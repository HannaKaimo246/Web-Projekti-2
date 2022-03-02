const jwt = require('jsonwebtoken');
const config = require('./config');

/**
 * Tarkistaa onko selaimesta tullut json web token kelvollinen.
 */

function verifyToken(req, res, next) {

    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) return res.sendStatus(401)

        jwt.verify(token, config.secret, (err, user) => {

            if (err) return res.sendStatus(403)

            req.userData = user

            next()
        })
    }catch (err) {
        res.status(403).json({
            message: 'Tarkistus epäonnistui!'
        });
    }


}

module.exports = verifyToken;