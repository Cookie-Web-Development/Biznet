'use strict';

export let discount_pipeline = [
    {$match: { discount: true }},
    {
        $project: {
            _id:  1,
            name: 1,
            price: 1.,
            discount_percent: 1,
            description: 1,
            category: 1,
            brand: 1,
            tags: 1,
            sku: 1,
            images: 1,
            price_discounted: { 
                $round: [{ $subtract: ['$price', { $multiply: ['$price', '$discount_percent'] }] }, 2] } 
        }
    }
];
