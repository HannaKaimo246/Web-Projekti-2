import React, {useRef, useState} from "react";

import {Form, Button, Card, Alert} from "react-bootstrap";

import { useAuth } from "../contexts/AuthContext";
import {Link, useHistory} from "react-router-dom";

const Settings = () => {

    const { user, updatePassword, updateEmail } = useAuth()

    const emailRef = useRef()

    const passwordRef = useRef()

    const passwordConfirmRef = useRef()

    const { login } = useAuth()

    const [error, setError] = useState('')

    const [loading, setLoading] = useState(false)

    const history = useHistory()

    const handleSubmit = async (event) => {

        event.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value)
            return setError('Salasanat eivät täsmää')

        const promises = []

        setLoading(true)

        setError("")

        if (emailRef.current.value !== user.email)
            promises.push(updateEmail(emailRef.current.value))

        if (passwordRef.current.value)
            promises.push(updatePassword(passwordRef.current.value))

        Promise.all(promises).then(() => {
            history.push("/")
        }).catch(() => {
            setError('Käyttäjätietojen päivittäminen epäonnstui.')
        }).finally(() => {
            setLoading(false)
        })

    }

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Profiili sivu</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required defaultValue={user.email} />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="email" ref={passwordRef} required placeholder="Jätä kenttä tyhjäksi pitääkseen salasanan ennallaan." />
                        </Form.Group>
                        <Form.Group id="password-confirm">
                            <Form.Label>Password Confirmation</Form.Label>
                            <Form.Control type="password" ref={passwordConfirmRef} required placeholder="Jätä kenttä tyhjäksi pitääkseen salasanan ennallaan." />
                        </Form.Group>
                        <button disabled={loading} className="w-100" type="submit">Päivitä</button>
                    </form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                <Link to="/">Takaisin</Link>
            </div>
        </>
    )

}

export default Settings