"use strict";

import mongoose from 'mongoose';

export let brands_schema = mongoose.Schema({
    brand_name: {
        type: String,
        default: "Original"
    },
    brand_id: {
        type: Number,
        unique: true
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