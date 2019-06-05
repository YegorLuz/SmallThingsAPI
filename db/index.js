const mysql = require('mysql');

let db = null;
let initialized = false;
const queryCallback = (error, result, fields) => {
    if (error) {
        console.log(error);
    }
    console.log(result);
    return result;
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
    static async getCategories (params = {}) {
        const { store_id, category_id = null } = params;

        if (!!store_id && !category_id) {
            return db.query(`SELECT * FROM categories WHERE category_id IN (SELECT DISTINCT(category_id) AS category_id FROM products WHERE store_id=${store_id})`, queryCallback);
        }

        if (category_id) {
            return db.query(`SELECT * FROM categories WHERE category_id=${category_id}`, queryCallback);
        }

        return db.query('SELECT * FROM categories', queryCallback);
    }

    static async getCategory (category_id) {
        return db.query(`SELECT * FROM categories WHERE category_id=${category_id}`, queryCallback);
    }

    static async addCategory (data = {}) {
        return null;
    }

    static async removeCategory (id) {
        return null;
    }




    /** ----- COLORS ----- */
    static async getColors (params = {}) {
        const { color_id } = params;

        if (color_id) {
            return db.query(`SELECT * FROM colors WHERE color_id=${color_id}`, queryCallback);
        }

        return db.query(`SELECT * FROM colors`);
    }

    static async getColor (color_id) {
        return db.query(`SELECT * FROM colors WHERE color_id=${color_id}`, queryCallback);
    }

    static async addColor (data = {}) {
        return null;
    }

    static async removeColor (id) {
        return null;
    }




    /** ----- COMPANIES ----- */
    static async getCompanies (params = {}) {
        return db.query(`SELECT * FROM companies`, queryCallback);
    }

    static async getCompany (company_id) {
        return db.query(`SELECT * FROM companies WHERE company_id=${company_id}`, queryCallback);
    }

    static async getCompanyByStoreId (store_id) {
        return db.query(`SELECT * FROM companies WHERE company_id IN (SELECT DISTINCT(company_id) AS company_id FROM stores WHERE store_id=${store_id})`, queryCallback);
    }

    static async addCompany (data = {}) {
        return null;
    }

    static async removeCompany (id) {
        return null;
    }




    /** ----- DELIVERY TYPES ----- */
    static async getDeliveryTypes (params = {}) {
        return db.query(`SELECT * FROM delivery_types`, queryCallback);
    }

    static async getDeliveryType (delivery_type_id) {
        return db.query(`SELECT * FROM delivery_types WHERE delivery_type_id=${delivery_type_id}`, queryCallback);
    }

    static async addDeliveryType (data = {}) {
        return null;
    }

    static async removeDeliveryType (id) {
        return null;
    }




    /** ----- ORDERS ----- */
    static async getOrders (params = {}) {
        return db.query(`SELECT * FROM orders`, queryCallback);
    }

    static async getOrder (order_id) {
        return db.query(`SELECT * FROM orders WHERE order_id=${order_id}`, queryCallback);
    }

    static async addOrder (data = {}) {
        return null;
    }

    static async removeOrder (id) {
        return null;
    }




    /** ----- PRODUCTS ----- */
    static async getProducts (params = {}) {
        return db.query(`SELECT * FROM products`, queryCallback);
    }

    static async getProduct (product_id) {
        return db.query(`SELECT * FROM products WHERE product_id=${product_id}`, queryCallback);
    }

    static async getRecommendedProducts () {
        return Product.find({});
    }

    static async addProduct (data = {}) {
        return null;
    }

    static async removeProduct (id) {
        return null;
    }




    /** ----- SIZES ----- */
    static async getSizes (params = {}) {
        return db.query(`SELECT * FROM sizes`, queryCallback);
    }

    static async getSize (size_id) {
        return db.query(`SELECT * FROM sizes WHERE size_id=${size_id}`, queryCallback);
    }

    static async addSize (data = {}) {
        return null;
    }

    static async removeSize (id) {
        return null;
    }




    /** ----- STORES ----- */
    static async getStores (params = {}) {
        return db.query(`SELECT * FROM stores`, queryCallback);
    }

    static async getStore (store_id) {
        return db.query(`SELECT * FROM stores WHERE store_id=${store_id}`, queryCallback);
    }

    static async addStore (data = {}) {
        return null;
    }

    static async removeStore (id) {
        return null;
    }




    /** ----- TRANSPORTERS ----- */
    static async getTransporters (params = {}) {
        return db.query(`SELECT * FROM transporters`, queryCallback);
    }

    static async getTransporter (transporter_id) {
        return db.query(`SELECT * FROM transporters WHERE transporter_id=${transporter_id}`, queryCallback);
    }

    static async addTransporter (data = {}) {
        return null;
    }

    static async removeTransporter (id) {
        return null;
    }




    /** ----- USERS ----- */
    static async getUsers (params = {}) {
        return db.query(`SELECT * FROM users`, queryCallback);
    }

    static async getUser (user_id) {
        return db.query(`SELECT * FROM users WHERE user_id=${user_id}`, queryCallback);
    }

    static async getUserByCreds (email, password) {
        return db.query(`SELECT * FROM users WHERE email=${email} AND password=${password}`, queryCallback);
    }

    static async addUser (data) {
        return null;
    }

    static async removeUser (id) {
        return null;
    }




    /** ----- USER TYPES ----- */
    static async getUserTypes (params = {}) {
        return db.query(`SELECT * FROM user_types`, queryCallback);
    }

    static async getUserType (user_type_id) {
        return db.query(`SELECT * FROM user_types WHERE user_type_id=${user_type_id}`, queryCallback);
    }

    static async addUserType (data = {}) {
        return null;
    }

    static async removeUserType (id) {
        return null;
    }




    /** ----- STORE ----- */
    static async getStoreList ({ categoryId, searchValue = '' }) {
        let additionalQuery = '';
        if (categoryId) {
            additionalQuery = `store_id IN (SELECT DISTINCT(store_id) AS store_id FROM products WHERE category_id=${categoryId}) AND`;
        }

        return db.query(`SELECT
            stores.address AS store_address,
            companies.name AS company_name,
            companies.slogan AS company_slogan,
            companies.description AS company_description,
            companies.logo AS company_logo,
            companies.banner AS company_banner,
            companies.color_scheme
            FROM stores LEFT JOIN companies ON stores.company_id = companies.company_id
            WHERE ${additionalQuery} (stores.address LIKE '%${searchValue}%' OR companies.name LIKE '%${searchValue}%')`, queryCallback);
    }




    /** ----- BASKET ----- */
    static async addToBasket (data) {
        return null;
    }



    /** ----- PAGES ----- */
    static async getPages (params = {}) {
        return db.query(`SELECT * FROM pages`, queryCallback);
    }

    static async getPage (page_id) {
        return db.query(`SELECT * FROM pages WHERE page_id=${page_id}`, queryCallback);
    }

    static async addPage (data = {}) {
        return null;
    }

    static async removePage (id) {
        return null;
    }
}

module.exports = DataBase;
