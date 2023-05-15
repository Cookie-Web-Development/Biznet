"use strict";

import mongoose from 'mongoose';

export let products_schema = mongoose.Schema({
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
    price: {
        type: Number,
        required: true
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
    tag_id: {
        type: [Number],
        ref: "tags"
    },
    sku: {
        type: String,
        required: true
    }
});

/* BACKUP
"use strict";

import mongoose from 'mongoose';

export let product_schema = mongoose.Schema({
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
    price: {
        type: Number,
        required: true
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
    category: {
        en: {
            type: String,
            default: 'uncategorized'
        },
        es: {
            type: String,
            default: 'sin categoría'
        }
    },
    brand: {
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
    tags: {
        en: [String],
        es: [String]
    },
    sku: {
        type: String,
        required: true
    }
});

*/