import React, {useRef, useState} from "react";

import {Form, Button, Card, Alert} from "react-bootstrap";

import '../../styles/Register.scss'

import PasswordStrengthBar from 'react-password-strength-bar';

import { useAuth } from "../../contexts/AuthContext";
import {useHistory} from "react-router-dom";

const Register = () => {

    const [validated, setValidated] = useState(false)

    const [ newEmail, setNewEmail ] = useState('')

    const [ newPassword, setNewPassword ] = useState('')

    const formRef = useRef(null)

    const emailRef = useRef()

    const passwordRef = useRef()

    const passwordConfirmRef = useRef()

    const { signup } = useAuth()

    const [error, setError] = useState('')

    const [loading, setLoading] = useState(false)

    const history = useHistory()

    const handleSubmit = async (event) => {

        event.preventDefault()

        setValidated(true);

        if (passwordRef.current.value !== passwordConfirmRef.current.value)
           return setError('Salasanat eivät täsmää')

        try {
            setError('')
            setLoading(true)
           await signup(emailRef.current.value, passwordRef.current.value)
            history.push("/")
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

    return (
        <>
            <div className="w-100" style={{ maxWidth: "400px" }}>
           <Card>
               <Card.Body>
                  <h2 className="text-center mb-4">Rekisteröidy</h2>
                   {error && <Alert variant="danger">{error}</Alert>}
                  <form noValidate ref={formRef} validated={validated}  onSubmit={handleSubmit} className="sign-up-form">
                      <Form.Group id="email">
                          <Form.Label>Sähköpostiosoite</Form.Label>
                          <Form.Control type="email" ref={emailRef}
                          required
                          onChange={handleEmailChange}
                          value={newEmail}
                          />
                      </Form.Group>
                      <Form.Group id="password">
                          <Form.Label>Salasana</Form.Label>
                          <Form.Control type="email"
                           ref={passwordRef}
                           required
                           onChange={handlePasswordChange}
                           value={newPassword}
                          />
                      </Form.Group>
                      <PasswordStrengthBar
                          password={newPassword}
                          minLength={5}
                          minScore={2}
                          scoreWords={['Heikko', 'Ihan ok', 'Hyvä', 'Vahva', 'Erinomainen']}
                          onChangeScore={(score, feedback) => {
                              console.log(score, feedback);
                          }}
                          inputProps={{ name: "password_input", autoComplete: "off", className: "form-control" }}
                      />
                      <Form.Group id="password-confirm">
                          <Form.Label>Salasana uudelleen</Form.Label>
                          <Form.Control type="password"
                          ref={passwordConfirmRef}
                          required
                          />
                      </Form.Group>
                      <button disabled={loading} type="submit">Rekisteröidy</button>
                  </form>
               </Card.Body>
           </Card>
           </div>
        </>
    )

}

export default Register