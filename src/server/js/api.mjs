'use strict';

import { product_schema } from './schema/product_schema.js';
import mongoose from 'mongoose';

let apiRoute = function (app) {
    mongoose.set('strictQuery', true);

    mongoose.connect(process.env.URI_PRODUCTS, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    let Products = mongoose.model('Products', product_schema);


    app.route('/').get(async (req, res) => {
        let discount_list = await Products.aggregate([
            {$match: { discount: true }},
            {
                $project: {
                    name: 1,
                    formattedPrice: {
                        $concat: [
                            "  $",
                            { $toString: { $round: ["$price", 2] } },
                            {
                                $cond: [
                                    {
                                        $regexMatch: {
                                            input: { $toString: '$price' },
                                            regex: /\./
                                        }
                                    }, "", ".00"
                                ]
                            }
                        ]
                    },
                    discount_percent: 1,
                    description: 1,
                    price_discounted: {
                        $concat: [" $", { $toString: { $round: [{ $subtract: ['$price', { $multiply: ['$price', '$discount_percent'] }] }, 2] } }, {
                            $cond: [
                                {
                                    $regexMatch: {
                                        input: { $toString: '$price' },
                                        regex: /\./
                                    }
                                }, "", ".00"
                            ]
                        }]
                    }
                }
            }
        ]);

        let empty_list = []
        res.render('home', { discount_list })
    });

    app.route('/test').get(async (req, res) => {
        /*
        let agregar = Products.create({
            "name": "testproduct7",
            "description": "description testproduct7",
            "price": 50,
            "discount": true,
            "discount_percent": 0.525,
            "featured": true,
            "tags": ["product", "test product"]
        })
        res.json(agregar);
        */
        res.send('aloha')
    })


};

export default apiRoute;