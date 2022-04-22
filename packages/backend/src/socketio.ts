import http from 'http';
import express from 'express';
import { Server, Socket } from 'socket.io';
import { BASE_URL } from './configs/backend.config';

const socket = (server: http.Server, app: express.Application) => {
  const io = new Server(server);

  // console.log(`socketio http://localhost:${PORT}${BASE_URL}/socketio`);

  // io.on('connection', (socket: socketio.Socket) => {
  //   console.log('client connected');

  //   socket.on('disconnect', () => {
  //     console.log('client disconneted');
  //   });
  // });

  app.set('socketio', io);
};

export default socket;
