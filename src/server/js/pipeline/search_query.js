"use strict";
import mongoose from 'mongoose';

export default function search_query(query_input) {
    /*
    req.body: {
      name: 'Batidora',
      price_range_min: '164',
      price_range_max: '785',
      category: '2',
      brand: '1',
      selected_tags: [ '5', '6' ],
      discount: 'true',
      featured: 'true',
      search_lang: 'es',
      sort_option: "0-9"
    }
    */
    let queryObj = {}
    //id
    if (query_input.id) {
        queryObj._id = new mongoose.Types.ObjectId(query_input.id);
    }

    //name
    if (query_input.name) {
        queryObj.$or = [
            { "name.en": { $regex: query_input.name, $options: 'i' } },
            { "name.es": { $regex: query_input.name, $options: 'i' } }
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
        queryObj.tag_id = { $all: [...+query_input.selected_tags] }
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
    }

    // sorting option
    let sort = {};
    switch (query_input.sort_option) {
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
        { $match: queryObj },
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
        { $sort: sort }
    ]
}