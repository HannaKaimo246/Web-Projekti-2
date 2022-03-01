import React, {useRef, useState} from "react";

import {Form, Button, Card, Alert} from "react-bootstrap";

import { useAuth } from "../../contexts/AuthContext";
import {Link, useHistory} from "react-router-dom";
import axios from "axios";

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

    const imageHandler = (event) => {

        const file = event.target.files[0]

        const formData = new FormData()

        formData.append('image', file)

        const tokenObject = localStorage.getItem('token')

        if (tokenObject == null)
            return false

        let token = JSON.parse(tokenObject).token

        axios
            .post('http://localhost:8080/api/addImage', formData,
                {headers: {
                    Authorization: 'Bearer: ' + token,
                        Accept: 'multipart/form-data'
                    }
                }
            ).then(response => {
            console.log('Kuvan lisaaminen onnistui!' + JSON.stringify(response.data))

        })


    }

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Asetukset</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required defaultValue={user.email} />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required placeholder="Jätä kenttä tyhjäksi pitääkseen salasanan ennallaan." />
                        </Form.Group>
                        <Form.Group id="password-confirm">
                            <Form.Label>Password Confirmation</Form.Label>
                            <Form.Control type="password" ref={passwordConfirmRef} required placeholder="Jätä kenttä tyhjäksi pitääkseen salasanan ennallaan." />
                        </Form.Group>
                        <button disabled={loading} className="w-100" type="submit">Päivitä</button>
                        <input type="file" name="image" accept="image/*" multiple={false} onChange={imageHandler} />
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