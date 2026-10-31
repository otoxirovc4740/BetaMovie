import Fastify, { FastifyRequest } from 'fastify';
import fastifyStatic from '@fastify/static';
import { webhookCallback } from 'grammy';
import type { User } from '@prisma/client';
import { z } from 'zod';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { bot } from './bot.js';
import { config } from './config.js';
import { prisma } from './db.js';
import { verifyInitData } from './telegramAuth.js';

declare module 'fastify' {
  interface FastifyRequest {
    user: User | null;
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webDistPath = path.resolve(process.cwd(), 'web/dist');
const card = {
  id: true,
  code: true,
  title: true,
  year: true,
  posterUrl: true,
} as const;

export function buildServer() {
  const app = Fastify({ logger: true });

  app.decorateRequest('user', null);

  // Frontend fayllari
  app.register(fastifyStatic, {
    root: webDistPath,
    prefix: '/',
    wildcard: false,
  });

  // Telegram webhook
  app.post(
    '/bot/webhook',
    webhookCallback(bot, 'fastify', {
      secretToken: config.webhookSecret,
    }),
  );

  app.get('/health', async () => ({ ok: true }));

  // API autentifikatsiyasi
  app.addHook('preHandler', async (req, reply) => {
    if (!req.url.startsWith('/api/')) return;

    const h = req.headers.authorization ?? '';
    const tg = h.startsWith('tma ')
      ? verifyInitData(h.slice(4), config.botToken)
      : null;

    if (!tg) {
      return reply.code(401).send({ error: 'Avtorizatsiya xatosi' });
    }

    req.user = await prisma.user.upsert({
      where: { telegramId: BigInt(tg.id) },
      update: {
        lastActiveAt: new Date(),
        firstName: tg.first_name ?? null,
        username: tg.username ?? null,
        photoUrl: tg.photo_url ?? null,
      },
      create: {
        telegramId: BigInt(tg.id),
        firstName: tg.first_name ?? null,
        username: tg.username ?? null,
        photoUrl: tg.photo_url ?? null,
      },
    });
  });

  const me = (req: FastifyRequest) => req.user as User;

  // Profil
  app.get('/api/me', async (req) => {
    const user = me(req);

    const favoritesCount = await prisma.favorite.count({
      where: { userId: user.id },
    });

    const isAdmin =
      config.adminIds.includes(user.telegramId) ||
      !!(await prisma.admin.findUnique({
        where: { telegramId: user.telegramId },
      }));

    return { user, favoritesCount, isAdmin };
  });

  app.patch('/api/me', async (req, reply) => {
    const body = z
      .object({
        theme: z.enum(['dark', 'light']).optional(),
        language: z.enum(['uz']).optional(),
      })
      .safeParse(req.body);

    if (!body.success) {
      return reply.code(400).send({ error: "Noto'g'ri ma'lumot" });
    }

    return prisma.user.update({
      where: { id: me(req).id },
      data: body.data,
    });
  });

  // Janrlar
  app.get('/api/genres', async () =>
    prisma.genre.findMany({ orderBy: { nameUz: 'asc' } }),
  );

  // Bosh sahifa
  app.get('/api/home', async () => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000);

    const featured =
      (await prisma.movie.findFirst({ where: { isFeatured: true } })) ??
      (await prisma.movie.findFirst({ orderBy: { createdAt: 'desc' } }));

    const manual = await prisma.movie.findMany({
      where: { isTrending: true },
      select: card,
      take: 20,
    });

    const top = await prisma.favorite.groupBy({
      by: ['movieId'],
      where: { createdAt: { gte: weekAgo } },
      _count: { movieId: true },
      orderBy: { _count: { movieId: 'desc' } },
      take: 20,
    });

    const autoMovies = await prisma.movie.findMany({
      where: { id: { in: top.map((x) => x.movieId) } },
      select: card,
    });

    const order = new Map(top.map((x, i) => [x.movieId, i]));
    autoMovies.sort((a, b) => order.get(a.id)! - order.get(b.id)!);

    const seen = new Set<number>();

    let trending = [...manual, ...autoMovies]
      .filter((m) => !seen.has(m.id) && seen.add(m.id))
      .slice(0, 20);

    if (trending.length === 0) {
      trending = await prisma.movie.findMany({
        orderBy: { createdAt: 'desc' },
        select: card,
        take: 20,
      });
    }

    const [recentlyAdded, popular, recommended] = await Promise.all([
      prisma.movie.findMany({
        orderBy: { createdAt: 'desc' },
        select: card,
        take: 20,
      }),
      prisma.movie.findMany({
        orderBy: { popularity: 'desc' },
        select: card,
        take: 20,
      }),
      prisma.movie.findMany({
        where: { isRecommended: true },
        select: card,
        take: 20,
      }),
    ]);

    return { featured, trending, recentlyAdded, popular, recommended };
  });

