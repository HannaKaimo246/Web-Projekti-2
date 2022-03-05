import React, {useContext, useState, useEffect, useRef} from "react";

import {useHistory} from "react-router-dom";

import {auth} from '../firebase';
import firebase from "firebase/app";

import jwt from 'jwt-decode'
import axios from "axios";

const AuthContext = React.createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState();
    const history = useHistory();


    const _isMounted = useRef(true); // Initial value _isMounted = true

    useEffect(() => {
        return () => { // ComponentWillUnmount in Class Component
            _isMounted.current = false;
        }
    }, []);

    useEffect(() => {

        const token = localStorage.getItem('token')

        if (token) {
            const tokenArvo = jwt(token)

            loginUser({email: tokenArvo.user})

        }

    }, []);

    const signup = (email, password) => {

        return auth.createUserWithEmailAndPassword(email, password)

    }

    const login = (email, password) => {

        return auth.signInWithEmailAndPassword(email, password)


    }

    const resetPassword = (email) => {

        return auth.sendPasswordResetEmail(email)

    }

    const userExists = async (email) => {

        let arvo = false

        await firebase.auth().fetchSignInMethodsForEmail(email)
            .then((signInMethods) => {
                if (signInMethods.length)
                    arvo = true
            })
            .catch((error) => {
                arvo = error
            });

        return arvo

    }

    const regenerateToken = () => {

        console.log("regeneroidaan...")

        try {

            const tokenObject = localStorage.getItem('token')

            let token = JSON.parse(tokenObject).token

            console.log("tokenni: " + token)

            const objectToken = {
                token: token
            }

            axios
                .post('http://localhost:8080/api/regenerateToken', objectToken,
                ).then(response => {

                    if (response.status === 202) {

                        console.log("token uudelleen luonti onnistui!")

                        localStorage.setItem('token', JSON.stringify(response.data))

                        history.go(0)

                    }


            }).catch(function (error) {
                console.log(error)
            });

        } catch (error) {
            console.log(error)
        }

    }


    const logout = () => {

        console.log("kirjaudu ulos")

        const token = localStorage.getItem('token')

        const tokenFirebase = localStorage.getItem('firebaseToken')

        setUser(null)

        if (token) {
            localStorage.removeItem('token')
            auth.signOut()
        }

        if (tokenFirebase)
            localStorage.removeItem('firebaseToken')

    }

    const updateEmail = (email) => {

        return user.updateEmail(email)
    }

    const updatePassword = (password) => {

        return user.updatePassword(password)
    }

    const loginUser = (userdata) => {

        setUser(userdata)

    }

    useEffect(() => {

        const authState = auth.onAuthStateChanged((user) => {

            setLoading(false)
            console.log("kirjautuminen onnistui!" + user)

            if (user) {
                setUser(user);
                // kirjautuminen onnistui!

                try {

                    const token = localStorage.getItem('token')

                    if (user.getIdToken() == null || token !== null)
                        return false

                    user.getIdToken().then(function (idToken) {

                        console.log("firebase token: " + idToken)

                        localStorage.setItem('firebaseToken', idToken)

                    });
                } catch (err) {
                    console.log(err)
                }

            }
        })

        return authState

    }, [user, history]);

    const value = {
        user,
        signup,
        login,
        logout,
        resetPassword,
        userExists,
        updateEmail,
        updatePassword,
        loginUser,
        regenerateToken
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )

}