import { createYoga } from 'graphql-yoga';
import { type NextRequest } from 'next/server';
import { schema } from '../../../pothos/schema';

const yoga = createYoga<{
  req: NextRequest;
}>({
  schema: schema,
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Request, Response },
});

export { yoga as GET, yoga as POST };
