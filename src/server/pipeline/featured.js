'use strict';

export let featured_pipeline = [
    { $match: { featured: true } },
    {
        $lookup: {
            from: "categories",
            localField: "category_id",
            foreignField: "category_id",
            as: "category_name"
        }
    },
    {
        $unwind: "$category_name"
    },
    {
        $lookup: {
            from: "brands",
            localField: "brand_id",
            foreignField: "brand_id",
            as: "brand_name"
        }
    },
    {
        $unwind: "$brand_name"
    },
    {
        $lookup: {
            from: "tags",
            localField: "tag_id",
            foreignField: "tag_id",
            as: "tag_collection"
        }
    },
    {
        $addFields: {
            listing: {
                $map: {
                    input: "$listing",
                    as: "entry",
                    in: {
                        $mergeObjects: [
                            "$$entry",
                            {
                                price_discounted: {
                                    $round: [{ $subtract: ["$$entry.price", { $multiply: ["$$entry.price", "$$entry.discount_percent"] }] }, 2]
                                }
                            }
                        ]
                    }
                }
            }
        }
    },
    {
        $project: {
            _id: 1,
            name: 1,
            description: 1,
            reviews: 1,
            listing: 1,
            brand_id: 1,
            category_id: 1,
            featured: 1,
            category_name: "$category_name.name",
            brand_name: "$brand_name.name",
            tag_array: {
                $map: {
                    input: "$tag_collection",
                    as: "tag",
                    in: {
                        name: "$$tag.name",
                        tag_id: "$$tag.tag_id"
                    }
                }
            }
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