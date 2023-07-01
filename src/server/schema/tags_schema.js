"use strict";

import mongoose from 'mongoose';

export let tags_schema = mongoose.Schema({
    name: {
        es: {
            type: String,
            required: true
        },
        en: {
            type: String,
            required: true
        }
    },
    tag_id: {
        type: Number,
        unique: true
    }
})