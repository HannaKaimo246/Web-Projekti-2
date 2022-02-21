var jwt = require('jsonwebtoken');
var config = require('./config');

/**
 * Tarkistaa onko selaimesta tullut json token kelvollinen.
 */

function verifyToken(req, res, next) {

    try {

        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, config.secret);

        req.userData = decoded;

        next();

    }catch (err) {
        res.status(403).json({
            message: 'Tarkistus epäonnistui!'
        });
    }


}

module.exports = verifyToken;