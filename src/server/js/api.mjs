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
            {
                $match: {
                    discount: true
                }
            },
            {
                $project: {
                    name: 1,
                    price: 1,
                    discount_percent: 1
                }
            }
        ]);
        res.render('home', { discount_list })
    });

    app.route('/test').get(async (req, res) => {

        res.send('testerino');
    })


};

export default apiRoute;