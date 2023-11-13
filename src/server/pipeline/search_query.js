"use strict";
import mongoose from 'mongoose';

export default function search_query(query_input, option = undefined) {
    /*
    query_input: { //A.K.A req.body
      product_name: 'Batidora',
      price_range_min: '164',
      price_range_max: '785',
      category: '2',
      brand: '1',
      selected_tags: [ '5', '6' ],
      discount: 'true',
      featured: 'true',
      search_lang: 'es',
      sort_option: "0-9",
      more_brand: [ product_id, brand_id ]
      more_similar: [ product_id, result[0].brand_id, {category}, [...tags_id]]
    },

    option: {
        sample: sample_number || skip: [ page_number, limit_per_page ]
    }

    sample: only shows limited amount, randomly selectec from pool of documents.
    skip: only shows limit_per_page, from a specific number. Used for pagination.

    */
    let queryObj = {}
    //id

    if (query_input.id) {
        queryObj._id = new mongoose.Types.ObjectId(query_input.id);
    }

    //name
    if (query_input.product_name) {
        queryObj.$or = [
            { "product_name.en": { $regex: query_input.product_name, $options: 'i' } },
            { "product_name.es": { $regex: query_input.product_name, $options: 'i' } }
        ]
    }

    //price_range_min
    //price_range_max
    if (query_input.price_range_min || query_input.price_range_max) {
        if (!queryObj.listing) {
            queryObj.listing = {}
        }

        if (query_input.price_range_min && query_input.price_range_max) {
            queryObj.listing = {
                $elemMatch: {
                    ...queryObj.listing.$elemMatch,
                    price_discounted: {
                        $gte: +query_input.price_range_min,
                        $lte: +query_input.price_range_max
                    }
                }
            }
        } else if (query_input.price_range_min) {
            queryObj.listing = {
                $elemMatch: {
                    ...queryObj.listing.$elemMatch,
                    price_discounted: {
                        $gte: +query_input.price_range_min
                    }
                }
            }
        } else {
            queryObj.listing = {
                $elemMatch: {
                    ...queryObj.listing.$elemMatch,
                    price_discounted: {
                        $lte: +query_input.price_range_max
                    }
                }
            }
        }
    }

    //category
    if (query_input.category) {
        queryObj.category_id = +query_input.category
    }

    //brand
    if (query_input.brand) {
        queryObj.brand_id = +query_input.brand
    }

    //selected_tags
    if (query_input.selected_tags) {
        //change all elements inside array from string to number
        query_input.selected_tags = query_input.selected_tags.map(entry => +entry);

        queryObj.tag_id = { $all: [...query_input.selected_tags] }
    }

    //discount
    if (query_input.discount) {
        if (!queryObj.listing) {
            queryObj.listing = {}
        }
        queryObj.listing = {
            $elemMatch: {
                ...queryObj.listing.$elemMatch,
                discount: Boolean(query_input.discount)
            }
        }
    }
    //featured
    if (query_input.featured) {
        queryObj.featured = Boolean(query_input.featured)
    };

    // sorting option
    let sort = {};
    let sort_name = `product_name.${query_input.search_lang}`;
    switch (query_input.sort_option) {
        case '9-0':
            sort = { "listing.price_discounted": -1 }
            break;
        case 'a-z':
            sort = { [sort_name]: 1 }
            break;
        case 'z-a':
            sort = { [sort_name]: -1 }
            break;
        default:
            sort = { "listing.price_discounted": 1 }
    };

    /*##############################
    similar query: Only used in /product/:id. Should not be used anywhere else for now
    ##############################*/
    //{ more_brand: [product_id, brand_id] }
    if (query_input.more_brand) {
        queryObj.$and = [
            { _id: {$ne: new mongoose.Types.ObjectId(query_input.more_brand[0])} },
            { brand_id: query_input.more_brand[1] }
        ]
    }
    //{ more_similar: [product_id, result[0].brand_id, category_id, [...tags_id]] }
    if (query_input.more_similar) {
        queryObj.$and = [
            { _id: { $ne: new mongoose.Types.ObjectId(query_input.more_similar[0])} },
            { brand_id: { $ne: query_input.more_similar[1]}} //avoid showing same items on main and more_brand
        ]
        queryObj.$and.push( { $or: [
            { category_id: {$eq: query_input.more_similar[2] } },
            { tag_id: { $elemMatch: {$in: [...query_input.more_similar[3] ] } } }
        ] } );
    }

    //{ more_product: product_id }
    if (query_input.more_product) {
        queryObj._id = { $ne: query_input.more_product}
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
                }
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
                reviews: 1,
                listing: 1,
                brand_id: 1,
                category_id: 1,
                featured: 1,
                category_name: "$category.category_name",
                brand_name: "$brand.brand_name",
                tag_id: 1,
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


    //display and sample options
    if(option) { //only used in /product/:id route
        try {
            for(let [key, value] of Object.entries(option)) {
                switch(key) {
                    case 'sample': // { sample: value }
                        pipeline.push({ $sample: { size: value} });
                        break;
                    case 'skip':  // { skip: [pageNumber, limitPerPage] }
                        pipeline.push( {
                            $facet: {
                                results_arr: [ 
                                    { $skip: ( value[0] - 1 ) * value[1] },
                                    { $limit: value[1] }
                                ],
                                results_total: [ { $count: 'total' }]
                            }
                        });

                        pipeline.push( {
                            $project: {
                                results_arr: 1,
                                results_total: { $arrayElemAt: ["$results_total.total", 0]}
                            }
                        });
                        break;
                }
            }
        }
        catch (err){
            return pipeline
         }
    }
    return pipeline;
}