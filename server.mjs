'use strict';

import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import apiRoute from './src/server/js/api.mjs';

const app = express();
const server = http.createServer(app);
dotenv.config({ path: './.env' });

//FOR DEV ONLY START; DELETE WHEN DONE
//const testObj = require('./devTool/product_object.json');

//FOR DEV ONLY END; DELETE WHEN DONE

app.set('view engine', 'pug');
app.set('views', './views');
app.use('/public', express.static(process.cwd() + '/public'));


apiRoute(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`)
})  