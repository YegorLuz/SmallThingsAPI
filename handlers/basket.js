const { forbid } = require('../utils');

const addToBasketHandler = function (DataBase) {
    return async function (request, response) {
        const { data } = request.body || {};
        try {
            const answer = await DataBase.addToBasketHandler(data);
            response.status(200).send({
                message: 'Product has been successfully added to basket',
            });
        } catch (error) {
            forbid(request, response);
        }
    }
};

module.exports = { addToBasketHandler };