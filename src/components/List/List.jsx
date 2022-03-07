import React, {useEffect, useState} from 'react';
import {Grid, Typography, InputLabel, MenuItem, FormControl, Select}
    from '@material-ui/core';

import PlaceDetails from '../../components/PlaceDetails/PlaceDetails'

import useStyles from './styles';
import axios from 'axios';
import socketIOClient from "socket.io-client";
import {useAuth} from "../../contexts/AuthContext";

const List = ({type, setType, rating, setRating, coordinates, account}) => {

    const ENDPOINT = "https://ariten.herokuapp.com"

    const socket = socketIOClient(ENDPOINT)

    const classes = useStyles();

    const [locationList, setlocationList] = useState([])

    const [users, setUsers] = useState([])

    const [sijaintiNappi, setSijaintiNappi] = useState(false)

    const [time, setTime] = useState()

    const {user, logout} = useAuth()

    useEffect(() => {

        const tokenObject = localStorage.getItem('token')

        if (tokenObject == null)
            return logout()

        let token = JSON.parse(tokenObject).token

        axios
            .get('https://ariten.herokuapp.com/api/mapUsers',
                {headers: {Authorization: 'Bearer: ' + token}}
            ).then(response => {

            if (response.status === 200) {

                console.log('Kartan listaaminen onnistui!' + JSON.stringify(response.data))

                let arr = []

                response.data.userdata.forEach((element, index) => {

                    if (element.kuva) {
                        arr.push({
                            id: element.kayttaja_id,
                            name: element.sahkoposti,
                            photo: 'https://ariten.herokuapp.com/' + element.kuva
                        });
                    } else {
                        arr.push({
                            id: element.kayttaja_id,
                            name: element.sahkoposti,
                            photo: 'https://ariten.herokuapp.com/uploads/default-user.png'
                        });
                    }


                });

                setUsers(arr)

            }

        }).catch(function (error) {

            console.log("Virhe: " + error)

        });


    }, [])

    const locationHandleAdd = (id) => {

        console.log("klikattu: " + id)

        setlocationList(share => [...share, id]);

    }

    const locationHandleRemove = (id) => {

        console.log("klikattu2: " + id)

        let array = [...locationList];
        let index = array.indexOf(id)
        if (index !== -1) {
            array.splice(index, 1);
            setlocationList(array)
        }

    }


    const locationShareOn = () => {

        setSijaintiNappi(true)

        socket.emit("shareLocation", {
            "users": locationList,
            "coords": coordinates,
            "user": account
        });

        setTime(setInterval(() => {

            socket.emit("shareLocation", {
                "users": locationList,
                "coords": coordinates,
                "user": account
            });


        }, 10000))

    }

    const locationShareOff = () => {

        console.log("perutetaan sijaintia...")

        setSijaintiNappi(false)

        clearTimeout(time)

    }

    return (
        <div className={classes.container}>
            <Typography variant="h4">Chatissa olevat ihmiset:</Typography>
            <FormControl className={classes.formControl}>
                <InputLabel>Type</InputLabel>
                <Select value={type} onChange={(e) => setType(e.target.value)}>
                    <MenuItem value="restaurants">Restaurants</MenuItem>
                    <MenuItem value="hotels">Hotels</MenuItem>
                    <MenuItem value="attractions">Attractions</MenuItem>
                </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
                <InputLabel>Rating</InputLabel>
                <Select value={rating} onChange={(e) => setRating(e.target.value)}>
                    <MenuItem value={0}>All</MenuItem>
                    <MenuItem value={3}>Above 3.0</MenuItem>
                    <MenuItem value={4}>Above 4.0</MenuItem>
                    <MenuItem value={4.5}>Above 4.5</MenuItem>
                </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
                {user && !sijaintiNappi && <button onClick={() => locationShareOn()}>Jaa sijainti</button>}
                {user && sijaintiNappi && <button onClick={() => locationShareOff()}>Peruuta sijainti</button>}
            </FormControl>
            <Grid container spacing={3} className={classes.list}>
                {!user && <p>Kirjaudu sisään nähdäkseen omat kaverit!</p>}
                {users.length == 0 && user && <p>Ei tuloksia. Lisää kaveri!</p>}
                {users && users?.map((user, i) => (
                    <Grid item key={i} xs={12}>
                        <PlaceDetails user={user} locationHandleAdd={locationHandleAdd}
                                      locationHandleRemove={locationHandleRemove}/>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default List