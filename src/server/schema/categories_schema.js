"use strict";

import mongoose from 'mongoose';

export let categories_schema = mongoose.Schema({
    category_name: {
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
        unique: true,
    },
    demo: {
        type: Boolean,
        default: false
    },
    ttl: {
        type: Number,
        default: null
    }
}, {
    timestamps: true
})