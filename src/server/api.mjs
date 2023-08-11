'use strict';

import mongoose from 'mongoose';
import langData from '../../src/server/lang/lang.json' assert { type: "json" };
import { products_schema } from './schema/products_schema.js';
//import { product_variations_schema } from './schema/product_variations_schema.js';
import { brands_schema } from './schema/brands_schema.js';
import { categories_schema } from './schema/categories_schema.js';
import { reviews_schema } from './schema/reviews_schema.js';
import { tags_schema } from './schema/tags_schema.js';
import { users_schema } from './schema/users_schema.js';
//import { discount_pipeline } from './pipeline/discount.js'; //FLAGGED FOR DELETION!
//import { featured_pipeline } from './pipeline/featured.js'; //FLAGGED FOR DELETION!
import { search_list } from './pipeline/search_list.js';
import search_query from './pipeline/search_query.js';

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


    //format currency in USD with two decimal places
    let formatOptions = { 
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    };

    function priceFormatter(product) {
        product.forEach(item => {
            item.listing.forEach(entry => {
                entry.format_price = entry.price.toLocaleString('en-US', formatOptions);
                entry.format_price_discounted = entry.price_discounted.toLocaleString('en-US', formatOptions);
            })
        })
    }

    app.route(['/', '/home']).get(async (req, res) => {
        //session lang is req.session.lang
        let lang = req.session.lang || "es";
        let discount_list = await Products.aggregate(search_query({discount: "true"}));
        let featured_list = await Products.aggregate(search_query({featured: "true"}, {sample: 8}))

        priceFormatter(discount_list);
        priceFormatter(featured_list);

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
            let tags = await Tags.aggregate(search_list.multi_lang(lang)),
                categories = await Categories.aggregate(search_list.multi_lang(lang)),
                brands = await Brands.aggregate(search_list.brand),
                price_range = await Products.aggregate(search_list.price_range);
            // price_range returns [{max, min}]

            let search_fields = {
                tags: [...tags],
                categories: [...categories],
                brands: [...brands],
                price_range: price_range[0]
            }
            res.render('catalog', { search_fields, lang, langData, quick_query });
            //res.json(search_fields)
        })
        .post(async (req, res) => {
            let active_page = +req.body.active_page || 1;
            let items_per_page = +req.body.items_per_page || 12;
            let results = await Products.aggregate(search_query(req.body, { skip: [ active_page, items_per_page]}));
            /*When used with pagination!!!
            paginasion tiene que oocurrir aqui!!!
            let active_page


            search_query(req.body, { skip: [page_number, limit_per_page] }),
                returns results = [ 
                    { results_arr: [{...}, {...}, ...], 
                    { results_total: total }
                }]
            */
            priceFormatter(results[0].results_arr);
            res.json({ api_results: results })
        })

    app.route('/product/:id')
        .get(async (req, res) => {
            try {
                let lang = req.session.lang || 'es';
                let product_id = req.params.id;
                let result = await Products.aggregate(search_query({ id: product_id }));                
                let similar = {
                    by_brand: await Products.aggregate(search_query({ more_brand: [product_id, result[0].brand_id]}, { sample: 8})),
                    by_other: await Products.aggregate(search_query({ more_similar: [ product_id, result[0].brand_id, result[0].category_id, [...result[0].tag_id] ] }, { sample: 8 } ) )
                }

                priceFormatter(result)

                if(similar.by_brand.length >= 1) {
                    priceFormatter(similar.by_brand)
                }
                if(similar.by_other.length >= 1) {
                    priceFormatter(similar.by_other)
                }

                if(similar.by_brand.length == 0 || similar.by_other.length == 0) {
                    similar.more_products = await Products.aggregate(search_query({ more_product: product_id}, { sample: 10 }))
                    priceFormatter(similar.more_products)
                }

                res.render('product', { api_results: result[0], similar, lang, langData })
                //res.json({similar: {by_brand: more_brand, by_other: more_similar}})

            } catch (err) {
                let lang = req.session.lang || 'es';
                console.log(err)
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

/*############
DEV ROUTES
#############*/
/*
    app.route('/test').get(async (req, res) => {
        let lang = req.session.lang || 'es';
        let tags = await Tags.aggregate(search_list.multi_lang(lang)),
            categories = await Categories.aggregate(search_list.multi_lang(lang)),
            brands = await Brands.aggregate(search_list.brand),
            price_range = await Products.aggregate(search_list.price_range);
        // price_range returns [{max, min}]

        let search_fields = {
            tags: [...tags],
            categories: [...categories],
            brands: [...brands],
            price_range: price_range[0]
        }
        res.send(search_fields)
    });

    app.route('/test_db').get(async (req, res) => {
        let db = await Products.aggregate([{ $match: {} }, {$project: {listing: 1}}, {$sort: { "listing.price": -1} }])
        res.json(db)
    });

    app.route('/test_product').get(async (req, res) => {
        //let products = await Products.aggregate([{ $match: {} }])
        //res.json(products)
        let count_test = await Products.aggregate(search_query({ category: 9}, { skip: [1, 3]}));
        priceFormatter(count_test[0].results_arr)
        res.json(count_test)
    })*/
};

export default apiRoute;
