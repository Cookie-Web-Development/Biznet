"use strict";
import mongoose from 'mongoose';

export default function company_query(query_obj) {
    /*
    query structure will be
        { search: { key : value }, sort: { key: value } }

    anything outside this format must show empty list

    all values will be in string so values like _ids must be changed back to interger

    search query for products will be using the search_query.js pipeline
    */

    let query_match = query_obj.search || {};
    let query_sort = query_obj.sort || { brand_id: 1};

    Object.keys(query_match).map(key => {
        let regex = /_?id$/;
        if (regex.test(key)) {
            return query_match[key] = parseInt(query_match[key]) || query_match[key];
        }
        if (key == 'name') {
            return query_match[key] = { $regex: query_match[key], $options: 'i'};
        }
    });

    Object.keys(query_sort).map(key => {
        // console.log(typeof(query_sort[key])) //string 1
        if (query_sort[key] != 1 && query_sort[key] != -1) {
            return query_sort[key] =  1 
        } 
        return query_sort[key] = parseInt(query_sort[key])
    })

    /*
    let pipeline = [
        { $match: { }},
        { $sort: { brand_id: 1 } }
    ];
    THIS IS MUST BE DE FALLBACK VALUE FOR PIPELINE IN CASE QUERY IS WRONG OR EMPTY
    */

    let pipeline = [
        { $match: query_match },
        { $sort: query_sort }
    ];

    return pipeline;
    
  
}