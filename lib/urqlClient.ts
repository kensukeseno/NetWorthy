import { createClient, cacheExchange, fetchExchange } from 'urql';

export const client = createClient({
  url: 'http://localhost:3000/api/graphql',
  fetchOptions: {
    credentials: 'include', // if using cookies/session auth
  },
  exchanges: [cacheExchange, fetchExchange], // required field
});
