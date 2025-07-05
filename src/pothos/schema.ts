import { writeFileSync, mkdirSync } from 'fs';
import { printSchema, lexicographicSortSchema } from 'graphql';
import { builder } from './builder';
import prisma from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import { GraphQLDecimal } from './decimal';
import { GraphQLDateTime } from 'graphql-scalars';

// Register custom scalars with the buider
builder.addScalarType('Decimal', GraphQLDecimal, {});
builder.addScalarType('DateTime', GraphQLDateTime, {});

// Define custom input types
const UserCreateInput = builder.inputType('UserCreateInput', {
  fields: (t) => ({
    name: t.field({ type: 'String', required: true }),
    email: t.field({ type: 'String', required: true }),
    password: t.field({ type: 'String', required: true }),
  }),
});

const AssetCreateInput = builder.inputType('AssetCreateInput', {
  fields: (t) => ({
    userId: t.field({ type: 'String', required: true }),
    name: t.field({ type: 'String', required: true }),
    typeId: t.field({ type: 'Int', required: true }),
    value: t.field({ type: 'Decimal', required: true }),
    currencyId: t.field({ type: 'Int', required: true }),
  }),
});

const LiabilityCreateInput = builder.inputType('LiabilityCreateInput', {
  fields: (t) => ({
    userId: t.field({ type: 'String', required: true }),
    name: t.field({ type: 'String', required: true }),
    typeId: t.field({ type: 'Int', required: true }),
    value: t.field({ type: 'Decimal', required: true }),
    currencyId: t.field({ type: 'Int', required: true }),
    referenceUrl: t.field({ type: 'String', required: false }),
    monthlyPayment: t.field({ type: 'Decimal', required: false }),
    interestRate: t.field({ type: 'Decimal', required: false }),
  }),
});

// Define Object types
builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeString('id'),
    name: t.exposeString('name'),
    email: t.exposeString('email'),
    password: t.exposeString('password'),
    asset: t.relation('asset'),
    liability: t.relation('liability'),
  }),
});

