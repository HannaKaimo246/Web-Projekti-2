import React, {useEffect, useRef, useState} from "react";
import {Col, Form} from "react-bootstrap";

import '../../styles/OpenChat.scss'

const OpenChat = (props) => {

    const [validated, setValidated] = useState(false)

    const formRef = useRef(null)

    const [message, setMessage] = useState('')

    const [messages, setMessages] = useState([])

    const [typing, setTyping] = useState([])

    const handleReset = () => {

        setMessage('')
        setValidated(false)
        formRef.current.reset()

    }

    const handleMessage = async event => {

        event.preventDefault();

        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.stopPropagation();

        }

        setValidated(true);

        if (form.checkValidity() === false)
            return

        props.sendMessage(message)

        handleReset()
        
    }
    
    const handleMessageChange = (event) => {

        setMessage(event.target.value)

    }

    useEffect(() => {



        if (message) {
            props.handleTyping(true)
        } else {

            props.handleTyping(false)
        }

    },[message])

    useEffect(() => {

        if (props.messages.length == 0)
            return false

        setMessages(searches => [props.messages, ...searches]);

    },[props.messages])

    useEffect(() => {

        setTyping(props.typing);

    },[props.typing])

    return (
        <>
            <div className="view chat">
                <header id="openchatOtsikko">
                    <h1>OpenChat</h1>
                    <h1>Tervetuloa, {props.user2}</h1>
                    <p className="online">Paikalla: {props.online}</p>
                </header>
                <section className="chat-box">
                    {messages && messages.map((message, index) =>
                    <div key={index} className={message.username == props.user2 ? 'message current-user' : 'message'}>
                            <div className="message-inner">
                                <div className="username">{message.username}</div>
                                <div className="message-text">{message.msg}</div>
                            </div>
                    </div>
                    )}
                </section>
                <footer>
                    { typing.state == true && typing.username !== props.user2 &&
                        <small className="text-typing">
                            <h2>{typing.username} kirjoittaa viestiä...</h2>
                        </small>
                    }
                    <Form className="input-container" noValidate ref={formRef} validated={validated} onSubmit={handleMessage}>
                        <Form.Group as={Col} md="5" controlId="validationCustom02">
                            <Form.Control
                                required
                                type="text"
                                placeholder="Kirjoita viesti..."
                                name="viesti"
                                onChange={handleMessageChange}
                                value={message}
                            />
                            <Form.Control.Feedback type="invalid">Anna viesti!</Form.Control.Feedback>
                        </Form.Group>
                            <button type="submit">Lähetä</button>
                    </Form>
                </footer>
            </div>
        </>
)
}

export default OpenChat