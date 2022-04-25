import http from 'http';
import express from 'express';
import { Server, Socket } from 'socket.io';

const BASE_URL: string = process.env.BASE_URL;

const socket = (server: http.Server, app: express.Application) => {
  const io = new Server(server, { path: `${BASE_URL}/socketio/` });

  io.on('connection', (socket: Socket) => {
    console.log('client connected');

    socket.on('test', (arg) => {
      console.log(arg);
      socket.emit('test', 'message from server');
    });

    socket.on('disconnect', () => {
      console.log('client disconneted');
    });
  });

  app.set('socketio', io);
};

export default socket;
