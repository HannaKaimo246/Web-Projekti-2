const mysql = require('mysql');

/**
 * Luodaan tietokanta yhteys ja tarkistetaan että tietokanta yhteys onnistui.
 */

const conn = mysql.createConnection({
    host: 'mysql.metropolia.fi',
    user: 'ariten',
    password: 'talo123',
    database: 'ariten'
});

conn.connect(function(err) {
    if (err) throw err;
    console.log("Connected to MySQL!");
});

const util = require('util'); // for async calls
// node native promisify
const query = util.promisify(conn.query).bind(conn); // is bind needed?

module.exports = query;