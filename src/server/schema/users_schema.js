'use strict';

import mongoose from 'mongoose';

export let users_schema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    profile_name: String,
    password: {
        type: String,
        required: true
    },
    user_config: {
        lang: String,
        theme: String
    }
})