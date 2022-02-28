import React, {useEffect, useState} from "react";
import axios from "axios";
import {Alert, Table} from "react-bootstrap";

import '../../styles/UserList.scss'
import {useHistory} from "react-router-dom";
import socketIOClient from "socket.io-client";
import Button from "@material-ui/core/Button";

const Invite = () => {

    const ENDPOINT = "http://localhost:8080"

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

    const history = useHistory()

    useEffect(() => {

        const tokenObject = localStorage.getItem('token')

        if (tokenObject == null)
            return false

        let token = JSON.parse(tokenObject).token

    axios
        .get('http://localhost:8080/api/check',
            {headers: {Authorization: 'Bearer: ' + token}}
        ).then(response => {

        setomaId(response.data.value.id)

        socket.emit("user-join", {
            "id": response.data.value.id
        });

    })

    }, [])

    useEffect(() => {

        console.log("salliiko?")

        setLoading(false)

        const tokenObject = localStorage.getItem('token')

        if (tokenObject == null)
            return false

        let token = JSON.parse(tokenObject).token



        console.log('effect')
        axios
            .get('http://localhost:8080/api/receiveInvites',
                {headers: {Authorization: 'Bearer: ' + token}}
            ).then(response => {
            console.log('Käyttäjien listaaminen onnistui!' + JSON.stringify(response.data))
            setusers(response.data.userdata)

        })
        setLoading(true)
    }, [pyynto, success, error, teksti])


    const hyvaksyPyynto = (value) => {

        const tokenObject = localStorage.getItem('token')

        let token = JSON.parse(tokenObject).token

        if (token == null || value == null)
            return false



        const inviteObject = {
            tunnus: value
        }

        axios
            .put('http://localhost:8080/api/acceptInvite', inviteObject,
                {headers: {Authorization: 'Bearer: ' + token}}
            ).then(response => {
            console.log('Kutsun hyväksyminen onnistui!' + response.data)

            setPyynto(!pyynto)

            socket.emit("removeNotifications", {
                "id": response.data.id,
                "tunnus": omaid,
                "kutsu": true
            });

        })
    }

    const poistaPyynto = (value) => {

        const tokenObject = localStorage.getItem('token')

        if (tokenObject == null || value == null)
            return false

        let token = JSON.parse(tokenObject).token


        const inviteObject = {
            vastaanottaja: value
        }

        axios.delete('http://localhost:8080/api/deleteInvite2', {
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

    return (
        <section id="hakukenttalista">
            <h1>Käyttäjien pyynnöt</h1>
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

            { users.length <= 0 && loading &&
                <section className="eituloksia">
                    <h1>Ei pyyntöjä.</h1>
                </section>
            }

            <section id="haku">
                <button onClick={handleBack}>Takaisin</button>
            </section>

        </section>
    )

}

export default Invite