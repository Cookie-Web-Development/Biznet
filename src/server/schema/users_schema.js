'use strict';

import mongoose from 'mongoose';

export let users_schema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    user_config: {
        lang: String,
        theme: String
    }
})