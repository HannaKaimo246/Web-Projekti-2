import React, {useEffect, useState} from "react";
import axios from "axios";
import {Alert, Table} from "react-bootstrap";

import '../../styles/UserList.scss'
import {useHistory} from "react-router-dom";
import socketIOClient from "socket.io-client";
import Button from "@material-ui/core/Button";

const UserList = () => {

    const ENDPOINT = "http://localhost:8080"

    const socket = socketIOClient(ENDPOINT)

    const [users, setusers] = useState([])

    const [hae, setHae] = useState('')

    const [loading, setLoading] = useState(false)

    const [pyynto, setPyynto] = useState(false)

    const [teksti, setTeksti] = useState('')

    const [error, setError] = useState(false)

    const [success, setSuccess] = useState(false)

    const [tila, setTila] = useState(2)

    const [omaid, setOmaid] = useState(2)

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

            setOmaid(response.data.value.id)

            socket.emit("user-join", {
                "id": response.data.value.id
            });

        })

    }, [])

    useEffect(() => {

        setLoading(false)

        const tokenObject = localStorage.getItem('token')

        let token = JSON.parse(tokenObject).token

        if (token == null)
            return false

        console.log('effect')
        axios
            .get(`http://localhost:8080/api/search?name=${hae}`,
                {headers: {Authorization: 'Bearer: ' + token}}
            ).then(response => {
                console.log('Käyttäjien listaaminen onnistui!' + JSON.stringify(response.data))
                setusers(response.data.userdata)

            })
            setLoading(true)
    }, [hae, pyynto, teksti, error, success])

    const handleHaeLista = (event) => {

        setHae(event.target.value)

    }

    const lahetaPyynto = (value) => {

        const tokenObject = localStorage.getItem('token')

        let token = JSON.parse(tokenObject).token

        if (token == null || value == null)
            return false



        const inviteObject = {
            vastaanottaja: value
        }

        axios
            .post('http://localhost:8080/api/invites', inviteObject,
                {headers: {Authorization: 'Bearer: ' + token}}
            ).then(response => {
            console.log('Kutsun lähettäminen onnistui!' + JSON.stringify(response.data))

            setPyynto(!pyynto)

            socket.emit("addNotifications", {
                "id": response.data.id
            });

        })
    }

    const poistaPyynto = (value) => {

        const tokenObject = localStorage.getItem('token')

        let token = JSON.parse(tokenObject).token

        if (token == null || value == null)
            return false

        const inviteObject = {
            vastaanottaja: value
        }

        axios.delete('http://localhost:8080/api/deleteInvite', {
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
                "tunnus": omaid

            });

        })

    }

    const handleInvite = () => {

        history.push("invites")

    }

    const handleBack = () => {

        history.goBack()

    }

    useEffect(() => {

        socket.on("removeNotifications", (value) => {

            if (value.kutsu == true) {
                setError(false)

                setSuccess(true)

                let arvo = "Kutsusi hyväksyttiin";

                setTeksti(arvo)
            } else if (value.kutsu == false) {
                setError(true)

                setSuccess(false)

                setTeksti("Kutsusi hylättiin")
            }



        })

    },[])


    return (
        <section id="hakukenttalista">
            <h1>Hae Käyttäjiä</h1>
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
                            {user.hyvaksytty == 0 ? <button onClick={() => poistaPyynto(user.kayttaja_id)}>Peruuta pyyntö</button> : <button onClick={() => lahetaPyynto(user.kayttaja_id)}>Lähetä pyyntö</button> }

                        </td>
                    </tr>)}
                </tbody>
            </Table>

            { users.length <= 0 && loading &&
                <section className="eituloksia">
                    <h1>Ei tuloksia.</h1>
                </section>
            }

            <section id="haku">
                <button onClick={handleBack}>Takaisin</button>
                <button onClick={handleInvite}>Kutsut</button>
                <input type="text" onChange={handleHaeLista} value={hae} placeholder="Hae Käyttäjiä" />
            </section>

        </section>
    )


}

export default UserList