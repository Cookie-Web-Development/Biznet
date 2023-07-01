'use strict';

import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import http from 'http';
import dotenv from 'dotenv';
import apiRoute from './src/server/api.mjs';
import bodyParser from 'body-parser';

const app = express();
const server = http.createServer(app);
dotenv.config({ path: './.env' });

app.set('view engine', 'pug');
app.set('views', './views');
app.use('/public', express.static(process.cwd() + '/public'));


const sessionDB = mongoose.createConnection(process.env.URI_SESSION, { useNewUrlParser: true, useUnifiedTopology: true });


const store = MongoStore.create({
  mongoUrl: process.env.URI_SESSION,
  mongooseConnection: sessionDB,
  collectionName: 'session'
});

app.use(session({ //from ChatGPT
    secret: process.env.SESSION,
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: 'none',
      httpOnly: true, //Prevent client-side scripting
      secure: false, //Sends cookies only HTTPS, false during testing
      maxAge: 300000 //5min FOR DEV ONLY!
    },
    store: store
}));

// Set up body-parser middleware from ChatGPT
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middleware function to set language preference
let setLanguagePreference = (req, res, next) => {
  if (!req.session.language) {
    // Check for language in request headers
    req.session.language = req.headers['accept-language'];
    if (!req.session.language) {
      // Set default language
      language = 'es';
    } else {
      // Extract the language code from the header
      req.session.language = req.session.language.split(',')[0].split(';')[0].split('-')[0];
    }
  }
  next();
}

// Set the middleware function for all routes
app.use(setLanguagePreference);

apiRoute(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`)
})  