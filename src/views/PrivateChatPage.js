import React, {useEffect} from "react";

import socketIOClient from "socket.io-client"

const ENDPOINT = "http://localhost:8080"

import PrivateChat from "../components/Chat/PrivateChat";
import axios from "axios";
import {useAuth} from "../contexts/AuthContext";

const PrivateChatPage = () => {

     const [user, logout] = useAuth()

    const optionList = [
        {
            value: "uusin"
        },
        {
            value: "vanhin"
        }
    ]

    // Viestin poistaminen

    const poistaViesti = async (id, sisalto) => {

        const tokenObject = localStorage.getItem('token')

        let token = JSON.parse(tokenObject).token;

        if (token == null)
            return false

        const messageObject = {
            tunnus: id,
            viesti: sisalto
        }

        try {

            await axios
                .delete('http://localhost:8080/api/deleteUserMessage', messageObject,
                    {headers: {Authorization: 'Bearer: ' + token}}
                )
                .then(async response => {

                    const data = await response.json();

                    if (response.status === 202) {

                        console.log("viesti poistettu: " + this.messages2.length);

                        for (const property in this.messages2) {
                            console.log(this.messages2[property].sisalto);

                            if (this.messages2[property].sisalto == data.sisalto) {

                                this.messages2.splice(property, 1);

                            }

                        }

                        useEffect(() => {
                            const socket = socketIOClient(ENDPOINT)
                            socket.emit("deleteMessage", {
                                "sisalto": data.sisalto,
                                "vastaanottaja_id": data.tunnus,
                                "lahettaja_id": data.oma
                            });
                        }, [])

                    } else {

                        console.log("ei ok")
                        return Promise.reject(response.statusText);

                    }

                }).catch(function (error) {
                    console.log("Virhe: " + error)
                });

        } catch (error) {
            console.log(error);
        }
    }


    // Poistetaan kayttaja

    const poistaKayttaja = async (id) => {

        const tokenObject = localStorage.getItem('token')

        let token = JSON.parse(tokenObject).token;

        if (token == null)
            return false

        const userObject = {
            tunnus: id
        }

        try {

            await axios
                .delete('http://localhost:8080/api/deleteUser', userObject,
                    {headers: {Authorization: 'Bearer: ' + token}}
                )
                .then(async response => {

                    const data = await response.json();

                    if (response.status === 202) {

                        for (const property in this.users) {
                            console.log(this.users[property].vastaanottaja_id);

                            if (this.users[property].vastaanottaja_id == data.value) {

                                this.users.splice(property, 1)

                            }

                        }

                    } else {

                        console.log("ei ok")
                        return Promise.reject(response.statusText);

                    }

                }).catch(function (error) {
                    console.log("Virhe: " + error)
                });

        } catch (error) {
            console.log(error);
        }
    }

    // Oman viestin kirjoittamista kaverille (Socket)

    const omaViesti = (value) => {

        useEffect(() => {
            const socket = socketIOClient(ENDPOINT)

            socket.emit("user-join", {
                "id": this.omaTunnus
            });

            socket.emit("privateTyping", {
                "id": this.id,
                "id2": this.id2,
                "arvo": value
            });

        }, [])

    }

    // Kaverilistan selaamista

    const selaa = async (value) => {

        const tokenObject = localStorage.getItem('token')

        let token = JSON.parse(tokenObject).token;

        if (token == null)
            return false

        const userObject = {
            tunnus: id
        }

        try {

            await axios
                .get(`http://localhost:8080/api/users?page=${value}`,
                    {headers: {Authorization: 'Bearer: ' + token}}
                )
                .then(async response => {

                    const data = await response.json();

                    if (response.status === 200) {

                        this.users = data.value;

                    } else {

                        console.log("ei ok")
                        return Promise.reject(response.statusText);

                    }

                }).catch(function (error) {
                    console.log("Virhe: " + error)
                });

        } catch (error) {
            console.log(error);
        }
    }

    // Viestin luominen

    const sendMessage = async (viesti, vastaanottaja) => {

        const tokenObject = localStorage.getItem('token')

        let token = JSON.parse(tokenObject).token;

        if (token == null)
            return false

        const messageObject = {
            viesti: viesti,
            vastaanottaja_id: vastaanottaja
        }

        try {

            await axios
                .post('http://localhost:8080/api/postMessage', messageObject,
                    {headers: {Authorization: 'Bearer: ' + token}}
                )
                .then(async response => {

                    const data = await response.json();

                    if (response.status === 201) {

                        this.messages2.push(data.value)

                        this.sivut = this.sivut + 1

                        this.messages = [];


                        // lähetetään tiedot vastaanottajalle

                        useEffect(() => {
                            const socket = socketIOClient(ENDPOINT);

                            socket.emit("sendPrivateMessage", {
                                "lahettaja_id": data.value.lahettaja_id,
                                "vastaanottaja_id": data.value.vastaanottaja_id,
                                "sisalto": data.value.sisalto,
                                "paivamaara": data.value.paivamaara,
                                "nimimerkki": data.value.nimimerkki
                            });

                        }, [])


                    } else {

                        console.log("ei ok")
                        return Promise.reject(response.statusText);

                    }

                }).catch(function (error) {
                    console.log("Virhe: " + error)
                });

        } catch (error) {
            console.log(error);
        }
    }

    // Haetaan kaveri

    const haeKaveri = async (value, lataa, lajittele) => {

        if (lataa) {

            this.sivut = this.sivut + 10;

        } else {

            this.sivut = 0;

        }

        const tokenObject = localStorage.getItem('token')

        let token = JSON.parse(tokenObject).token;

        if (token == null)
            return false

        const messageObject = {
            viesti: viesti,
            vastaanottaja_id: vastaanottaja
        }

        try {

            await axios
                .get(`http://localhost:8080/api/userDetail?id=${value}&page=${this.sivut}&filter=${lajittele}`,
                    {headers: {Authorization: 'Bearer: ' + token}}
                )
                .then(async response => {

                    const data = await response.json();

                    if (response.status === 201) {

                        if (!lataa) {

                            this.messages2 = [];

                            this.messages = data.userdata;

                            let arr = this.messages2.concat(this.messages);

                            this.messages2 = arr;

                            this.messages2.reverse();

                            this.messages.reverse();

                            this.id = data.id;

                            this.id2 = data.id2;

                        } else if (data.userdata.length >= 1) {

                            data.userdata.forEach(element => this.messages2.unshift(element));

                        }

                        if (data.userdata.length < 10) {

                            this.nayta = false;

                        } else {

                            this.nayta = true;

                        }

                        // Liitytään roomiin
                        if (data.id != '' && data.id2 != '') {

                            useEffect(() => {

                                const socket = socketIOClient(ENDPOINT);

                                socket.emit("joinRoom", {
                                    "lahettaja_id": data.id,
                                    "vastaanottaja_id": data.id2
                                });

                            }, []);

                        }

                        /**
                         * Tieto palvelimeen että oma käyttäjä on liittynyt privatechattiin.
                         */

                        useEffect(() => {

                            const socket = socketIOClient(ENDPOINT)

                            socket.emit("user-join", {
                                "id": data.id
                            });

                        }, [])

                    } else {

                        console.log("ei ok")
                        return Promise.reject(response.statusText);

                    }

                }).catch(function (error) {
                    console.log("Virhe: " + error)
                });

        } catch (error) {
            console.log(error);
        }
    }

    // Haetaan listalta kayttajat

    const haeLista = async (value) => {

        /**
         * Haetaan kavereita listalta.
         */

        const tokenObject = localStorage.getItem('token')

        let token = JSON.parse(tokenObject).token;

        if (token == null)
            return false

        const messageObject = {
            viesti: viesti,
            vastaanottaja_id: vastaanottaja
        }

        try {

            await axios
                .get(`http://localhost:3000/api/searchFriends?search=${value}`,
                    {headers: {Authorization: 'Bearer: ' + token}}
                )
                .then(async response => {

                    const data = await response.json();

                    if (response.status === 200) {

                        this.users = data.userdata;

                    } else {

                        console.log("ei ok")
                        return Promise.reject(response.statusText);

                    }

                }).catch(function (error) {
                    console.log("Virhe: " + error)
                });

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {

        const socket = socketIOClient(ENDPOINT)

        socket.on("PrivateMessageReceived", (data) => {

            console.log("lähetys: " + arvo.id2 + " ja " + data.vastaanottaja_id);

            if (arvo.id2 == data.vastaanottaja_id || arvo.id2 == data.lahettaja_id) {

                arvo.messages2.push(data);

                arvo.sivut = arvo.sivut + 1;

                arvo.messages = [];

            }
        })

        // poistetaan viesti

        socket.on("deleteMessage", (data) => {

            console.log("sisalto: " + JSON.stringify(data));

            for (const property in arvo.messages2) {


                if (arvo.messages2[property].sisalto == data.sisalto) {

                    arvo.messages2.splice(property, 1);

                }

            }

        })

        /**
         * Kuunellaan että onko joku käyttäjä paikalla.
         */

        socket.on('user-online', (data) => {
            // update status of data.user_id according to your need.
            console.log("tieto id: " + JSON.stringify(data));

            if (arvo.omaTunnus != data && !arvo.paikalla.includes(data)) {
                arvo.paikalla.push(data);
            }

        });

        /**
         * Kuunellaan jos kaverisi kirjoittaa.
         */

        socket.on('privateTyping', (value) => {

            if (value) {
                arvo.typing = true;
            } else {
                arvo.typing = false;
            }

        });

        /**
         * Kuunnellaan jos paikalla oleva käyttäjä menee offlineen.
         */

        socket.on('user-unjoin', (data) => {

            let index = arvo.paikalla.indexOf(data);

            arvo.paikalla.splice(index,1);

        });

    }, [])

    useEffect(() => {

        const socket = socketIOClient(ENDPOINT)

        (async () => { // IIFE (Immediately Invoked Function Expression)

            /**
             * Haetaan kavereita listalta.
             */

            const tokenObject = localStorage.getItem('token')

            let token = JSON.parse(tokenObject).token;

            if (token == null)
                return false

            try {

                this.tokenArvo = true;

                await axios
                    .get(`http://localhost:3000/api/users?page=${0}`,
                        {headers: {Authorization: 'Bearer: ' + token}}
                    )
                    .then(async response => {

                        const data = await response.json();

                        if (response.status === 200) {

                            this.users = data.value;

                            this.omaTunnus = data.id;

                            let luku = (data.count[0].count / 8);

                            if (luku > 0) {

                                this.count = Math.ceil(luku);

                            } else {
                                this.count = 1;
                            }

                            socket.emit("user-join", {
                                "id": data.id
                            });

                    } else {

                            console.log("ei ok")
                            return Promise.reject(response.statusText);

                        }

                    }).catch(function (error) {
                        console.log("Virhe: " + error)
                    });

            } catch (error) {
                console.log(error);
            }

        })()

    }, [])


    return (
        <div id="chat">
            {user && tokenArvo == true &&
                <header>
                    <h1>PrivateChat</h1>
                    <h3>Tervetuloa, {user}</h3>
                </header>
            }

            {user && tokenArvo == true &&

                <PrivateChat
                    poistaViesti={poistaViesti}
                    poistaKayttaja={poistaKayttaja}
                    omaViesti={omaViesti}
                    typing={typing}
                    paikalla={paikalla}
                    count={count}
                    selaa={selaa}
                    haeLista={haeLista}
                    nayta={nayta}
                    messages={messages}
                    messages2={messages2}
                    id={id}
                    sendMessage={sendMessage}
                    haeKaveri={haeKaveri}
                    users={users}
                    selectList={optionList}
                />

            }
        </div>
    )
}

export default PrivateChatPage