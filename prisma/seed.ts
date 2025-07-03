import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput = {
  id: 'test',
  name: 'test',
  password: '$2b$10$BkGl7SRrUYVxv7G51w89x.YklN1zNhfIrcQTY.DtkUHc7RERuM9Se',
  email: 'test@test.com',
};

const assetTypeData: Prisma.AssetTypeCreateInput[] = [
  { name: 'cash' },
  { name: 'bank_account' },
  { name: 'stock' },
  { name: 'real_estate' },
];

const assetData: Prisma.AssetCreateInput[] = [
  {
    id: '1',
    user: { connect: { id: 'test' } },
    name: 'TD chequing',
    assetType: { connect: { id: 2 } },
    value: '5000',
    currency: { connect: { id: 1 } },
    createdAt: new Date('2024-03-23'),
    updatedAt: new Date('2025-06-23'),
  },
  {
    id: '2',
    user: { connect: { id: 'test' } },
    name: 'S&P500',
    assetType: { connect: { id: 3 } },
    value: '4000',
    currency: { connect: { id: 1 } },
    createdAt: new Date('2024-04-23'),
    updatedAt: new Date('2025-04-23'),
  },
  {
    id: '3',
    user: { connect: { id: 'test' } },
    name: 'Cash',
    assetType: { connect: { id: 1 } },
    value: '500',
    currency: { connect: { id: 1 } },
    createdAt: new Date('2024-12-23'),
    updatedAt: new Date('2025-05-23'),
  },
];

const assetHistoryData: Prisma.AssetHistoryCreateInput[] = [
  // TD Chequing (Asset ID: '1')
  {
    asset: { connect: { id: '1' } },
    value: '4500',
    timestamp: new Date('2022-03-01'),
  },
  {
    asset: { connect: { id: '1' } },
    value: '4600',
    timestamp: new Date('2022-09-01'),
  },
  {
    asset: { connect: { id: '1' } },
    value: '4700',
    timestamp: new Date('2023-03-01'),
  },
  {
    asset: { connect: { id: '1' } },
    value: '4900',
    timestamp: new Date('2023-09-01'),
  },
  {
    asset: { connect: { id: '1' } },
    value: '5000',
    timestamp: new Date('2024-03-01'),
  },

  // S&P500 (Asset ID: '2')
  {
    asset: { connect: { id: '2' } },
    value: '3500',
    timestamp: new Date('2022-03-01'),
  },
  {
    asset: { connect: { id: '2' } },
    value: '3700',
    timestamp: new Date('2022-09-01'),
  },
  {
    asset: { connect: { id: '2' } },
    value: '3900',
    timestamp: new Date('2023-03-01'),
  },
  {
    asset: { connect: { id: '2' } },
    value: '4100',
    timestamp: new Date('2023-09-01'),
  },
  {
    asset: { connect: { id: '2' } },
    value: '4400',
    timestamp: new Date('2024-03-01'),
  },

  // Cash (Asset ID: '3')
  {
    asset: { connect: { id: '3' } },
    value: '300',
    timestamp: new Date('2022-03-01'),
  },
  {
    asset: { connect: { id: '3' } },
    value: '400',
    timestamp: new Date('2022-09-01'),
  },
  {
    asset: { connect: { id: '3' } },
    value: '450',
    timestamp: new Date('2023-03-01'),
  },
  {
    asset: { connect: { id: '3' } },
    value: '480',
    timestamp: new Date('2023-09-01'),
  },
  {
    asset: { connect: { id: '3' } },
    value: '500',
    timestamp: new Date('2024-03-01'),
  },
];

const liabilityTypeData: Prisma.LiabilityTypeCreateInput[] = [
  { name: 'student_loan' },
  { name: 'mortgage' },
  { name: 'auto_loan' },
];

const liabilityData: Prisma.LiabilityCreateInput[] = [
  {
    id: '1',
    user: { connect: { id: 'test' } },
    name: 'Alberta Student Aid',
    liabilityType: { connect: { id: 1 } },
    value: 20000,
    currency: { connect: { id: 1 } },
    createdAt: new Date('2024-07-20'),
    updatedAt: new Date('2025-04-02'),
  },
  {
    id: '2',
    user: { connect: { id: 'test' } },
    name: 'House in Calgary',
    liabilityType: { connect: { id: 2 } },
    value: 900000,
    currency: { connect: { id: 1 } },
    createdAt: new Date('2023-04-23'),
    updatedAt: new Date('2025-04-23'),
  },
  {
    id: '3',
    user: { connect: { id: 'test' } },
    name: 'Tesla',
    liabilityType: { connect: { id: 3 } },
    value: 80000,
    currency: { connect: { id: 1 } },
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-05-02'),
  },
];

