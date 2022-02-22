import React from "react";
import {useHistory, useParams} from "react-router-dom";
import '../../styles/Panels.scss'

const Panels = (props) => {

    const history = useHistory()


    const handleRegister = () => {

        history.push("/api/user/register")

    }
    
    const handleLogin = () => {

        history.push("/api/user/login")

    }
    

    return(
        <div className="panels-container">
                <div className="panel left-panel">
                    <div className="content">
                        <h3>Etkö ole rekisteröitynyt?</h3>
                        <p>
                            Rekisteröitymis-sivulla käyttäjä syöttää lomakkeeseen sähköpostiosoitteen,
                            salasanan ja toista salasanan.
                        </p>
                        <button onClick={handleRegister} className="btn transparent" id="sign-up-btn">
                            Rekisteröidy nyt
                        </button>
                    </div>
                </div>
                <div className="panel right-panel">
                <div className="content">
                <h3>Onko sinulla tili?</h3>
                <p>
                Vierailija voi kirjoitella ja selata viestejä chatissa, mutta ei ole mahdollista kirjoittaa
                kavereille chatissa ilman kirjautumista.
                </p>
                <button onClick={handleLogin} className="btn transparent" id="sign-in-btn">
                Kirjaudu sisään
                </button>
                </div>
                </div>
        </div>
    )
    
}

export default Panels