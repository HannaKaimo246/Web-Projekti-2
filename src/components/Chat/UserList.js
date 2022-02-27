import React, {useEffect, useState} from "react";
import axios from "axios";
import {Table} from "react-bootstrap";

import '../../styles/UserList.scss'

const UserList = () => {

    const [users, setusers] = useState([])

    const [hae, setHae] = useState('')

    const [loading, setLoading] = useState(false)

    const [pyynto, setPyynto] = useState(false)


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
    }, [hae, pyynto])

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
            console.log('Kutsun lähettäminen onnistui!' + response.data)

            setPyynto(!pyynto)

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
        })

    }

    return (
        <section id="hakukenttalista">
            <h1>Hae Käyttäjiä</h1>
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
                <button>Takaisin</button>
                <button>Kutsut</button>
                <input type="text" onChange={handleHaeLista} value={hae} placeholder="Hae Käyttäjiä" />
            </section>

        </section>
    )


}

export default UserList