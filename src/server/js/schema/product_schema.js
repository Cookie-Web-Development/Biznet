"use strict";

import mongoose from 'mongoose';

export let product_schema = mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        default: "uncategorized"
    },
    from: {
        type: String,
        default: "Original"
    },
    discount: {
        type: Boolean,
        default: false
    },
    discount_percent: {
        type: Number,
        default: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    images: [String],
    reviews: {
        type: [ 
            { username: String, comment: String, rating: Number }
         ],
        default: []
    },
    tags: [String],
    sku: {
        type: String,
        required: true
    }
});

