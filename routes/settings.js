const express = require('express');
const query = require('./db');
const router = express.Router();
const cors = require('cors');
router.use(cors());
const VerifyToken = require('./verifytoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser'); // Create application/x-www-form-urlencoded parser (for POST)

// Create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false });
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json()); // for reading JSON
const { check, validationResult } = require('express-validator');

/**
 * Täällä hoidetaan asetuksiin liittyviä asioita.
 */

/**
 * Seuraava toiminto tarkistaa onko sähköpostiosoite kelvollinen.
 */

router.put("/api/settings/email", urlencodedParser, [check('sahkoposti').isEmail().withMessage("Sähköpostiosite ei ole kelvollinen!")], VerifyToken, function (req, res) {

    /**
     * Jos ilmenee virheitä, palautetaan virhe status selaimeen.
     */

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            errors: errors.array()
        });
    }

    /**
     * Kyseinen sql lause päivittää nimimerkin kayttaja taulussa, kayttaja_id mukaan.
     */

    let sql = "UPDATE kayttaja SET sahkoposti = ? WHERE kayttaja_id = ?";

    (async () => {
        try {

            await query(sql,[req.body.sahkoposti, req.userData.id]);

            /**
             * Jos tietokanta kysely onnistui läheteään ilmoitus status 200 selaimeen.
             */

            res.status(200).send('Sähköpostin päivittäminen onnistui!')

        } catch (err) {
            console.log("Database error!"+ err);
        }
    })()


});

/**
 * Seuraava toiminto päivittää salasanan.
 */

/**
 * Tarkistetaan onko salasana vähintään 8 merkkiä pitkä.
 */

router.put("/api/settings/password", urlencodedParser, [check('salasana').isLength({ min: 8 }).withMessage("Salasana täytyy olla vähintään 8 merkkiä pitkä!")], VerifyToken, function (req, res) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            errors: errors.array()
        });
    }

    let jsonObj = req.body;

    /**
     * Päivitetään salasana kayttaja_id mukaan.
     */

    let sql = "UPDATE kayttaja SET salasana = ? WHERE kayttaja_id = ?";


    (async () => {
        try {

            /**
             * Muutetaan salasana hash muotoon.
             */

            let hashedPassword = await bcrypt.hash(jsonObj.salasana, 10);


            await query(sql,[hashedPassword, req.userData.id]);

            /**
             * Jos sql kysely onnistui, palautetaan onnistunut tieto selaimeen.
             */

            res.status(200).json('Käyttäjänimen päivittäminen onnistui!')

        } catch (err) {
            console.log("Database error!"+ err);
        }
    })()


});

module.exports = router;