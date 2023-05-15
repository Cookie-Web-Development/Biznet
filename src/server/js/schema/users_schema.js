'use strict';

import mongoose from 'mongoose';

export let user_schema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profile_pic: {
        type: String,
        default: ''
    }
})