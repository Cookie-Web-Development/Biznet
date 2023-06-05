"use strict";

import mongoose from 'mongoose';

let listing_schema = mongoose.Schema({
    variation_options: {
        en: Object,
        es: Object
    },
    price: {
        type: Number//, required: true
    },
    discount: {
        type: Boolean//, default: false
    },
    discount_percent: {
        type: Number//, default: 0
    },
    featured: {
        type: Boolean//, default: false
    },
    images: [String],
    sku: {
        type: String//, required: true
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
    variation_type: {
        en: [String],
        es: [String]
    },
    listing: {
        type: [listing_schema],
        required: true
    }, //FIELDS FOR MIGRATION PORPUSE! DELETE AFTER FINISHED
    category: String,
    brand: String,
    tags: [String],
    sku: String,
    discount: Boolean,
    discount_percent: Number,
    featured: Boolean,
    images: [String]

});

export { products_schema, listing_schema}

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