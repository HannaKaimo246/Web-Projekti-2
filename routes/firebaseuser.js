const express = require('express');
const query = require('./db');
const router = express.Router();
const cors = require('cors');
router.use(cors());
const VerifyToken = require('./verifytoken');
const bcrypt = require("bcryptjs");
const admin = require('firebase-admin');

/*
 * Täällä hoidetaan firebase apin liittyviä asioita esim. unohtunut salasana, profiilin päivittäminen ja firebase kirjautuminen.
 */


/*
 * Alustetaan firebase apin tiedot.
 */
const serviceAccount = require('../serviceAccountKey.json');
const jwt = require("jsonwebtoken");
const config = require("./config");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

/*
 * Tarkistetaan onko firebase apin token kelvollinen.
 */
const VerifyFirebaseToken = (req, res, next) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
            'Make sure you authorize your request by providing the following HTTP header:',
            'Authorization: Bearer <Firebase ID Token>');
        res.status(403).json({error: 'Unauthorized'});
        return;
    }
    const idToken = req.headers.authorization.split('Bearer ')[1];
    admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
        console.log('ID Token correctly decoded', decodedIdToken);
        admin.auth().getUser(decodedIdToken.uid).then((userRecord) => {
            req.user = userRecord;
            next();
        }).catch(error => {
            console.error('Error while getting Firebase User record:', error);
            res.status(403).json({error: 'Unauthorized'});
        });
    }).catch(error => {
        console.error('Error while verifying Firebase ID token:', error);
        res.status(403).json({error: 'Unauthorized'});
    });
}

/*
 *  Päivitetään tietokantaan käyttäjän unohtuneen salasanan tiedot jos firebase apin käyttäjän omistama token on kelvollinen
 */

router.post("/api/checkForgotPassword", VerifyFirebaseToken, function (req, res) {

    console.log("firebase lupa myönnetty.")

    let jsonObj = req.body;

    let sql = "SELECT * FROM kayttaja WHERE sahkoposti = ?";

    let sql2 = "UPDATE kayttaja SET salasana = ? WHERE sahkoposti = ?";



    (async () => { // IIFE (Immediately Invoked Function Expression)
        try {

            const rows = await query(sql,[jsonObj.sahkoposti]);

            const validPassword = await bcrypt.compare(jsonObj.salasana, rows[0].salasana);

            if (rows.length != 0 && !validPassword) {

                let hashedPassword = await bcrypt.hash(jsonObj.salasana, 10);

                await query(sql2,[hashedPassword, jsonObj.sahkoposti]);

                let insertedId = rows[0].kayttaja_id;

                const tokenValue = jwt.sign({id: insertedId, user: jsonObj.sahkoposti}, config.secret, {
                    expiresIn: "1h"
                });

                /**
                 * Jos kaikki onnistui viedään token selaimeen ja käyttäjän tiedot.
                 */

                res.status(202).json({
                    token: tokenValue,
                    user: jsonObj.sahkoposti
                });

            } else {
                res.status(400).send('Unohtuneen salasanan paivittaminen epaonnistui!')
            }


        }
        catch (err) {
            console.log("Database error!"+ err);
            res.status(400).send(err);
        }
    })()


})

router.post("/api/checkUserFirebase", VerifyFirebaseToken, function (req, res) {

    let sql = "SELECT * FROM kayttaja WHERE sahkoposti = ?";

    let sql2 = "INSERT into kayttaja (sahkoposti, salasana)"
        + " VALUES (?, ?)";


    let jsonObj = req.body;

    (async () => { // IIFE (Immediately Invoked Function Expression)
        try {

            const rows = await query(sql,[jsonObj.sahkoposti]);

            if (rows.length == 0) {

                let hashedPassword = await bcrypt.hash(jsonObj.salasana, 10);

                await query(sql2,[jsonObj.sahkoposti, hashedPassword]);

                const tulos = await query(sql,[jsonObj.sahkoposti]);

                let insertedId = tulos[0].kayttaja_id;

                const tokenValue = jwt.sign({id: insertedId, user: jsonObj.sahkoposti, password: jsonObj.salasana}, config.secret, {
                    expiresIn: "1h"
                });

                /**
                 * Jos kaikki onnistui viedään token selaimeen ja käyttäjän tiedot.
                 */

                res.status(202).json({
                    token: tokenValue,
                    user: jsonObj.sahkoposti
                });


            } else if (rows.length !== 0) {

                const validPassword = await bcrypt.compare(jsonObj.salasana, rows[0].salasana);

                if (validPassword) {

                    let insertedId = rows[0].kayttaja_id;

                    const tokenValue = jwt.sign({id: insertedId, user: jsonObj.sahkoposti, password: jsonObj.salasana}, config.secret, {
                        expiresIn: "1h"
                    });

                    /**
                     * Jos kaikki onnistui viedään token selaimeen ja käyttäjän tiedot.
                     */

                    res.status(202).json({
                        token: tokenValue,
                        user: jsonObj.sahkoposti
                    });

                } else {
                    res.status(400).send('Salasana ei täsmää!')
                }

            } else {
                res.status(400).send('Tietokanta epäonnistui!')
            }



        }
        catch (err) {
            console.log("Database error!"+ err);
            res.status(400).send(err);

        }
    })()


})

module.exports = router;