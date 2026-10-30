import 'dotenv/config';

const need = (key: string): string => {
  const v = process.env[key];
  if (!v) throw new Error(`.env faylida ${key} yetishmayapti`);
  return v;
};

const publicUrl = process.env.PUBLIC_URL ?? process.env.RENDER_EXTERNAL_URL;
if (!publicUrl) throw new Error('PUBLIC_URL yoki RENDER_EXTERNAL_URL kerak');

export const config = {
  botToken: need('BOT_TOKEN'),
  publicUrl: publicUrl,
  webAppUrl: process.env.WEBAPP_URL ?? publicUrl,
  webhookSecret: need('WEBHOOK_SECRET').replace(/[^A-Za-z0-9_-]/g, ''),
  port: Number(process.env.PORT ?? 3000),
  adminIds: (process.env.ADMIN_IDS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => BigInt(s)),
  supportContact: process.env.SUPPORT_CONTACT ?? '',
};
