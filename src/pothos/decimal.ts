import { GraphQLScalarType, Kind } from 'graphql';
import { Decimal } from '@prisma/client/runtime/library';

// implementaion of Decimal type in GraphQL
export const GraphQLDecimal = new GraphQLScalarType({
  name: 'Decimal',
  description: 'High-precision decimal scalar',
  serialize(value) {
    if (value instanceof Decimal) {
      return value.toString(); // send string to client
    }
    return value;
  },
  parseValue(value) {
    // From client input
    return new Decimal(value as string);
  },
  parseLiteral(ast) {
    if (
      ast.kind === Kind.STRING ||
      ast.kind === Kind.FLOAT ||
      ast.kind === Kind.INT
    ) {
      return new Decimal(ast.value);
    }
    return null;
  },
});
