import Server from './server';
import socket from './socketio';

const server = new Server();

server.start();

export default server;
