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


    app.route('/').get((req, res) => {

        let response = 'hola baby'
        res.render('home', { response })
    });

    app.route('/test').get(async (req, res) => {

        res.send('testerino');
    })


};

export default apiRoute;