
const express = require('express');
const query = require('./db');
const router = express.Router();
const cors = require('cors');
router.use(cors());
const { check, validationResult } = require('express-validator');
const VerifyToken = require('./verifytoken');

const bodyParser = require('body-parser'); // Create application/x-www-form-urlencoded parser (for POST)

// Create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false });
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json()); // for reading JSON

/**
 *
 * Täällä hallinnoidaan käyttäjän tietoihin liittyviä asioita.
 */

/**
 * Seuraava toiminto lähettää viestin tietokantaan.
 */

router.post("/api/postMessage", urlencodedParser, VerifyToken, function (req, res) {

    /**
     * Tehdään sql kysely jossa on vastaanottaja_id, lahettaja_id, sisalto, paivamaara. Tiedot lisätään chat tauluun.
     */

    let sql = "INSERT into chat (vastaanottaja_id, lahettaja_id, sisalto, paivamaara)"
        + " VALUES (?, ?, ?, ?)";

    /**
     *  Muutetaan nykyinen päivämäärä tietokantaa sopivaksi.
     */

    let paivamaara = new Date().toISOString().slice(0, 19).replace('T', ' ');

    (async () => {
        try {

            await query(sql,[req.body.vastaanottaja_id, req.userData.id, req.body.viesti, paivamaara]);

            /**
             * Jos tietokanta kysely onnistui niin palautetaan selaimeen status 200 ja luodut tiedot.
             */

            return res.status(201).json({
                success: true,
                message: 'Viestin lisäys onnistui!',
                value: {"vastaanottaja_id":req.body.vastaanottaja_id,"lahettaja_id":req.userData.id,"sisalto":req.body.viesti,"paivamaara":paivamaara,"sahkoposti":req.userData.user},
                id: req.userData.id

            })

        } catch (err) {
            console.log("Database error!"+ err);
        }
    })()


});

/**
 * Seuraava toiminto hakee käyttäjän omat kaverit ja näyttää 10 käyttäjää kerralla.
 */


router.get("/api/users", VerifyToken, function (req, res) {


    /**
     * Select lauseella hakee kaikki hyväksytyt kaverilistalta jos omatunnus löytyy vastaanottaaja_id:ltä tai lahettaja_id:ltä.
     */

    let sql = "SELECT kayttaja.kayttaja_id, kayttaja.sahkoposti, kaverilista.vastaanottaja_id, kaverilista.lahettaja_id FROM kaverilista, kayttaja WHERE kaverilista.hyvaksytty = ? AND ((kaverilista.vastaanottaja_id = kayttaja.kayttaja_id AND kaverilista.lahettaja_id = ?) OR (kaverilista.lahettaja_id = kayttaja.kayttaja_id AND kaverilista.vastaanottaja_id = ?)) LIMIT ? OFFSET ?";

    /**
     * Sama kuin äskeinen sql lasue mutta laskee kaverit yhteen ja käytetään maksimisivumääränä selaimessa.
     */

    let sql2 = "SELECT COUNT(*) AS count FROM kaverilista, kayttaja WHERE kaverilista.hyvaksytty = ? AND (kaverilista.vastaanottaja_id = kayttaja.kayttaja_id AND kaverilista.lahettaja_id = ?) OR (kaverilista.lahettaja_id = kayttaja.kayttaja_id AND kaverilista.vastaanottaja_id = ?)";


    (async () => { // IIFE (Immediately Invoked Function Expression)
        try {

            const rows = await query(sql,[1, req.userData.id, req.userData.id, 8, parseInt(req.query.page)]);

            const rows2 = await query(sql2,[1, req.userData.id, req.userData.id]);

            /**
             * Jos tietokanta kysely onnistui, lista näytetään selaimessa.
             */

            return res.status(200).json({
                success: true,
                message: 'Listan näyttäminen onnistui!',
                value: rows,
                count: rows2,
                id: req.userData.id
            })

        }
        catch (err) {
            console.log("Database error! api/users " + err);
        }
    })()

});

/**
 *  Seuraava toiminto hakee tietyt viestit tietokannasta.
 */


/**
 * Kaveri tunnuksen validointi.
 */

