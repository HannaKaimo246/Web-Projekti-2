const Sockets = (io) => {

    /**
     * Sockets käytetään chatin realiaikaiseen viestimiseen ja kartassa markkerin realiaikaiseen päivittämiseen.
     */

    /**
     * Jos indeksi on negatiivinen niin tällöin kukaan ei ole paikalla.
     */

    let index = -1;

    let sockets = [];

    /**
     * Luodaan yhteys.
     */

    io.on("connection", socket => {

        /**
         * Seuraava toiminto alustaa oman käyttäjän online tilaan.
         */

        const id = socket.id ;

        socket.on('user-join', function(data) {

            console.log("user-join: " + data.id)

            socket.join(data.id);

            sockets[id] = data.id;

            io.emit('user-online', data.id);

        });


        /**
         * Seuraava toiminto lisää käyttäjän onlineen openchatissa.
         */

        socket.on('joined', (username) => {

            console.log("käyttäjä: " + username);

            index = index + 1;


            io.emit('joined', index);


        })

        /**
         * Seuraava toiminto lähettää kaikille selaimille tiedon että joku kirjoittaa openchatissa.
         */

        socket.on('typing', value => {

            io.emit('typing', value);

        });

        /**
         * Seuraava toiminto lähettää oman kaverin selaimelle tiedon että itse kirjoittaa privatechatissa.
         */

        socket.on('privateTyping', value => {

            let aula2 = parseInt(value.id2)

            let arvo = value.arvo

            let kayttaja = value.kayttaja

            const tulos = {
                arvo,
                kayttaja
            }

            /**
             * Tieto meenee kaverin aulaan.
             */

            socket.to(aula2).emit("privateTyping", tulos);

        });

        /**
         * Seuraava toiminto lähettää kaikille selaimille tiedon että joku on lähettänyt viestin openchatissa.
         */

        socket.on('msg', msg => {
            let message = {
                username: socket.username,
                msg: msg
            };



            socket.broadcast.emit('msg', message)

        });


        /**
         * Seuraava toiminto tehdään kun käyttäjä poistuu selaimesta.
         */

        socket.on("disconnect", () => {

            if (index >= 0) {

                index = index - 1;

                /**
                 * Poistuu openchatista
                 */

                io.emit('poistu', index);


            }

            /**
             * Poistuu privatechatista ja merkistee käyttäjään "offline".
             */

            io.emit('user-unjoin', sockets[id]);



        });


        /**
         * Privatechat liittyviä asioita.
         */

        /**
         * Seuraava toiminto lähettää kaverin selaimelle tiedon että, kaveri on lähettänyt viestin.
         */

        socket.on("sendPrivateMessage", function (data) {

          let aula = data.vastaanottaja_id;

       //   let aula2 = data.lahettaja_id;

            /**
             * Viedään tieto käyttäjän, kaverin aulaan ja lähetetään selaimelle.
             */

            socket.to(aula).emit("PrivateMessageReceived", data);

        })

        /**
         * Seuraava toiminto poistaa viestin privatechatista.
         */

        socket.on("deleteMessage", function (data) {

            let aula = data.vastaanottaja_id;

          //  let aula2 = data.lahettaja_id;

            /**
             * Viedään tieto käyttäjän, kaverin aulaan ja lähetetään selaimelle.
             */

            socket.to(aula).emit("deleteMessage", data);

        })


        /**
         * Luodaan huoneita
         */

        socket.on("joinRoom", function (data) {

            /**
             *  Tehdään kaksi huonetta kahden käyttäjän kommunikointiin.
             */

            let aula = data.vastaanottaja;

            let aula2 = data.lahettaja_id;

              socket.join(aula);

              socket.join(aula2);

        })

        /**
         * Karttaan liittyviä asioita.
         */

        /**
         * Asetetaan markkerit valituille kavereille.
         */

        socket.on("setMarkers", function (array) {

           array.tiedot.forEach(roomi =>  socket.join(roomi));

        })

        /**
         * Asetetaan oma markkeri valituille kavereille.
         */

        socket.on("myMarker", function (value) {

            socket.join(value);

        })

        /**
         * Seuraava toiminto lähettää valituille selaimille tiedon lisäämään markkeri muiden kartoille.
         */

        socket.on("showMarkers", function (array, coords) {

            let arvo = socket;

           array.tiedot.forEach(roomi => arvo.to(roomi).emit("showMarkers", coords));

        })

    });

}
module.exports = Sockets;