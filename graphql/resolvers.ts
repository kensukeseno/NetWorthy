import prisma from "../lib/prisma";
import { DateTimeResolver } from "graphql-scalars";
export const resolvers = {
  DateTime: DateTimeResolver,
  Query: {
    Users: () => {
      return prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
    },
  },
};
