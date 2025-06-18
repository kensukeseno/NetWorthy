import { writeFileSync } from 'fs';
import { printSchema, lexicographicSortSchema } from 'graphql';
import { builder } from './builder';
import prisma from '../../lib/prisma';
import bcrypt from 'bcryptjs';

// Define custom types
const UserCreateInput = builder.inputType('UserCreateInput', {
  fields: (t) => ({
    name: t.field({ type: 'String', required: true }),
    email: t.field({ type: 'String', required: true }),
    password: t.field({ type: 'String', required: true }),
  }),
});

// Define Object types
builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeString('id'),
    name: t.exposeString('name'),
    email: t.exposeString('email'),
    password: t.exposeString('password'),
  }),
});

// Define Query types
builder.queryType({
  fields: (t) => ({
    users: t.prismaField({
      description: 'get a list of all users',
      type: ['User'],
      resolve: () => prisma.user.findMany(),
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
      resolve: async (query, root, args, ctx, info) => {
        return prisma.user.findUnique({
          ...query,
          where: { email: args.email },
        });
      },
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

export const schema = builder.toSchema();
const schemaAsString = printSchema(lexicographicSortSchema(schema));

// Create a graphql schema as SDL
writeFileSync('graphql/generated-schema.graphql', schemaAsString);
