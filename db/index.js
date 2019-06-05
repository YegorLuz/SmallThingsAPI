const mysql = require('mysql');

let db = null;
let initialized = false;

const query = (sql) => {
    return new Promise((resolve, reject) => {
        db.query(sql, (error, result, fields) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        });
    });
};

class DataBase {
    static async init (config = {}) {
        if (!initialized) {
            db = mysql.createConnection(config);
            await db.connect(error => {
                if (error) console.log('error', error);
            });

            initialized = true;
        }
    }

    static async destructor () {
        db.end();
    }



    /** ----- CATEGORIES ----- */
    static getCategories (params = {}) {
        const { store_id, category_id = null } = params;

        if (!!store_id && !category_id) {
            return query(`SELECT * FROM categories WHERE category_id IN (SELECT DISTINCT(category_id) AS category_id FROM products WHERE store_id=${store_id})`);
        }

        if (category_id) {
            return query(`SELECT * FROM categories WHERE category_id=${category_id}`);
        }

        return query(`SELECT * FROM categories`);
    }

    static getCategory (category_id) {
        return query(`SELECT * FROM categories WHERE category_id=${category_id}`);
    }

    static async addCategory (data = {}) {
        return null;
    }

    static async removeCategory (id) {
        return null;
    }




    /** ----- COLORS ----- */
    static getColors (params = {}) {
        const { color_id } = params;

        if (color_id) {
            return query(`SELECT * FROM colors WHERE color_id=${color_id}`);
        }

        return query(`SELECT * FROM colors`);
    }

    static getColor (color_id) {
        return query(`SELECT * FROM colors WHERE color_id=${color_id}`);
    }

    static async addColor (data = {}) {
        return null;
    }

    static async removeColor (id) {
        return null;
    }




    /** ----- COMPANIES ----- */
    static getCompanies (params = {}) {
        return query(`SELECT * FROM companies`);
    }

    static getCompany (company_id) {
        return query(`SELECT * FROM companies WHERE company_id=${company_id}`);
    }

    static getCompanyByStoreId (store_id) {
        return query(`SELECT * FROM companies WHERE company_id IN (SELECT DISTINCT(company_id) AS company_id FROM stores WHERE store_id=${store_id})`);
    }

    static async addCompany (data = {}) {
        return null;
    }

    static async removeCompany (id) {
        return null;
    }




    /** ----- DELIVERY TYPES ----- */
    static getDeliveryTypes (params = {}) {
        return query(`SELECT * FROM delivery_types`);
    }

    static getDeliveryType (delivery_type_id) {
        return query(`SELECT * FROM delivery_types WHERE delivery_type_id=${delivery_type_id}`);
    }

    static async addDeliveryType (data = {}) {
        return null;
    }

    static async removeDeliveryType (id) {
        return null;
    }




    /** ----- ORDERS ----- */
    static getOrders (params = {}) {
        return query(`SELECT * FROM orders`);
    }

    static getOrder (order_id) {
        return query(`SELECT * FROM orders WHERE order_id=${order_id}`);
    }

    static async addOrder (data = {}) {
        return null;
    }

    static async removeOrder (id) {
        return null;
    }




    /** ----- PRODUCTS ----- */
    static getProducts (params = {}) {
        return query(`SELECT * FROM products`);
    }

    static getProduct (product_id) {
        return query(`SELECT * FROM products WHERE product_id=${product_id}`);
    }

    static getRecommendedProducts () {
        return query(`SELECT * FROM products`);
    }

    static async addProduct (data = {}) {
        return null;
    }

    static async removeProduct (id) {
        return null;
    }




    /** ----- SIZES ----- */
    static getSizes (params = {}) {
        return query(`SELECT * FROM sizes`);
    }

    static getSize (size_id) {
        return query(`SELECT * FROM sizes WHERE size_id=${size_id}`);
    }

    static async addSize (data = {}) {
        return null;
    }

    static async removeSize (id) {
        return null;
    }




    /** ----- STORES ----- */
    static getStores (params = {}) {
        return query(`SELECT * FROM stores`);
    }

    static getStore (store_id) {
        return query(`SELECT * FROM stores WHERE store_id=${store_id}`);
    }

    static async addStore (data = {}) {
        return null;
    }

    static async removeStore (id) {
        return null;
    }




    /** ----- TRANSPORTERS ----- */
    static getTransporters (params = {}) {
        return query(`SELECT * FROM transporters`);
    }

    static getTransporter (transporter_id) {
        return query(`SELECT * FROM transporters WHERE transporter_id=${transporter_id}`);
    }

    static async addTransporter (data = {}) {
        return null;
    }

    static async removeTransporter (id) {
        return null;
    }




    /** ----- USERS ----- */
    static getUsers (params = {}) {
        return query(`SELECT * FROM users`);
    }

    static getUser (user_id) {
        return query(`SELECT * FROM users WHERE user_id=${user_id}`);
    }

    static getUserByCreds (email, password) {
        return query(`SELECT * FROM users WHERE email=${email} AND password=${password}`);
    }

    static async addUser (data) {
        return null;
    }

    static async removeUser (id) {
        return null;
    }




    /** ----- USER TYPES ----- */
    static getUserTypes (params = {}) {
        return query(`SELECT * FROM user_types`);
    }

    static getUserType (user_type_id) {
        return query(`SELECT * FROM user_types WHERE user_type_id=${user_type_id}`);
    }

    static async addUserType (data = {}) {
        return null;
    }

    static async removeUserType (id) {
        return null;
    }




    /** ----- STORE ----- */
    static getStoreList ({ categoryId, searchValue = '' }) {
        let additionalQuery = '';
        if (categoryId) {
            additionalQuery = `store_id IN (SELECT DISTINCT(store_id) AS store_id FROM products WHERE category_id=${categoryId}) AND`;
        }

        return query(`SELECT
            stores.address AS store_address,
            companies.name AS company_name,
            companies.slogan AS company_slogan,
            companies.description AS company_description,
            companies.logo AS company_logo,
            companies.banner AS company_banner,
            companies.color_scheme
            FROM stores LEFT JOIN companies ON stores.company_id = companies.company_id
            WHERE ${additionalQuery} (stores.address LIKE '%${searchValue}%' OR companies.name LIKE '%${searchValue}%')`);
    }




    /** ----- BASKET ----- */
    static async addToBasket (data) {
        return null;
    }



    /** ----- PAGES ----- */
    static getPages (params = {}) {
        return query(`SELECT * FROM pages`);
    }

    static getPage (page_id) {
        return query(`SELECT * FROM pages WHERE page_id=${page_id}`);
    }

    static async addPage (data = {}) {
        return null;
    }

    static async removePage (id) {
        return null;
    }
}

module.exports = DataBase;
