'use strict';

import passport from 'passport';
import bcrypt from 'bcrypt';
import LocalStrat from 'passport-local';

import { users_schema } from './schema/users_schema.js';

let auth = (app, db) => {
    let userDB = db.model('users', users_schema);
    passport.use(new LocalStrat((username, password, done) => {
        userDB.findOne({ username: username }, (err, user) => {
            console.log('User in DB:', user);
            if(err){ return done(err) }
            if(!user) { return done( null, false )}
            if(!bcrypt.compareSync(password, user.password)) { return done( null, false )};
            return done (null, user);
        })
    }));
    
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    
    passport.deserializeUser((id, done) => {
        userDB.findOne({ _id: id }, (err, doc) => {
            done(null, doc)
        })
    })
}

export default auth;