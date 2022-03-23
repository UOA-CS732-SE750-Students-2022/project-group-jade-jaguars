import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { usersRouter, eventsRouter } from './routes/routes.module';
import { PORT, BASE_URL, VERBOSE } from './configs/backend.config';
import { mongoService } from './services/mongo.service';

const app = express();
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
      url: `http://localhost:${PORT}/`,
    },
  ],
  host: `localhost:${PORT}`,
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

function initialize() {
  app.use(BASE_URL, router);
  app.use(BASE_URL, eventsRouter);
  app.use(BASE_URL, usersRouter);
  app.use(express.json());

  app.use(
    `${BASE_URL}/docs`,
    swaggerUi.serve,
    swaggerUi.setup(swaggerJsdoc(options)),
  );

  // ROUTER.get('/', () => {});

  app.listen(PORT, () => {
    if (!VERBOSE) {
      console.clear();
    }
    console.log(`app on - https://localhost:${PORT}`);
  });

  mongoService.connect();
}

initialize();
