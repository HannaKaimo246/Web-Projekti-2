import React, {useRef, useState} from "react";

import {Form, Button, Card, Alert, InputGroup, FormControl} from "react-bootstrap";

import { useAuth } from "../../contexts/AuthContext";
import {Link, useHistory} from "react-router-dom";
import axios from "axios";

const Settings = () => {

    const { user, updatePassword, updateEmail } = useAuth()

    const { login, logout } = useAuth()

    const [error, setError] = useState('')

    const [loading, setLoading] = useState(false)

    const history = useHistory()

    const [success, setSuccess] = useState(false)

    const formRef = useRef(null)

    const [validated, setValidated] = useState(false)

    const [ newEmail, setNewEmail ] = useState(user.email)

    const [ newPassword, setNewPassword ] = useState('')

    const [ newPassword2, setNewPassword2 ] = useState('')

    const { regenerateToken } = useAuth()

    const handleSubmit = async (event) => {

        event.preventDefault()

        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.stopPropagation();

        }

        setValidated(true);

        if (form.checkValidity() === false)
            return

        if (newPassword !== newPassword2)
            return setError('Salasanat eivät täsmää')

        const promises = []

        setLoading(true)

        setError("")


        const tokenObject = localStorage.getItem('token')

        if (tokenObject == null)
            return logout()

        let token = JSON.parse(tokenObject).token


        if (newEmail !== user.email) {

            const emailObject = {
                sahkoposti: newEmail
            }

            axios
                .put('https://ariten.herokuapp.com/api/settings/email', emailObject,
                    {headers: {
                            Authorization: 'Bearer: ' + token,
                            Accept: 'multipart/form-data'
                        }
                    }
                ).then(response => {
                console.log('Sähköpostin päivittäminen onnistui!' + JSON.stringify(response.data))

                if (response.status === 200) {
                    setSuccess('Sähköpostin päivittäminen onnistui!')
                    promises.push(updateEmail(newEmail))
                } else {
                    setError('Sähköpostin päivittäminen epäonnistui!')
                }

            }).catch(function(err) {
                console.log(err)
                regenerateToken()
            })

        }


        if (newPassword) {

            const passwordObject = {
                salasana: newPassword
            }

            axios
                .put('https://ariten.herokuapp.com/api/settings/password', passwordObject,
                    {headers: {
                            Authorization: 'Bearer: ' + token,
                            Accept: 'multipart/form-data'
                        }
                    }
                ).then(response => {
                console.log('Salasanan päivittäminen onnistui!' + JSON.stringify(response.data))

                if (response.status === 200) {
                    setSuccess('Salasanan päivittäminen onnistui!')
                    promises.push(updatePassword(newPassword))
                } else {
                    setError('Salasanan päivittäminen epäonnistui!')
                }

            }).catch(function(err) {
                console.log(err)
                regenerateToken()
            })



        }

        Promise.all(promises).then(() => {

            history.push("/")
        }).catch(() => {
            setError('Käyttäjätietojen päivittäminen epäonnstui.')
        }).finally(() => {
            setLoading(false)
        })

    }

    const imageHandler = async (event) => {

       const file = event.target.files[0]

        const formData = new FormData()

        formData.append('image', file)

        const tokenObject = localStorage.getItem('token')

        if (tokenObject == null)
            return logout()

        let token = JSON.parse(tokenObject).token

        axios
            .post('https://ariten.herokuapp.com/api/addImage', formData,
                {headers: {
                    Authorization: 'Bearer: ' + token,
                        Accept: 'multipart/form-data'
                    }
                }
            ).then(response => {
            console.log('Kuvan lisaaminen onnistui!' + JSON.stringify(response.data))

            setSuccess('Kuvan päivittäminen onnistui.')

        }).catch(function(err) {
            console.log(err)
            regenerateToken()
        })


    }

    const handlePasswordChange = (event) => {

        setNewPassword(event.target.value)

    }

    const handleEmailChange = (event) => {

        setNewEmail(event.target.value)

    }

    const handlePasswordChange2 = (event) => {

        setNewPassword2(event.target.value)

    }

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-5">Asetukset</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    <Form noValidate ref={formRef} validated={validated} onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Sähköpostiosoite</Form.Label>
                            <Form.Control
                            type="email"
                            required
                            name="sahkoposti"
                            placeholder="Anna sähköpostiosoite"
                            onChange={handleEmailChange}
                            value={newEmail}
                            />
                            <Form.Control.Feedback type="invalid">Sähköpostiosoite ei ole kelvollinen!</Form.Control.Feedback>
                            <Form.Control.Feedback type="valid">Sähköpostiosoite on kelvollinen!</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Salasana</Form.Label>
                            <Form.Control type="password"
                            required pattern="[a-zA-Z0-9]{8,}"
                            name="salasana"
                            placeholder="Anna salasana"
                            onChange={handlePasswordChange}
                            value={newPassword}
                            />
                            <Form.Control.Feedback type="invalid">Salasana täytyy olla vähintään 8 merkkiä pitkä!</Form.Control.Feedback>
                            <Form.Control.Feedback type="valid">Salasana muotoilu oikein!</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group id="password-confirm">
                            <Form.Label>Uudelleen salasana</Form.Label>
                            <Form.Control type="password"
                            required
                            placeholder="Anna uudelleen salasana"
                            name="uudelleensalasana"
                            onChange={handlePasswordChange2}
                            value={newPassword2}
                            />
                            <Form.Control.Feedback type="invalid">Uudelleen salasana täytyy olla vähintään 8 merkkiä pitkä!</Form.Control.Feedback>
                            <Form.Control.Feedback type="valid">Uudelleen salasana muotoilu oikein!</Form.Control.Feedback>
                        </Form.Group>
                        <br />
                        <Form.Group id="image">
                            <Form.Label>Profiilikuva</Form.Label>
                            <InputGroup size="sm" className="mb-3">
                                <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm" type="file" name="image" accept="image/*" multiple={false} onChange={imageHandler} />
                            </InputGroup>
                        </Form.Group>
                        <button disabled={loading} className="w-30" type="submit">Päivitä</button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                <Link to="/">Takaisin</Link>
            </div>
        </>
    )

}

export default Settings