export const typeDefs = `
  scalar DateTime

  type User {
    id: ID
    name: String!
    email: String
    emailVerified: DateTime!
    image: String!
    imageUrl: String!
  }

  type Query {
    Users: [User]!
  }
    `;
