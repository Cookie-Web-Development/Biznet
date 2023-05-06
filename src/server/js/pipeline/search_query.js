"use strict";
import mongoose from 'mongoose';

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
  search_lang: 'es',
  sort_option: "0-9"
}
*/
    let queryObj = {}
    //id
    if(query_input.id) {
        queryObj._id = new mongoose.Types.ObjectId(query_input.id);
    }

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
    };
    
    // sorting option
    let sort = {};
    switch(query_input.sort_option) {
        case '9-0':
            sort = { price_discounted: -1 }
            break;
        case 'a-z':
            sort = { name: 1 }
            break;
        case 'z-a':
            sort = { name: -1 }
            break;
        default:
            sort = { price_discounted: 1 }
    }   
    return [
        { $addFields: {
            price_discounted: { $round: [{ $subtract: [ '$price', { $multiply: [ '$price', '$discount_percent' ]}]}, 2] }
        }},
        { $match: queryObj },
        { $project: {
            _id: 1,
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
        }},
        { $sort: sort}
    ]
}