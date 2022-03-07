import React, {useEffect, useState} from "react";
import axios from "axios";
import {Alert, Table} from "react-bootstrap";

import '../../styles/UserList.scss'
import {useHistory} from "react-router-dom";
import socketIOClient from "socket.io-client";
import Button from "@material-ui/core/Button";
import {useAuth} from "../../contexts/AuthContext";

const Invite = () => {

    const ENDPOINT = "https://ariten.herokuapp.com:8080"

    const socket = socketIOClient(ENDPOINT)

    const [users, setusers] = useState([])

    const [loading, setLoading] = useState(false)

    const [pyynto, setPyynto] = useState(false)

    const [pyynto2, setPyynto2] = useState(false)

    const [teksti, setTeksti] = useState('')

    const [error, setError] = useState(false)

    const [success, setSuccess] = useState(false)

    const [tila, setTila] = useState([])

    const [omaid, setomaId] = useState(0)

    const { regenerateToken, logout } = useAuth()

    const history = useHistory()

    useEffect(() => {

        const tokenObject = localStorage.getItem('token')

        if (tokenObject == null)
            return logout()

        let token = JSON.parse(tokenObject).token

    axios
        .get('https://ariten.herokuapp.com/api/check',
            {headers: {Authorization: 'Bearer: ' + token}}
        ).then(response => {

        setomaId(response.data.value.id)

        socket.emit("user-join", {
            "id": response.data.value.id
        });

    }).catch(function (err) {
        console.log(err)
        regenerateToken()
    })

    }, [])

    useEffect(() => {

        console.log("salliiko?")

        setLoading(false)

        const tokenObject = localStorage.getItem('token')

        if (tokenObject == null)
            return logout()

        let token = JSON.parse(tokenObject).token



        console.log('effect')
        axios
            .get('https://ariten.herokuapp.com/api/receiveInvites',
                {headers: {Authorization: 'Bearer: ' + token}}
            ).then(response => {
            console.log('Käyttäjien listaaminen onnistui!' + JSON.stringify(response.data))
            setusers(response.data.userdata)

        }).catch(function (err) {
            console.log(err)
            regenerateToken()
        })

        setLoading(true)
    }, [pyynto, success, error, teksti])


    const hyvaksyPyynto = (value) => {

        const tokenObject = localStorage.getItem('token')

        let token = JSON.parse(tokenObject).token

        if (token == null || value == null)
            return logout()



        const inviteObject = {
            tunnus: value
        }

        axios
            .put('https://ariten.herokuapp.com/api/acceptInvite', inviteObject,
                {headers: {Authorization: 'Bearer: ' + token}}
            ).then(response => {
            console.log('Kutsun hyväksyminen onnistui!' + response.data)

            setPyynto(!pyynto)

            socket.emit("removeNotifications", {
                "id": response.data.id,
                "tunnus": omaid,
                "kutsu": true
            });

        }).catch(function (err) {
            console.log(err)
            regenerateToken()
        })
    }

    const poistaPyynto = (value) => {

        const tokenObject = localStorage.getItem('token')

        if (tokenObject == null || value == null)
            return logout()

        let token = JSON.parse(tokenObject).token


        const inviteObject = {
            vastaanottaja: value
        }

        axios.delete('https://ariten.herokuapp.com/api/deleteInvite2', {
                headers: {
                    Authorization: 'Bearer: ' + token,
                    deleteobject: JSON.stringify(inviteObject)
                }
            }
        ).then(response => {
            console.log('Kutsun poistaminen onnistui!' + response.data)
            setPyynto(!pyynto)

            console.log("value: " + value)

            socket.emit("removeNotifications", {
                "id": value,
                "tunnus": omaid,
                "kutsu": false
            });

        }).catch(function (error) {
            console.log(error)
            regenerateToken()
        })

    }

    const handleBack = () => {

        history.goBack()

    }

    useEffect(() => {

        if (tila.tunnus == omaid || tila == null || tila == '')
            return

        setTeksti("Kutsusi peruttiin!")

        setError(true)

        setSuccess(false)


    },[tila])


    useEffect(() => {

        socket.on("addNotifications", (value) => {

            setError(false)

            setSuccess(true)

            setTeksti("Sait uuden kutsun!")

        })

        socket.on("removeNotifications", (value) => {

            setTila(value)

        })

        },[])

    const handleList = () => {

        history.push('/api/hae')

    }

    return (
        <section id="hakukenttalista">
            <h1>Käyttäjien pyynnöt</h1>
            <section id="sisalto2">
            <Alert show={success} variant="success" transition={false}>
                <Alert.Heading>{teksti}</Alert.Heading>
                <div className="d-flex justify-content-end">
                    <Button onClick={() => setSuccess(false)} variant="outline-success">
                        Sulje!
                    </Button>
                </div>
            </Alert>
            <Alert show={error} variant="danger" onClose={() => setError(false)} transition={false} dismissible>
                <Alert.Heading>{teksti}</Alert.Heading>
            </Alert>
            <Table striped>
                <tbody>
                {loading && users.map((user, index) =>
                    <tr key={index}>
                        <td>
                            <div className="userRow">{user.kayttaja_id}</div>
                            <div className="emailRow">{user.sahkoposti}</div>
                            <button onClick={() => hyvaksyPyynto(user.kayttaja_id)}>Hyväksy pyyntö</button>
                            <button onClick={() => poistaPyynto(user.kayttaja_id)}>Hylkää pyyntö</button>
                        </td>
                    </tr>)}
                </tbody>
            </Table>
            </section>

            { users.length <= 0 && loading &&
                <section className="eituloksia">
                    <h1>Ei pyyntöjä.</h1>
                </section>
            }

            <section id="haku">
                <button onClick={handleBack}>Takaisin</button>
                <button onClick={handleList}>Lisää kaveri</button>
            </section>

        </section>
    )

}

export default Invite