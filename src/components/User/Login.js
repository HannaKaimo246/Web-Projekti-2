import React, {useRef, useState} from "react";

import {Form, Button, Card, Alert, Container} from "react-bootstrap";

import '../styles/Login.scss'

import { useAuth } from "../contexts/AuthContext";
import {Link, useHistory} from "react-router-dom";

const Login = () => {

    const [validated, setValidated] = useState(false)

    const formRef = useRef(null)

    const emailRef = useRef()

    const passwordRef = useRef()

    const { login } = useAuth()

    const [error, setError] = useState('')

    const [loading, setLoading] = useState(false)

    const history = useHistory()

    const handleSubmit = async (event) => {

        event.preventDefault()

        try {
            setError('')
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            history.push('/')
        } catch {
            setError('Kirjautuminen epäonnistui. Yritä hetken kuluttua uudelleen.')
        }

        setLoading(false)
    }

    return (
        <>
                <div className="w-100" style={{ maxWidth: "400px" }}>
                    <Card>
                        <Card.Body>
                            <h2 className="text-center mb-4">Kirjaudu</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <form noValidate ref={formRef} validated={validated} onSubmit={handleSubmit} className="sign-in-form">
                                <Form.Group id="email">
                                    <Form.Label>Sähköpostiosoite</Form.Label>
                                    <Form.Control type="email" ref={emailRef} required />
                                </Form.Group>
                                <Form.Group id="password">
                                    <Form.Label>Salasana</Form.Label>
                                    <Form.Control type="email" ref={passwordRef} required />
                                </Form.Group>
                                <button disabled={loading} type="submit">Kirjaudu sisään</button>
                            </form>
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