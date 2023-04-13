'use strict';

import mongoose from 'mongoose';
import langData from './lang/lang.json' assert { type: "json" };
import { product_schema } from './schema/product_schema.js';
import { product_variation_schema } from './schema/product_variation.js'
import { discount_pipeline } from './pipeline/discount.js';
import { featured_pipeline } from './pipeline/featured.js';
import { search_list } from './pipeline/search_list.js';
import search_query from './pipeline/search_query.js';

/*DEV MODE START: DELETE AFTER USE*/
import { product_import } from '../../../devTool/product_import.js';
//import crypto from 'crypto';

//const key = crypto.randomBytes(32).toString('hex');
//console.log(key);
//import product_variation from '../../../devTool/product_object';
/*DEV MODE END*/

let apiRoute = function (app) {
    mongoose.set('strictQuery', true);

    mongoose.connect(process.env.URI_PRODUCTS, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    let Products = mongoose.model('Products', product_schema);
    let formatOptions = {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    };

    app.route(['/', '/home']).get(async (req, res) => {
        //session lang is req.session.lang
        console.log(req.session.id)
        let lang = req.session.lang || "es";

        console.log(lang)
        let discount_list = await Products.aggregate(discount_pipeline);
        let featured_list = await Products.aggregate(featured_pipeline);
 

        discount_list.forEach(item => { //price formatter
            item.format_price = item.price.toLocaleString('en-US', formatOptions);
            item.format_price_discounted = item.price_discounted.toLocaleString('en-US', formatOptions);
        });
        featured_list.forEach(item => { //price formatter
            item.format_price = item.price.toLocaleString('en-US', formatOptions);
            item.format_price_discounted = item.price_discounted.toLocaleString('en-US', formatOptions);
        })
        //featured_list = [featured_list[0]];
        //console.log(featured_list);
        res.render('home', { discount_list, featured_list, lang, langData })
    });

    app.route('/catalog')
        .get(async (req, res) => {
            let lang = req.session.lang || 'es';
            let tags = await Products.aggregate(search_list.tags),
            categories = await Products.aggregate(search_list.category),
            brands = await Products.aggregate(search_list.brand),
            // ^ All of these return [{key: [...string]}]
            price_range = await Products.aggregate(search_list.price_range);
        
            let search_fields = {
                tags_fields: tags[0][lang].sort(),
                category_fields: categories[0][lang].sort(),
                brand_fields: brands[0].brand.sort(),
                price_range: price_range[0]
            }
            //console.log(search_fields.tags_fields.sort())
            res.render('catalog', { search_fields, lang, langData })
        })
        .post(async (req, res) => {
            let results = await Products.aggregate(search_query(req.body));
            results.forEach(item => { //price formatter
                item.format_price = item.price.toLocaleString('en-US', formatOptions);
                item.format_price_discounted = item.price_discounted.toLocaleString('en-US', formatOptions);
            });
            res.json({ api_results: results })
        })

    app.route('/lang_change').get((req, res) => {
        if(req.session.lang == 'en') {
            req.session.lang = 'es'
        } else {
            req.session.lang = 'en'
        }
        console.log(`session: ${req.session.lang}`);
        let referer = req.headers.referer || '/';
        res.redirect(referer);
    });

    app.route('/test').get(async (req, res) => {
        //let test = await Products.create(product_import);
        //res.json(test);
        //let testerino = 'es'
        //let opt = {es: 1, en: 2}
        //console.log(opt[testerino])
        let testobj = {
            key1: 1,
            key2: 2
        };
        let x = 1;
        if (x = 1) {
            testobj = { bigbunk: [testobj]}
        }
        console.log(testobj)
        res.send('aloha')
    });


};

export default apiRoute;

/* example req.body
$expr: {
        $and:
req.body: {
    "name": "car",
    "price_range_min": "379",
    "price_range_max": "1238",
    "category": "Automobile",
    "brand": "Ralph's",
    "selected_tags": [
        "Ball",
        "Basketball"
    ],
    "discount": "true",
    "featured": "true"
}

req.body.empty = {}



*/