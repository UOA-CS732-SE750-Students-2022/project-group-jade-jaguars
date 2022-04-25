import { isAuthenticated } from './libs/middleware.lib';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { usersRouter, eventsRouter } from './routes/routes.module';
import { PORT, BASE_URL, VERBOSE } from './configs/backend.config';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { teamRouter } from './routes/team.route';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import swaggerDocument from './docs/swagger.json';
import dotenv from 'dotenv';

const app = express();
app.use(bodyParser.json());

const router = express.Router();

async function initialize() {
  dotenv.config({ path: `.env.${process.env.ENV_PATH}` });

  initializeApp({
    credential: applicationDefault(),
  });
  app.use(express.json());

  // Initialize endpoints
  app.use(BASE_URL, isAuthenticated, router);
  app.use(BASE_URL, eventsRouter);
  app.use(BASE_URL, usersRouter);
  app.use(BASE_URL, teamRouter);

  if (process.env.NODE_ENV !== 'testing') {
    app.use(`/docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log(`serving swagger on: http://localhost:${PORT}/docs`);

    await mongoose.connect(process.env.DATABASE_URL);
    console.log(`Database connected: ${process.env.DATABASE_URL}`);
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
