import React, {useEffect, useState} from "react";

import socketIOClient from "socket.io-client"
import PrivateChat from "../components/Chat/PrivateChat";
import axios from "axios";
import {useAuth} from "../contexts/AuthContext";

const PrivateChatPage = () => {

    const ENDPOINT = "http://localhost:8080"

    const [user, logout] = useAuth()

    const [messages, setMessages] = useState([])

    const [messages2, setMessages2] = useState([])

    const [users, setUsers] = useState([])

    const [id, setId] = useState([])

    const [sivut, setSivut] = useState(0)

    const [tokenArvo, setTokenArvo] = useState(false)

    const [nayta, setNayta] = useState(false)

    const [count, setCount] = useState(0)

    const [id2, setId2] = useState([])

    const [omaTunnus, setOmaTunnus] = useState(0)

    const [paikalla, setPaikalla] = useState([])

    const [typing, setTyping] = useState(false)

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

                        console.log("viesti poistettu: " + messages2.length);

                        for (const property in messages2) {
                            console.log(messages2[property].sisalto);

                            if (messages2[property].sisalto == data.sisalto) {

                                messages2.splice(property, 1);

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

                    if (response.status === 200) {

                        for (const property in users) {
                            console.log(users[property].vastaanottaja_id);

                            if (users[property].vastaanottaja_id == data.value) {

                                users.splice(property, 1)

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
                "id": omaTunnus
            });

            socket.emit("privateTyping", {
                "id": id,
                "id2": id2,
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

                        setUsers(data.value)

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

                        setMessages2(oldArray => [...oldArray,data.value] )

                        setSivut(sivut + 1)

                        setMessages([])

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

            setSivut(sivut + 10)

        } else {

            setSivut(0)

        }

        const tokenObject = localStorage.getItem('token')

        let token = JSON.parse(tokenObject).token;

        if (token == null)
            return false

        try {

            await axios
                .get(`http://localhost:8080/api/userDetail?id=${value}&page=${sivut}&filter=${lajittele}`,
                    {headers: {Authorization: 'Bearer: ' + token}}
                )
                .then(async response => {

                    const data = await response.json();

                    if (response.status === 201) {

                        if (!lataa) {

                            setMessages2([])

                            setMessages(data.userdata)

                            let arr = messages2.concat(messages);

                            setMessages2(arr)

                            messages2.reverse();

                            messages.reverse();

                            setId(data.id)

                            setId2(data.id2)

                        } else if (data.userdata.length >= 1) {

                            data.userdata.forEach(element => messages2.unshift(element));

                        }

                        if (data.userdata.length < 10) {

                            setNayta(false)

                        } else {

                            setNayta(true)

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

        try {

            await axios
                .get(`http://localhost:8080/api/searchFriends?search=${value}`,
                    {headers: {Authorization: 'Bearer: ' + token}}
                )
                .then(async response => {

                    const data = await response.json();

                    if (response.status === 200) {

                        setUsers(data.userdata)

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

            console.log("Lahetys: " + id2 + " ja " + data.vastaanottaja_id);

            if (id2 == data.vastaanottaja_id || id2 == data.lahettaja_id) {

                setMessages2(oldArray => [...oldArray,data] )

                setSivut(sivut + 1)

                setMessages([])

            }
        })

        // poistetaan viesti

        socket.on("deleteMessage", (data) => {

            console.log("sisalto: " + JSON.stringify(data));

            for (const property in messages2) {

                if (messages2[property].sisalto == data.sisalto) {

                    messages2.splice(property, 1);

                }

            }

        })

        /**
         * Kuunellaan että onko joku käyttäjä paikalla.
         */

        socket.on('user-online', (data) => {

            console.log("tieto id: " + JSON.stringify(data));

            if (omaTunnus != data && !paikalla.includes(data)) {

                setPaikalla(oldArray => [...oldArray,data] )
            }

        });

        /**
         * Kuunellaan jos kaverisi kirjoittaa.
         */

        socket.on('privateTyping', (value) => {

            if (value) {
                setTyping(true)
            } else {
                setTyping(false)
            }

        });

        /**
         * Kuunnellaan jos paikalla oleva käyttäjä menee offlineen.
         */

        socket.on('user-unjoin', (data) => {

            let index = paikalla.indexOf(data);

            paikalla.splice(index,1);

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

                setTokenArvo(true)

                await axios
                    .get(`http://localhost:8080/api/users?page=${0}`,
                        {headers: {Authorization: 'Bearer: ' + token}}
                    )
                    .then(async response => {

                        const data = await response.json();

                        if (response.status === 200) {

                            setUsers(data.value)

                            setOmaTunnus(data.id)

                            let luku = (data.count[0].count / 8)

                            if (luku > 0) {

                                setCount(Math.ceil(luku))

                            } else {
                                setCount(1)
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