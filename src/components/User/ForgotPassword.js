import React, {useRef, useState} from "react";

import {Form, Button, Card, Alert} from "react-bootstrap";

import { useAuth } from "../../contexts/AuthContext";
import {Link} from "react-router-dom";

const ForgotPassword = () => {

    const emailRef = useRef()

    const passwordRef = useRef()

    const { resetPassword } = useAuth()

    const [error, setError] = useState('')

    const [message, setMessage] = useState('')

    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event) => {

        event.preventDefault()

        try {
            setMessage('')
            setError('')
            setLoading(true)
            setMessage("Lähetämme sähköpostiin vahvistuslinkin salasanan vaihtamisesta.")
            await resetPassword(emailRef.current.value)

        } catch {
            setError('Salasanan vaihtaminen ei onnistunut. Yritä hetken kuluttua uudelleen.')
        }

        setLoading(false)
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Salasana unohtunut</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>
                        <button disabled={loading} className="w-100" type="submit">Vaihda salasana</button>
                    </form>
                    <div className="w-100 text-center mt-3">
                        <Link to="/login">Kirjaudu</Link>
                    </div>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                Eikö sinulla ole tiliä? <Link to="user/register">Rekisteröidy</Link>
            </div>
        </>
    )

}

export default ForgotPassword