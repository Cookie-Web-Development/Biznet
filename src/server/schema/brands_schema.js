"use strict";

import mongoose from 'mongoose';

export let brands_schema = mongoose.Schema({
    name: {
        type: String,
        default: "Original"
    },
    brand_id: {
        type: Number,
        unique: true
    }
})