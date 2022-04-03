import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { EVENTS_ROUTER } from './routes/eventsRoute';
import { PORT, BASE_URL, VERBOSE } from './config';
import { mongoService } from './services/mongoService';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const APP = express();
const ROUTER = express.Router();

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
  apis: ['**/*.ts', './swaggerTypes.json'],
};

function initialize() {
  APP.use(express.json());
  APP.use(BASE_URL, ROUTER);
  APP.use(BASE_URL, EVENTS_ROUTER);

  APP.use(
    `${BASE_URL}/docs`,
    swaggerUi.serve,
    swaggerUi.setup(swaggerJsdoc(options)),
  );

  // ROUTER.get('/', () => {});

  APP.listen(PORT, () => {
    if (!VERBOSE) {
      console.clear();
    }
    console.log(`app on - https://localhost:${PORT}`);
  });

  mongoService.connect();
}

initialize();
