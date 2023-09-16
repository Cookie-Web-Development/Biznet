'use strict';

import langData from '../../src/server/lang/lang.json' assert { type: "json" };
import bcrypt from 'bcrypt';
import passport from 'passport';
import flash from 'express-flash';
import { products_schema } from './schema/products_schema.js';
//import { product_variations_schema } from './schema/product_variations_schema.js';
import { brands_schema } from './schema/brands_schema.js';
import { categories_schema } from './schema/categories_schema.js';
import { reviews_schema } from './schema/reviews_schema.js';
import { tags_schema } from './schema/tags_schema.js';
import { session_schema } from './schema/session_schema.js'
import { users_schema } from './schema/users_schema.js';
import { search_list } from './pipeline/search_list.js';
import search_query from './pipeline/search_query.js';

//import crypto from 'crypto';
//import {cookieParser} from 'cookie-parser';

//const key = crypto.randomBytes(32).toString('hex');
//console.log(key);
//import product_variation from '../../../devTool/product_object';
/*DEV MODE END*/

let apiRoute = function (app, db) {
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
    let Products = db.model('products', products_schema),
        //Product_Variations = productsDB.model('variations', product_variations_schema),
        Brands = db.model('brands', brands_schema),
        Categories = db.model('categories', categories_schema),
        Reviews = db.model('reviews', reviews_schema),
        Tags = db.model('tags', tags_schema);
    let Sessions = db.model('sessions', session_schema);
    let Users = db.model('users', users_schema);


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

    function check_auth(redirecRoute, restictionCheck) {
        //if restrictionCheck is true, means ONLY logged in users can enter.
        //restrictionCheck false is used to allow only GUEST
        let redirect = redirecRoute || '/', check = restictionCheck || false;
        if (check) {
            return function (req, res, next) {
                if (req.isAuthenticated()) { return next() }
                res.redirect(redirect)
            }
        }

        return function (req, res, next) {
            if (req.isAuthenticated()) { return res.redirect(redirect) }
            next();
        }
    }

    //Global objects for all routes middleware
    function globalObjectInit(req, res, next) {
        //lang
        let lang = req.session.lang || 'es';
        //userCheck
        next();
    }

    app.route(['/', '/home'])
        .get(async (req, res) => {
            //user object
            let user = req.user || null;
            //session lang is req.session.lang
            let lang = req.session.lang || "es";
            let discount_list = await Products.aggregate(search_query({ discount: "true" }));
            let featured_list = await Products.aggregate(search_query({ featured: "true" }, { sample: 8 }))

            priceFormatter(discount_list);
            priceFormatter(featured_list);

            res.render('home', { discount_list, featured_list, lang, langData, user })
        });

    app.route('/catalog')
        .get(async (req, res) => {
            //user object
            let user = req.user || null;
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
            res.render('catalog', { search_fields, lang, langData, quick_query, user });
            //res.json(search_fields)
        })
        .post(async (req, res) => {
            let active_page = +req.body.active_page || 1;
            let items_per_page = +req.body.items_per_page || 12;
            let results = await Products.aggregate(search_query(req.body, { skip: [active_page, items_per_page] }));

            priceFormatter(results[0].results_arr);
            res.json({ api_results: results })
        })

    app.route('/product/:id')
        .get(async (req, res) => {
            //user object
            let user = req.user || null;
            let lang = req.session.lang || 'es';
            try {
                let product_id = req.params.id;
                let result = await Products.aggregate(search_query({ id: product_id }));
                let similar = {
                    by_brand: await Products.aggregate(search_query({ more_brand: [product_id, result[0].brand_id] }, { sample: 8 })),
                    by_other: await Products.aggregate(search_query({ more_similar: [product_id, result[0].brand_id, result[0].category_id, [...result[0].tag_id]] }, { sample: 8 }))
                }

                priceFormatter(result)

                if (similar.by_brand.length >= 1) {
                    priceFormatter(similar.by_brand)
                }
                if (similar.by_other.length >= 1) {
                    priceFormatter(similar.by_other)
                }

                if (similar.by_brand.length == 0 || similar.by_other.length == 0) {
                    similar.more_products = await Products.aggregate(search_query({ more_product: product_id }, { sample: 10 }))
                    priceFormatter(similar.more_products)
                }

                res.render('product', { api_results: result[0], similar, lang, langData, user })

            } catch (err) {
                console.log(err)
                res.render('product', { api_results: null, lang, langData })
            }
        })


    app.route('/login')
        .get(check_auth('/profile', false), (req, res) => {
            let login_notification = req.flash('error') || []
            let lang = req.session.lang || 'es';
            let loginCheck = true;
            res.render('login', { lang, langData, loginCheck, error_login: login_notification })
        })
        .post((req, res, next) => {
            if (!req.body.username || !req.body.password) {
                req.flash('error', 'invalid_login')
                return res.redirect('/login')
            } else { next() }
        },
            passport.authenticate('local', {
                successRedirect: '/profile',
                failureRedirect: '/login',
                failureFlash: true
            }))

    app.route('/logout')
        .get((req, res) => {
            req.logout((err) => {
                if (err) { return next(err) }
                res.redirect('/login')
            })
        })

    app.route('/register')
        .get(check_auth('/profile', false), (req, res) => {
            const flash_messages = req.flash('flash')[0] || []
            let lang = req.session.lang || 'es';
            let loginCheck = true;
            res.render('register', { lang, langData, loginCheck, notification: flash_messages })
        })
        .post(async (req, res) => {
            let user_credentials = req.body
            user_credentials.username = user_credentials.username.trim();

            //check if username already exist
            let checkDB = await Users.findOne({ username: user_credentials.username.toLowerCase() }, { username: 1 })
            if (checkDB) {
                req.flash('flash', { username: { error: 'username_in_use', input: user_credentials.username } })
                res.redirect('/register')
                return;
            }

            let hash = await bcrypt.hash(user_credentials.password, 12)

            //user credentials creation
            let user_save = new Users({
                username: user_credentials.username.toLowerCase(),
                profile_name: user_credentials.username,
                password: hash,
                user_preferences: {
                    lang: req.session.lang || 'es'
                }
            })
            try {
                await user_save.save()
                res.redirect('/login')
            } catch (err) {
                console.error(err);
                req.flash('flash', { username: { error: 'unexpected_error' } });
                res.redirect('/register');
            }
        })

    app.route('/profile')
        .get(check_auth('/login', true), async (req, res) => {
            //user object
            let user = await Users.findOne({ _id: req.user._id }, { password: 0, __v: 0 }) || null;

            if (!user) { //fallback incase user is not found for some reason
                req.flash('error', { message: 'unexpected_error' })
                return res.redirect('/login')
            }

            //set user_prefered.lang to session.lang
            req.session.lang = user.user_preferences.lang
            let lang = req.session.lang || 'es';
            let loginCheck = true;
            res.render('profile', { lang, langData, loginCheck, user })
        })

    app.route('/lang_change')
        .get((req, res) => {
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
    app.route('/test_cookie').get(async (req, res) => {
        let dateNow = new Date().toUTCString();
        console.log(dateNow)
        let cookie = await req.cookies
        let regex = /:(\w+)\./
        //let session_id_cookie = cookie["connect.sid"].match(regex)[1]
        //let session_db_search = await Sessions.findOneAndUpdate({_id: session_id_cookie}, { testerino: ""})
        res.json(cookie)
    })

};

export default apiRoute;