  // Kino katalogi
  app.get('/api/movies', async (req, reply) => {
    const q = z
      .object({
        genre: z.string().optional(),
        year: z.coerce.number().int().optional(),
        country: z.string().optional(),
        minRating: z.coerce.number().optional(),
        sort: z.enum(['new', 'year', 'popular']).default('new'),
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(40).default(20),
      })
      .safeParse(req.query);

    if (!q.success) {
      return reply.code(400).send({ error: "Noto'g'ri so'rov" });
    }

    const { genre, year, country, minRating, sort, page, limit } = q.data;

    const where = {
      ...(genre && { genres: { some: { genre: { slug: genre } } } }),
      ...(year && { year }),
      ...(country && {
        country: { equals: country, mode: 'insensitive' as const },
      }),
      ...(minRating && { rating: { gte: minRating } }),
    };

    const orderBy =
      sort === 'year'
        ? { year: 'desc' as const }
        : sort === 'popular'
          ? { popularity: 'desc' as const }
          : { createdAt: 'desc' as const };

    const [items, total] = await Promise.all([
      prisma.movie.findMany({
        where,
        orderBy,
        select: card,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.movie.count({ where }),
    ]);

    return { items, total, page, hasMore: page * limit < total };
  });

  // Qidiruv
  app.get('/api/movies/search', async (req, reply) => {
    const q = z
      .object({
        q: z.string().trim().min(1).max(100),
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(40).default(20),
      })
      .safeParse(req.query);

    if (!q.success) {
      return reply.code(400).send({ error: "Noto'g'ri so'rov" });
    }

    const { q: text, page, limit } = q.data;

    const where = {
      OR: [
        { title: { contains: text, mode: 'insensitive' as const } },
        { originalTitle: { contains: text, mode: 'insensitive' as const } },
        { code: { contains: text, mode: 'insensitive' as const } },
      ],
    };

    const [items, total] = await Promise.all([
      prisma.movie.findMany({
        where,
        select: card,
        orderBy: { popularity: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.movie.count({ where }),
    ]);

    if (page === 1 && text.length >= 2) {
      await prisma.searchLog.create({
        data: {
          userId: me(req).id,
          query: text.toLowerCase(),
          movieId: items[0]?.id ?? null,
        },
      });
    }

    return { items, total, page, hasMore: page * limit < total };
  });

  // Kino tafsilotlari
  app.get('/api/movies/:id', async (req, reply) => {
    const id = Number((req.params as { id: string }).id);

    if (!Number.isInteger(id)) {
      return reply.code(400).send({ error: "Noto'g'ri ID" });
    }

    const movie = await prisma.movie.findUnique({
      where: { id },
      include: { genres: { include: { genre: true } } },
    });

    if (!movie) {
      return reply.code(404).send({ error: 'Kino topilmadi' });
    }

    const fav = await prisma.favorite.findUnique({
      where: {
        userId_movieId: { userId: me(req).id, movieId: id },
      },
    });

    return {
      ...movie,
      genres: movie.genres.map((g) => g.genre),
      isFavorite: !!fav,
    };
  });

  // Sevimlilar
  app.get('/api/favorites', async (req) => {
    const rows = await prisma.favorite.findMany({
      where: { userId: me(req).id },
      orderBy: { createdAt: 'desc' },
      include: { movie: { select: card } },
    });

    return rows.map((r) => r.movie);
  });

  app.put('/api/favorites/:movieId', async (req, reply) => {
    const movieId = Number(
      (req.params as { movieId: string }).movieId,
    );

    if (!Number.isInteger(movieId)) {
      return reply.code(400).send({ error: "Noto'g'ri ID" });
    }

    if (!(await prisma.movie.findUnique({ where: { id: movieId } }))) {
      return reply.code(404).send({ error: 'Kino topilmadi' });
    }

    await prisma.favorite.upsert({
      where: {
        userId_movieId: { userId: me(req).id, movieId },
      },
      update: {},
      create: { userId: me(req).id, movieId },
    });

    return { isFavorite: true };
  });

  app.delete('/api/favorites/:movieId', async (req) => {
    const movieId = Number(
      (req.params as { movieId: string }).movieId,
    );

    await prisma.favorite.deleteMany({
      where: { userId: me(req).id, movieId },
    });

    return { isFavorite: false };
  });

  // React ilovasi uchun SPA fallback
  app.setNotFoundHandler((req, reply) => {
    if (
      req.method === 'GET' &&
      !req.url.startsWith('/api/') &&
      !req.url.startsWith('/bot/')
    ) {
      return reply.sendFile('index.html');
    }

    return reply.code(404).send({ error: 'Sahifa topilmadi' });
  });

  return app;
}
