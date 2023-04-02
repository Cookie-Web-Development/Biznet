"use strict";

export let search_list = {
    tags: [
        { $unwind: "$tags" },
        { $group: { _id: null, tag: { $addToSet: "$tags" } } },
        { $project: { _id: 0, tags: "$tag" } },
    ],
    category: [
        { $unwind: "$category" },
        { $group: { _id: null, category: { $addToSet: "$category" } } },
        { $project: { _id: 0, category: 1 } },
    ],
    from: [
        { $unwind: "$from" },
        { $group: { _id: null, from: { $addToSet: "$from" } } },
        { $project: { _id: 0, from: 1 } },
    ],
    price_range: [
        { $group: {
            _id: null,
            min: { $min: "$price" },
            max: { $max: "$price" }
        }},
        { $project: {
            _id: 0,
            min: { $floor: "$min" },
            max: { $ceil: "$max" }
        }}
    ]
}