import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const currencyData: Prisma.CurrnencyCreateInput[] = [
  { code: 'USD' },
  { code: 'EUR' },
  { code: 'JPY' },
  { code: 'GBP' },
  { code: 'AUD' },
  { code: 'CAD' },
  { code: 'CHF' },
  { code: 'CNY' },
  { code: 'HKD' },
  { code: 'NZD' },
  { code: 'SEK' },
  { code: 'KRW' },
  { code: 'SGD' },
  { code: 'NOK' },
  { code: 'MXN' },
  { code: 'INR' },
  { code: 'RUB' },
  { code: 'ZAR' },
  { code: 'BRL' },
  { code: 'TRY' },
];

export async function main() {
  for (const c of currencyData) {
    await prisma.currnency.create({ data: c });
  }
}

main();
