'use strict';

import mongoose from 'mongoose';
import langData from './lang/lang.json' assert { type: "json" };
import { products_schema } from './schema/products_schema.js';
//import { product_variations_schema } from './schema/product_variations_schema.js';
import { brands_schema } from './schema/brands_schema.js';
import { categories_schema } from './schema/categories_schema.js';
import { reviews_schema } from './schema/reviews_schema.js';
import { tags_schema } from './schema/tags_schema.js';
import { users_schema } from './schema/users_schema.js';
import { discount_pipeline } from './pipeline/discount.js';
import { featured_pipeline } from './pipeline/featured.js';
import { search_list } from './pipeline/search_list.js';
import search_query from './pipeline/search_query.js';

/*DEV MODE START: DELETE AFTER USE*/
import { product_import } from '../../../devTool/product_import.js';
import { devBrand } from '../../../devTool/devPipeline/devBrand.js';
import { devCategory } from '../../../devTool/devPipeline/devCategory.js';
import { devTag } from '../../../devTool/devPipeline/devTag.js';
import { product_update } from '../../../devTool/product_update.js'



//import crypto from 'crypto';

//const key = crypto.randomBytes(32).toString('hex');
//console.log(key);
//import product_variation from '../../../devTool/product_object';
/*DEV MODE END*/

let apiRoute = function (app) {
    mongoose.set('strictQuery', true);

    /*Mongoose Connections*/
    const connectionSettings = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };

    const productsDB = mongoose.createConnection(process.env.URI_PRODUCTS, connectionSettings);
    const usersDB = mongoose.createConnection(process.env.URI_USERS, connectionSettings);

    /*pre-hooks for schemas: used to assign customs_ids before saving*/

    //brand
    brands_schema.statics.createBrand = async function (data) {
        let last_entry = await this.findOne({}, { _id: 0, brand_id: 1 }, { sort: { brand_id: -1 } }) || { brand_id: 0 };

        let indexTracker = 0;  // one of the obj in the array contains brand_id

        for (let i = 0; i < data.length; i++) {
            if (!data[i].hasOwnProperty('brand_id')) {
                data[i].brand_id = last_entry.brand_id + indexTracker + 1;
                indexTracker++
            }
        }
        return this.create(data)
    }
    //category
    categories_schema.statics.createCategory = async function (data) {
        let last_entry = await this.findOne({}, { _id: 0, category_id: 1 }, { sort: { category_id: -1 } }) || { category_id: 0 };

        let indexTracker = 0;

        for (let i = 0; i < data.length; i++) {
            if (!data[i].hasOwnProperty('category_id')) {
                data[i].category_id = last_entry.category_id + indexTracker + 1;
                indexTracker++
            }
        }
        return this.create(data)
    }

    //tags
    tags_schema.statics.createTag = async function (data) {
        let last_entry = await this.findOne({}, { _id: 0, tag_id: 1 }, { sort: { tag_id: -1 } }) || { tag_id: 0 };

        let indexTracker = 0;

        for (let i = 0; i < data.length; i++) {
            if (!data[i].hasOwnProperty('tag_id')) {
                data[i].tag_id = last_entry.tag_id + indexTracker + 1;
                indexTracker++
            }
        }
        return this.create(data)
    }

    /*Models*/
    let Products = productsDB.model('products', products_schema),
        //Product_Variations = productsDB.model('variations', product_variations_schema),
        Brands = productsDB.model('brands', brands_schema),
        Categories = productsDB.model('categories', categories_schema),
        Reviews = productsDB.model('reviews', reviews_schema),
        Tags = productsDB.model('tags', tags_schema);
    let Users = usersDB.model('users', users_schema);

    let formatOptions = { //format currency in USD with two decimal places
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    };

    app.route(['/', '/home']).get(async (req, res) => {
        //session lang is req.session.lang
        let lang = req.session.lang || "es";

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
            //if there is a URL param for quiick search, include iit in the reender section...
            let quick_query = undefined;
            if (req.query) {
                quick_query = { ...req.query }
            };
            //URL PARAM /catalog?key=value <- ESTTO NO DEBE DE GUARDARSEE EN EEL SEARCH SESSION@!
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
            res.render('catalog', { search_fields, lang, langData, quick_query })
        })
        .post(async (req, res) => {
            let results = await Products.aggregate(search_query(req.body));
            results.forEach(item => { //price formatter
                item.format_price = item.price.toLocaleString('en-US', formatOptions);
                item.format_price_discounted = item.price_discounted.toLocaleString('en-US', formatOptions);
            });
            res.json({ api_results: results })
        })

    app.route('/product/:id')
        .get(async (req, res) => {
            //Declara una funcion para similares el cual usara los datos de session para busqueda inicial y en todo caso un fallback de {} con un sample al final. Se debe hacer aqui para que se pueeda utilizar tanto en el try como en el cattch y evitar codigo doble.
            try {
                let lang = req.session.lang || 'es';
                let product_id = req.params.id;
                let result = await Products.aggregate(search_query({ id: product_id }));

                result.forEach(item => { //price formatter
                    item.format_price = item.price.toLocaleString('en-US', formatOptions);
                    item.format_price_discounted = item.price_discounted.toLocaleString('en-US', formatOptions);
                });
                res.render('product', { api_results: result[0], lang, langData })

            } catch (err) {
                let lang = req.session.lang || 'es';
                res.render('product', { api_results: null, lang, langData })
            }
        })

    app.route('/lang_change').get((req, res) => {
        if (req.session.lang == 'en') {
            req.session.lang = 'es'
        } else {
            req.session.lang = 'en'
        }
        let referer = req.headers.referer || '/';
        res.redirect(referer);
    });

    app.route('/test').get(async (req, res) => {
        //let query = {...req.query};

        /*
        let update = await Products.aggregate(product_update)
        res.json(update);
        */

        /*
        let changeDB = await Products.updateMany( {"category.en" : "Home Improvement"}, { $set: { "category.en" : "Home Improvements"}})

        res.json(changeDB)
        */
        //let testerino = 'es'
        //let opt = {es: 1, en: 2}
        //console.log(opt[testerino])
        //console.log(query)
        //res.send('aloha')
    });

    app.route('/test_db').get(async (req, res) => {
        let db = await Tags.aggregate([{ $match: {} }, { $sort: { tag_id: 1 } }])
        res.json(db)
    });

    app.route('/test_product').get(async (req, res) => {
        let products = await Products.aggregate([{ $match: {} }])
        res.json(products)
    })
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