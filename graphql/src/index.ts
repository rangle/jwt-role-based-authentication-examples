import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import * as express from 'express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { UserResolver } from './users/user-resolver';
import { ProductResolver } from './products/product-resolver';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { authChecker } from './utils/auth-checker';
import { verifyToken } from './utils/verify-token';

// Initialize an apollo server instance
const bootstrap = async () => {
  try {
    // Create typeorm connection using setup configured in .env
    await createConnection();

    // Build TypeGraphQL executable schema
    const schema = await buildSchema({
      resolvers: [UserResolver, ProductResolver],
      authChecker, // register auth checking function
    });

    // Create GraphQL server
    const apolloServer = new ApolloServer({
      schema,
      context: ({ req, res }: ExpressContext) => {
        const tokenPayload = verifyToken(req);
        return {
          ...tokenPayload,
          req,
          res,
        };
      },
    });

    const app = express();

    apolloServer.applyMiddleware({ app });

    app.listen(4001, () => {
      console.log('Server is starting on http://localhost:4001/graphql');
    });
  } catch (err) {
    console.error(err);
  }
};

bootstrap();
