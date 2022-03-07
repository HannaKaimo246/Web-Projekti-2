import React, {useEffect, useRef, useState} from "react";

import Chat from '../components/Chat/OpenChat'
import {useAuth} from "../contexts/AuthContext";
import socketIOClient from "socket.io-client";
import {Col, Form} from "react-bootstrap";

import '../styles/OpenChatPage.scss'

const OpenChatPage = () => {

    const [validated, setValidated] = useState(false)

    const [online, setOnline] = useState("")

    const formRef = useRef(null)

    const ENDPOINT = "https://ariten.herokuapp.com"

    const socket = socketIOClient(ENDPOINT)

    const { user } = useAuth()

    const [username, setUsername] = useState('')

    const [messages, setMessages] = useState([])

    const [name, setName] = useState('')

    const [typing, setTyping] = useState([])

    const sendMessage = (message) => {
        /**
         * Lähetetään viesti palvelimeen ja lähettämään viesti kaikille selaimille.
         */

        const sendValue = {
            username: username,
            msg: message
        }

        socket.emit('msg', sendValue)

    }

    useEffect(() => {

        if (user) {

            setUsername(user.email)
        }

    }, [user])

    const sendUser = async event => {

        event.preventDefault();

        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.stopPropagation();

        }

        setValidated(true);

        if (form.checkValidity() === false)
            return

        setUsername(name)

    }

    const handleNameChange = (event) => {

        setName(event.target.value)

    }

    const handleTyping = (value) => {

        console.log("value: " + value)

        const type = {
            state: value,
            username: username
        }

        socket.emit('typing', type)

    }

    /*
      * socket
     */

    useEffect(() => {

        socket.on("msg", (message) => {

            setMessages(message)

        })

        socket.on("joined", (name) => {

            setOnline(name)

        })

        socket.on("poistu", (name) => {

            setOnline(name)

        })

        socket.on('typing', (value) => {

            setTyping(value)

        })


    }, [])

    useEffect(() => {

        if (username)
            socket.emit('joined', username)

    }, [username])

    return (
            <div id="openchat">

                {username && <Chat online={online} messages={messages} typing={typing} handleTyping={handleTyping} user2={username} sendMessage={sendMessage}/>}

                {!username &&
                    <div className="view login">
                        <Form className="login-form" noValidate ref={formRef} validated={validated} onSubmit={sendUser}>
                            <div className="form-inner">
                                <h1>Ole hyvä ja syötä nimesi</h1>
                                <Form.Group as={Col} md="w-30" controlId="validationCustom02">
                                    <Form.Label>Nimimerkki</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Anna Nimimerkki"
                                        name="nimi"
                                        onChange={handleNameChange}
                                        value={name}
                                    />
                                    <Form.Control.Feedback type="invalid">Nimi on tyhjä!</Form.Control.Feedback>
                                    <Form.Control.Feedback type="valid">Nimi oikein!</Form.Control.Feedback>
                                </Form.Group>
                                <button type="submit" id="nappi">Jatka</button>
                            </div>
                        </Form>

                    </div>
                }
            </div>
    )

}

export default OpenChatPage