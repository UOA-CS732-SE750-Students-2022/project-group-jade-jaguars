import express from 'express';
import http from 'http';
import path from 'path';
import cors from 'cors';
import {
  PORT,
  BASE_URL,
  VERBOSE,
  DATABASE_URL,
} from './configs/backend.config';
import socketio from 'socket.io';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import bodyParser from 'body-parser';
import { eventsRouter } from './routes/event.route';
import { usersRouter } from './routes/user.route';
import { teamRouter } from './routes/team.route';
import mongoose from 'mongoose';
import socket from './socketio';

const indexRouter = express.Router();

class Server extends http.Server {
  public app: express.Application;

  constructor() {
    const app: express.Application = express();
    super(app);
    this.app = app;
  }

  private setRouter() {
    this.app.use(BASE_URL, indexRouter);
    this.app.use(BASE_URL, eventsRouter);
    this.app.use(BASE_URL, usersRouter);
    this.app.use(BASE_URL, teamRouter);
  }

  private setMiddleware() {
    this.app.use(express.json());
    this.app.use(bodyParser.json());

    if (process.env.NODE_ENV !== 'testing') {
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

      this.app.use(
        `${BASE_URL}/docs`,
        swaggerUi.serve,
        swaggerUi.setup(swaggerJsdoc(options)),
      );
      console.log(`swagger: http://localhost:${PORT}${BASE_URL}/docs`);
    }

    this.setRouter();
  }

  private async setDatabase() {
    if (process.env.NODE_ENV !== 'testing') {
      await mongoose.connect(DATABASE_URL);
    }
  }

  async start() {
    this.app.set('port', PORT);
    this.setMiddleware();
    await this.setDatabase();
    if (process.env.NODE_ENV !== 'testing') {
      socket(this, this.app);
      this.app.listen(this.app.get('port'), () => {
        console.log(`server: http://localhost:${this.app.get('port')}`);
      });
    } else {
    }
  }
}

export default Server;
