import React, { useContext, useState, useEffect } from "react";

import { useHistory } from "react-router-dom";

import { auth } from '../firebase';

const AuthContext = React.createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const history = useHistory();

    const signup = (email, password) => {

        return auth.createUserWithEmailAndPassword(email, password)

    }

    const login = (email, password) => {

        return auth.signInWithEmailAndPassword(email, password)

    }

    const resetPassword = (email) => {

        return auth.sendPasswordResetEmail(email)

    }

    const updateEmail = (email) => {

       return user.updateEmail(email)
    }

    const updatePassword = (password) => {

        return user.updatePassword(password)
    }

    useEffect(() => {

        const authState = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
            if (user) {

                // kirjautuminen onnistui!

                history.push('/');

                console.log("kirjautuminen onnistui!")

                localStorage.setItem('token', 'tokenarvo')

            }
        })

        return authState

    }, [user, history]);

    const value = {
        user,
        signup,
        login,
        resetPassword,
        updateEmail,
        updatePassword
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )

}