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

//import {auth} from "./firebase"

const App = () => {



  // const [user, logout] = useAuth()
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


    // const [user, logout] = useAuth()

    const [user, logout] = useState('')

    const history = useHistory()

    const handleLogout = async () => {
        // await auth.signOut()
        // setUser(false)
        try {
            await logout()
            history.pushState("api/login")
        } catch {
            alert("Uloskirjautuminen epäonnistui!")
        }

    }

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

    useEffect(() => {
        const loggedInUser = localStorage.getItem("token");
        if (loggedInUser) {

            // setUser(true);
        } else {
            //   setUser(false);
        }
    }, []);

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
            <div id="sliderbar">
                <nav>
                    <ul>
                        <figure className="image-logo">
                            <img src={require("./assets/logo.png")} height="40px" width="40px" />
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
                                <p>Kirjautunut:</p>
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
            <AuthProvider>
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