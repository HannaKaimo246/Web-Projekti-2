/**
 *   Tekijä Ari Tenhunen
 */

import React, {useRef, useState, useEffect} from "react"

import {useHistory, useParams} from "react-router-dom"

import '../../styles/PrivateChat.scss'
import {Form} from "react-bootstrap";

const PrivateChat = (props) => {

    const { polku } = useParams();

    const history = useHistory()

    const [selectedOption, setSelectedOption] = useState('uusin')

    const [users, setUsers] = useState(props.users)

    const [nayta, setNayta] = useState(props.nayta)

    const [id, setId] = useState(props.id)

    const [paikalla, setPaikalla] = useState(props.paikalla)

    const [count, setCount] = useState(props.count)

    const [active, setActive] = useState(false)

    const [disabled, setDisabled] = useState(false)

    const [disabled2, setDisabled2] = useState(true)

    const [validated, setValidated] = useState(false)

    const [sivu, setSivu] = useState(0)

    const [valittuID, setValittuID] = useState(0)

    const [nykyinenSivumaara, setNykyinenSivuMaara] = useState(1)

    const formRef = useRef(null)

    const [messages, setMessages] = useState([])

    const [messages2, setMessages2] = useState([])

    const [typing, setTyping] = useState(false)

    const [nykyinenRivi, setNykyinenRivi] = useState(0)

    const [omaviesti, setOmaViesti] = useState('')

    const [haeLista, sethaeLista] = useState('')

    const sisalto = useRef(null)

    const [usersTyping, setUsersTyping] = useState([])

    const sendMessage = async event => {

        event.preventDefault();

        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.stopPropagation();

        }

        setValidated(true);

        if (form.checkValidity() === false)
            return

        // lahetetaan viestia...

        /**
         * Jos viesti ja valittu id ei ole tyhjä niin lähetetään tiedot ylemmälle komponentille.
         */

        if (omaviesti && valittuID) {

            props.sendMessage(omaviesti, valittuID)

            setOmaViesti('')

        } else {
            alert("Anna viesti!");
        }


    }

    useEffect(() => {

        if (haeLista == '') {

            if (nykyinenSivumaara != count) {

                setDisabled(false)
            }

            if (nykyinenSivumaara != 1) {

                setDisabled2(false)
            }

            props.selaa(sivu)

        } else {

            setDisabled(true)

            setDisabled2(true)

            props.haeLista(haeLista)

        }

    },[haeLista])

    const handleHaeLista = (event) => {

        /**
         * Jos haku on tyhja niin jatketaan ja tarkistetaan ettei nykyinensivumäärä ole maksimisivumäärä eikä ykkönen. Jos ei pidä paikkansa niin sivu painikkeet poistetaan käytöstä.
         */

        sethaeLista(event.target.value)

    }

    const poistaKayttaja = (id) => {

        /**
         * Jos käyttäjä klikkaa roskakoria niin kysytään poista käyttäjä varmistusta ja jos käyttäjä valitsee kyllä niin tiedot lähetetään ylemmälle komponentille.
         */

        let r = window.confirm("Haluatko varmasti poistaa kaverin?");
        if (r == true) {

           props.poistaKayttaja(id)

        }

    }

    const selaahandle = (sivu) => {

        console.log("selataan...")

        setActive(false)

        /**
         * Jos käyttäjä klikkaa seuraavaa sivua niin nykyinen sivumäärä ei saa olla maksimisivumäärä ja nykyinensivumäärä on ykkönen tai sitä suurempi.
         */

        if (nykyinenSivumaara != (count + 1) && nykyinenSivumaara >= 1) {

            props.selaa(sivu)

        }

        /**
         * Jos nykyinensivumäärä on maksimisivumäärä niin seuraava nappi poistetaan käytöstä.
         */

        if (nykyinenSivumaara == count) {

            setDisabled(true)

        } else {

            setDisabled(false)

        }

        /**
         * Jos nykyinensivumäärä on pienempi tai yhtäsuuri kuin ykkönen niin edellinen nappi poistetaan käytöstä.
         */


        if (nykyinenSivumaara <= 1) {

            setDisabled2(true)

        } else {

            setDisabled2(false)

        }

    }

    const haeKaveri = (id, index) => {

        setActive(index)

        /**
         * Käyttäjä klikkasi kaveria listasta ja aloitetaan viemää tietoa ylemmälle komponentille ladatakseen viestit.
         */

        setValittuID(id)

        props.haeKaveri(id, false, selectedOption)



    }

    const hakuLista = () => {

        /**
         * Suoritetaan toiminto jos käyttäjä klikkasi "lisää kaveri" toimintoa ja pushaa hae sivulle.
         */

        if (polku !== 'hae') {

            history.push('/api/hae')

        }

    }

    const poistaViesti = (id, sisalto) => {

        /**
         * Jos käyttäjä klikkaa roskakoria niin kysytään poista viesti varmistusta ja jos käyttäjä valitsee kyllä niin tiedot lähetetään ylemmälle komponentille.
         */

        let r = window.confirm("Haluatko varmasti poistaa viestin?");
        if (r == true) {

            props.poistaViesti(id, sisalto)

        }

    }

    const aika = (value) => {

        /**
         * Muunnetaan saatu aika tietokannasta käyttäjän luettavaksi.
         */

        const date = new Date(value).toDateString();
        let h = new Date(value).getHours();
        let m = new Date(value).getMinutes();

        let output = date + ':' + h + ':' + m;

        return output;

    }

    const handleSelectOption = (event) => {

        setSelectedOption(event.target.value)

        console.log("valittu: " + valittuID + " ja " + event.target.value)

       props.haeKaveri(valittuID, false, event.target.value)

    }

    /**
    * Reactin useEffectit
    */

    useEffect(() => {

        /**
         * Tapahtumakäsitteljä reagoi scrollaukseen siten kun on päädytty paikkaan 0 eli scrollattu ihan ylös. Tällöin ladataan 10 uutta viestiä tietokannasta. Tiedot viedään ylemmälle komponentille ja axios vie tiedot palvelimeen.
         */

        let content = sisalto.current

        content.addEventListener("scroll", () => {

            if (content.scrollTop > 0 && content.scrollTop < 10) {

                setNykyinenRivi(content.scrollHeight)

            }

        }, false);

    }, [])

    /*
     *  Jos kayttajan nykyinenrivi(paikka) on ylhaalla niin haetaan lisaa vastaanottajan viesteja tietokannasta.
     */

    useEffect(() => {

        props.haeKaveri(valittuID, true, selectedOption)

    }, [nykyinenRivi])


    useEffect(() => {

        /**
         * Kun uudet viestit on ladattu niin scrollataan käyttäjä alkuperäiseen paikkaan.
         */

        process.nextTick(() => {

            let container = document.querySelector("#sisalto");

            container.scrollTop = container.scrollHeight - nykyinenRivi

        });

    }, [props.messages, props.messages2, props.haeKaveri])


    useEffect(() => {

        /**
         * Kun uutta viestiä lähetetty scrollataan käyttäjä ihan alas asti.
         */

        process.nextTick(() => {

            setNykyinenRivi(0)

            let container = document.querySelector("#sisalto");

            container.scrollTop = container.scrollHeight;

        });

    }, [props.messages, props.messages2])

    useEffect(() => {

        /**
         * Tarkistetaan onko maksimisivumäärä 1, jotta ei turhaan viedä tyhjille sivuille.
         */

        if (count == 1) {

            setDisabled(true)

        } else {

            setDisabled(false)
        }

    }, [props.count])

    useEffect(() => {

        /**
         * Käyttäjä kirjoittaa...
         */

        let totta = false

        if (omaviesti !== '' && omaviesti != null)
            totta = true

        props.viesti(omaviesti, totta)

    }, [omaviesti])

    useEffect(() => {

        setTyping(props.typing)

    },[props.typing])


    const handleMessageChange = (event) => {

        setOmaViesti(event.target.value)

    }

    /*
     *  Paivitetaan viestien tilat jos tapahtuu muutos
     */

    useEffect(() => {

            setMessages2(props.messages2)

    },[props.messages2])


    /*
      * Naytetaan kayttajien sahkopostiosoitteet jos yksikin kirjoittaa.
     */

    useEffect(() => {

        setUsersTyping(props.usersTyping)

    },[props.usersTyping])

    /*
    *  Paivittaa kaverin poiston listalta
     */

    useEffect(() => {

        setUsers(props.users)

    },[props.users])

    /*
     *  Paivitetaan paikalla olevat kayttajat listaan
     */

    useEffect(() => {

        setPaikalla(props.paikalla)

    },[props.paikalla])

    const openChat = () => {

        history.push('/api/openchat')

    }

    return (
        <div id="privatechat">
            <section className="kaverilista">
                <section id="hakukentta">
                    <input disabled={users.length <= 0 && !haeLista} type="text" onChange={handleHaeLista} value={haeLista}
                           placeholder="Hae kavereita"/> {haeLista && <p>Tuloksia löydetty : ({users.length})</p>}
                </section>
                {users.length > 0 &&
                    <section id="lista">
                        {users.map((user, index) =>
                            <div key={index}>
                                <button
                                    onClick={() => poistaKayttaja(user.kayttaja_id == user.vastaanottaja_id ? user.vastaanottaja_id : user.lahettaja_id)}>🗑️
                                </button>
                                <button className={`
                     ${index === active ? 'nayta' : ''}
                     ${paikalla.includes(user.kayttaja_id) ? 'paikalla' : 'poissa'}
                     listapainikkeet
                `} type="button"
                                        onClick={() => haeKaveri(user.kayttaja_id == user.vastaanottaja_id ? user.vastaanottaja_id : user.lahettaja_id, index)}>{user.sahkoposti}</button>
                            </div>
                        )}
                    </section>
                }
                {haeLista == false && users.length <= 0 &&
                    <section className="eiloydy">
                        <h1>Sinulla ei ole kavereita! Lisää kaveri.</h1>
                    </section>
                }
                {haeLista == true && users.length <= 0 &&
                    <section className="eiloydy">
                        <h1>Kaveria ei löytynyt!</h1>
                    </section>
                }

                <section id="kentta_pohja">
                    <section id="sivupalkit">
                        <div>
                            <button
                                onClick={() => selaahandle(setSivu(sivu - 8), setNykyinenSivuMaara(nykyinenSivumaara - 1))}
                                disabled={disabled2} id="vasen">⬅
                            </button>
                            <p>{nykyinenSivumaara}/{count}</p>
                            <button
                                onClick={() => selaahandle(setSivu(sivu + 8), setNykyinenSivuMaara(nykyinenSivumaara + 1))}
                                disabled={disabled} id="oikea">➡
                            </button>
                        </div>
                    </section>
                    <button id="lisaa" onClick={() => hakuLista()}>Lisää kaveri</button>
                    <button id="lisaa" onClick={() => openChat()}>Open Chat</button>
                </section>

            </section>

            <section className="viestikentta">

                <section id="sisalto" ref={sisalto}>

                    {valittuID == 0 && <h1>Aloita klikkaamalla kaveria!</h1>}

                    {messages2.length != 0 && messages2.length % 10 == 0 && <h2>⬆ Hae viestejä rullaamalla ylös ⬆</h2>}

                    {messages2.length != 0 && messages2.length % 10 !== 0 &&
                        <h3>⬇ Viestit loppuivat ⬇</h3>}

                    {/* messages2 */}
                    {messages2.length !== 0 && messages2.map((message, index) =>
                        <div key={index} className={message.lahettaja_id == id ? 'oma' : 'toinen'} id="messages2">
                            {message.lahettaja_id == id &&
                                <button
                                    onClick={() => poistaViesti(id == message.vastaanottaja_id ? message.lahettaja_id : message.vastaanottaja_id, message.sisalto)}
                                    className="poisto">🗑️</button>
                            }
                            <div className="ulko_sisalto">

                                {message.lahettaja_id != id &&
                                    <p>{message.sahkoposti}</p>
                                }

                                <div className="viesti_sisalto">
                                    <p>{message.sisalto}</p>

                                </div>

                                <div className="aika">
                                    <p>{aika(message.paivamaara)}</p>
                                </div>

                            </div>

                        </div>
                    )}
                </section>

                {valittuID !== 0 &&
                    <Form noValidate ref={formRef} validated={validated} onSubmit={sendMessage} className="viesti">
                        {typing && usersTyping.map((user, index) =>
                            <div key={index} id="kirjoittaa">{user} kirjoittaa...</div>
                        )}
                        <input type="text" placeholder="Kirjoita viesti..." name="viestikentta" value={omaviesti} onChange={handleMessageChange} />
                        <button type="submit" id="laheta">Lähetä</button>
                        <select value={selectedOption} onChange={handleSelectOption}>
                            <option value="uusin">Uusin</option>
                            <option value="vanha">Vanhin</option>
                        </select>
                    </Form>
                }
            </section>
</div>

    )
}

export default PrivateChat