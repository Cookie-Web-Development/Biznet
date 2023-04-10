"use strict";

export default function search_query (query_input) {
/*
req.body: {
  name: 'Batidora',
  price_range_min: '164',
  price_range_max: '785',
  category: 'Automotriz',
  brand: 'Cybertron',
  selected_tags: [ 'Accesorios', 'Acústica' ],
  discount: 'true',
  featured: 'true',
  search_lang: 'es'
}
*/
    let queryObj = {}
    //name
    if(query_input.name) {
        queryObj.$or = [
            { "name.en": { $regex: query_input.name, $options: 'i' } },
            { "name.es": { $regex: query_input.name, $options: 'i' } }
        ]
    }
    
    //price_range_min
    //price_range_max
    if(query_input.price_range_min || query_input.price_range_max) {
        if (query_input.price_range_min && query_input.price_range_max) {
            queryObj.price_discounted = { $lte: +query_input.price_range_max, $gte: +query_input.price_range_min }
        } else if (query_input.price_range_min) {
            queryObj.price_discounted = { $gte: +query_input.price_range_min }
        } else {
            queryObj.price_discounted = { $lte: +query_input.price_range_max }
        }
    }
    
    //category
    if (query_input.category) {
        queryObj[`category.${query_input.search_lang}`] = query_input.category
    }
    
    //brand
    if (query_input.brand) {
        queryObj.brand = query_input.brand
    }
    
    //selected_tags
    if (query_input.selected_tags) {
        queryObj[`tags.${query_input.search_lang}`] = { $all: [...query_input.selected_tags] }
    }

    //discount
    if (query_input.discount) {
        queryObj.discount = Boolean(query_input.discount)
    }
    //featured
    
    if (query_input.featured) {
        queryObj.featured = Boolean(query_input.featured)
    }

    //single vs multiple queries
    if (Object.keys(queryObj).length > 1) {
        let andQuery = { $and: []};
        for (let key in queryObj) {
            andQuery.$and.push( { [key]: queryObj[key]} )
        }
        
        queryObj = andQuery
    }
    console.log(queryObj)
    return [
        { $addFields: {
            price_discounted: { $round: [{ $subtract: [ '$price', { $multiply: [ '$price', '$discount_percent' ]}]}, 2] }
        }},
        { $match: queryObj },
        { $project: {
            name: 1,
            price: 1,
            description: 1,
            price_discounted: 1,
            discount_percent: 1,
            category: 1,
            brand: 1,
            tags: 1,
            images: 1,
            sku: 1
        }}
    ]
}