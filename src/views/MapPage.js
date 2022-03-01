import React, {useState, useEffect} from 'react';

import {CssBaseline, Grid} from '@material-ui/core';

import {getPlacesData} from '../api';
import Header from '../components/Header/Header';
import List from '../components/List/List';
import Map from '../components/Map/Map';
import LocationSearch from "../components/LocationSearch"

import Result from "../components/PlaceDetails/Result";

const MapPage = () => {
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
        })
    }, []);

    useEffect(() => {

        const filteredPlaces = places.filter((place) => place.rating > rating)
        setFilteredPlaces(filteredPlaces);
    }, [rating]);

    useEffect(() => {

        getPlacesData(type, bounds.sw, bounds.ne).then((data) => {
            setPlaces(data);
        })
    })

    return (
        <>
            <CssBaseline/>
            <Header setCoordinates={setCoordinates}/>
            <Grid container spacing={3} style={{width: '100%'}}>
                <Grid item xs={12} md={4}>
                    <List places={filteredPlaces.length ? filteredPlaces : places}
                          type={type}
                          setType={setType}
                          rating={rating}
                          setRating={setRating}
                    />
                </Grid>
                <Grid item xs={12} md={8}>
                    <Map
                        setCoordinates={setCoordinates}
                        setBounds={setBounds}
                        coordinates={coordinates}
                        places={filteredPlaces.length ? filteredPlaces : places}
                        markers={markers}
                        setMarkers={setMarkers}
                    />
                </Grid>
            </Grid>
            <h2>Haluatko tarkistaa sään?</h2>
            <div className="outerBox">
                <Result weatherData={weatherData} error={error} />
                <div>
                    <LocationSearch updateParent={getDataFromChild} />
                </div>
            </div>
        </>
    );
}
export default MapPage;