const express = require('express');
const query = require('./db');
const router = express.Router();
const cors = require('cors');
const bcrypt = require('bcryptjs');
router.use(cors());
const jwt = require('jsonwebtoken');
const config = require('./config');
const VerifyToken = require('./verifytoken');

const multer = require('multer')

/**
 * Täällä hoidetaan käyttäjän asioita.
 */

const bodyParser = require('body-parser'); // Create application/x-www-form-urlencoded parser (for POST)

// Create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false });
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json()); // for reading JSON
const { check, validationResult } = require('express-validator');

/*
 * Kuva tiedoston tallentaminen
 */



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./");},
    filename: function (req, file, cb) {
        const ext = file.mimetype.split("/")[1];
        cb(null, `uploads/${file.originalname}-${Date.now()}.${ext}`);
    }
})

const upload = multer({
    storage: storage
})

/**
 * Seuraava toiminto hoitaa käyttäjän kirjautumisen.
 */

/**
 * Tarkistetaan onko nimimerkki ja salasana kelvollisia.
 */


router.post("/api/login", urlencodedParser,
    [check('salasana').isLength({ min: 8 }).withMessage("Salasana täytyy olla vähintään 8 merkkiä pitkä!"),
        check('sahkoposti').isEmail().withMessage("Sähköpostiosoite ei ole kelvollinen!")],
    function (req, res) {

    let jsonObj = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                success: false,
                errors: errors.array()
            });
        }

        let sql = "SELECT * FROM kayttaja WHERE sahkoposti = ?";

    (async () => { // IIFE (Immediately Invoked Function Expression)
        try {

            console.log("sahkoposti:" + jsonObj.sahkoposti)

            const rows = await query(sql,[jsonObj.sahkoposti]);

                /**
                 * Tarkistetaan onko nimimerkki ja salasana kelvollisia.
                 */

                if (rows[0].sahkoposti != null && rows[0].salasana != null && rows.length != 0) {

                    /**
                     * Otetaan käyttäjän id tietokannasta
                     */

                    let insertedId = rows[0].kayttaja_id;

                    /**
                     * Tarkistetaan täsmääkö salasana ja jos täsmää, luodaan json token arvoineen.
                     */

                    const validPassword = await bcrypt.compare(jsonObj.salasana, rows[0].salasana);

                    if (validPassword) {

                        const tokenValue = jwt.sign({id: insertedId, user: req.body.sahkoposti}, config.secret, {
                            expiresIn: "1h"
                        });

                        /**
                         * Jos kaikki onnistui viedään token selaimeen ja käyttäjän tiedot.
                         */

                        res.status(202).json({
                            token: tokenValue,
                            user: req.body.sahkoposti
                        });

                    } else {
                        res.status(204).send()
                    }

                } else {

                    res.status(401).send('Tyhjät kentät!')
                }

        }
        catch (err) {
            console.log("Insertion into some (2) table was unsuccessful!" + err)
            res.status(400).send('kirjautuminen ei onnistunut!' + err)

        }
    })()


});

/**
 * Seuraava toiminto rekisteröi käyttäjän tietokantaan.
 */

router.post("/api/register", urlencodedParser,
    [check('salasana').isLength({ min: 8 }).withMessage("Salasana täytyy olla vähintään 8 merkkiä pitkä!"),
        check('sahkoposti').isEmail().normalizeEmail().withMessage("Sähköpostin muotoilu on väärin!"),
        check('salasana').custom((value,{req}) => {
            if (value !== req.body.salasana2) {
                throw new Error("Salasanat eivät täsmäää!")
            } else {
                return value
            }
    })

    ],
    function (req, res) {

    // tarkistetaan virheet
        let jsonObj = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                success: false,
                errors: errors.array()
            });
        }

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

});

/**
 * Seuraava toiminto tarkistaa onko käyttän json token kelvollinen. Selaimeen palautetaan käyttäjänimi ja aika.
 */

router.get("/api/check", VerifyToken, function (req, res) {

    res.json({
        value: req.userData
    });

});

/**
 * Seuraava toiminto hakee kaikki käyttäjät listaan joka on käyttäjälista sivulla.
 */

