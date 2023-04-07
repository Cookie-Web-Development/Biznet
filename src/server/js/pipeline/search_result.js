"use strict";

export default function search_result (queryObj) {
/*
req.body: {
    "name": "car",
    "price_range_min": "379",
    "price_range_max": "1238",
    "category": "Automobile",
    "brand": "Ralph's",
    "selected_tags": [
        "Ball",
        "Basketball"
    ],
    "discount": "true",
    "featured": "true"
}
*/
    let objResult = {}
    //name
    if(queryObj.name) {
        objResult.name = { $regex: queryObj.name, $options: 'i'}
    }
    
    //price_range_min
    //price_range_max
    if(queryObj.price_range_min || queryObj.price_range_max) {
        if (queryObj.price_range_min && queryObj.price_range_max) {
            objResult.price_discounted = { $lte: +queryObj.price_range_max, $gte: +queryObj.price_range_min }
        } else if (queryObj.price_range_min) {
            objResult.price_discounted = { $gte: +queryObj.price_range_min }
        } else {
            objResult.price_discounted = { $lte: +queryObj.price_range_max }
        }
    }
    
    //category
    if (queryObj.category) {
        objResult.category = queryObj.category
    }

    //brand

    //selected_tags
    
    //discount
    if (queryObj.discount) {
        objResult.discount = Boolean(queryObj.discount)
    }
    //featured
    
    if (queryObj.featured) {
        objResult.featured = Boolean(queryObj.featured)
    }

    console.log(objResult)
    return [
        { $addFields: {
            price_discounted: { $round: [{ $subtract: [ '$price', { $multiply: [ '$price', '$discount_percent' ]}]}, 2] }
        }},
        { $match: objResult},
        //{ $match: { price_discounted: { $gte: 784 } } },
        { $project: {
            _id: 1,
            name: 1, 
            price: 1,
            price_discounted: 1
        }}
    ]
}


/*    let matchQuery = { $match: {
        $expr: {
            $and: []
        }
    }}; */