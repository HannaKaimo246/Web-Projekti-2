const express = require('express');
const query = require('./db');
const router = express.Router();
const cors = require('cors');
router.use(cors());
const VerifyToken = require('./verifytoken');

/**
 * Täällä hoidellaan karttaan liittyviä asioita.
 */

/**
 * Seuraava toiminto hakee käyttäjän kaverit ja näyttää sijainti listassa.
 */

router.get("/api/mapUsers", VerifyToken, function (req, res) {

    let sql = "SELECT kayttaja.kayttaja_id, kayttaja.nimimerkki, kaverilista.vastaanottaja_id, kaverilista.lahettaja_id FROM kaverilista, kayttaja WHERE kaverilista.hyvaksytty = ? AND ((kaverilista.vastaanottaja_id = kayttaja.kayttaja_id AND kaverilista.lahettaja_id = ?) OR (kaverilista.lahettaja_id = kayttaja.kayttaja_id AND kaverilista.vastaanottaja_id = ?)) LIMIT ? OFFSET ?";


    (async () => { // IIFE (Immediately Invoked Function Expression)
        try {
            const rows = await query(sql,[1, req.userData.id, req.userData.id, 10, parseInt(req.query.page)]);

            /**
             * Jos sql kysely onnistui, näytetään käyttäjän kaverit sijainti listassa.Id ja username on tarkoitettu omiin tietoihin selaimessa.
             */

            return res.status(200).json({
                success: true,
                message: 'Listan näyttäminen onnistui!',
                userdata: rows,
                id: req.userData.id,
                username: req.userData.user
            })

        }
        catch (err) {
            console.log("Database error!"+ err);
        }
    })()

});

/**
 * Exportataan palvelin moduuliin.
 */

module.exports = router;