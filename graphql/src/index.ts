import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { UserResolver } from './users/user-resolver';
import { ProductResolver } from './products/product-resolver';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { authChecker } from './utils/auth-checker';
import { verifyAccessToken } from './utils/verify-tokens';
import { refreshTokens } from './utils/refresh-tokens';

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
      formatError: (error) => {
        console.log(error);
        return error;
      },
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
      context: async ({ req, res }: ExpressContext) => {
        const tokenPayload = await verifyAccessToken(
          req,
          <string>process.env.ACCESS_TOKEN_SECRET
        );

        return {
          ...tokenPayload,
          req,
          res,
        };
      },
    });

    const app = express();

    app.use(cookieParser());

    app.get('/refresh-token', async (req, res) => {
      const token = req.cookies['refreshToken'];
      console.log('refresh token is', token);
      const decodedResult = await refreshTokens(
        token,
        <string>process.env.ACCESS_TOKEN_SECRET,
        <string>process.env.REFRESH_TOKEN_SECRET
      );
      const { accessToken, user } = decodedResult;

      if (accessToken && user) {
        return res.send({ accessToken });
      } else {
        return res.send({
          accessToken: null,
        });
      }
    });

    apolloServer.applyMiddleware({
      app,
      cors: { origin: 'http://localhost:4200', credentials: true },
    });

    app.listen(4001, () => {
      console.log('Server is starting on http://localhost:4001/graphql');
    });
  } catch (err) {
    console.error(err);
  }
};

bootstrap();
