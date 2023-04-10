"use strict";

export let search_list = {
    tags: [
        { $group: {
            _id: null,
            en: { $addToSet: "$tags.en" },
            es: { $addToSet: "$tags.es" }
        }},
        { $project: {
            en: { $reduce: {
                input: "$en",
                initialValue: [],
                in: { $concatArrays: [ '$$value', '$$this' ] }
            }},
            es: { $reduce: {
                input: '$es',
                initialValue: [],
                in: { $concatArrays: [ '$$value', '$$this' ] }
            }}
        }},
        { $unwind: '$en' },
        { $unwind: '$es' },
        { $group: {
            _id: null,
            en: { $addToSet: '$en' },
            es: { $addToSet: '$es' }
        }},
        { $project: {
            _id: 0
        }}
    ],
    category: [
        { $group: {
            _id: null,
            en: { $addToSet: "$category.en" },
            es: { $addToSet: "$category.es" }
        }},
        { $project: {
            _id: 0
        }}
    ],
    brand: [
        { $unwind: "$brand" },
        { $group: { _id: null, brand: { $addToSet: "$brand" } } },
        { $project: { _id: 0, brand: 1 } }
    ],
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
}

/*
    price_range: [
        { $group: {
            _id: null,
            min: { $min: "$price" },
            max: { $max: "$price" }
        }},
    category: [
        { $unwind: "$category" },
        { $group: { _id: null, category: { $addToSet: "$category" } } },
        { $project: { _id: 0, category: 1 } },
    ],
    tags: [
        { $unwind: "$tags" },
        { $group: { _id: null, tag: { $addToSet: "$tags" } } },
        { $project: { _id: 0, tags: "$tag" } },
    ],

*/