const colorPalette = require('../data/colorPalette');
let companyInfo = {
    name: 'Ukrainian Product Cluster',
    slogan: 'Шукаю &bull; знаходжу &bull; доставляю',
    logo: '../../assets/logos/small-things.png',
};

function withLoggedIn (data, request) {
    const loggedIn = (request.body || {}).loggedIn ? { loggedIn: true } : {};
    return { ...data, ...loggedIn };

}

const homePageHandler = function (DataBase) {
    return async function (request, response) {
        const { customerId = null, loggedIn } = request.body || {};
        let colors = colorPalette.index;
        let pages = [];
        let categories = [];

        try {
            if (customerId !== null) {
                colors = colorPalette[customerId];
            }

            pages = await DataBase.getPages();
            categories = await DataBase.getCategories();

            response.send(withLoggedIn({ pages, categories, colorPalette: colors, companyInfo, loggedIn }, request));
        } catch (error) {
            response.status(404).end(error);
        }
    };
};

const loginPageHandler = function (DataBase) {
    return async function (request, response) {
        const { customerId = null } = request.body || {};
        let colors = colorPalette.index;

        try {
            if (customerId !== null) {
                colors = colorPalette[customerId];
            }

            response.send(withLoggedIn({ colorPalette: colors, companyInfo }, request));
        } catch (error) {
            response.status(404).end(error);
        }
    };
};

const registrationPageHandler = function (DataBase) {
    return async function (request, response) {
        const { customerId = null } = request.body || {};
        let colors = colorPalette.index;

        try {
            if (customerId !== null) {
                colors = colorPalette[customerId];
            }

            response.send(withLoggedIn({ colorPalette: colors, companyInfo }, request));
        } catch (error) {
            response.status(404).end(error);
        }
    };
};

const categoryPageHandler = function (DataBase) {
    return async function (request, response) {
        const { customerId = null, storeId = null, categoryId = null } = request.body || {};
        const prodParams = {};
        const catParams = {};
        let colors = colorPalette.index;

        try {
            if (customerId !== null) {
                colors = colorPalette[customerId];
            }

            if (storeId) {
                catParams.store = storeId;
                prodParams.store = storeId;
            }

            if (categoryId) prodParams.category = categoryId;

            const categoriesData = await DataBase.getCategories(catParams);
            const categories = (categoriesData || []).map(cat => cat.category);
            const products = await DataBase.getProducts(prodParams);
            const storeInfo = await DataBase.getCompanyByStoreId(storeId);
            const companyInfo = (storeInfo[0] || {}).company;
            const category = await DataBase.getCategory(categoryId);

            response.send(withLoggedIn({ colorPalette: colors, companyInfo, categories, products, category: (category || [])[0] }, request));
        } catch (error) {
            response.status(404).end(error);
        }
    };
};

const selectStorePageHandler = function (DataBase) {
    return async function (request, response) {
        const { customerId = null, categoryId } = request.body || {};
        let colors = colorPalette.index;

        try {
            if (customerId !== null) {
                colors = colorPalette[customerId];
            }

            const category = await DataBase.getCategory(categoryId);
            response.send(withLoggedIn({ colorPalette: colors, companyInfo, category: (category || [])[0] }, request));
        } catch (error) {
            response.status(404).end(error);
        }
    };
};

const productPageHandler = function (DataBase) {
    return async function (request, response) {
        const { customerId = null, productId } = request.body || {};
        let colors = colorPalette.index;

        try {
            if (customerId !== null) {
                colors = colorPalette[customerId];
            }

            const productData = await DataBase.getProduct(productId);
            const { category: categoryId, store: storeId } = (productData || [{}])[0];
            const categoryData = await DataBase.getCategory(categoryId);
            const storeData = await DataBase.getStore(storeId);
            const storeInfo = await DataBase.getCompanyByStoreId(storeId);
            const companyInfo = (storeInfo[0] || {}).company;

            response.send(withLoggedIn({ colorPalette: colors, companyInfo, product: productData[0], category: categoryData[0], store: storeData[0] }, request));
        } catch (error) {
            response.status(404).end(error);
        }
    };
};

module.exports = { homePageHandler, loginPageHandler, registrationPageHandler, categoryPageHandler, selectStorePageHandler, productPageHandler };