'use strict';

import mongoose from 'mongoose';

export let session_schema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        default: ''
    },
    expires: Date,
    session: String,
    last_acess: String
})