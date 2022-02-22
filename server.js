const express = require('express');
const http = require('http');

/**
 * Server.js tiedostossa kokontuu projektin kaikki nodeJS tiedostot yhteen.
 */

const app = express();
const server = http.createServer(app);
app.set("trust proxy", 1);

const privateChat = require('./routes/privatechat');

app.use(privateChat);

const kayttaja = require('./routes/user');

app.use(kayttaja);

//const settings = require('./routes/settings');

//app.use(settings);

//const map = require('./routes/map');

//app.use(map);

const path = require('path');

const cors = require('cors');
app.use(cors());

app.use(express.static(path.join(__dirname,'./public')));

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

require('./routes/sockets')(io);

server.listen(8080, () => {

    let host = server.address().address
    let port = server.address().port

    console.log("Chat app listening at http://%s:%s", host, port)
});
