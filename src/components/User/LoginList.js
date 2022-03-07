import React, {useEffect, useState} from "react"

import { GoogleOutlined, FacebookOutlined, TwitterOutlined, GithubOutlined } from '@ant-design/icons'

import firebase from "firebase/app"

import { auth } from "../../firebase"
import {useAuth} from "../../contexts/AuthContext";
import axios from "axios";
import {Link, useHistory} from "react-router-dom";
import {Alert} from "react-bootstrap";

const LoginList = () => {

    const { user, logout } = useAuth()

    const [error, setError] = useState('')

    const [loading, setLoading] = useState(false)

    const history = useHistory()

    useEffect(() => {

        if (user == null)
            return false

        const userObject = {
            sahkoposti: user.email,
            salasana: user.uid
        }

        console.log("userobject:" + JSON.stringify(user.email))

        setLoading(true)

        axios
            .post('https://ariten.herokuapp.com/api/checkUserFirebase', userObject,
                {headers: {Authorization: 'Bearer ' + localStorage.getItem('firebaseToken')}}
            ).then(response => {

            if (response.status === 202) {

                console.log("firebase tarkistus23: " + JSON.stringify(response.data))

                localStorage.setItem('token', JSON.stringify(response.data))

                localStorage.removeItem('firebaseToken')

                if (response.data.value) {

                    const linkki = response.data.value.photoURL

                    imageHandler(linkki)

                }

                history.push("/")

            } else {

                setError('Salasana ei täsmää! Käytä tavallista kirjautumista napsauttamalla.')

                setLoading(false)

            }

        }).catch(function (error) {
            console.log(error)

            setLoading(false)

            setError('Salasana ei täsmää! Tai sähköpostiosoitetta ei ole vahvistettu.')
        });

    },[user])

    const imageHandler = async (link) => {

        const response = await fetch(link);

        const blob = await response.blob();

        const file = new File([blob], 'image.png', {type:"image/png", lastModified:new Date().getTime()});

        const formData = new FormData()

        formData.append('image', file)

        const tokenObject = localStorage.getItem('token')

        if (tokenObject == null)
            return false

        let token = JSON.parse(tokenObject).token

        axios
            .post('https://ariten.herokuapp.com/api/addImage', formData,
                {headers: {
                        Authorization: 'Bearer: ' + token,
                        Accept: 'multipart/form-data'
                    }
                }
            ).then(response => {
            console.log('Kuvan lisaaminen onnistui!' + JSON.stringify(response.data))

        }).catch(function(err) {
            console.log(err)

            setLoading(false)

            setError('Kuvan päivittäminen epäonnistui!')

        })


    }

    const githubSignin = () => {
        auth.signInWithPopup(new firebase.auth.GithubAuthProvider())

            .then(function(result) {
                let token = result.credential.accessToken;
                let user = result.user;

                console.log(token)
                console.log(user)
            }).catch(function(error) {
            console.log("githubSignin epaonnistui!")
            console.log(error.code)
            console.log(error.message)
            setError(error.message)
        });
    }

    const microsoftSignin = () => {
        auth.signInWithPopup(new firebase.auth.OAuthProvider('microsoft.com'))

            .then(function(result) {
                let token = result.credential.accessToken;
                let user = result.user;

                console.log(token)
                console.log(user)
            }).catch(function(error) {
            console.log("faceboookSignin epaonnistui!")
            console.log(error.code)
            console.log(error.message)
            setError(error.message)
        });
    }


    const faceboookSignin = () => {
        auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())

            .then(function(result) {
                let token = result.credential.accessToken;
                let user = result.user;

                console.log(token)
                console.log(user)
            }).catch(function(error) {
            console.log("faceboookSignin epaonnistui!")
            console.log(error.code)
            console.log(error.message)
            setError(error.message)
        });
    }



    const googleSignin = () => {
        auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())

            .then(function(result) {
                let token = result.credential.accessToken;
                let user = result.user;

                console.log(token)
                console.log(user)
            }).catch(function(error) {
            console.log("google epaonnistui!")
            console.log(error.code)
            console.log(error.message)
            setError(error.message)
        });
    }


    const twitterSignin = () => {
        firebase.auth().signInWithPopup(new firebase.auth.TwitterAuthProvider())

            .then(function(result) {
                let token = result.credential.accessToken;
                let user = result.user;

                console.log(token)
                console.log(user)
            }).catch(function(error) {
                console.log("twitter epaonnistui!")
            console.log(error.code)
            console.log(error.message)
            setError(error.message)
        });
    }

    return (
        <>
        { !loading &&
    <div id='login-page'>
        <div id='login-card'>
            <Link to="/api/user/login">{error && <Alert variant="danger">{error}</Alert>}</Link>
            <h2>Millä haluat kirjautua?</h2>
            <br/>
            <div
                className='login-button google'
                onClick={() => googleSignin()}
            >
                <GoogleOutlined/> Kirjaudu Google-tilillä
            </div>

            <br/><br/>

            <div
                className='login-button facebook'
                onClick={() => faceboookSignin()}
            >
                <FacebookOutlined/> Kirjaudu Facebook-tilillä
            </div>

            <br/><br/>

            <div className="login-button" style={{backgroundColor: "#ffb900"}}
                 onClick={() => microsoftSignin()}>
                    <span role="img" aria-label="facebook" className="anticon anticon-facebook">

                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5jplHhwlhc69aeajUKmOJRJy8L7yQk-Ffaw&usqp=CAU"
                            alt="microsoft" width="20px" height="auto"/>
                </span>
                Kirjaudu Microsoft-tilillä
            </div>

            <br/><br/>

            <div
                className='login-button google'
                onClick={() => twitterSignin()}
            >
                <TwitterOutlined/> Kirjaudu Twitter-tilillä
            </div>

            <br/><br/>

            <div
                className='login-button' style={{backgroundColor: "#333"}}
                onClick={() => githubSignin()}
            >
                <GithubOutlined/> Kirjaudu Github-tilillä
            </div>

        </div>
    </div>

}
        </>
    )
}

export default LoginList