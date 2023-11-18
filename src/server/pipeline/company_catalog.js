"use strict";
import mongoose from 'mongoose';

export default function company_catalog_query(query_input, option = undefined) {
    /* The following code was extracted from seach_query Pipeline originally
    {
    search: {
        'product_name.es': 'Name',
        'category_name.es': 'cat',
        brand_name: 'brand',
        'tag_name.es': 'tag',
        featured: 'false',
        document_publish: 'true',
        discount: 'true',
        'publish': 'true'
        },
    sort: { 'product_name.es': '1' }
    }


    //Only skip and limit for catalog edit. For the future
    option: { 
        sample: sample_number || skip: [ page_number, limit_per_page ]
    }
    */

    let queryObj = {};
    if (query_input.search) {
        Object.keys(query_input.search).forEach(key => {
            switch(key) {
                case '_id':
                    queryObj[key] = new mongoose.Types.ObjectId(query_input.search[key])
                    break;
                case 'featured':
                case 'document_publish':
                    queryObj[key] = JSON.parse(query_input.search[key]);
                    break;
                case 'discount':
                case 'publish':
                    if (!queryObj.listing) {
                        queryObj.listing = {}
                    }
                    queryObj.listing = {
                        $elemMatch: {
                            ...queryObj.listing.$elemMatch,
                            [key]: JSON.parse(query_input.search[key])
                        }
                    }
                    break;
                default:
                    queryObj[key]= { $regex: query_input.search[key], $options: 'i' }
            }
        })
    };

    //sort
    let sort = {};
    
    if(query_input.sort) {
       Object.keys(query_input.sort).forEach(key => {
        sort[key] = +query_input.sort[key]
       }) 
    } else {
        sort._id = 1
    }

    let pipeline = [
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
                                        $round: [
                                            { $subtract: ["$$entry.price", { $multiply: ["$$entry.price", "$$entry.discount_percent"] }] }, 2]
                                    }
                                }
                            ]
                        }
                    }
                },
                listing_length: { $size: "$listing" },
                tag_length: { $size: "$tag_id"}
            }
        },
        {
            $lookup: {
                from: "categories",
                localField: "category_id",
                foreignField: "category_id",
                as: "category"
            }
        },
        {
            $unwind: "$category"
        },
        {
            $lookup: {
                from: "brands",
                localField: "brand_id",
                foreignField: "brand_id",
                as: "brand"
            }
        },
        {
            $unwind: "$brand"
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
            $project: {
                _id: 1,
                product_name: 1,
                description: 1,
                document_publish: 1,
                variation_type: 1,
                reviews: 1,
                listing: 1,
                listing_length: 1,
                brand_id: 1,
                category_id: 1,
                featured: 1,
                category_name: "$category.category_name",
                brand_name: "$brand.brand_name",
                tag_id: 1,
                tag_length: 1,
                tag_array: {
                    $map: {
                        input: "$tag_collection",
                        as: "tag",
                        in: {
                            tag_name: "$$tag.tag_name",
                            tag_id: "$$tag.tag_id"
                        }
                    }
                }
            }
        },
        { $match: queryObj },
        { $sort: sort }
    ];

    // For future feature, to control how many entries to be displayed for  pagination in catalog_edit

    //display and sample options 
    // if(option) {
    //     try {
    //         for(let [key, value] of Object.entries(option)) {
    //             switch(key) {
    //                 case 'sample': // { sample: value }
    //                     pipeline.push({ $sample: { size: value} });
    //                     break;
    //                 case 'skip':  // { skip: [pageNumber, limitPerPage] }
    //                     pipeline.push( {
    //                         $facet: {
    //                             results_arr: [ 
    //                                 { $skip: ( value[0] - 1 ) * value[1] },
    //                                 { $limit: value[1] }
    //                             ],
    //                             results_total: [ { $count: 'total' }]
    //                         }
    //                     });

    //                     pipeline.push( {
    //                         $project: {
    //                             results_arr: 1,
    //                             results_total: { $arrayElemAt: ["$results_total.total", 0]}
    //                         }
    //                     });
    //                     break;
    //             }
    //         }
    //     }
    //     catch (err){
    //         return pipeline
    //      }
    // }
    return pipeline;
}