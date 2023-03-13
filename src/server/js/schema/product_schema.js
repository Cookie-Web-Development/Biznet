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
    pictures: [String],
    reviews: [{username: String, comment: String}],
    tags: [String]
});

