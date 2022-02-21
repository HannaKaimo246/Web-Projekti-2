/**
 *   Tekijä Ari Tenhunen
 */

import React, {useRef, useState, useEffect} from "react"

import {useHistory, useParams} from "react-router-dom"

const PrivateChat = (props) => {

    const { polku } = useParams();

    const history = useHistory()

    const [selectedOption, setSelectedOption] = useState(props.selectList[0].value)

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

    const [messages, setMessages] = useState(props.messages)

    const [messages2, setMessages2] = useState(props.messages2)

    const [mainMessages, setMainMessages] = useState('')

    const [typing, setTyping] = useState(props.typing)

    const [lajittelu, setLajittelu] = useState(1)

    const [nykyinenRivi, setNykyinenRivi] = useState(0)

    const [aktiivinenRivi, setAktiivinenRivi] = useState(0)

    const [omaviesti, setOmaViesti] = useState('')

    const [haeLista, sethaeLista] = useState('')

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

    const handleHaeLista = (event) => {

        /**
         * Jos haku on tyhja niin jatketaan ja tarkistetaan ettei nykyinensivumäärä ole maksimisivumäärä eikä ykkönen. Jos ei pidä paikkansa niin sivu painikkeet poistetaan käytöstä.
         */

        sethaeLista(event.target.value)

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

    const selaa = (sivu) => {

        setActive(null)

        /**
         * Jos käyttäjä klikkaa seuraavaa sivua niin nykyinen sivumäärä ei saa olla maksimisivumäärä ja nykyinensivumäärä on ykkönen tai sitä suurempi.
         */

        if (nykyinenSivumaara != (count + 1) && nykyinenSivumaara >= 1) {

            this.$emit('selaa', sivu);

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

        props.haeKaveri(valittuID, false, lajittelu)

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

    const handleSelectOption = (value) => {

        setSelectedOption(value)

        setLajittelu(value)

        props.haeKaveri(valittuID, false, lajittelu)

    }

    /**
    * Reactin useEffectit
    */

    useEffect(() => {

        /**
         * Tapahtumakäsitteljä reagoi scrollaukseen siten kun on päädytty paikkaan 0 eli scrollattu ihan ylös. Tällöin ladataan 10 uutta viestiä tietokannasta. Tiedot viedään ylemmälle komponentille ja axios vie tiedot palvelimeen.
         */

        // element should be replaced with the actual target element on which you have applied scroll, use window in case of no target element.
        let content = this.$refs.sisalto;
        content.addEventListener("scroll", function () {

            if (content.scrollTop > 0 && content.scrollTop < 10) {

                props.haeKaveri(valittuID, true, lajittelu)

                setNykyinenRivi(content.scrollHeight)

            }

        }, false);

    }, [])


    useEffect(() => {

        /**
         * Kun uudet viestit on ladattu niin scrollataan käyttäjä alkuperäiseen paikkaan.
         */

        this.$nextTick(function () {

            let container = this.$el.querySelector("#sisalto");

            setAktiivinenRivi(container.scrollHeight - nykyinenRivi)

            container.scrollTop = aktiivinenRivi;

        });

    }, [messages2])


    useEffect(() => {

        /**
         * Kun uutta viestiä lähetetty scrollataan käyttäjä ihan alas asti.
         */

        this.$nextTick(function () {

            setNykyinenRivi(0)

            setAktiivinenRivi(0)

            let container = this.$el.querySelector("#sisalto");

            container.scrollTop = container.scrollHeight;

        });

    }, [messages])

    useEffect(() => {

        /**
         * Tarkistetaan onko maksimisivumäärä 1, jotta ei turhaan viedä tyhjille sivuille.
         */

        if (this.count == 1) {

            this.disabled = true;

        } else {

            this.disabled = false;
        }

    }, [count])

    useEffect(() => {

        /**
         * Käyttäjä kirjoittaa...
         */

        let totta = false

        if (this.viesti == '') {

            totta = false

        } else {

            totta = true

        }

        props.viesti(omaviesti, totta)

    }, [omaviesti])


    return (
        <div id="privatechat">
            <section class="kaverilista">
                <section id="hakukentta">
                    <input disabled={users.length <= 0} type="text" onChange={handleHaeLista} value={haeLista}
                           placeholder="Hae kavereita"/> {haeLista && <p>Tuloksia löydetty : ({users.length})</p>}
                </section>
                {users.length > 0 &&
                    <section id="lista">
                        {users.map((user, index) =>
                            <div key={"" + user.id}>
                                <button
                                    onClick={poistaKayttaja(user.kayttaja_id == user.vastaanottaja_id ? user.vastaanottaja_id : user.lahettaja_id)}>🗑️
                                </button>
                                <button className={`
                     ${index === active ? 'nayta' : ''}
                     ${paikalla.includes(user.vastaanottaja_id) || paikalla.includes(user.lahettaja_id) ? 'paikalla' : 'poissa'}
                     listapainikkeet
                `} type="button"
                                        onClick={haeKaveri(user.kayttaja_id == user.vastaanottaja_id ? user.vastaanottaja_id : user.lahettaja_id, index)}>{user.nimimerkki}</button>
                            </div>
                        )}
                    </section>
                }
                {haeLista == false && users.length <= 0 &&
                    <section ClassName="eiloydy">
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
                                onClick={selaa(setSivu(sivu - 8), setNykyinenSivuMaara(nykyinenSivumaara - 1))}
                                disabled={disabled2} id="vasen">⬅
                            </button>
                            <p>{nykyinenSivumaara}/{count}</p>
                            <button onClick={selaa(setSivu(sivu + 8), setNykyinenSivuMaara(nykyinenSivumaara + 1))}
                                    disabled={disabled} id="oikea">➡
                            </button>
                        </div>
                    </section>
                    <button id="lisaa" onClick={hakuLista()}>Lisää kaveri</button>
                </section>
            </section>
            <section className="viestikentta">
                <section id="sisalto" ref="sisalto">
                    {valittuID == 0 && <h1>Aloita klikkaamalla kaveria!</h1>}

                    {id != '' && nayta && <h2>⬆ Hae viestejä rullaamalla ylös ⬆</h2>}

                    {id != '' && !nayta && messages2.length != 0 && messages.length >= 10 &&
                        <h3>⬇ Viestit loppuivat ⬇</h3>}

                    {messages2.length == 0 ? setMainMessages(messages) : setMainMessages(messages2)}

                    {mainMessages.map((message) =>
                        <div key={"" + message.id} className={message.lahettaja_id == id ? 'oma' : 'toinen'}>
                            {message.lahettaja_id == id &&
                                <button
                                    onClick={poistaViesti(id == message.vastaanottaja_id ? message.lahettaja_id : message.vastaanottaja_id, message.sisalto)}
                                    className="poisto">🗑️</button>
                            }
                            <div class="ulko_sisalto">

                                {message.lahettaja_id != id &&
                                    <p>{message.nimimerkki}</p>
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
                    <form noValidate ref={formRef} validated={validated} onSubmit={sendMessage} className="viesti">
                        {typing &&
                            <div id="kirjoittaa">Kaverisi kirjoittaa...</div>
                        }
                        <input type="text" placeholder="Kirjoita viesti..."/>
                        <button type="submit" id="laheta">Lähetä</button>
                        <select
                            name="users"
                            value={selectedOption}
                            onChange={e => handleSelectOption(e.target.value)}>
                            {props.selectList.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </form>
                }
            </section>
        </div>
    )
}

export default PrivateChat