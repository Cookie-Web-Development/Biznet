'use strict';

import mongoose from 'mongoose';
import { product_schema } from './schema/product_schema.js';
import { product_variation_schema } from './schema/product_variation.js'
import { discount_pipeline } from './pipeline/discount.js';
import { featured_pipeline } from './pipeline/featured.js';
import { search_list } from './pipeline/search_list.js';

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


    app.route(['/', '/home']).get(async (req, res) => {
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

    app.route('/catalog')
        .get(async (req, res) => {
            let tags = await Products.aggregate(search_list.tags),
            categories = await Products.aggregate(search_list.category),
            brands = await Products.aggregate(search_list.from);
            //All of them return [{key: [...string]}]

            let search_fields = {
                tags_fields: tags[0].tags.sort(),
                category_fields: categories[0].category.sort(),
                brand_fields: brands[0].from.sort()
            }
            //console.log(search_fields.tags_fields.sort())
            res.render('catalog', { search_fields })
        })

    app.route('/test').get(async (req, res) => {
        let test = await Products.findOneAndUpdate(
            { _id: "64189e972ea9cdec50ce98da" },
            { from: "Future Now" }
            );
        res.json(test);
        //res.send('aloha')
    });


};

export default apiRoute;