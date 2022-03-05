import React, {useEffect, useRef, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import {useAuth} from "../../contexts/AuthContext";
import {auth} from "firebase";
import '../../styles/NavBar.scss'
import { useMediaQuery } from 'react-responsive';
import axios from "axios";
import socketIOClient from "socket.io-client";

const NavBar = () => {

    const ENDPOINT = "http://localhost:8080"

    const socket = socketIOClient(ENDPOINT)

    const { user, logout} = useAuth()

    const history = useHistory()

    const navRef = useRef(null)

    const isMobile = useMediaQuery({ query: `(max-width: 900px)` })

    const [ilmoitus, setIlmoitus] = useState(0)

    const handleLogout = async () => {
        try {
            await logout()
            history.push("/api/user/login")
        } catch (error) {
            console.log("Ei voitu kirjautua ulos!")
        }

    }

    const handleLogo = () => {

        if (isMobile) {

            const nav = navRef.current.classList
            nav.contains('active') ? nav.remove('active') : nav.add('active')

        } else {
            history.push("/")
        }

    }

    useEffect(() => {

        const tokenObject = localStorage.getItem('token')

        if (tokenObject == null)
            return logout()

        let token = JSON.parse(tokenObject).token

        axios
            .get('http://localhost:8080/api/check',
                {headers: {Authorization: 'Bearer: ' + token}}
            ).then(response => {

                console.log("asetetaan id: " + response.data.value.id)

            socket.emit("user-join", {
                "id": response.data.value.id
            });

        })

        console.log('effect')
        axios
            .get('http://localhost:8080/api/receiveInvites',
                {headers: {Authorization: 'Bearer: ' + token}}
            ).then(response => {
            console.log('Käyttäjien ilmoittaminen onnistui!' + JSON.stringify(response.data))

            if (response.status === 200) {
                setIlmoitus(response.data.userdata.length)
            } else {
                history.push("api/user/login")
            }

        })

    }, [])


    /*
    *  socket
     */

    useEffect(() => {

        socket.on("addNotifications", (value) => {

                setIlmoitus(ilmoitus + 1)

        })

        socket.on("removeNotifications", (value) => {

            console.log("tuliko? " + value)

            if (ilmoitus <= 0) {
                setIlmoitus(0)
            } else {
                setIlmoitus(ilmoitus - 1)
            }



        })

    },[])

    return (
        <div id="sliderbar">
            <nav>
                <ul ref={navRef}>
                    <figure className="image-logo">
                        <img onClick={handleLogo} src={require("../../assets/logo.png")} height="50px" width="50px" alt="logo" />
                    </figure>
                    <li>
                        <Link className="navstyles" to="/">Etusivu<i className="ion-ios-home" /></Link>
                    </li>
                    {user &&
                        <li>
                            <Link className="navstyles" to="/api/privatechat">Chat<i
                                className="ion-md-chatbubbles"/></Link>
                        </li>
                    }
                    {!user &&
                        <li>
                            <Link className="navstyles" to="/api/openchat">Chat<i
                                className="ion-md-chatbubbles"/></Link>
                        </li>
                    }
                    <li>
                        <Link className="navstyles" to="/api/map">Kartta<i className="ion-ios-map" /></Link>
                    </li>
                    {user &&
                        <li>
                            <Link className="navstyles" to="/api/settings">Asetukset<i className="ion-ios-settings" /></Link>
                        </li>
                    }
                    {user &&
                        <li>
                            <Link className="navstyles" to="/api/invites">Kutsut ({ilmoitus})<i className="ion-ios-notifications" /></Link>
                        </li>
                    }
                    {user
                        ?   <div className="user">
                            <p>{user.email}</p>
                            <Link to="/"><button type="button" onClick={handleLogout}>Kirjaudu-ulos</button></Link>
                        </div>
                        :    <div className="user">
                            <Link to="/api/user/login"><button type="button">Kirjaudu sisään</button></Link>
                            <Link to="/api/user/register"><button type="button">Rekisteröidy</button></Link>
                        </div>
                    }
                </ul>
            </nav>
        </div>
    )

}

export default NavBar