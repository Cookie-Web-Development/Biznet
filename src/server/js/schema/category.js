"use strict";

import mongoose from 'mongoose';

export let category_schema = mongoose.Schema({
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
    category_id: {
        type: Number,
        required: true
    }
})