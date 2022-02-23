import React, {useRef, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import {useAuth} from "../../contexts/AuthContext";
import {auth} from "firebase";
import '../../styles/NavBar.scss'
import { useMediaQuery } from 'react-responsive';

const NavBar = () => {

    const { user, logout} = useAuth()

    const history = useHistory()

    const navRef = useRef(null)

    const isMobile = useMediaQuery({ query: `(max-width: 900px)` })

    const handleLogout = async () => {
        try {
            await logout()
            history.push("/login")
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
                            <Link className="navstyles" to="/api/privatechat">Private Chat<i
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