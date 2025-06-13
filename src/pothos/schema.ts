rimport { writeFileSync } from "fs";
import { printSchema, lexicographicSortSchema } from "graphql";
import { builder } from "./builder";
import prisma from "../../lib/prisma";

builder.prismaObject("User", {
  fields: (t) => ({
    id: t.exposeString("id"),
    name: t.exposeString("name"),
    email: t.exposeString("email"),
  }),
});

builder.queryType({
  fields: (t) => ({
    users: t.prismaField({
      type: ["User"],
      resolve: () => prisma.user.findMany(),
    }),
  }),
});

export const schema = builder.toSchema();
const schemaAsString = printSchema(lexicographicSortSchema(schema));

// Create a graphql schema as SDL
writeFileSync("graphql/generated-schema.graphql", schemaAsString);
