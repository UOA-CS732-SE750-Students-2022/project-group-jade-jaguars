import express from 'express';
import http from 'http';
import swaggerUi from 'swagger-ui-express';
import { eventsRouter } from './routes/event.route';
import { usersRouter } from './routes/user.route';
import { teamRouter } from './routes/team.route';
import mongoose from 'mongoose';
import WebSocket from './socketio';
import dotenv from 'dotenv';
import { isAuthenticated } from './libs/middleware.lib';
import swaggerDocument from './docs/swagger.json';
import * as firebase from 'firebase-admin';
import cors from 'cors';

dotenv.config({ path: `.env` });

const PORT: number = parseInt(process.env.PORT) ?? 3000;
const NODE_ENV: string = process.env.NODE_ENV ?? 'dev'; // Jest sets this to 'test', this should not be manually set in env files
const BASE_URL: string = process.env.BASE_URL ?? '/api/v1';
const DATABASE_URL: string = process.env.DATABASE_URL;

const indexRouter = express.Router();

class Server extends http.Server {
  public app: express.Application;
  public webSocket: WebSocket;
  public server: http.Server;

  constructor() {
    const app: express.Application = express();
    super(app);

    app.use(cors({ origin: '*' }));

    this.app = app;
  }

  private setRouter() {
    // Skip auth protection on tests
    if (NODE_ENV !== 'test') {
      // Makes all endpoints to require authentication
      this.app.use(BASE_URL, isAuthenticated, indexRouter);
    }
    this.app.use(BASE_URL, eventsRouter);
    this.app.use(BASE_URL, usersRouter);
    this.app.use(BASE_URL, teamRouter);
  }

  private setMiddleware() {
    firebase.initializeApp({
      credential: firebase.credential.applicationDefault(),
    });

    this.app.use(express.json());

    if (process.env.NODE_ENV !== 'test') {
      this.app.use(`/docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
      console.log(`swagger: http://localhost:${PORT}/docs`);
    }

    this.setRouter();
  }

  private async setDatabase() {
    if (NODE_ENV !== 'test') {
      await mongoose.connect(DATABASE_URL);
    }
  }

  async start() {
    this.setMiddleware();
    await this.setDatabase();
    if (NODE_ENV !== 'test') {
      // Supertest means that we don't have to listen when testing
      this.server = this.app.listen(PORT, () => {
        console.log(`server: http://localhost:${PORT}${BASE_URL}`);
      });
    }

    this.webSocket = new WebSocket(this.server);
    console.log(`socketIO: http://localhost:${PORT}`);
  }
}

export default Server;
