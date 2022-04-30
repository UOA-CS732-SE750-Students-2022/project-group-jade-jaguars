import http from 'http';
import { Socket, Server } from 'socket.io';

const BASE_URL: string = process.env.BASE_URL;

const socket = (server: http.Server) => {
  const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
  };

  const io = new Server(server, { cors: corsOptions });

  io.on('connection', (socket: Socket) => {
    console.log('client connected');

    socket.emit('message', 'message from server');

    socket.on('message', (arg) => {
      console.log(arg);
      socket.emit('test', 'message from server');
    });

    socket.on('disconnect', () => {
      console.log('client disconneted');
    });
  });

  // app.set('socketio', io);
};

export default socket;
