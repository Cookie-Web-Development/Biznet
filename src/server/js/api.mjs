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
        let featured_list = await Products.aggregate(featured_pipeline)

        let empty_list = [];
        //console.log(discount_list)
        res.render('home', { discount_list, featured_list })
    });

    app.route('/test').get(async (req, res) => {
        //let agregar = await Products.insertMany(product_import);
        //res.json(agregar);
        res.send('aloha')
    })


};

export default apiRoute;