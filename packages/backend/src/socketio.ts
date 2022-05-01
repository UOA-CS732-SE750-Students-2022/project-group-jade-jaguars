import http from 'http';
import { Socket, Server } from 'socket.io';

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};

class WebSocket {
  io: Server;

  constructor(server: http.Server) {
    this.io = new Server(server, { cors: corsOptions });

    this.io.on('connection', (socket: Socket) => {
      console.log('socketIO client connected');

      socket.on('disconnect', () => {
        console.log('socketIO client disconnected');
      });
    });
  }

  send(eventName: string, data: any) {
    this.io.emit(eventName, data);
  }

  listen(eventName: string, callback: (data: any) => void) {
    this.io.on(eventName, callback);
  }
}

export default WebSocket;
