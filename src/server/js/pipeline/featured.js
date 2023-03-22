'use strict';

export let featured_pipeline = [
    {$match: { featured: true }},
    {
        $project: {
            name: 1,
            price: 1,
            discount_percent: 1,
            description: 1,
            category: 1,
            from: 1,
            tags: 1,
            sku: 1,
            images: 1,
            price_discounted: { 
                $round: [{ $subtract: ['$price', { $multiply: ['$price', '$discount_percent'] }] }, 2] } 
            }
        },
    { $sample: { size: 8 } }
];

/*
'use strict';

export let featured_pipeline = [
    {$match: { featured: true }},
    {
        $project: {
            name: 1,
            formattedPrice: {
                $concat: [
                    "  $",
                    { $toString: { $round: ["$price", 2] } },
                    {
                        $cond: [
                            {
                                $regexMatch: {
                                    input: { $toString: '$price' },
                                    regex: /\./
                                }
                            }, "", ".00"
                        ]
                    }
                ]
            },
            discount_percent: 1,
            description: 1,
            category: 1,
            from: 1,
            tags: 1,
            sku: 1,
            images: 1,
            price_discounted: {
                $concat: [" $", { $toString: { $round: [{ $subtract: ['$price', { $multiply: ['$price', '$discount_percent'] }] }, 2] } }, {
                    $cond: [
                        {
                            $regexMatch: {
                                input: { $toString: '$price' },
                                regex: /\./
                            }
                        }, "", ".00"
                    ]
                }]
            }
        }
    },
    { $sample: { size: 8 } }
];


*/