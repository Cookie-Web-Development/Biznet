'use strict';

import 'core-js';
import express from 'express';
import favicon from 'serve-favicon';
import path from 'path';
import helmet from 'helmet';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import passport from 'passport';
import flash from 'express-flash';
import http from 'http';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import apiRoute from './server/api.mjs';
import auth from './server/auth.js'
import { session_schema } from './server/schema/session_schema.js'

/*Directory Traversal Prevent*/
// function _DTP (req, res, next) {
//   const requested_path =  req.path;
//   const norm_path = path.normalize(requested_path)

//   if(!norm_path.startsWith('public'))
// }



const app = express();
const server = http.createServer(app);
dotenv.config({ path: './.env' });

app.set('view engine', 'pug');
app.set('views', './views');
app.use(cookieParser());
app.use(flash());
app.use(favicon('./public/img/logo/icon.ico'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/src', express.static(process.cwd() + '/src'));

/*###########
DB connection
#############*/
mongoose.set('strictQuery', true);
mongoose.Promise = global.Promise;

const connection_settings = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

const DB = mongoose.createConnection(process.env.URI_DB, connection_settings);

const store = MongoStore.create({
  mongoUrl: process.env.URI_DB,
  mongooseConnection: DB,
  collectionName: 'sessions'
});


DB.on('error', (err) => {
  console.error('Error connecting to Database', err);
})

//DEV ENVIORMENT; DELETE FOR PRODUCTION
if ( process.env.DEV_ENV ) {

  DB.on('connected', () => {
    console.log('Connected to Database');
  });

  DB.on('disconnect', () => {
    console.log('Disconnected from Database')
  });

  app.use(helmet({
    hsts: false,
    referrerPolicy: { policy: 'same-origin' },
    hidePoweredBy: false,
    contentSecurityPolicy: false
  }));

} else {
  app.use(helmet({
    referrerPolicy: { policy: 'same-origin' }
  }))
}

/*######
SESSIONS
########*/

app.use(session({ //from ChatGPT
  secret: process.env.SESSION,
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: 'lax',
    httpOnly: true, //Prevent client-side scripting
    secure: false, //Sends cookies only HTTPS. true for Production. false for dev
    maxAge: 300000 //5min FOR DEV ONLY!
  },
  store: store
}));

app.use(passport.initialize());
app.use(passport.session())

// Set up body-parser middleware from ChatGPT
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Session middleware function for all routes
let Sessions = DB.model('sessions', session_schema);

let session_middleware = async (req, res, next) => {
  let sessionDB_result, errorLimit = 3;

  async function queryDB(id) {
    return await Sessions.findOne( { _id: id } );
  }

  async function regenerate_id() {
    return new Promise((resolve, reject) => {
      req.session.regenerate((err) => {
        if (err) {throw new Error('wtf')}
        else { 
          console.log('Error log: session_middleware errorLimit', errorLimit)
          resolve() 
        }
      })
    })
  }

  async function sessionID_check() {
    return new Promise(async (resolve, reject) => {
      sessionDB_result = await queryDB(req.sessionID);

      if(sessionDB_result && !req.cookies['connect.sid']) { reject() }
      
      if(!sessionDB_result) { req.session.save() }
      resolve();

    })
    .then(() => {
      req.session.last_access = new Date();
      next();
    })
    .catch(async () => {
      errorLimit--
      if(errorLimit <= 0) { throw new Error('Unable to generate SessionID') };
      await regenerate_id();
      return sessionID_check();
    })
  }

  try {
    await sessionID_check()
  } 
  catch(err) {
    next(err);
  }
}

app.use(session_middleware);


apiRoute(app, DB);
auth(app, DB);

//placeholder error middleware
app.use((err, req, res, next) => {
  console.error('Error', err);

  let errorStatus = err.status || '500'

  res.status(errorStatus).json({
    error: {
      message: err.message || "Internal Server Error"
    }
  })
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Listening to port: ${PORT}`)
})  