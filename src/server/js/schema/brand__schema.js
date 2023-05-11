"use strict";

import mongoose from 'mongoose';

export let brand_schema = mongoose.Schema({
    name: {
        type: String,
        default: "Original"
    }
})