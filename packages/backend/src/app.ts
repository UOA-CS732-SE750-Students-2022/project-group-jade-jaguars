import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { usersRouter, eventsRouter } from './routes/routes.module';
import {
  PORT,
  BASE_URL,
  VERBOSE,
  DATABASE_URL,
} from './configs/backend.config';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

const router = express.Router();

// Swagger definition
const definition = {
  openapi: '3.0.0',
  info: {
    title: 'Count Me In',
    version: '1.0.0',
    description: '',
    license: {
      name: 'GPL-3.0',
      url: 'https://choosealicense.com/licenses/gpl-3.0/',
    },
  },
  servers: [
    {
      url: `http://localhost:${PORT}${BASE_URL}`,
    },
  ],
  host: `localhost:${PORT}${BASE_URL}`,
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      scheme: 'bearer',
      in: 'header',
    },
  },
};

const options = {
  definition,
  apis: ['**/*.ts'],
};

async function initialize() {
  app.use(BASE_URL, router);
  app.use(BASE_URL, eventsRouter);
  app.use(BASE_URL, usersRouter);

  app.use(express.json());

  app.use(
    `${BASE_URL}/docs`,
    swaggerUi.serve,
    swaggerUi.setup(swaggerJsdoc(options)),
  );
  console.log(`serving swagger on: http://localhost:${PORT}${BASE_URL}/docs`);

  // ROUTER.get('/', () => {});

  if (process.env.NODE_ENV !== 'testing') {
    await mongoose.connect(DATABASE_URL);
    console.log(`Database connected: ${DATABASE_URL}`);
    app.listen(PORT, () => {
      if (!VERBOSE) {
        console.clear();
      }
      console.log(`app on - https://localhost:${PORT}`);
    });
  }
}

initialize();

export default app;
