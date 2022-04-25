import express from 'express';
import http from 'http';
import { PORT, BASE_URL, VERBOSE } from './configs/backend.config';
import swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser';
import { eventsRouter } from './routes/event.route';
import { usersRouter } from './routes/user.route';
import { teamRouter } from './routes/team.route';
import mongoose from 'mongoose';
import socket from './socketio';
import dotenv from 'dotenv';
import { isAuthenticated } from './libs/middleware.lib';
import swaggerDocument from './docs/swagger.json';
import * as firebase from 'firebase-admin';

const indexRouter = express.Router();

class Server extends http.Server {
  public app: express.Application;

  constructor() {
    const app: express.Application = express();
    super(app);
    this.app = app;
  }

  private setEnvironment() {
    dotenv.config({ path: `.env.${process.env.ENV_PATH}` });
  }

  private setRouter() {
    this.app.use(BASE_URL, isAuthenticated, indexRouter);
    this.app.use(BASE_URL, eventsRouter);
    this.app.use(BASE_URL, usersRouter);
    this.app.use(BASE_URL, teamRouter);
  }

  private setMiddleware() {
    firebase.initializeApp({
      credential: firebase.credential.applicationDefault(),
    });

    this.app.use(express.json());
    this.app.use(bodyParser.json());

    if (process.env.NODE_PATH !== 'test') {
      this.app.use(
        `${BASE_URL}/docs`,
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocument),
      );
      console.log(`swagger: http://localhost:${PORT}${BASE_URL}/docs`);
    }

    this.setRouter();
  }

  private async setDatabase() {
    if (process.env.NODE_PATH !== 'test') {
      await mongoose.connect(process.env.DATABASE_URL as string);
    }
  }

  async start() {
    this.setEnvironment();
    this.setMiddleware();
    await this.setDatabase();
    // When we are testing so no need to start socketio
    if (process.env.NODE_PATH !== 'test') {
      socket(this, this.app);
      console.log(`socketio: http://localhost:${PORT}${BASE_URL}/socketio`);

      // Supertest means that we don't have to listen when testing
      this.app.listen(this.app.get('port'), () => {
        console.log(`server: http://localhost:${PORT}`);
      });
    } else {
    }
  }
}

export default Server;