router.get("/api/search", VerifyToken, function (req, res) {


        let sql = "SELECT kayttaja.kayttaja_id, kaverilista.hyvaksytty, kayttaja.sahkoposti FROM kayttaja LEFT JOIN kaverilista ON (kayttaja.kayttaja_id = kaverilista.lahettaja_id AND kaverilista.vastaanottaja_id = ?) OR (kayttaja.kayttaja_id = kaverilista.vastaanottaja_id  AND kaverilista.lahettaja_id = ?) WHERE kayttaja.kayttaja_id != ? AND (kaverilista.hyvaksytty = ? OR kaverilista.hyvaksytty IS NULL) LIMIT ?";

        let sql2 = "SELECT kayttaja.kayttaja_id, kaverilista.hyvaksytty, kayttaja.sahkoposti FROM kayttaja LEFT JOIN kaverilista ON (kayttaja.kayttaja_id = kaverilista.lahettaja_id AND kaverilista.vastaanottaja_id = ?) OR (kayttaja.kayttaja_id = kaverilista.vastaanottaja_id  AND kaverilista.lahettaja_id = ?) WHERE kayttaja.kayttaja_id != ? AND (kaverilista.hyvaksytty = ? OR kaverilista.hyvaksytty IS NULL) AND kayttaja.sahkoposti LIKE ? LIMIT ?";

        let rows;

    (async () => {
        try {
            if (req.query.name == '') {
                rows = await query(sql,[req.userData.id, req.userData.id, req.userData.id, 0, 10]);
            } else {
                rows = await query(sql2,[req.userData.id, req.userData.id, req.userData.id, 0, '%' + req.query.name + '%', 10]);
            }

            res.status(200).json({
                success: true,
                message: 'Haku onnistui!',
                userdata: rows
            })

        } catch (err) {
                console.log("Database error!"+ err);
            }
        })()
});

/**
 * Seuraava toiminto käsittelee käyttäjän pyyntöjä
 */

router.post("/api/invites", urlencodedParser, VerifyToken,
    [check('vastaanottaja').custom((value,{req}) => {

        if (value == req.userData.id && value != null) {

            throw new Error("Tunnus ei ole kelvollinen!");
        } else {
            return value;
        }

    })],
    function (req, res) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                success: false,
                errors: errors.array()
            });
        }

        let jsonObj = req.body;

        let sql = "INSERT into kaverilista (vastaanottaja_id , lahettaja_id, hyvaksytty)"
            + " VALUES (?, ?, ?)";

        let sql2 = "SELECT * FROM kaverilista WHERE vastaanottaja_id = ? AND lahettaja_id = ?";

        (async () => { // IIFE (Immediately Invoked Function Expression)
            try {

                /**
                 * Tarkistetaan onko toinen käyttäjä hyväksynyt pyynnön jos ei niin tiedot lisätään kantaan.
                 */

                const result = await query(sql2,[jsonObj.vastaanottaja, req.userData.id]);


                if (result.length == 0) {

                    await query(sql, [jsonObj.vastaanottaja, req.userData.id, 0]);

                    res.status(201).json({
                        id: jsonObj.vastaanottaja
                    })
                }


                res.status(403).send("Kutsun lähettämisessä tapahtui virhe!")


            }
            catch (err) {
                console.log("Database error!"+ err);

            }
        })()


    });


/**
 * Seuraava toiminto hakee jokaisen käyttäjän kannasta ja selaimessa laittaa tiedot selaus listaan käyttäjälista sivulla.
 */
/*
router.get("/api/search/users", VerifyToken, function (req, res) {

    let arvo = req.query.filter;

    let sql;

    if (arvo == 1) {

        sql = "SELECT kayttaja.kayttaja_id, kayttaja.nimimerkki FROM kayttaja LEFT JOIN kaverilista ON (kayttaja.kayttaja_id = kaverilista.lahettaja_id  AND kaverilista.vastaanottaja_id = ?) OR (kayttaja.kayttaja_id = kaverilista.vastaanottaja_id  AND kaverilista.lahettaja_id = ?) WHERE kayttaja.kayttaja_id != ? AND kaverilista.kaveri_id IS NULL ORDER BY kayttaja.kayttaja_id DESC LIMIT ? OFFSET ?";

    } else if (arvo == 2) {

        sql = "SELECT kayttaja.kayttaja_id, kayttaja.nimimerkki FROM kayttaja LEFT JOIN kaverilista ON (kayttaja.kayttaja_id = kaverilista.lahettaja_id  AND kaverilista.vastaanottaja_id = ?) OR (kayttaja.kayttaja_id = kaverilista.vastaanottaja_id  AND kaverilista.lahettaja_id = ?) WHERE kayttaja.kayttaja_id != ? AND kaverilista.kaveri_id IS NULL ORDER BY kayttaja.kayttaja_id ASC LIMIT ? OFFSET ?";
    }


    let sql2 = "SELECT COUNT(*) AS count FROM kayttaja LEFT JOIN kaverilista ON (kayttaja.kayttaja_id = kaverilista.lahettaja_id  AND kaverilista.vastaanottaja_id = ?) OR (kayttaja.kayttaja_id = kaverilista.vastaanottaja_id  AND kaverilista.lahettaja_id = ?) WHERE kayttaja.kayttaja_id != ? AND kaverilista.kaveri_id IS NULL";


    (async () => {
        try {

            const rows = await query(sql,[req.userData.id, req.userData.id, req.userData.id, parseInt(req.query.page), parseInt(req.query.page) - 10]);

            const rows2 = await query(sql2,[req.userData.id, req.userData.id, req.userData.id]);

            return res.status(200).json({
                success: true,
                message: 'Haku onnistui!',
                userdata: rows,
                count: rows2
            })

        } catch (err) {
            console.log("Database error!"+ err);
        }
    })()
});
*/

