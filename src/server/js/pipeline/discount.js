'use strict';

export let discount_pipeline = [
    {$match: { discount: true }},
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
    { $sample: { size: 5 } }
];
