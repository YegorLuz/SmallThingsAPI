const moment = require('moment');
const { shallowEquality, forbid, parseAuthHeaders, parseToken } = require('../utils');
const { TOKEN_HEADER, UPC_API_KEY, AVAILABLE_URIS, UPC_SIMPLE_ACCESS_KEY } = require('../constants');

function accessAllowed (request) {
    const { originalUrl } = request;
    const { simpleAccessKey } = parseAuthHeaders(request);

    return simpleAccessKey === UPC_SIMPLE_ACCESS_KEY && AVAILABLE_URIS.indexOf(originalUrl) >= 0;
}

async function isClientAuthorized (request, response, getUser) {
    const { access_token } = parseAuthHeaders(request);
    return await isValidToken(access_token, getUser);
}

function isServerAuthorized (upcApiKey) {
    return upcApiKey === UPC_API_KEY;
}

async function isValidToken (token, getUser) {
    const { data, header } = parseToken(token);
    if (shallowEquality(header, TOKEN_HEADER)) {
        const { id, email, password, expirationDate } = data;
        if (moment() < moment(expirationDate)) {
            const userData = await getUser(id);
            if (userData[0].email === email && userData[0].password === password) {
                return true;
            }
        }
    }

    return false;
}

function useAuth (DataBase) {
    return async function (request, response, next) {
        const { upcApiKey, access_token } = parseAuthHeaders(request);


        /*
        if (upcApiKey) {
            if (!isServerAuthorized(upcApiKey)) {
                forbid(request, response);
            } else {
                if (access_token) {
                    let authorized = await isClientAuthorized(request, response, DataBase.getUser);

                    if (authorized) {
                        request.body.loggedIn = true;
                    }
                }
            }
        } else {
            if (!accessAllowed(request)) {
                if (access_token) {
                    let authorized = await isClientAuthorized(request, response, DataBase.getUser);

                    if (!authorized) {
                        forbid(request, response);
                    }
                } else {
                    forbid(request, response);
                }
            }
        }
        */

        next();
    }
}

module.exports = { useAuth };
