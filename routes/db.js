const mysql = require('mysql');

/**
 * Luodaan tietokanta yhteys ja tarkistetaan onko tietokanta yhteys onnistunut.
 */

const conn = mysql.createConnection({
    host: 'byosoe21zqmlnw17quml-mysql.services.clever-cloud.com',
    user: 'uqxs8s8ocmowhye8',
    password: 'yitEuGYWBQ21Z0vMbjfO',
    database: 'byosoe21zqmlnw17quml'
});

conn.connect(function(err) {
    if (err) throw err;
    console.log("Connected to MySQL!");
});

const util = require('util'); // for async calls
// node native promisify
const query = util.promisify(conn.query).bind(conn); // is bind needed?

module.exports = query;