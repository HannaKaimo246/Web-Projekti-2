import React, {useEffect} from "react"

import { GoogleOutlined, FacebookOutlined } from '@ant-design/icons'

import firebase from "firebase/app"

import { auth } from "../../firebase"
import {useAuth} from "../../contexts/AuthContext";
import axios from "axios";
import {useHistory} from "react-router-dom";

const LoginList = () => {

    const { user } = useAuth()

    const history = useHistory()

    useEffect(() => {

        if (user == null)
            return false

        const userObject = {
            sahkoposti: user.email,
            salasana: user.uid
        }

        axios
            .post('http://localhost:8080/api/checkUserFirebase', userObject,
                {headers: {Authorization: 'Bearer ' + localStorage.getItem('firebaseToken')}}
            ).then(response => {

            if (response.status === 202) {

                console.log("firebase tarkistus23: " + JSON.stringify(response.data))

                localStorage.setItem('token', JSON.stringify(response.data))

                localStorage.removeItem('firebaseToken')

                history.push("/")

            }

        }).catch(function (error) {
            console.log(error)
        });


        console.log("just:" + user)

    },[user])


    return (
        <div id='login-page'>
            <div id='login-card'>
                <h2>Kirjautumis vaihtoehdot</h2>
                <div
                    className='login-button google'
                    onClick={() => auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider())}
                >
                    <GoogleOutlined /> Kirjaudu Google-tilillä
                </div>

                <br/><br/>

                <div
                    className='login-button facebook'
                    onClick={() => auth.signInWithRedirect(new firebase.auth.FacebookAuthProvider()) }
                >
                    <FacebookOutlined /> Kirjaudu Facebook-tilillä
                </div>
            </div>
        </div>
    )
}

export default LoginList