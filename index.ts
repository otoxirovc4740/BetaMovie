import { bot } from './bot.js';
import { config } from './config.js';
import { prisma } from './db.js';
import { buildServer } from './server.js';

// BigInt (Telegram ID) JSON'ga o'tishi uchun
(BigInt.prototype as unknown as { toJSON: () => string }).toJSON = function () {
  return this.toString();
};

async function main() {
  // .env dagi adminlarni bazaga yozib qo'yamiz
  for (const id of config.adminIds) {
    await prisma.admin.upsert({ where: { telegramId: id }, update: {}, create: { telegramId: id } });
  }

  const app = buildServer();
  await app.listen({ port: config.port, host: '0.0.0.0' });

  await bot.init();
  await bot.api.setWebhook(`${config.publicUrl}/bot/webhook`, { secret_token: config.webhookSecret });
  console.log('NW CINEMA ishga tushdi');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
