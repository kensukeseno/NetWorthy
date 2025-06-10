import { DateTimeResolver } from "graphql-scalars";
export const resolvers = {
  DateTime: DateTimeResolver,
  Query: {
    Users: () => {
      return [
        {
          id: "1234",
          name: "test",
          email: "test",
          emailVerified: null,
          image: null,
          imageUrl: null,
        },
      ];
    },
  },
};
