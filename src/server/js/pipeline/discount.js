'use strict';

export let discount_pipeline = [
    { $match: { listing: {$elemMatch: {discount: true}} }},
    { $addFields: {
        listing: {
            $map: {
                input: "$listing",
                as: "entry",
                in: {
                    $mergeObjects: [
                        "$$entry",
                        {price_discounted: {
                            $subtract: ["$$entry.price", { $multiply: ["$$entry.price", "$$entry.discount_percent"]}]
                        }}
                    ]
                }
            }
        }
    }},
    { $project: {
        __v: 0
    }}
];
