const { forbid, decryptData, createToken } = require('../utils');

const authHandler = function (DataBase) {
    return async function (request, response) {
        const { body, forbidden } = request;

        if (forbidden) return;

        const { token } = body || {};
        const { email: tEmail, password } = decryptData(token);

        try {
            const userData = await DataBase.getUserByCreds(tEmail, password);
            const {_id, firstName, lastName, image, email} = userData[0];
            if (_id) {
                const access_token = createToken({id: _id, email, password});
                const refresh_token = createToken({access_token, type: 'refresh'});
                response.send({userData: {_id, firstName, lastName, email, image, access_token, refresh_token}});
            } else {
                forbid(request, response);
            }
        } catch (error) {
            forbid(request, response);
        }
    };
};

const pingHandler = function (DataBase) {
    return async function (request, response) {
        response.send({ loggedIn: request.body.loggedIn || false });
    };
};

const registrationHandler = function (DataBase) {
    return async function (request, response) {
        const { data, forbidden } = request;

        if (forbidden) return;

        const { password, email, firstName = '', lastName = '' } = data;
        console.log(data);
        return;
        try {
            const userData = await DataBase.addUser({password, email, firstName, lastName});
            response.send({ userData });
        } catch (error) {
            console.log(error);
        }
    };
};

module.exports = { authHandler, pingHandler, registrationHandler };