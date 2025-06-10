import { createSchema, createYoga } from "graphql-yoga";
import { type NextRequest } from "next/server";
import { resolvers } from "@graphql/resolvers";
import { typeDefs } from "@graphql/schema";

const yoga = createYoga<{
  req: NextRequest;
}>({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Request, Response },
});

export { yoga as GET, yoga as POST };
