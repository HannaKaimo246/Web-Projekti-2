const mysql = require('mysql');

/**
 * Luodaan tietokanta yhteys ja tarkistetaan onko tietokanta yhteys onnistunut.
 */

const conn = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "chatti_db"
});

conn.connect(function(err) {
    if (err) throw err;
    console.log("Connected to MySQL!");
});

const util = require('util'); // for async calls
// node native promisify
const query = util.promisify(conn.query).bind(conn); // is bind needed?

module.exports = query;