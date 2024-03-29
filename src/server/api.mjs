'use strict';

import langData from '../../src/lang/lang.json' assert { type: "json" };
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import passport from 'passport';
import flash from 'express-flash';
import { products_schema } from './schema/products_schema.js';
import { brands_schema } from './schema/brands_schema.js';
import { categories_schema } from './schema/categories_schema.js';
import { reviews_schema } from './schema/reviews_schema.js';
import { tags_schema } from './schema/tags_schema.js';
import { session_schema } from './schema/session_schema.js'
import { users_schema } from './schema/users_schema.js';
import { search_list } from './pipeline/search_list.js';
import search_query from './pipeline/search_query.js';
import { INPUT_CHECK } from './modules/moduleInputCheck.js';
import company_query from './pipeline/company_query.js';
import company_catalog_query from './pipeline/company_catalog.js'


let apiRoute = function (app, db) {
    /*#######
    PRE-HOOKS 
    #########
    for schemas: used to assign customs_ids before saving*/
    //brand
    brands_schema.statics.createEntry = async function (data) {
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
    categories_schema.statics.createEntry = async function (data) {
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
    tags_schema.statics.createEntry = async function (data) {
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

    /*####
    MODELS
    ######*/
    let Products = db.model('products', products_schema),
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

    /*###############
    ROUTES MIDDLEWARE
    #################*/
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

    function check_role(req, res, next) {
        //Role hierarchy webmaster > company > demo > user
        //user.account_settings.role
        let route_regex = /^\/[^\/]+/
        let path = req.originalUrl;
        let route = path.match(route_regex)[0];
        // console.log('route from check_role', route)
        let user_role = req.user.account_settings.role || undefined;
        switch (route) {
            //webmaster
            case "/webmaster_test":
                if (user_role !== 'webmaster') {
                    return res.status(401).send('Forbidden')
                }
                return next()
            //company
            case "/company":
                if (user_role !== 'webmaster' && user_role !== 'company' && user_role !== 'demo') {
                    return res.status(401).send('Forbidden')
                }
                return next();
            default:
                if (!user_role) {
                    //notification
                    return res.redirect('/')
                }
                return next();
        }
    }

    /*####
    ROUTES
    ######*/

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
        .get(async (req, res) => { /* => /catalog  */
            //user object
            let user = req.user || null;
            //if there is a URL param for quiick search, include iit in the reender section...
            let quick_query = undefined;
            if (req.query) {
                quick_query = { ...req.query }
            };
            //URL PARAM /catalog?key=value <- ESTTO NO DEBE DE GUARDARSEE EN EEL SEARCH SESSION@!
            let lang = req.session.lang || 'es';
            let tags = await Tags.aggregate(search_list.multi_lang(lang, 'tag')),
                categories = await Categories.aggregate(search_list.multi_lang(lang, 'category')),
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
        .post(async (req, res) => { /* => /catalog  */
            let active_page = +req.body.active_page || 1;
            let items_per_page = +req.body.items_per_page || 12;
            let results = await Products.aggregate(search_query(req.body, { skip: [active_page, items_per_page] }));
            priceFormatter(results[0].results_arr);
            res.json({ api_results: results })
        })

    app.route('/product/:id')
        .get(async (req, res) => { /* => /product/:id  */
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
                let similar = {
                    more_products: await Products.aggregate(search_query({ more_product: {} }, { sample: 10 })),
                    by_brand: [],
                    by_other: []
                }
                priceFormatter(similar.more_products)
                res.render('product', { api_results: null, lang, similar, user, langData })
            }
        })


    app.route('/login')
        .get(check_auth('/profile', false), (req, res) => {
            let login_notification = req.flash('error') || []

            let lang = req.session.lang || 'es';
            let loginCheck = true;
            res.render('login', { lang, langData, loginCheck, error_login: login_notification })
        })
        .post((req, res, next) => { //voids empty fields
            if (!req.body.username || !req.body.password) {
                req.flash('error', 'invalid_login')
                return res.redirect('/login')
            } else { next() }
        },
            passport.authenticate('local', {
                successRedirect: '/pref',
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
        .get(check_auth('/profile', false), (req, res) => { /* => /register  */
            const flash_messages = req.flash('flash')[0] || [];
            let csrf_token = crypto.randomBytes(16).toString('hex');
            let csrf = csrf_token;
            req.session._csrf = csrf_token;
            let lang = req.session.lang || 'es';
            let loginCheck = true;
            res.render('register', { lang, langData, loginCheck, csrf, notification: flash_messages })
        })
        .post(async (req, res) => { /* => /register  */
            let user_credentials = req.body;

            // check data integrity
            try {
                for (let key in user_credentials) {
                    let value = new INPUT_CHECK(user_credentials[key])
                    switch (key) {
                        case 'token':
                            if (value.checkEmpty() || user_credentials[key] !== req.session._csrf) { throw new Error('invalid token') }
                            break;
                        case 'username':
                            if (
                                value.checkEmpty() ||
                                value.checkSpace() ||
                                !value.checkLength(4) ||
                                value.checkSpecial()
                            ) { throw new Error('invalid username') }
                            break;
                        case 'password':
                            if (
                                value.checkEmpty() ||
                                value.checkSpace() ||
                                !value.checkLength(6) ||
                                !value.checkLetter() ||
                                !value.checkNum()
                            ) { throw new Error('invalid password') }
                            break;
                        case 'confirm_password':
                            break;
                        default:
                            throw new Error('unexpected values')
                    }
                }
            } catch (err) {
                console.log(err)
                console.log('register data integrity failed')
                req.flash('flash', { username: { error: 'unexpected_error' } });
                return res.redirect('/register');
            }


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
                return res.redirect('/login')
            } catch (err) {
                console.error(err);
                req.flash('flash', { username: { error: 'unexpected_error' } });
                return res.redirect('/register');
            }
        })

    app.route('/lang_change')
        .get((req, res) => {
            if (req.session.lang == 'en') {
                req.session.lang = 'es'
            } else {
                req.session.lang = 'en'
            }
            let referer = req.headers.referer || '/';
            return res.redirect(referer);
        });

    app.route('/pref')
        .get(check_auth('/login', true), async (req, res) => {
            //user object
            let user = await Users.findOne({ _id: req.user._id }, { password: 0, __v: 0 }) || null;
            if (!user) { //fallback incase user is not found for some reason
                req.flash('error', 'unexpected_error')
                return res.redirect('/login')
            }
            if (user.user_preferences.lang) {
                req.session.lang = user.user_preferences.lang;
            }
            /*if(user.user_preferences.theme) {
                req.session.theme = user.user_preferences.theme;
            }*/
            return res.redirect('/profile_overview')
        })

    app.route('/profile_overview')
        .get(check_auth('/login', true), async (req, res) => {
            //user object
            let user = await Users.findOne({ _id: req.user._id }, { password: 0, __v: 0 }) || null;
            if (!user) { //fallback incase user is not found for some reason
                req.flash('error', 'unexpected_error')
                return res.redirect('/login')
            }

            let lang = req.session.lang || 'es';
            let loginCheck = true;
            return res.render(`profile_overview`, { lang, langData, loginCheck, user })
        })

    app.route('/profile/password')
        .get(check_auth('/login', true), async (req, res) => { /* => /profile/password  */
            let flash_message = req.flash() || {};
            let csrf_token = crypto.randomBytes(16).toString('hex');
            let csrf = csrf_token;
            req.session._csrf = csrf_token;

            //user object
            let user = await Users.findOne({ _id: req.user._id }, { password: 0, __v: 0 }) || null;
            if (!user) { //fallback incase user is not found for some reason
                req.flash('error', 'unexpected_error')
                return res.redirect('/login')
            }

            let lang = req.session.lang || 'es';
            let loginCheck = true;

            return res.render(`data_management/password`, { lang, langData, loginCheck, user, csrf, flash_message })
        })
        .post(check_auth('/login', true), async (req, res) => { /* => /profile/password  */
            let user_update = req.body;

            //validate csrf
            if (user_update.validate._csrf !== req.session._csrf) {
                req.flash('error', 'save_fail')
                console.log('invalid token')
                res.json({ url: `/profile/password` })
                return;
            }

            //user object
            let user = await Users.findOne({ _id: req.user._id }) || null;

            // DEMO USER
            if (user.account_settings.role == 'demo') {
                req.flash('error', 'demo_user_update');
                res.json({ url: `/profile/password ` });
                return;
            }

            //validate new password standard
            let new_password = new INPUT_CHECK(user_update.update.password);
            if (
                new_password.checkEmpty() ||
                new_password.checkSpace() ||
                !new_password.checkLength(6) ||
                !new_password.checkLetter() ||
                !new_password.checkNum()
            ) {
                req.flash('error', 'save_fail')
                console.log('new password not valid')
                res.json({ url: `/profile/password` })
                return;
            }


            //validate current password
            if (!bcrypt.compareSync(user_update.validate.password, user.password)) {
                req.flash('error', 'wrong_password');
                res.json({ url: '/profile/password' });
                return;
            }

            //check if updating same password
            if (bcrypt.compareSync(user_update.update.password, user.password)) {
                req.flash('error', 'no_change');
                res.json({ url: '/profile/password' });
                return;
            }

            let update_password = await bcrypt.hash(req.body.update.password, 12);

            await Users.findOneAndUpdate(
                { _id: req.user._id },
                { password: update_password }
            )

            req.flash('notification', 'save_success')
            return res.json({ url: '/profile/password' })
        })

    app.route('/profile') //THIS IS /PROFILE
        .get(check_auth('/login', true), check_role, async (req, res, next) => { /* => /profile */
            let csrf_token = crypto.randomBytes(16).toString('hex');
            let csrf = csrf_token;
            req.session._csrf = csrf_token;

            //flash message
            let flash_message = {};
            flash_message.notification = req.flash('notification') || undefined;
            flash_message.error = req.flash('error') || undefined;

            //user object
            let user = await Users.findOne({ _id: req.user._id }, { password: 0, __v: 0 }) || null;
            if (!user) { //fallback incase user is not found for some reason
                req.flash('error', 'unexpected_error')
                return res.redirect('/login')
            }

            let lang = req.session.lang || 'es';
            let loginCheck = true;
            try {
                return res.render(`data_management/profile`, { lang, langData, loginCheck, user, csrf, flash_message })
            } catch (err) {
                err.status = 404;
                next(err);
            }
        })
        .post(check_auth('/login', true), async (req, res) => { /* => /profile */
            let user_update = req.body;

            //validate
            if (user_update.validate._csrf !== req.session._csrf) {
                req.flash('error', 'save_fail')
                console.log('invalid token')
                res.json({ url: `/profile` })
                return;
            }

            // Validate User !== demo
            let user = await Users.findOne({ _id: req.user._id });

            if (user.account_settings.role == 'demo') {
                req.flash('error', 'demo_user_update');
                res.json({ url: `/profile` });
                return;
            }

            user_update.target._id = req.session.passport.user;
            req.session.lang = user_update.update['user_preferences.lang']

            await Users.findOneAndUpdate(
                user_update.target,
                user_update.update,
            )

            req.flash('notification', 'save_success')
            return res.json({ url: `/profile` })
        })

    app.route('/company/catalog_edit/:product_id?')
        .get(check_auth('/login', true), check_role, async (req, res, next) => { /* => /company/catalog_edit/:product_id?  */
            /*
            main route: /company/catalog_edit/
            product edit route: /company/catalog_edit/:product_id
            product create route: /company/catalog_edit/new
            */
            let lang = req.session.lang || 'es';

            // Validate User 
            let user = await Users.findOne({ _id: req.user._id }) || null;
            if (!user) { //fallback incase user is not found for some reason
                req.flash('error', 'unexpected_error')
                return res.redirect('/login')
            }

            let csrf_token = crypto.randomBytes(16).toString('hex');
            let csrf = csrf_token;
            req.session._csrf = csrf_token;

            let query = req.query || {};
            let render_file;
            let product_db;
            let product_info = {
                brands: await Brands.aggregate(search_list.brand),
                categories: await Categories.aggregate(search_list.multi_lang(lang, 'category')),
                tags: await Tags.aggregate(search_list.multi_lang(lang, 'tag'))
            };

            if (req.params.product_id === 'new') {
                //new
                render_file = 'data_management/product_new'
            }

            if (req.params.product_id && req.params.product_id !== 'new') {
                //product_edit
                render_file = 'data_management/product_edit'

                product_db = await Products.aggregate(company_catalog_query({ search: { _id: req.params.product_id } }))

                if (product_db.length == 0) {
                    req.flash('error', 'no_db_entry')
                    res.redirect('/company/catalog_edit')
                    return;
                }

                product_db = product_db[0]
            }

            if (!req.params.product_id) {
                //catalog_edit
                render_file = 'data_management/catalog_edit'
                product_db = await Products.aggregate(company_catalog_query(query))
            }

            let flash_message = {
                notification: req.flash('notification') || [],
                error: req.flash('error') || []
            }

            try {
                res.render(render_file, { lang, langData, user, flash_message, csrf, db_result: product_db, product_info })
            } catch (err) {
                err.status = 404;
                next(err);

            }
        })
        .post(check_auth('/login', true), check_role, async (req, res) => { /* => /company/catalog_edit/new  */
            let payload_content = req.body.payload || null;
            let payload_csrf = req.body.csrf || null;

            //validate token
            if (!payload_csrf || payload_csrf !== req.session._csrf) {
                req.flash('error', 'save_fail');
                console.log('invalid token');
                res.json({ redirect_url: `/company/catalog_edit/new` })
                return;
            }

            // Validate User 
            let user = await Users.findOne({ _id: req.user._id }) || null;
            if (!user) { //fallback incase user is not found for some reason
                req.flash('error', 'unexpected_error')
                return res.redirect('/login')
            }

            if (user.account_settings.role == 'demo') {
                payload_content.demo = true;
                payload_content.ttl = 300
            }

            //validate required fields
            if (
                !payload_content['product_name.es'] ||
                !payload_content['product_name.en'] ||
                payload_content['product_name.es'] === '' ||
                payload_content['product_name.en'] === ''
            ) {
                req.flash('error', 'empty_field')
                res.json({ redirect_url: `/company/catalog_edit/new` })
                return;
            }


            let new_entry = await Products.create(payload_content)
            let new_id = await new_entry._id.toHexString()

            //flash message
            req.flash('notification', 'save_success')

            res.json({ redirect_url: `/company/catalog_edit/${new_id}` })
            return
        })
        .put(check_auth('/login', true), check_role, async (req, res, next) => { /* => /company/catalog_edit/:product_id?  */
            let route_id = req.params.product_id || undefined;
            let payload_content = req.body.payload || null;
            let payload_csrf = req.body.csrf || null;
            let payload_id = req.body.match || null;
            let payload_arrayFilters = req.body.arrayFilters || null;

            //validate request

            ////check product in db
            let product_check = await Products.findOne(
                { _id: payload_id._id }
            )

            if (!route_id || !product_check._id || route_id !== product_check._id.toHexString()) {
                req.flash('error', 'no_db_entry')
                res.json({ redirect_url: `/company/catalog_edit` })
                return;
            }

            ////Check demo users. DEMO USERS CAN ONLY UPDATE [DEMO: TRUE] PRODUCTS
            let user = await Users.findOne({ _id: req.user._id }) || null;
            if (!user) { //fallback incase user is not found for some reason
                req.flash('error', 'unexpected_error')
                res.json({ redirect_url: '/login' })
                return;
            }

            if (user.account_settings.role == 'demo') {
                if (!product_check.demo) {
                    req.flash('error', 'demo_update_error')
                    res.json({ redirect_url: `/company/catalog_edit/${route_id}` })
                    return;
                }
            }

            ////check csrf
            if (!payload_csrf || payload_csrf !== req.session._csrf) {
                req.flash('error', 'save_fail');
                console.log('invalid token');
                res.json({ redirect_url: `/company/catalog_edit/${route_id}` })
                return;
            }

            ////check sku
            if (req.body.validate_sku) {
                let sku_check = await Products.aggregate([
                    {
                        $match: {
                            'listing.sku': { $regex: new RegExp(req.body.validate_sku, "i") }
                        }
                    }
                ]);

                if (sku_check.length > 0) {
                    req.flash('error', 'sku_duplicate');
                    res.json({ redirect_url: `/company/catalog_edit/${route_id}` });
                    return;
                }
            }

            let update;
            if (payload_arrayFilters) {
                update = await Products.findOneAndUpdate(
                    payload_id,
                    payload_content,
                    { arrayFilters: payload_arrayFilters }
                )
            } else {
                update = await Products.findOneAndUpdate(
                    payload_id,
                    payload_content,
                    { new: true }
                )
            }

            if (update === null) {
                req.flash('error', 'save_fail')
                return res.json({ redirect_url: `/company/catalog_edit/${route_id}` })
            }

            //flash message
            req.flash('notification', 'save_success')

            return res.json({ redirect_url: `/company/catalog_edit/${route_id}` })

        })
        .delete(check_auth('/login', true), check_role, async (req, res, next) => { /* => /company/catalog_edit/:product_id?  */
            let route_id = req.params.product_id || null;
            let payload_csrf = req.body.csrf || null;
            let payload_id = req.body._id || null;

            //validation
            ////check product in db
            let product_check = await Products.findOne(
                { _id: payload_id }
            )

            if (!route_id || !product_check._id || route_id !== product_check._id.toHexString()) {
                req.flash('error', 'no_db_entry')
                res.json({ redirect_url: `/company/catalog_edit` })
                return;
            }

            if (!payload_csrf || payload_csrf !== req.session._csrf) {
                req.flash('error', 'save_fail');
                console.log('invalid token');
                res.json({ redirect_url: `/company/catalog_edit/${route_id}` })
                return;
            }

            //// Validate User 
            let user = await Users.findOne({ _id: req.user._id }) || null;
            if (!user) { //fallback incase user is not found for some reason
                req.flash('error', 'unexpected_error')
                return res.redirect('/login')
            }

            if (user.account_settings.role == 'demo') {
                if (!product_check.demo) {
                    req.flash('error', 'demo_update_error')
                    res.json({ redirect_url: `/company/catalog_edit/${route_id}` })
                    return;
                }
            }

            let data_delete = await Products.deleteOne({ _id: payload_id })

            if (data_delete.deletedCount == 0) {
                req.flash('error', 'no_change')
                res.json({ redirect_url: `/company/catalog_edit/${route_id}` })
                return;
            }

            //flash message
            req.flash('notification', 'save_success');

            res.json({ redirect_url: `/company/catalog_edit` })
            return;
        })

    app.route('/company/:main_route')
        .get(check_auth('/login', true), check_role, async (req, res, next) => { /* => /company/:main_route [ brands | categories | tags ]  */
            let company_route = req.params.main_route
            let lang = req.session.lang || 'es'
            let csrf_token = crypto.randomBytes(16).toString('hex');
            let csrf = csrf_token;
            req.session._csrf = csrf_token;

            let route_regex = /^[^_]+/
            let route_prefix = company_route.match(route_regex)
            let db_selector;

            switch (route_prefix[0]) {
                case 'brand':
                    db_selector = Brands;
                    break;
                case 'category':
                    db_selector = Categories;
                    break;
                case 'tag':
                    db_selector = Tags;
                    break;
                default:
                    try { throw new Error('internal error') } catch (err) { next(err) }
                    return;
            }

            //param
            let query = req.query || {};

            //user object
            let user = await Users.findOne({ _id: req.user._id }, { password: 0, __v: 0 }) || null;
            if (!user) { //fallback incase user is not found for some reason
                req.flash('error', 'unexpected_error')
                return res.redirect('/login')
            }

            let flash_message = {
                notification: req.flash('notification') || [],
                error: req.flash('error') || []
            }

            let query_result = await db_selector.aggregate(company_query(query, route_prefix[0]))

            try {
                res.render(`data_management/${company_route}`, { lang, csrf, langData, user, flash_message, db_result: query_result })
            } catch (err) {
                err.status = 404;
                next(err);
            }
        })
        .post(check_auth('/login', true), check_role, async (req, res) => { /* => /company/:main_route [ brands | categories | tags ]  */
            let company_route = req.params.main_route
            let payload_csrf = req.body.validate;
            let payload_content = req.body.payload_content;

            //validate
            if (payload_csrf._csrf !== req.session._csrf) {
                req.flash('error', 'save_fail');
                console.log('invalid token');
                res.json({ url: `/company/${company_route}` }) //placeholder
                return;
            }

            // Validate User 
            let user = await Users.findOne({ _id: req.user._id }) || null;
            if (!user) { //fallback incase user is not found for some reason
                req.flash('error', 'unexpected_error')
                return res.redirect('/login')
            }

            if (user.account_settings.role == 'demo') {
                payload_content.demo = true;
                payload_content.ttl = 300
            }

            let route_regex = /^[^_]+/
            let route_prefix = company_route.match(route_regex)
            let db_selector;

            switch (route_prefix[0]) {
                case 'brand':
                    db_selector = Brands;
                    break;
                case 'category':
                    db_selector = Categories;
                    break;
                case 'tag':
                    db_selector = Tags;
                    break;
                default:
                    try { throw new Error('internal error') } catch (err) { next(err) }
                    return;
            }

            try {
                await db_selector.createEntry([payload_content])
            } catch (err) {
                req.flash('error', 'unexpected_error');
                res.json({ url: `/company/${company_route}` }) //placeholder
                return;
            }

            req.flash('notification', 'save_success');
            return res.json({ url: `/company/${company_route}` })
        })
        .put(check_auth('/login', true), check_role, async (req, res) => { /* => /company/:main_route [ brands | categories | tags ]  */
            let company_route = req.params.main_route
            let payload_csrf = req.body.validate;
            let payload_id = req.body.payload_id;
            let payload_content = req.body.payload_content;

            //db_selector
            let route_regex = /^[^_]+/
            let route_prefix = company_route.match(route_regex)
            let db_selector;

            switch (route_prefix[0]) {
                case 'brand':
                    db_selector = Brands;
                    break;
                case 'category':
                    db_selector = Categories;
                    break;
                case 'tag':
                    db_selector = Tags;
                    break;
                case 'catalog':
                    db_selector = Products;
                    break;
                default:
                    try { throw new Error('internal error') } catch (err) { next(err) }
                    return;
            }

            //validate
            //// CSRF
            if (payload_csrf._csrf !== req.session._csrf) {
                req.flash('error', 'save_fail');
                console.log('invalid token');
                res.json({ url: `/company/${company_route}` })
                return;
            };

            //// WIP: CHECK DEMO USER. DEMO USER CAN ONLY UPDATE [ DEMO: TRUE ] ENTRIES
            let entry_check = await db_selector.findOne(
                payload_id
            )

            ////Check demo users. DEMO USERS CAN ONLY UPDATE [DEMO: TRUE]
            let user = await Users.findOne({ _id: req.user._id }) || null;
            if (!user) { //fallback incase user is not found for some reason
                req.flash('error', 'unexpected_error')
                res.json({ redirect_url: '/login' })
                return;
            }

            if (user.account_settings.role == 'demo' && !entry_check.demo) {
                req.flash('error', 'demo_update_error')
                res.json({ url: `/company/${company_route}` })
                return;
            }

            let update = await db_selector.findOneAndUpdate(
                payload_id,
                payload_content
            );

            if (update === null) {
                req.flash('error', 'save_fail')
                return res.json({ url: `/company/${company_route}` })
            }

            req.flash('notification', 'save_success');
            return res.json({ url: `/company/${company_route}` })
        });

    //non-existant routes handler
    app.route('/*').get((req, res) => {
        console.log('Non-existance route')
        let user = req.user || null;
        let lang = req.session.lang || "es"
        res.render('404', { lang, user, langData })
    })

    app.use((req, res, next) => {
        const err = new Error('Not Found');
        err.status = 404;
        next(err)
    })

    app.use((err, req, res, next) => {
        console.log('Routing API error:')
        console.error(err)
        res.status(err.status || 500)
        return res.json({ error: err.status })
    })
};

export default apiRoute;
