"use strict";

import mongoose from 'mongoose';

let listing_schema = mongoose.Schema({
    variation_options: {
        en: Object,
        es: Object
    },
    price: {
        type: Number, 
        default: 0
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
    },
    publish: {
        type: Boolean,
        default: false
    }
});

let products_schema = mongoose.Schema({
    product_name: {
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
    variation_type: [{
        en: String,
        es: String
    }],
    listing: {
        type: [{
            variation_options: {
                en: Object,
                es: Object
            },
            price: {
                type: Number, 
                default: 0
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
            images: {
                type: [String],
                default: ['no-image.webp']
            },
            sku: {
                type: String, 
                default: ''
            },
            publish: {
                type: Boolean,
                default: false
            }
        }],
        default: []
    },
    document_publish: {
        type: Boolean,
        default: false
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
});

export { products_schema }