router.get("/api/userDetail", VerifyToken,
    [check('id').custom((value,{req}) => {
    if (value == req.userData.id || value == null) {

        throw new Error("Tunnus ei ole kelvollinen!");
    } else {

        return value;
    }
})], function (req, res) {

        const errors = validationResult(req);
        if (!errors.isEmpty() || req.query.id == 0 || req.userData.id == 0) {
            return res.status(422).json({
                success: false,
                errors: errors.array()
            });
        }

        let sql;

        /**
         * Haetaan yksittäiset viestit uusimman tai vanhimman lajitteluperusteella.
         */


        if (req.query.filter == 'uusin') {

        sql = "SELECT kayttaja.sahkoposti, chat.sisalto, chat.lahettaja_id, chat.vastaanottaja_id, chat.paivamaara FROM chat, kayttaja WHERE (vastaanottaja_id = ? AND lahettaja_id = ? AND chat.vastaanottaja_id = kayttaja.kayttaja_id) OR (vastaanottaja_id = ? AND lahettaja_id = ? AND chat.lahettaja_id = kayttaja.kayttaja_id)  ORDER BY paivamaara DESC LIMIT ? OFFSET ?";

    } else {

        sql = "SELECT kayttaja.sahkoposti, chat.sisalto, chat.lahettaja_id, chat.vastaanottaja_id, chat.paivamaara FROM chat, kayttaja WHERE (vastaanottaja_id = ? AND lahettaja_id = ? AND chat.vastaanottaja_id = kayttaja.kayttaja_id) OR (vastaanottaja_id = ? AND lahettaja_id = ? AND chat.lahettaja_id = kayttaja.kayttaja_id)  ORDER BY paivamaara ASC LIMIT ? OFFSET ?";

    }



    (async () => { // IIFE (Immediately Invoked Function Expression)
        try {
            const rows = await query(sql,[req.query.id, req.userData.id, req.userData.id, req.query.id, 10, parseInt(req.query.page)]);

            /**
             * Jos tietokanta kysely onnistui, näyteään viestit selaimessa
             */

           res.status(201).json({
                success: true,
                message: 'viestin tiedot onnistui!',
                userdata: rows,
                id: req.userData.id,
                id2: req.query.id
            })

        }
        catch (err) {
            console.log("Database error!"+ err + "1");
        }
    })()

});

/**
 * Seuraava toiminto hakee omia kavereita listasta.
 */

router.get("/api/searchFriends", VerifyToken, function (req, res) {


    /**
     * Ensiksi haetaan omat kaverit sql lauseesta ja lopuksi rajoitetaan haun nimimerkin mukaan. 8 hakua näyetään maksimissa.
     */

    var sql = "SELECT kayttaja.kayttaja_id, kayttaja.sahkoposti, kaverilista.vastaanottaja_id, kaverilista.lahettaja_id FROM kaverilista, kayttaja WHERE kaverilista.hyvaksytty = ? AND ((kaverilista.vastaanottaja_id = kayttaja.kayttaja_id AND kaverilista.lahettaja_id = ?) OR (kaverilista.lahettaja_id = kayttaja.kayttaja_id AND kaverilista.vastaanottaja_id = ?)) AND kayttaja.sahkoposti LIKE ? LIMIT ?";



    (async () => { // IIFE (Immediately Invoked Function Expression)
        try {
            const rows = await query(sql,[1, req.userData.id, req.userData.id, '%' + req.query.search + '%', 8]);

            /**
             * Jos haku kysely onnistui, näyteään haku tulos selaimessa.
             */

            res.status(200).json({
                success: true,
                message: 'Listan näyttäminen onnistui!',
                userdata: rows
            })

        }
        catch (err) {
            console.log("Database error!"+ err);
        }
    })()

});

/**
 * Seuraava toiminto poistaa tietyn käyttäjän kaverin.
 */

router.delete("/api/deleteUser", VerifyToken, function (req, res) {

    /**
     * Poistetaan kaverilistalta vastaanottaja_id ja lahettaja_id mukaan.
     */

    let sql = "DELETE FROM kaverilista WHERE (vastaanottaja_id = ? AND lahettaja_id = ?) OR (vastaanottaja_id = ? AND lahettaja_id = ?)";

    /**
     * Poistetaan chatista viestit vastaanottaja_id ja lahettaja_id mukaan.
     */

    let sql2 = "DELETE FROM chat WHERE (vastaanottaja_id = ? AND lahettaja_id = ?) OR (vastaanottaja_id = ? AND lahettaja_id = ?)";

    (async () => { // IIFE (Immediately Invoked Function Expression)
        try {

            const deleteObject = JSON.parse(req.headers['deleteobject'])

            await query(sql,[req.userData.id, deleteObject.tunnus, deleteObject.tunnus, req.userData.id]);

            await query(sql2,[req.userData.id, deleteObject.tunnus, deleteObject.tunnus, req.userData.id]);

            /**
             * Jos sql poisto kysely onnistui, läheteään onnistunut status selaimeen.
             */

            res.status(200).json({
                success: true,
                message: 'Poisto onnistui!',
                value: deleteObject.tunnus
            })

        }
        catch (err) {
            console.log("Database error!"+ err);
        }
    })()

});

/**
 * Seuraava toiminto poistaa tietyn viestin.
 */

router.delete("/api/deleteUserMessage", VerifyToken, function (req, res) {

    /**
     * Poistetaan chatista viesti vastaanottaja_id, lahettaja_id ja sisallon mukaan.
     */

    let sql = "DELETE FROM chat WHERE ((vastaanottaja_id = ? AND lahettaja_id = ?) OR (vastaanottaja_id = ? AND lahettaja_id = ?)) AND sisalto = ?";

    (async () => { // IIFE (Immediately Invoked Function Expression)
        try {

            const deleteObject = JSON.parse(req.headers['deleteobject'])

            console.log(deleteObject.viesti)

            await query(sql,[req.userData.id, deleteObject.tunnus, deleteObject.tunnus, req.userData.id, deleteObject.viesti]);

            res.status(200).json({
                success: true,
                message: 'Poisto onnistui!',
                tunnus: deleteObject.tunnus,
                sisalto: deleteObject.viesti,
                oma: req.userData.id
            })

        }
        catch (err) {
            console.log("Database error! 123 "+ err);
        }
    })()

});

/**
 * Exportataan palvelin moduuliin.
 */

module.exports = router;