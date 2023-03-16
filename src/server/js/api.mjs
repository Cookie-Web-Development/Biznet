'use strict';

import mongoose from 'mongoose';
import { product_schema } from './schema/product_schema.js';
import { discount_pipeline } from './pipeline/discount.js';
import { featured_pipeline} from './pipeline/featured.js';

let apiRoute = function (app) {
    mongoose.set('strictQuery', true);

    mongoose.connect(process.env.URI_PRODUCTS, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    let Products = mongoose.model('Products', product_schema);


    app.route('/').get(async (req, res) => {
        let discount_list = await Products.aggregate(discount_pipeline);
        let featured_list = await Products.aggregate(featured_pipeline)

        let empty_list = [];
        res.render('home', { discount_list, featured_list })
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