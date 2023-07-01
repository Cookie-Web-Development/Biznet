"use strict";

import mongoose from 'mongoose';

export let reviews_schema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "products"
    },
    review_score: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review_text: {
        type: String,
        default: ''
    }
})