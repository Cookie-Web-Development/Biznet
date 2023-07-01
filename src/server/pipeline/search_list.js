"use strict";

export let search_list = {
    multi_lang: (lang) => {
        let sort_lang = `name.${lang}`;

        return [
            {
                $project: {
                    _id: 0,
                    __v: 0
                }
            },
            {
                $sort: {
                    [sort_lang]: 1
                }
            }
        ]
    },
    brand: [
        { $project: { _id: 0, __v: 0 } }
    ],
    price_range: [
        {
            $project: {
                _id: 0,
                price_list: {
                    $map: {
                        input: "$listing",
                        as: "entry",
                        in: {
                            $round: [{ $subtract: ["$$entry.price", { $multiply: ["$$entry.price", "$$entry.discount_percent"] }] }, 2]
                        }
                    }
                }
            }
        },
        {
            $unwind: "$price_list"
        },
        {
            $group: {
                _id: null,
                price_list: {
                    $push: "$price_list"
                }
            }
        },
        {
            $project: {
                _id: 0,
                max: {
                    $max: "$price_list"
                },
                min: {
                    $min: "$price_list"
                }
            }
        }
    ]
}

/*
    price_range: [
        { $project: {
            price_discounted: { $subtract: [ '$price', { $multiply: [ '$price', '$discount_percent' ]}]}
        }},
        { $group: {
            _id: null,
            min: { $min: "$price_discounted" },
            max: { $max: "$price_discounted" }
        }},
        { $project: {
            _id: 0,
            min: { $floor: "$min" },
            max: { $ceil: "$max" }
        }}
    ]

*/