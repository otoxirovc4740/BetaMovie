import { createHmac, timingSafeEqual } from 'node:crypto';

export interface TgUser {
  id: number;
  first_name?: string;
  username?: string;
  photo_url?: string;
}

/**
 * Telegram Mini App initData'ni serverda tekshiradi (rasmiy usul).
 * Soxta yoki eskirgan ma'lumot bo'lsa null qaytaradi.
 */
export function verifyInitData(initData: string, botToken: string, maxAgeSec = 86400): TgUser | null {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return null;
  params.delete('hash');

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  const secret = createHmac('sha256', 'WebAppData').update(botToken).digest();
  const calc = createHmac('sha256', secret).update(dataCheckString).digest('hex');

  const a = Buffer.from(calc, 'hex');
  const b = Buffer.from(hash, 'hex');
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  const authDate = Number(params.get('auth_date') ?? 0);
  if (!authDate || Date.now() / 1000 - authDate > maxAgeSec) return null;

  try {
    const user = JSON.parse(params.get('user') ?? '');
    return typeof user?.id === 'number' ? (user as TgUser) : null;
  } catch {
    return null;
  }
}
