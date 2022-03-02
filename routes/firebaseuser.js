const express = require('express');
const query = require('./db');
const router = express.Router();
const cors = require('cors');
router.use(cors());
const VerifyToken = require('./verifytoken');
const bcrypt = require("bcryptjs");

/*
 * Täällä hoidetaan firebase apin liittyviä asioita esim. unohtunut salasana, profiilin päivittäminen ja firebase kirjautuminen.
 */

router.post("/api/checkFirebase", VerifyToken, function (req, res) {

    console.log("tarkistetaan firebase...")


    let sql = "INSERT into kayttaja (sahkoposti, salasana)"
        + " VALUES (?, ?)";

    (async () => { // IIFE (Immediately Invoked Function Expression)
        try {

            let email = false;

            let sql3 = "SELECT sahkoposti FROM kayttaja WHERE sahkoposti = ?";

            const rows2 = await query(sql3,[jsonObj.sahkoposti]);

            /**
             * Tarkistetaan onko samanlainen sahkoposti olemassa tietokannassa.
             */

            if (JSON.stringify(rows2.length) == 0) {

                email = true;

            }

            /**
             * Jos salasanat täsmää sekä nimimerkki ja sahkoposti eivät ole olemassa niin hashataan salasana ja viedään tiedot kantaan.
             */

            if (jsonObj.salasana == jsonObj.salasana2 && email == true) {

                let hashedPassword = await bcrypt.hash(jsonObj.salasana, 10);

                await query(sql,[jsonObj.sahkoposti, hashedPassword]);

                res.status(201).send('Rekisteröinti onnistui!')

            } else {

                res.status(403).send('Rekisteröinti epäonnistui!')
            }

        }
        catch (err) {
            console.log("Database error!"+ err);
        }
    })()


})