const liabilityHistoryData: Prisma.LiabilityHistoryCreateInput[] = [
  // Alberta Student Aid (Liability ID: '1')
  {
    liability: { connect: { id: '1' } },
    value: 20000,
    timestamp: new Date('2022-03-01'),
  },
  {
    liability: { connect: { id: '1' } },
    value: 19500,
    timestamp: new Date('2022-09-01'),
  },
  {
    liability: { connect: { id: '1' } },
    value: 18000,
    timestamp: new Date('2023-03-01'),
  },
  {
    liability: { connect: { id: '1' } },
    value: 16000,
    timestamp: new Date('2023-09-01'),
  },
  {
    liability: { connect: { id: '1' } },
    value: 14000,
    timestamp: new Date('2024-03-01'),
  },

  // House in Calgary (Liability ID: '2')
  {
    liability: { connect: { id: '2' } },
    value: 900000,
    timestamp: new Date('2022-03-01'),
  },
  {
    liability: { connect: { id: '2' } },
    value: 890000,
    timestamp: new Date('2022-09-01'),
  },
  {
    liability: { connect: { id: '2' } },
    value: 875000,
    timestamp: new Date('2023-03-01'),
  },
  {
    liability: { connect: { id: '2' } },
    value: 860000,
    timestamp: new Date('2023-09-01'),
  },
  {
    liability: { connect: { id: '2' } },
    value: 850000,
    timestamp: new Date('2024-03-01'),
  },

  // Tesla (Liability ID: '3')
  {
    liability: { connect: { id: '3' } },
    value: 80000,
    timestamp: new Date('2022-03-01'),
  },
  {
    liability: { connect: { id: '3' } },
    value: 78000,
    timestamp: new Date('2022-09-01'),
  },
  {
    liability: { connect: { id: '3' } },
    value: 75000,
    timestamp: new Date('2023-03-01'),
  },
  {
    liability: { connect: { id: '3' } },
    value: 72000,
    timestamp: new Date('2023-09-01'),
  },
  {
    liability: { connect: { id: '3' } },
    value: 70000,
    timestamp: new Date('2024-03-01'),
  },
];

const currencyData: Prisma.CurrencyCreateInput[] = [
  { code: 'USD', country: 'us' },
  { code: 'EUR', country: 'eu' },
  { code: 'JPY', country: 'jp' },
  { code: 'GBP', country: 'gb' },
  { code: 'AUD', country: 'au' },
  { code: 'CAD', country: 'ca' },
  { code: 'CHF', country: 'ch' },
  { code: 'CNY', country: 'cn' },
  { code: 'HKD', country: 'hk' },
  { code: 'NZD', country: 'nz' },
  { code: 'SEK', country: 'se' },
  { code: 'KRW', country: 'kr' },
  { code: 'SGD', country: 'sg' },
  { code: 'NOK', country: 'no' },
  { code: 'MXN', country: 'mx' },
  { code: 'INR', country: 'in' },
  { code: 'RUB', country: 'ru' },
  { code: 'ZAR', country: 'za' },
  { code: 'BRL', country: 'br' },
  { code: 'TRY', country: 'tr' },
];

export async function main() {
  for (const c of currencyData) {
    await prisma.currency.create({ data: c });
  }
  await prisma.user.create({ data: userData });
  for (const a of assetTypeData) {
    await prisma.assetType.create({ data: a });
  }
  for (const l of liabilityTypeData) {
    await prisma.liabilityType.create({ data: l });
  }
  for (const a of assetData) {
    await prisma.asset.create({ data: a });
  }
  for (const l of liabilityData) {
    await prisma.liability.create({ data: l });
  }
  for (const a of assetHistoryData) {
    await prisma.assetHistory.create({ data: a });
  }
  for (const l of liabilityHistoryData) {
    await prisma.liabilityHistory.create({ data: l });
  }
}

main();
