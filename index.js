import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import env from 'dotenv';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pug from 'pug';
import http from 'http';
import { ExpressPeerServer } from 'peer';
import flash from 'express-flash';
import connectDB from './utils/db.js';
import router from './routes/index.js';
import session from 'express-session';
import multer from 'multer'; // Thêm multer

env.config();

import { app, server } from './socket/socket.js';

const PORT = process.env.PORT || 5000;

// Cấu hình CORS
const corsOptions = {
  origin: ['http://localhost:3000', 'https://localhost:5000'],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(flash());

// Kết nối MongoDB
await connectDB();

// Cấu hình method-override và body-parser
app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cấu hình public folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(join(__dirname, 'public')));

// Cấu hình view engine
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'pug');

// Cấu hình multer để upload file (sẽ dùng trong router)
const upload = multer({ dest: 'uploads/' });
app.set('upload', upload); // Lưu upload vào app để router sử dụng

// Tích hợp PeerServer vào Express
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/peerjs',
  allow_discovery: true
});
app.use('', peerServer);

// Lắng nghe sự kiện peer connect và disconnect
peerServer.on('connection', (peer) => {
  console.log('Peer connected:', peer.id);
});

peerServer.on('disconnect', (peer) => {
  console.log('Peer disconnected:', peer.id);
});

// Router
app.use(router);

// Khởi động server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});