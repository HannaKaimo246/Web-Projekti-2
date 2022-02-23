import React, {useState, useEffect} from 'react';

import {CssBaseline, Grid } from '@material-ui/core';

import {getPlacesData, getWeatherData} from './api';
import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';

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

//import PrivateChatPage from "./views/PrivateChatPage"

import UserPage from "./views/UserPage"

import LoginList from "./components/User/LoginList"

import Navbar from "./components/Home/NavBar"

const App = () => {

  const [places, setPlaces] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [coordinates, setCoordinates] = useState({});
  const [bounds, setBounds] = useState({});

  useEffect(()  => {
  navigator.geolocation.getCurrentPosition(({coords: {latitude, longitude} }) => {
    setCoordinates({lat: latitude, lng: longitude});
    })
  },[]);


  useEffect(() => {

    getWeatherData(coordinates.lat, coordinates.lng)
    .then((data) =>
        setWeatherData(data));

    getPlacesData(bounds.sw, bounds.ne)
        .then((data) => {
          console.log(data);
          setPlaces(data);
        })
      }, [coordinates, bounds]);

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
<>{/*
   <CssBaseline />
   <Header />
   <Grid container spacing={3} style={{ width: '100%'}}>
       <Grid item xs={12} md={4}>
     <List places={places}
     />
       </Grid>
     <Grid item xs={12} md={8}>
             <Map
             setCoordinates={setCoordinates}
             setBounds={setBounds}
             coordinates={coordinates}
             places={places}
             weatherData={weatherData}
             />
     </Grid>
   </Grid>
    */}
    <div id="app">
        <Router>
            <AuthProvider>
                <Navbar />
                <Switch>
                    <PrivateRoute exact path="/api/settings" component={Settings} />
                    { /* <Route path="/api/privatechat" component={PrivateChatPage} /> */}
                    <Route path="/api/user/:id" component={UserPage} />
                    <Route path="/api/forgot-password" component={ForgotPassword} />
                    <Route path="/api/loginList" component={LoginList} />
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
</>
);

}
export default App;