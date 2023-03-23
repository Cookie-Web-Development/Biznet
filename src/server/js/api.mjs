'use strict';

import mongoose from 'mongoose';
import { product_schema } from './schema/product_schema.js';
import { product_variation_schema} from './schema/product_variation.js'
import { discount_pipeline } from './pipeline/discount.js';
import { featured_pipeline} from './pipeline/featured.js';

/*DEV MODE START: DELETE AFTER USE*/
import { product_import } from '../../../devTool/product_import.js';
//import product_variation from '../../../devTool/product_object';
/*DEV MODE END*/

let apiRoute = function (app) {
    mongoose.set('strictQuery', true);

    mongoose.connect(process.env.URI_PRODUCTS, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    let Products = mongoose.model('Products', product_schema);


    app.route('/').get(async (req, res) => {
        let discount_list = await Products.aggregate(discount_pipeline);
        let featured_list = await Products.aggregate(featured_pipeline);
        let formatOptions = {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        };

        discount_list.forEach(item => {
            item.format_price = item.price.toLocaleString('en-US', formatOptions);
            item.format_price_discounted = item.price_discounted.toLocaleString('en-US', formatOptions);
        });
        featured_list.forEach(item => {
            item.format_price = item.price.toLocaleString('en-US', formatOptions);
            item.format_price_discounted = item.price_discounted.toLocaleString('en-US', formatOptions);
        })
        //featured_list = [featured_list[0]];
        //console.log(featured_list)
        res.render('home', { discount_list, featured_list })
    });

    app.route('/test').get(async (req, res) => {
        //let agregar = await Products.insertMany(product_import);
        //res.json(agregar);
        res.send('aloha')
    })


};

export default apiRoute;