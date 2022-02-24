import React, {useContext, useState, useEffect, useRef} from "react";

import { useHistory } from "react-router-dom";

import { auth } from '../AuthFirebase';
import firebase from "firebase/app";

import jwt from 'jwt-decode'

const AuthContext = React.createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

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

    const deleteUser = () => {

        user.delete().then(function() {
            // User deleted.
        }).catch(function(error) {
            // An error happened.
        });

    }

    const logout = () => {

        const token = localStorage.getItem('token')

        setUser(null)

        if (token)
            localStorage.removeItem('token')

        return auth.signOut()
      
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

        const authState = auth.onAuthStateChanged((userdata) => {

            setLoading(false)

            if (userdata) {
                setUser(userdata);

                // kirjautuminen onnistui!
                history.push("/")

                console.log("kirjautuminen onnistui!")

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
        deleteUser,
        userExists,
        updateEmail,
        updatePassword,
        loginUser
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )

}