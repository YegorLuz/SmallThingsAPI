const { forbid } = require('../utils');

const storeSearchHandler = function (DataBase) {
    return async function (request, response) {
        const { categoryId = null, searchValue } = request.query || {};

        try {
            let stores = await DataBase.getStoreList({ categoryId, searchValue });
            stores = stores || [];
            const category = await DataBase.getCategory(categoryId);
            response.send({ stores, category });
        } catch (error) {
            forbid(request, response);
        }
    };
};

module.exports = { storeSearchHandler };