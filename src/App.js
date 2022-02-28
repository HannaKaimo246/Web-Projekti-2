import React, {useState, useEffect} from 'react';

import './styles/App.scss'
import { Container } from "react-bootstrap"
import {
    BrowserRouter as Router,
    Switch, Route, Link, useHistory
} from 'react-router-dom'

import HomePage from './views/HomePage'

import {AuthProvider} from "./contexts/AuthContext"

import PrivateRoute from "./components/User/PrivateRoute";

import ForgotPassword from "./components/User/ForgotPassword"

import Settings from "./components/User/Settings"

import PrivateChatPage from "./views/PrivateChatPage"

import UserPage from "./views/UserPage"

import LoginList from "./components/User/LoginList"

import Navbar from "./components/Home/NavBar"

import Map from "./views/MapPage"

import Search from "./components/Chat/UserList"

import InvitationList from "./components/Chat/Invite"

const App = () => {

    // The back-to-top button is hidden at the beginning
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        window.addEventListener("scroll", () => {
            if (window.pageYOffset > 300) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        });
    }, []);

    // This function will scroll the window to the top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // for smoothly scrolling
        });
    };

    return (
    <div id="app">
        <Router>
            <AuthProvider>
                <Navbar />
                <Switch>
                    <PrivateRoute exact path="/api/settings" component={Settings} />
                    <PrivateRoute exact path="/api/hae" component={Search} />
                    <PrivateRoute exact path="/api/privatechat" component={PrivateChatPage} />
                    <PrivateRoute exact path="/api/invites" component={InvitationList} />
                    <Route path="/api/user/:id" component={UserPage} />
                    <Route path="/api/forgot-password" component={ForgotPassword} />
                    <Route path="/api/loginList" component={LoginList} />
                    <Route path="/api/map" component={Map} />
                    <Route path="/" component={HomePage} />
                </Switch>
            </AuthProvider>
        </Router>

        {showButton && (
            <button onClick={scrollToTop} className="back-to-top">
                &#8679;
            </button>
        )}
    </div>
);

}
export default App;