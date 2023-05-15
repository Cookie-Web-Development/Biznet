"use strict";

import mongoose from 'mongoose';

export let product_variations_schema = mongoose.Schema({
    variation_type: {
        type: String,
        required: true
    },
    variation_name: {
        type: String,
        required: true
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products"
    },
    variation_price: Number,
    variation_discount_percent: {
        type: Number,
        default: 0
    },
    variation_discount: {
        type: Boolean,
        default: false
    },
    variation_featured: {
        type: Boolean,
        default: false
    },
    variation_images: [String],
    variation_sku: {
        type: String,
        default: function() {
            return this.product_id ? this.product_id.sku : ""
        }
    }
});

