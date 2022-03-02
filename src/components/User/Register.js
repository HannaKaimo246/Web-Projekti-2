import React, {useEffect, useRef, useState} from "react";

import {Form, Button, Card, Alert, Col, Row} from "react-bootstrap";

import '../../styles/Register.scss'

import PasswordStrengthBar from 'react-password-strength-bar'

import { useAuth } from "../../contexts/AuthContext"
import axios from "axios"
import {useHistory} from "react-router-dom";
import {auth} from "../../firebase";
import firebase from "firebase";

const Register = () => {

    const [ newEmail, setNewEmail ] = useState('')

    const [ newPassword, setNewPassword ] = useState('')

    const [ newPasswordConfirm, setNewPasswordConfirm ] = useState('')

    const [validated, setValidated] = useState(false)

    const formRef = useRef(null)

    const { signup, loginUser } = useAuth()

    const [error, setError] = useState('')

    const [loading, setLoading] = useState(false)

    const _isMounted = useRef(true); // Initial value _isMounted = true

    const history = useHistory()

    useEffect(() => {
        return () => { // ComponentWillUnmount in Class Component
            _isMounted.current = false;
        }
    }, []);

    const handleReset = () => {

        setNewEmail('')
        setNewPassword('')
        setNewPasswordConfirm('')
        setValidated(false)
        formRef.current.reset()

    }

    const checkSignUp = async () => {

        try {
            await signup(newEmail, newPassword)
        } catch (err) {
            console.log(err)
            alert("Unohtuneen salasana palvelun tietojen tallettaminen ei onnistunut vaikka käyttäjän luonti onnistui. Määritä uudestaan unohtunut salasana napsauttamalla ok tai vaihda salasana asetuksista.")
            await checkSignUp()

        }


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

        if (newPassword !== newPasswordConfirm)
           return setError('Salasanat eivät täsmää')

        try {
            setError('')
            setLoading(true)

           /**
             * Rekisteröityminen
           **/

           const userObject = {
               sahkoposti: newEmail,
               salasana: newPassword,
               salasana2: newPasswordConfirm

           }

           await axios
                .post('http://localhost:8080/api/register', userObject
                ).then(async response => {

                if (response.status === 201) {

                    // Rekisteroityminen onnistui!

                    await checkSignUp()

                }

            }).catch(function (error) {
                    console.log(error)
                });

           /*
            * Kirjaudutaan sisään
            */

            const userObject2 = {
                sahkoposti: newEmail,
                salasana: newPassword,
                salasana2: newPasswordConfirm

            }

           await axios
                .post('http://localhost:8080/api/login', userObject2
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



        } catch {
            setError('Tilin luomisessa tapahtui virhe. Yritä hetken kuluttua uudelleen.')
        }

        setLoading(false)
    }

    const handleEmailChange = (event) => {

        setNewEmail(event.target.value)

    }

    const handlePasswordChange = (event) => {

        setNewPassword(event.target.value)

    }

    const handlePasswordConfirmChange = (event) => {

        setNewPasswordConfirm(event.target.value)

    }

    return (
        <>
            <div className="w-100" style={{ maxWidth: "400px" }}>
           <Card>
               <Card.Body>
                  <h2 className="text-center mb-4">Rekisteröidy</h2>
                   {error && <Alert variant="danger">{error}</Alert>}
                  <Form noValidate ref={formRef} validated={validated} onSubmit={handleSubmit}>
                      <Row className="mb-3">
                      <Form.Group id="email">
                          <Form.Label>Sähköpostiosoite</Form.Label>
                          <Form.Control
                          type="email"
                          placeholder="Anna sähköpostiosoite"
                          name="sahkopostiosoite"
                          required
                          onChange={handleEmailChange}
                          value={newEmail}
                          />
                          <Form.Control.Feedback type="invalid">Sähköpostiosoite ei ole kelvollinen!</Form.Control.Feedback>
                          <Form.Control.Feedback type="valid">Salasana muotoilu oikein!</Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group id="password">
                          <Form.Label>Salasana</Form.Label>
                          <Form.Control
                           required pattern="[a-zA-Z0-9]{8,}"
                           type="password"
                           placeholder="Anna salasana"
                           name="salasana"
                           onChange={handlePasswordChange}
                           value={newPassword}
                          />
                          <Form.Control.Feedback type="invalid">Salasana täytyy olla vähintään 8 merkkiä pitkä!</Form.Control.Feedback>
                          <Form.Control.Feedback type="valid">Salasana muotoilu oikein!</Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group id="password-confirm">
                          <Form.Label>Salasana uudelleen</Form.Label>
                          <Form.Control
                          required
                          type="password"
                          placeholder="Anna uudelleen salasana"
                          name="uusisalasana"
                          onChange={handlePasswordConfirmChange}
                          value={newPasswordConfirm}
                          />
                          <Form.Control.Feedback type="invalid">Salasanat eivät täsmää!</Form.Control.Feedback>
                          <Form.Control.Feedback type="valid">Uudelleen salasana muotoilu oikein!</Form.Control.Feedback>
                      </Form.Group>
                      </Row>
                      <button type="submit">Rekisteröidy</button>
                  </Form>
               </Card.Body>
           </Card>
           </div>
        </>
    )

}

export default Register