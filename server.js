const express = require('express');
const DataBase = require('./db');
const fetch = require('isomorphic-fetch');
const cors = require('cors');
const BodyParser = require('body-parser');
const { useAuth } = require('./auth');
const { authHandler, pingHandler, registrationHandler } = require('./handlers/user');
const { storeSearchHandler } = require('./handlers/store');
const { recommendedProductsHandler } = require('./handlers/product');
const { addToBasketHandler } = require('./handlers/basket');
const { homePageHandler, loginPageHandler, registrationPageHandler, categoryPageHandler, selectStorePageHandler, productPageHandler } = require('./handlers/pages');
const { UPC_API_KEY } = require('./constants');
const db_config = {
    host     : 'localhost',
    user     : 'root',
    password : 'luzev880221',
    database : 'small_things',
};

if (!global.fetch) {
    global.fetch = fetch;
}

DataBase.init(db_config).catch(err => console.log(err));

const server = express();



/** ------- Middleware ------- */
server.use(cors({ origin: 'http://localhost:3000' }));
server.use(BodyParser.json());
server.use(BodyParser.urlencoded({ extended: true }));
server.use(useAuth(DataBase));
/* ---------------- END ---------------- */



/** ------- AUTHORIZATION ------- */
server.post(`/api/applications/${UPC_API_KEY}/auth`, (request, response) => {

});

server.post('/api/auth', authHandler(DataBase));
//server.post('/api/ping', pingHandler(DataBase));
server.post('/api/registration', registrationHandler(DataBase));
/* ---------------- END ---------------- */



/** ------- PAGES ------- */
server.get('/api/home-page', homePageHandler(DataBase));
server.get('/api/login-page', loginPageHandler(DataBase));
server.get('/api/registration-page', registrationPageHandler(DataBase));
server.get('/api/category-page', categoryPageHandler(DataBase));
server.get('/api/select-store-page', selectStorePageHandler(DataBase));
server.get('/api/product-page', productPageHandler(DataBase));
/* ---------------- END ---------------- */



/** ------- STORE ------- */
server.get('/api/store-list', storeSearchHandler(DataBase));
/* ---------------- END ---------------- */



/** ------- PRODUCTS ------- */
server.get('/api/products', async (request, response) => {
    const { id = null, storeId = null, categoryId = null } = (request.data || {});
    try {
        const params = {};
        if (id !== null) params._id = id;
        if (storeId !== null) params.store = storeId;
        if (categoryId !== null) params.category = categoryId;

        const products = await DataBase.getProducts(params);
        response.send({ products });
    } catch (error) {
        response.status(404).end({ status: 404, message: 'error' });
    }
});

server.get('/api/recommended-products', recommendedProductsHandler(DataBase));
/* ---------------- END ---------------- */




/** Basket */
server.post('/api/basket', addToBasketHandler(DataBase));
/* ---------------- END ---------------- */



server.listen(3300, () => {
    console.log('+++Express Server is Running!!!');
});