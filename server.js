const express = require('express');
const http = require('http');
const serveStatic = require("serve-static");
const path = require('path');
const cors = require('cors');
/**
 * Server.js tiedostossa kokontuu projektin kaikki nodeJS tiedostot yhteen.
 */

const app = express();
const server = http.createServer(app);
app.set("trust proxy", 1);

app.use('/', serveStatic(path.join(__dirname, '/dist')));

const privateChat = require('./routes/chat');

app.use(privateChat);

const kayttaja = require('./routes/user');

app.use(kayttaja);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

const firebase = require('./routes/firebaseuser');

app.use(firebase);

const settings = require('./routes/settings');

app.use(settings);

const map = require('./routes/map');

app.use(map);


app.use(cors());

app.use(express.static(path.join(__dirname,'./public')));

app.use('/uploads', express.static(path.resolve(__dirname, './uploads')));

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

require('./routes/sockets')(io);

server.listen(process.env.PORT || 8080, () => {

    let host = server.address().address
    let port = server.address().port

    console.log("Chat app listening at http://%s:%s", host, port)
});

