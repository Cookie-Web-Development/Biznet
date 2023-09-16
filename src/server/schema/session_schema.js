'use strict';

import mongoose from 'mongoose';

export let session_schema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    expires: Date,
    session: String,
})