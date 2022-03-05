import React, {useState, useEffect} from 'react';

import {CssBaseline, Grid} from '@material-ui/core';

import {getPlacesData} from '../api';
import Header from '../components/Header/Header';
import List from '../components/List/List';
import Map from '../components/Map/Map';
import LocationSearch from "../components/LocationSearch"

import Result from "../components/PlaceDetails/Result";
import socketIOClient from "socket.io-client";
import axios from "axios";
import {useAuth} from "../contexts/AuthContext";

const MapPage = () => {

    const ENDPOINT = "http://localhost:8080"

    const socket = socketIOClient(ENDPOINT)

    const [places, setPlaces] = useState([]);
    const [filteredPlaces, setFilteredPlaces] = useState([]);
    const [coordinates, setCoordinates] = useState({});
    const [bounds, setBounds] = useState({});
    const [type, setType] = useState('restaurants');
    const [rating, setRating] = useState(0);
    const [markers, setMarkers] = useState([]);

    const [latLng, setLatLng] = useState({});
    const [weatherData, setWeatherData] = useState({});
    const [error, setError] = useState("");

    const [Account, setAccount] = useState([]);

    const { logout } = useAuth()

    useEffect(() => {
        //Fetch Weather data
        const getWeatherData = async () => {
            const key = "16fdab519c28d855012ea37284dad53f";
            const getData = await fetch(
                `http://api.openweathermap.org/data/2.5/find?lat=${latLng.lat}&lon=${latLng.lng}&cnt=1&appId=${key}`
            );
            const dataObj = await getData.json();
            console.log(dataObj);
            if (dataObj.cod === "200") {
                setWeatherData(dataObj.list[0]);
                setError("");
            } else {
                setError("Something is wrong, couldn't complete the request");
            }
        };
        if (latLng.lng) {
            getWeatherData();
        }
    }, [latLng, setLatLng]);

    //Fetch data from Child
    const getDataFromChild = result => {
        setLatLng(result);
    };


    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({coords: {latitude, longitude}}) => {
            setCoordinates({lat: latitude, lng: longitude});

            if (Account.length !== 0) {

                let sahkoposti = Account[0].sahkoposti

                let kuva = Account[0].kuva

                if (kuva == null)
                    kuva = 'uploads/default-user.png'

                console.log("email:" + JSON.stringify(Account))

                setMarkers(current => [...current, {lat: latitude, lng: longitude, time: new Date(), sahkoposti, kuva},])

            }
        })


    }, [Account]);

    useEffect(() => {

        const filteredPlaces = places.filter((place) => place.rating > rating)
        setFilteredPlaces(filteredPlaces);
    }, [rating]);

    useEffect(() => {

        getPlacesData(type, bounds.sw, bounds.ne).then((data) => {
            setPlaces(data);
        })
    })


    useEffect(() => {

        const tokenObject = localStorage.getItem('token')

        if (tokenObject == null)
            return logout()

        let token = JSON.parse(tokenObject).token

        axios
            .get('http://localhost:8080/api/check',
                {headers: {Authorization: 'Bearer: ' + token}}
            ).then(response => {

            console.log("asetetaan id: " + JSON.stringify(response.data.user))

            setAccount(response.data.user)

            socket.emit("user-join", {
                "id": response.data.value.id
            });

        })

    }, [])


    useEffect(() => {

        console.log("Account: " + JSON.stringify(Account))

    },[Account])

    useEffect(() => {

        socket.on("showMarkers", (value) => {

            let coords = value.coords

            let Account = value.user

            let lat = coords.lat

            let lng = coords.lng

            let sahkoposti = Account[0].sahkoposti

            let kuva = Account[0].kuva

            if (kuva == null)
                kuva = 'uploads/default-user.png'

            setMarkers(current => [...current, {lat: lat, lng: lng, time: new Date(), sahkoposti, kuva},])


        })

    }, [])

    return (
        <>
            <CssBaseline/>
            <Header setCoordinates={setCoordinates}/>
            <Grid container spacing={3} style={{width: '100%'}}>
                <Grid item xs={12} md={4}>
                    { Account &&
                        <List places={filteredPlaces.length ? filteredPlaces : places}
                              type={type}
                              setType={setType}
                              rating={rating}
                              setRating={setRating}
                              coordinates={coordinates}
                              account={Account}
                        />
                    }
                </Grid>
                <Grid item xs={12} md={8}>
                    { Account &&
                        <Map
                            setCoordinates={setCoordinates}
                            setBounds={setBounds}
                            coordinates={coordinates}
                            places={filteredPlaces.length ? filteredPlaces : places}
                            markers={markers}
                            setMarkers={setMarkers}
                        />
                    }
                </Grid>
            </Grid>
            <h2>Haluatko tarkistaa sään?</h2>
            <div className="outerBox">
                <Result weatherData={weatherData} error={error}/>
                <div>
                    <LocationSearch updateParent={getDataFromChild}/>
                </div>
            </div>
        </>
    );
}
export default MapPage;