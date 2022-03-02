import React, {useEffect, useRef, useState} from "react";

import {Form, Button, Card, Alert, Container, Row} from "react-bootstrap";

import '../../styles/Login.scss'

import {useAuth} from "../../contexts/AuthContext";
import {Link, useHistory, useParams} from "react-router-dom";
import axios from "axios";

const Login = () => {

    const [validated, setValidated] = useState(false)

    const formRef = useRef(null)

    const [newEmail, setNewEmail] = useState('')

    const [newPassword, setNewPassword] = useState('')

    const {login, userExists, loginUser} = useAuth()

    const [error, setError] = useState('')

    const history = useHistory()

    const _isMounted = useRef(true); // Initial value _isMounted = true

    const {id} = useParams();

    useEffect(() => {
        return () => { // ComponentWillUnmount in Class Component
            _isMounted.current = false;
        }
    }, []);

    const handleReset = () => {

        setNewEmail('')
        setNewPassword('')
        setValidated(false)
        formRef.current.reset()

    }

    const handleSubmit = async (event) => {

        event.preventDefault()

        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.stopPropagation();

        }

        setValidated(true)

        if (form.checkValidity() === false)
            return

        const userObject = {
            sahkoposti: newEmail,
            salasana: newPassword
        }

        try {

               const search =  window.location.search;
               const params = new URLSearchParams(search);
               const value = params.get('ForgotPassword');

            if (value) {

                // unohtunut salasana

                await login(newEmail, newPassword)

                const ifuserExists = await userExists(newEmail)

                if (ifuserExists) {

                    console.log("Kayttaja on olemassa firebasessa!")

                    axios
                        .post('http://localhost:8080/api/checkForgotPassword', userObject,
                    {headers: {Authorization: 'Bearer ' + localStorage.getItem('firebaseToken')}}
                        ).then(response => {

                        if (response.status === 202) {

                        console.log("firebase tarkistus: " + JSON.stringify(response.data))

                        localStorage.setItem('token', JSON.stringify(response.data))

                        localStorage.removeItem('firebaseToken')

                        handleReset()

                        if (_isMounted) {

                            loginUser({email: newEmail})

                            history.push('/');
                        }

                    }

                    }).catch(function (error) {
                        console.log(error)
                    });



                } else {

                    console.log("Kayttaja ei ole olemassa firebasessa!")

                }

                console.log("id: " + id)

            } else {



                axios
                    .post('http://localhost:8080/api/login', userObject
                    ).then(response => {

                    if (response.status === 202) {

                        // Kirjautuminen onnistui!

                        localStorage.setItem('token', JSON.stringify(response.data))

                        let tokenArvo = localStorage.getItem('token');

                        let tokenObject = JSON.parse(tokenArvo);

                        console.log("Token localstoragessa: " + tokenObject.token)

                        handleReset()

                        if (_isMounted) {

                            loginUser({email: newEmail})

                            history.push('/');
                        }
                    }

                }).catch(function (error) {
                    console.log(error)
                });

            }

        } catch (error) {
            console.log("Tapahtui virhe: " + error)
            setError('Kirjautuminen epäonnistui. Yritä hetken kuluttua uudelleen.')
        }

    }

    const handleEmailChange = (event) => {

        setNewEmail(event.target.value)

    }

    const handlePasswordChange = (event) => {

        setNewPassword(event.target.value)

    }


    return (
        <>
            <div className="w-100" style={{maxWidth: "400px"}}>
                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">Kirjaudu sisään</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form noValidate ref={formRef} validated={validated} onSubmit={handleSubmit}
                              className="sign-in-form">
                            <Row className="mb-3">
                                <Form.Group id="email">
                                    <Form.Label>Sähköpostiosoite</Form.Label>
                                    <Form.Control
                                        required
                                        type="email"
                                        name="sahkoposti"
                                        onChange={handleEmailChange}
                                        value={newEmail}
                                    />
                                    <Form.Control.Feedback type="invalid">Sähköpostiosoite ei ole
                                        kelvollinen!</Form.Control.Feedback>
                                    <Form.Control.Feedback type="valid">Sähköposti on
                                        kelvollinen</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group id="password">
                                    <Form.Label>Salasana</Form.Label>
                                    <Form.Control
                                        required pattern="[a-zA-Z0-9]{8,}"
                                        type="password"
                                        name="salasana"
                                        onChange={handlePasswordChange}
                                        value={newPassword}
                                    />
                                    <Form.Control.Feedback type="invalid">Salasana täytyy olla vähintään 8 merkkiä
                                        pitkä!</Form.Control.Feedback>
                                    <Form.Control.Feedback type="valid">Salasana muotoilu
                                        oikein!</Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <button type="submit">Kirjaudu</button>
                        </Form>
                        <div className="w-100 text-center mt-3">
                            <Link to="/api/forgot-password">Unohditko salasanan?</Link>
                        </div>
                    </Card.Body>
                </Card>
                <div className="w-100 text-center mt-2">
                    <Link to="/api/loginList">Haluatko kirjautua toisella tavalla?</Link>
                </div>
            </div>
        </>
    )

}

export default Login