builder.prismaObject('Asset', {
  fields: (t) => ({
    id: t.exposeString('id'),
    name: t.exposeString('name'),
    value: t.expose('value', { type: 'Decimal' }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    user: t.relation('user'),
    assetType: t.relation('assetType'),
    currency: t.relation('currency'),
    assetHistory: t.relation('assetHistory'),
  }),
});

builder.prismaObject('AssetHistory', {
  fields: (t) => ({
    id: t.exposeInt('id'),
    value: t.expose('value', { type: 'Decimal' }),
    timestamp: t.expose('timestamp', { type: 'DateTime' }),
    asset: t.relation('asset'),
  }),
});

builder.prismaObject('AssetType', {
  fields: (t) => ({
    id: t.exposeInt('id'),
    name: t.exposeString('name'),
    asset: t.relation('asset'),
  }),
});

builder.prismaObject('Currency', {
  fields: (t) => ({
    id: t.exposeInt('id'),
    code: t.exposeString('code'),
    country: t.exposeString('country'),
    asset: t.relation('asset'),
    liability: t.relation('liability'),
  }),
});

builder.prismaObject('Liability', {
  fields: (t) => ({
    id: t.exposeString('id'),
    name: t.exposeString('name'),
    value: t.expose('value', { type: 'Decimal' }),
    referenceUrl: t.exposeString('referenceUrl'),
    monthlyPayment: t.expose('monthlyPayment', { type: 'Decimal' }),
    interestRate: t.expose('interestRate', { type: 'Decimal' }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    user: t.relation('user'),
    liabilityType: t.relation('liabilityType'),
    currency: t.relation('currency'),
    liabilityHistory: t.relation('liabilityHistory'),
  }),
});

builder.prismaObject('LiabilityType', {
  fields: (t) => ({
    id: t.exposeInt('id'),
    name: t.exposeString('name'),
    liability: t.relation('liability'),
  }),
});

builder.prismaObject('LiabilityHistory', {
  fields: (t) => ({
    id: t.exposeInt('id'),
    value: t.expose('value', { type: 'Decimal' }),
    timestamp: t.expose('timestamp', { type: 'DateTime' }),
    liability: t.relation('liability'),
  }),
});

// Define Query types
builder.queryType({
  fields: (t) => ({
    users: t.prismaField({
      description: 'get a list of all users',
      type: ['User'],
      resolve: (query, _parent, _args, _ctx) =>
        prisma.user.findMany({
          ...query,
        }),
    }),
  }),
});

builder.queryType({
  fields: (t) => ({
    user: t.prismaField({
      description: 'Get a user by credentials',
      type: 'User',
      args: {
        email: t.arg.string({ required: true }),
      },
      resolve: async (query, _root, args, _ctx, _info) => {
        return prisma.user.findUnique({
          ...query,
          where: { email: args.email },
        });
      },
    }),
  }),
});

builder.queryType({
  fields: (t) => ({
    assets: t.prismaField({
      description: 'Get a list of assets',
      type: ['Asset'],
      resolve: (query, _parent, _args, _ctx) =>
        prisma.asset.findMany({ ...query }),
    }),
  }),
});

builder.queryType({
  fields: (t) => ({
    liabilities: t.prismaField({
      description: 'Get a list of liabilities',
      type: ['Liability'],
      resolve: (query, _parent, _args, _ctx) =>
        prisma.liability.findMany({ ...query }),
    }),
  }),
});

builder.queryType({
  fields: (t) => ({
    assetTypes: t.prismaField({
      description: 'Get a list of asset types',
      type: ['AssetType'],
      resolve: (query, _parent, _args, _ctx) =>
        prisma.assetType.findMany({ ...query }),
    }),
  }),
});

builder.queryType({
  fields: (t) => ({
    liabilityTypes: t.prismaField({
      description: 'Get a list of liability types',
      type: ['LiabilityType'],
      resolve: (query, _parent, _args, _ctx) =>
        prisma.liabilityType.findMany({ ...query }),
    }),
  }),
});

builder.queryType({
  fields: (t) => ({
    currencies: t.prismaField({
      description: 'Get a list of currencies',
      type: ['Currency'],
      resolve: (query, _parent, _args, _ctx) =>
        prisma.currency.findMany({ ...query }),
    }),
  }),
});

// Define Mutation types
builder.mutationType({
  fields: (t) => ({
    signup: t.prismaField({
      description: 'sign up a new user',
      type: 'User',
      args: {
        data: t.arg({
          type: UserCreateInput,
          required: true,
        }),
      },
      resolve: async (_query, _parent, args, _ctx, _info) => {
        return prisma.user.create({
          data: {
            name: args.data.name,
            email: args.data.email,
            // Hash a password
            password: await bcrypt.hash(args.data.password, 10),
          },
        });
      },
    }),
  }),
});

builder.mutationType({
  fields: (t) => ({
    addAsset: t.prismaField({
      description: 'create a new asset for a user',
      type: 'Asset',
      args: {
        data: t.arg({
          type: AssetCreateInput,
          required: true,
        }),
      },
      resolve: async (_query, _parent, args, _ctx, _info) => {
        return prisma.asset.create({
          data: {
            userId: args.data.userId,
            name: args.data.name,
            typeId: args.data.typeId,
            value: args.data.value,
            currencyId: args.data.currencyId,
          },
        });
      },
    }),
  }),
});

builder.mutationType({
  fields: (t) => ({
    addLiability: t.prismaField({
      description: 'create a new liability for a user',
      type: 'Liability',
      args: {
        data: t.arg({
          type: LiabilityCreateInput,
          required: true,
        }),
      },
      resolve: async (_query, _parent, args, _ctx, _info) => {
        return prisma.liability.create({
          data: {
            userId: args.data.userId,
            name: args.data.name,
            typeId: args.data.typeId,
            value: args.data.value,
            currencyId: args.data.currencyId,
            referenceUrl: args.data.referenceUrl!,
            monthlyPayment: args.data.monthlyPayment!,
            interestRate: args.data.interestRate!,
          },
        });
      },
    }),
  }),
});

export const schema = builder.toSchema();
const schemaAsString = printSchema(lexicographicSortSchema(schema));

// Create a graphql schema as SDL
mkdirSync('graphql', { recursive: true });
writeFileSync('graphql/generated-schema.graphql', schemaAsString);
