import React, {useRef, useState} from "react";

import {Form, Button, Card, Alert} from "react-bootstrap";

import { useAuth } from "../../contexts/AuthContext";
import {Link} from "react-router-dom";

const ForgotPassword = () => {

    const { resetPassword } = useAuth()

    const [ newEmail, setNewEmail ] = useState('')

    const [error, setError] = useState('')

    const [success, setSuccess] = useState('')

    const [loading, setLoading] = useState(false)

    const [validated, setValidated] = useState(false)

    const formRef = useRef(null)

    const handleReset = () => {

        setNewEmail('')
        setValidated(false)
        formRef.current.reset()

    }

    const handleSubmit = async (event) => {

        event.preventDefault();

        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.stopPropagation();

        }

        setValidated(true);

        if (form.checkValidity() === false)
            return

        setError('')
        setSuccess('')



        try {
            setLoading(true)

            await resetPassword(newEmail)

            setSuccess('Tarkista sähköposti')

            handleReset()

        } catch {
            setError('Salasanan vaihtaminen ei onnistunut. Yritä hetken kuluttua uudelleen.')
        }

        setLoading(false)
    }

    const handleEmailChange = (event) => {

        setNewEmail(event.target.value)

    }

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Salasana unohtunut</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    <Form noValidate ref={formRef} validated={validated} onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>1. Lähetämme sähköpostiin linkin salasanan vaihtamisesta</Form.Label>
                            <Form.Control
                             type="email"
                             placeholder="Anna sähköpostiosoite"
                             required
                             name="sahkopostiosoite"
                             value={newEmail}
                             onChange={handleEmailChange}
                            />
                            <Form.Control.Feedback type="invalid">Sähköpostiosoite ei ole kelvollinen!</Form.Control.Feedback>
                            <Form.Control.Feedback type="valid">Sähköpostiosoite on kelvollinen!</Form.Control.Feedback>
                        </Form.Group>
                        <br />
                        <button disabled={loading} className="w-30" type="submit">Lähetä</button>
                    </Form>
                    <div className="w-100 text-center mt-3">
                        <Link to="user/login?ForgotPassword=true">2. Kirjaudu tänne</Link>
                    </div>
                </Card.Body>
            </Card>
        </>
    )

}

export default ForgotPassword