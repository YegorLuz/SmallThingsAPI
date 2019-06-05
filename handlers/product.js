const { forbid } = require('../utils');

const recommendedProductsHandler = function (DataBase) {
    return async function (request, response) {
        try {
            let products = await DataBase.getRecommendedProducts();
            response.send({ products });
        } catch (error) {
            forbid(request, response);
        }
    };
};

module.exports = { recommendedProductsHandler };