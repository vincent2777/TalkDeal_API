"use strict";

import express from "express";

import dotenv from 'dotenv';
import fs from 'fs';

import  { app, server } from './config/expressSetup';
// import { io } from './config/socketIOSetup';
// import SocketIOController from "./controllers/socketIO_controller";
import Response from './utils/response';
import routes from './routes'

dotenv.config();

// Create the "./public/uploads/" if the do not exist.
!fs.existsSync(`./public/uploads/`) && fs.mkdirSync(`./public/uploads/`, { recursive: true });

//  Public Folder.
app.use(express.static('./public'));


//  parse JSON-encoded bodies and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// To avoid CORS errors, we need to allow some Header accesses as done below
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "POST, PUT, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});


//  Create Socket.IO Connection.
// SocketIOController.socketConnection(io);


//  Create a Default or Root Route.
app.get('/', (req, res) => {
    const response = new Response(
        true,
        200,
        'Welcome to Talk Deal API.'
    );
    res.status(response.code).json(response);
});

//  Create other Routes.
app.use('/api/v1', routes);


const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';
const BASE_URL = process.env.BASE_URL || `http://${HOST}:${PORT}`;

server.listen(PORT, () => {
    console.log(`Express server running on port: ${PORT}, Please kindly visit ${BASE_URL}`);
});