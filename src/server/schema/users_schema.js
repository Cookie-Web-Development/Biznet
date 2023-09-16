'use strict';

import mongoose from 'mongoose';

export let users_schema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    profile_name: String,
    profile_pic: {
        type: String,
        default: 'default.jpg'
    },
    password: {
        type: String,
        required: true
    },
    user_preferences: {
        lang: String
    },
    account_settings: {
        role: {
            type: String,
            default: 'user'
        }
    }
})