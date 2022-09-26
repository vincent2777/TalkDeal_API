"use strict";

import http from "http";
import express from "express";

//  Setup Server with Express App.
const app = express();
const server = http.createServer(app);

export { app, server };