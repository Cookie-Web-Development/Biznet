'use strict';

import express from 'express';
import session from 'express-session';
import http from 'http';
import dotenv from 'dotenv';
import apiRoute from './src/server/js/api.mjs';
import bodyParser from 'body-parser';

const app = express();
const server = http.createServer(app);
dotenv.config({ path: './.env' });

//FOR DEV ONLY START; DELETE WHEN DONE
//const testObj = require('./devTool/product_object.json');

//FOR DEV ONLY END; DELETE WHEN DONE

app.set('view engine', 'pug');
app.set('views', './views');
app.use('/public', express.static(process.cwd() + '/public'));

app.use(session({ //from ChatGPT
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: false, // expires when the user closes their browser
        secure: true, // recommended for HTTPS sites
    },
}));

// Set up body-parser middleware from ChatGPT
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


apiRoute(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`)
})  