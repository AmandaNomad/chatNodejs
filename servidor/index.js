import express from 'express';
import morgan from 'morgan';
import {Server as SocketServer} from 'socket.io';
import http from 'http';
import cors from 'cors';
import {dirname, join} from 'path';
import { fileURLToPath } from 'url';

//modulos que creamos la extencion se trae con .js y si son modulos de terceros no se necesita el .js
import {PORT} from './configuracion.js';


//configuracion de  socket.io
const app = express() //aplicacion de express
const __dirname = dirname(fileURLToPath (import.meta.url));

const server = http.createServer(app) //luego se convierte a un servidor http
const io = new SocketServer(server,{
    cors:{
        origin: 'https://chat-nodejs-react.onrender.com',
    },
}); //finalmente ese servidor se le pasa como parametro al servidor de  websocket


app.use(cors()) //cualquier servidor externo al localhost puerto 3000 se va a poder conectar
app.use(morgan('dev'));

io.on('connection', (socket)=>{
    console.log(socket.id)
    
    //aqui recibio el mensaje desde el frontend, una vez que el backend recibe el mensaje lo envia al frontend
    socket.on('message', (message) =>{
       
        socket.broadcast.emit('message',{
            body: message,
            from: socket.id,
        }); //enviamos al los otros clientes y emitimos un evento
    });
}); //esto se ejecuta cuando ocurre el evento

app.use(express.static(join(__dirname, '../cliente/build')))

server.listen(PORT)
console.log('server iniciado en el puerto ', PORT)