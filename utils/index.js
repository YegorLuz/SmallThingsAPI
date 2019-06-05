const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const moment = require('moment');
const { AUTH_DATA_SECRET, TOKEN_LIFE_TIME, TOKEN_SECRET, TOKEN_HEADER } = require('../constants');

const parseAuthHeaders = function (request) {
    const upcApiKey = request.headers['upc-api-key'] || '';
    const access_token = request.headers['upc-auth-token'] || '';
    const refresh_token = request.headers['upc-refresh-token'] || '';
    const simpleAccessKey = request.headers['upc-simple-access-key'] || '';

    return { upcApiKey, access_token, refresh_token, simpleAccessKey };
};

const forbid = function (request, response) {
    request.forbidden = true;
    response.status(403).json({ message: 'Forbidden' }).end();
};

function base64url_encode (src) {
    // Encode in classical base64
    let encodedSource = CryptoJS.enc.Base64.stringify(src);

    // Remove padding equal characters
    encodedSource = encodedSource.replace(/=+$/, '');

    // Replace characters according to base64url specifications
    encodedSource = encodedSource.replace(/\+/g, '-');
    encodedSource = encodedSource.replace(/\//g, '_');

    return encodedSource;
}

function base64url_decode (str = '') {
    let decodedSource = str.replace(/\_/g, '/');
    decodedSource = decodedSource.replace(/\-/g, '+');

    decodedSource += '=';

    decodedSource = CryptoJS.enc.Base64.parse(decodedSource);

    return decodedSource;
}

function createToken (userData) {
    const data = {
        ...userData,
        expirationDate: moment() + TOKEN_LIFE_TIME,
    };

    let header_str = CryptoJS.enc.Utf8.parse(JSON.stringify(TOKEN_HEADER));
    let header_enc = base64url_encode(header_str);

    let data_str = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
    let data_enc = base64url_encode(data_str);

    let token = header_enc + '.' + data_enc;

    token = CryptoJS.AES.encrypt(token, TOKEN_SECRET).toString();

    return token;
}

function parseToken (tk = '') {
    const token = CryptoJS.AES.decrypt(tk, TOKEN_SECRET).toString(CryptoJS.enc.Utf8);

    let [ header_enc, data_enc ] = token.split('.');

    let data_str = base64url_decode(data_enc);
    let t_data = JSON.parse(data_str.toString(CryptoJS.enc.Utf8));

    let header_str = base64url_decode(header_enc);
    let t_header = JSON.parse(header_str.toString(CryptoJS.enc.Utf8));

    return { data: t_data, header: t_header };
}

function shallowEquality (obj1, obj2) {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;
    for (let key in obj1) {
        if (!(obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key) && obj1[key] === obj2[key])) {
            return false;
        }
    }

    return true;
}

function decryptData (token) {
    return jwt.verify(token, AUTH_DATA_SECRET);
}

module.exports = { parseAuthHeaders, forbid, base64url_encode, base64url_decode, shallowEquality, decryptData, createToken, parseToken };