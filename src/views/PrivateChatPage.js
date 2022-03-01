import React, {useEffect, useState} from "react";

import socketIOClient from "socket.io-client"
import PrivateChat from "../components/Chat/PrivateChat";
import axios from "axios";
import {useAuth} from "../contexts/AuthContext";
import '../styles/PrivateChatPage.scss'

const PrivateChatPage = () => {

    const ENDPOINT = "http://localhost:8080"

    const socket = socketIOClient(ENDPOINT)

    const {user} = useAuth()

    const [messages, setMessages] = useState([])

    const [messages2, setMessages2] = useState([])

    const [users, setUsers] = useState([])

    const [id, setId] = useState([])

    const [sivut, setSivut] = useState(0)

    const [tokenArvo, setTokenArvo] = useState(false)

    const [nayta, setNayta] = useState(false)

    const [count, setCount] = useState(0)

    const [id2, setId2] = useState([])

    const [paikalla, setPaikalla] = useState([])

    const [typing, setTyping] = useState(false)

    const [loading, setLoading] = useState(false)

    const [filter, setFilter] = useState('')

    const [lataa, setLataa] = useState(false)

    const [UsersTyping, setUsersTyping] = useState([])

    const [poistettavaViesti, setPoistettavaViesti] = useState([])

    // Viestin poistaminen

    const poistaViesti = async (id, sisalto) => {

        const tokenObject = localStorage.getItem('token')

        if (tokenObject == null)
            return false

        let token = JSON.parse(tokenObject).token;


        const userObject = {
            tunnus: id,
            viesti: sisalto
        }

        axios
            .delete('http://localhost:8080/api/deleteUserMessage',
                {headers: {Authorization: 'Bearer: ' + token, deleteobject: JSON.stringify(userObject)}}
            )
            .then(async response => {

                const data = await response.data

                if (response.status === 200) {

                    console.log("viesti poistettu: " + messages2.length);

                    let arr = [...messages2]

                    for (const property in arr) {

                        if (arr[property].sisalto == data.sisalto) {

                            arr.splice(property, 1);

                            setMessages2(arr)

                        }

                    }

                    socket.emit("deleteMessage", {
                        "sisalto": data.sisalto,
                        "vastaanottaja_id": data.tunnus
                    });


                } else {

                    console.log("ei ok")
                    return Promise.reject(response.statusText);

                }

            }).catch(function (error) {
            console.log("tokenni: " + token)
            console.log("Virhe: " + error)
        });

    }


    // Poistetaan kayttaja

    const poistaKayttaja = async (id) => {

        const tokenObject = localStorage.getItem('token')

        if (tokenObject == null)
            return false

        let token = JSON.parse(tokenObject).token;

        const userObject = {
            tunnus: id
        }

        axios.delete('http://localhost:8080/api/deleteUser', {
                headers: {
                    Authorization: 'Bearer: ' + token,
                    deleteobject: JSON.stringify(userObject)
                }
            }
        ).then(response => {

            const data = response.data

            if (response.status === 200) {

                let arr = [...users]

                for (const property in arr) {

                    if (arr[property].kayttaja_id === data.value) {

                        arr.splice(property, 1)

                        setUsers(arr)

                    }

                }

            } else {

                console.log("ei ok")
                return Promise.reject(response.statusText);

            }

        }).catch(function (error) {
            console.log("Virhe: " + error)
        });


    }

    // Oman viestin kirjoittamista kaverille (Socket)

    const omaViesti = (value) => {

        if (!id2)
            return false

        socket.emit("privateTyping", {
            "id2": id2,
            "arvo": value,
            "kayttaja": user.email
        });


    }

    // Kaverilistan selaamista

    const selaa = async (value) => {

        const tokenObject = localStorage.getItem('token')

        if (tokenObject == null)
            return false

        let token = JSON.parse(tokenObject).token


        try {

            await axios
                .get(`http://localhost:8080/api/users?page=${value}`,
                    {headers: {Authorization: 'Bearer: ' + token}}
                )
                .then(async response => {

                    const data = await response.data

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

        if (tokenObject == null)
            return false

        let token = JSON.parse(tokenObject).token;

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

                    const data = await response.data

                    if (response.status === 201) {

                        setMessages2(oldArray => [...oldArray, data.value])

                        setSivut(sivut + 1)

                        setMessages([])

                        // lähetetään tiedot vastaanottajalle

                        socket.emit("sendPrivateMessage", {
                            "lahettaja_id": data.value.lahettaja_id,
                            "vastaanottaja_id": data.value.vastaanottaja_id,
                            "sisalto": data.value.sisalto,
                            "paivamaara": data.value.paivamaara,
                            "sahkoposti": data.value.sahkoposti
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
    }

    // Haetaan kaveri

    const haeKaveri = async (value, lataa, lajittele) => {

        console.log("heataan....")

        setFilter(lajittele)
        setLataa(lataa)
        setId2(value)

        if (lataa) {
            setSivut(sivut + 10)

        } else {
            setSivut(0)

        }

        if (id == null || id == '')
            return
        /**
         * Tieto palvelimeen että oma käyttäjä on liittynyt privatechattiin.
         */
        socket.emit("user-join", {
            "id": id
        });

    }


    useEffect(() => {

        console.log("heataan2...")

        const tokenObject = localStorage.getItem('token')

        if (tokenObject == null || filter == '' || id2 == '')
            return false

        let token = JSON.parse(tokenObject).token;

        try {

            axios
                .get(`http://localhost:8080/api/userDetail?id=${id2}&page=${sivut}&filter=${filter}`,
                    {headers: {Authorization: 'Bearer: ' + token}}
                )
                .then(response => {

                    const data = response.data

                    if (response.status === 201) {

                        if (!lataa) {

                            console.log("ei lataa...")

                            setMessages2([])

                            const arr = data.userdata

                            const reversed = arr.reverse()

                            setMessages(reversed)

                            setMessages2(reversed)

                            setId2(data.id2)

                        } else if (data.userdata.length >= 1) {

                            data.userdata.forEach(element => messages2.unshift(element))

                        }

                        if (data.userdata.length < 10) {

                            setNayta(false)

                        } else {

                            setNayta(true)

                        }

                        // Liitytään roomiin
                        if (data.id != '' && data.id2 != '') {

                            socket.emit("joinRoom", {
                                "lahettaja_id": data.id,
                                "vastaanottaja_id": data.id2
                            });

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


    }, [lataa, id2])

    // Haetaan listalta kayttajat

    const haeLista = async (value) => {

        /**
         * Haetaan kavereita listalta.
         */

        const tokenObject = localStorage.getItem('token')

        if (tokenObject == null)
            return false

        let token = JSON.parse(tokenObject).token;



        try {

            await axios
                .get(`http://localhost:8080/api/searchFriends?search=${value}`,
                    {headers: {Authorization: 'Bearer: ' + token}}
                )
                .then(async response => {

                    const data = await response.data

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

    /*
     * Socket
     */

    useEffect(() => {

        let arr = [...messages2]

        for (const property in arr) {

            if (arr[property].sisalto == poistettavaViesti.sisalto) {

                arr.splice(property, 1);

                setMessages2(arr)

            }

        }


    }, [poistettavaViesti])


    useEffect(() => {

        socket.on("PrivateMessageReceived", (data) => {

            setMessages2(oldArray => [...oldArray, data])

            setSivut(sivut + 1)

            setMessages([])

        })

        /*
         * poistetaan viesti
        */

        socket.on("deleteMessage", (data) => {

            setPoistettavaViesti(data)

        })


        /**
         * Kuunellaan että onko joku käyttäjä paikalla.
         */


        socket.on('user-online', (data) => {

            console.log("tieto id: " + JSON.stringify(data));

            if (id != data && !paikalla.includes(data)) {

                setPaikalla(oldArray => [...oldArray, data])
            }

        });

        /**
         * Kuunellaan jos kaverisi kirjoittaa.
         */

        socket.on('privateTyping', (value) => {

            if (value.arvo) {
                setTyping(true)
                setUsersTyping(oldArray => [...oldArray, value.kayttaja])
            } else {
                setTyping(false)
                setUsersTyping([])
            }

        });

        /**
         * Kuunnellaan jos paikalla oleva käyttäjä menee offlineen.
         */

        socket.on('user-unjoin', (data) => {

            if (data) {

                let arr = [...paikalla]

                let index = arr.indexOf(data)

                arr.splice(index, 1)

                setPaikalla(arr)

            }

        });

    }, [])

    useEffect(() => {
        (async () => { // IIFE (Immediately Invoked Function Expression)

            /**
             * Haetaan kavereita listalta.
             */

            const tokenObject = localStorage.getItem('token')

            if (tokenObject == null)
                return false

            let token = JSON.parse(tokenObject).token;


            try {

                setTokenArvo(true)

                await axios
                    .get(`http://localhost:8080/api/users?page=${0}`,
                        {headers: {Authorization: 'Bearer: ' + token}}
                    )
                    .then(response => {

                        const data = response.data

                        if (response.status === 200) {

                            setUsers(data.value);

                            setId(data.id)

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

                setLoading(true)

            } catch (error) {
                console.log(error);
            }

        })()
    }, [])

    return (
        <div id="chat">

            <header>
                <h1>PrivateChat</h1>
                <h3>Tervetuloa, {user.email}</h3>
            </header>


            {user && tokenArvo == true && loading &&

                <PrivateChat
                    poistaViesti={poistaViesti}
                    poistaKayttaja={poistaKayttaja}
                    viesti={omaViesti}
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
                    usersTyping={UsersTyping}
                />

            }

        </div>
    )
}

export default PrivateChatPage