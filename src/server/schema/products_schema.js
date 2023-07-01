"use strict";

import mongoose from 'mongoose';

let listing_schema = mongoose.Schema({
    variation_options: {
        en: Object,
        es: Object
    },
    price: {
        type: Number, 
        required: true
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
    sku: {
        type: String, 
        required: true
    }
});

let products_schema = mongoose.Schema({
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
    description: {
        en: {
            type: String,
            default: ''
        },
        es: {
            type: String,
            default: ''
        }
    },
    category_id: {
        type: Number,
        ref: "categories"
    },
    brand_id: {
        type: Number,
        ref: "brands"
    },
    tag_id: {
        type: [Number],
        ref: "tags"
    },
    featured: Boolean,
    variation_type: {
        en: [String],
        es: [String]
    },
    listing: {
        type: [listing_schema],
        required: true
    }
});

export { products_schema, listing_schema}
