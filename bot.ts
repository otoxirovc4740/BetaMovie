import { Bot, InlineKeyboard } from 'grammy';
import { config } from './config.js';
import { prisma } from './db.js';
import { t } from './i18n.js';

export const bot = new Bot(config.botToken);

bot.command('start', async (ctx) => {
  const from = ctx.from;
  if (from) {
    await prisma.user.upsert({
      where: { telegramId: BigInt(from.id) },
      update: { lastActiveAt: new Date(), isBlocked: false, firstName: from.first_name, username: from.username ?? null },
      create: { telegramId: BigInt(from.id), firstName: from.first_name, username: from.username ?? null },
    });
  }
  await ctx.reply(t.welcome, {
    reply_markup: new InlineKeyboard().webApp(t.openApp, config.webAppUrl),
  });
});

bot.command('help', (ctx) => ctx.reply(t.help));
bot.command('contact', (ctx) => ctx.reply(t.contact(config.supportContact)));

// Foydalanuvchi botni bloklasa yoki qayta yoqsa, belgilab qo'yamiz
bot.on('my_chat_member', async (ctx) => {
  const status = ctx.myChatMember.new_chat_member.status;
  if (ctx.chat.type !== 'private') return;
  await prisma.user.updateMany({
    where: { telegramId: BigInt(ctx.from.id) },
    data: { isBlocked: status === 'kicked' || status === 'left' },
  });
});

bot.catch((err) => console.error('Bot xatosi:', err.error));