/**
 * Seuraava toiminto käsittelee käyttäjän saapuneita kutsuja.
 */

router.get("/api/myInvites", VerifyToken, function (req, res) {

    /**
     * Hakee kannasta muiden käyttäjien kutsut jotka kohdistuvat tälle käyttäjälle.
     */

    let sql = "SELECT kaverilista.vastaanottaja_id, kayttaja.kayttaja_id, kayttaja.nimimerkki FROM kaverilista, kayttaja WHERE kaverilista.lahettaja_id = ? AND kaverilista.vastaanottaja_id = kayttaja.kayttaja_id AND kaverilista.hyvaksytty = ?";



    (async () => {
        try {

            const rows = await query(sql,[req.userData.id, 0]);

            return res.status(200).json({
                success: true,
                message: 'haku onnistui!',
                userdata: rows
            })

        } catch (err) {
            console.log("Database error!"+ err);
        }
    })()
});

/**
 * Seuraava toiminto poistaa lähetetyn kutsun.
 */

router.delete("/api/deleteInvite", VerifyToken, function (req, res) {

    let  sql = "DELETE FROM kaverilista WHERE vastaanottaja_id = ? AND lahettaja_id = ?";


    (async () => {
        try {

            const deleteObject = JSON.parse(req.headers['deleteobject'])

           const rows  = await query(sql,[deleteObject.vastaanottaja, req.userData.id]);


            if (rows) {

                res.status(201).send()

            } else {

                res.status(401).send()

            }

        } catch (err) {
            console.log("Database error!"+ err);
        }
    })()


});

/**
 * Seuraava toiminto poistaa saapuneen kutsun.
 */

router.delete("/api/deleteInvite2", VerifyToken, function (req, res) {

    let  sql = "DELETE FROM kaverilista WHERE vastaanottaja_id = ? AND lahettaja_id = ?";

    (async () => {
        try {

            const deleteObject = JSON.parse(req.headers['deleteobject'])

            const rows  = await query(sql,[req.userData.id, deleteObject.vastaanottaja]);

            if (rows) {

                res.status(200).send('poisto onnistui!')

            } else {

                res.status(401).send('poisto epäonnistui!')

            }

        } catch (err) {
            console.log("Database error!"+ err);
        }
    })()


});


/**
 * Seuraava toiminto käsittlee saapuneita kutsuja.
 */


router.get("/api/receiveInvites", VerifyToken, function (req, res) {



    let sql = "SELECT kayttaja.kayttaja_id, kaverilista.vastaanottaja_id, kaverilista.lahettaja_id, kayttaja.sahkoposti FROM kaverilista, kayttaja WHERE kaverilista.lahettaja_id = kayttaja.kayttaja_id AND kaverilista.vastaanottaja_id = ? AND kayttaja.kayttaja_id != ? AND kaverilista.hyvaksytty = ?";



    (async () => {
        try {

            const rows = await query(sql,[req.userData.id, req.userData.id, 0]);

            res.status(200).json({
                success: true,
                message: 'hakeminen onnistui!',
                userdata: rows
            })

        } catch (err) {
            console.log("Database error!"+ err);
        }
    })()
});

/**
 * Seuraava toiminto hyväksyy käyttäjän kutsun.
 */

router.put("/api/acceptInvite", urlencodedParser, VerifyToken, function (req, res) {


    let sql = "UPDATE kaverilista SET hyvaksytty = ? WHERE vastaanottaja_id = ? AND lahettaja_id = ?";

    /**
     * Poistetaan dublikaatiot varmuuden vuoksi.
     */

    let  sql2 = "DELETE FROM kaverilista WHERE vastaanottaja_id = ? AND lahettaja_id = ?";

    (async () => {
        try {

            await query(sql2,[req.body.tunnus, req.userData.id]);

            await query(sql,[1, req.userData.id, req.body.tunnus]);

                res.status(200).json({
                    success: true,
                    message: 'päivitys onnistui!',
                    id: req.body.tunnus
                })


        } catch (err) {
            console.log("Database error!"+ err);
        }
    })()


});

/*
 * Kuvan lisaaminen asetuksista.
 */

router.post("/api/addImage", upload.single('image'), VerifyToken, function (req, res) {

    if (!req.file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {

        res.status(400).send({ msg:'Only image files (jpg, jpeg, png) are allowed!'})

    } else {

        const image = req.file.filename

        let sql = "UPDATE kayttaja SET kuva = ? WHERE kayttaja_id = ?";

        (async () => {
            try {

                await query(sql,[image, req.userData.id]);

                res.status(200).send('Kuvan lisääminen onnistui!')

            } catch (err) {
                console.log("Ei voitu lisätä kuvaa: "+ err);
            }
        })()
    }


})


module.exports = router;