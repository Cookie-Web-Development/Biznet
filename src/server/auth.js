'use strict';

import passport from 'passport';
import bcrypt from 'bcrypt';
import LocalStrat from 'passport-local';
import flash from 'express-flash';
import mongoose from 'mongoose';

import { users_schema } from './schema/users_schema.js';

let auth = (app, db) => {
    let userDB = db.model('users', users_schema);
    passport.use(new LocalStrat((username, password, done) => {
        userDB.findOne({username: username.trim().toLowerCase()})
            .then(user => {
                if (!user) {
                    return done( null, false, {message: 'invalid_login'} )}
                if(!bcrypt.compareSync(password, user.password)) { 
                    return done( null, false, {message: 'invalid_login'} )};
                
                return done(null, user)
            })
            .catch(err => {
                if(err){ return done(err) }
            })
        }));
    
    passport.serializeUser((user, done) => {
        done(null, user._id)
    });
    
    passport.deserializeUser((id, done) => {
        const objectId = new mongoose.Types.ObjectId(id)
        userDB.findOne({_id: objectId}, {_id: 1, profile_name: 1})
            .then(user => {
                done(null, user)
            })
    })
}

export default auth;