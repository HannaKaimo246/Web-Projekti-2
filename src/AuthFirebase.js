import firebase from "firebase/app";
import "firebase/auth";

export const auth = firebase.initializeApp({
    apiKey: "AIzaSyDE9VXd9Kd4Oijj2OhU0lircw1bQjkyCfY",
    authDomain: "ichat-8d488.firebaseapp.com",
    projectId: "ichat-8d488",
    storageBucket: "ichat-8d488.appspot.com",
    messagingSenderId: "682784659651",
    appId: "1:682784659651:web:f6439200e5b63468922a76"
}).auth();