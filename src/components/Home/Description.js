import React, {useEffect} from "react";
import Aos from "aos";
import '../../styles/Description.css'
import "aos/dist/aos.css";

const Description = () => {

    useEffect(() => {

        Aos.init({duration: 2000});

    }, [])

    return (
        <section className="description">
            <p data-aos="fade-up">
                Aiheena on realiaikainen chat-sovellus, jossa käyttäjät ja vierailijat pääsevät open chatissa
                kirjoittelemaan viestejä kaikille. Kirjautuneena käyttäjällä on mahdollista private chatissa
                kirjoittaa viestejä tietyille henkilöille.
                Etusivulla käyttäjä voi valita ylävalikoista mm. private chat, open chat, asetukset ja
                kartan. Etusivulta pääsee linkkien kautta rekisteröinti sivulle ja kirjautumis-sivulle.
                Vierailija voi kirjoitella ja selata viestejä open chatissa, mutta ei ole mahdollista kirjoittaa
                private chatissa ilman kirjautumisoikeuksia. Kirjautumisen jälkeen käyttäjällä on mahdollista
                selailla private chattia ja muokata käyttäjän asetuksia. Asetukissa voi vaihtaa nimimerkin ja salasanan.
            </p>
            <p data-aos="fade-up">
                Private chatin luominen tapahtuu lisäämällä toinen käyttäjä ja se tapahtuu nimen haulla ja
                toisen käyttäjän täytyy hyväksyä pyyntö, jotta on mahdollista lähettää viestejä.
                Rekisteröitymis-sivulla käyttäjä syöttää lomakkeeseen nimimerkin, sähköpostiosoitteen,
                salasanan ja toista salasanan. Lomake tarkistaa, että tiedot ovat oikeassa formaatissa ja
                myös palvelimella. Kirjautumis-sivulla käyttäjä antaa nimimerkin ja salasanan. Lomake
                tarkistaa, että tiedot ovat oikeassa formaatissa ja myös palvelimella.
            </p>
            <p data-aos="fade-up">
                Kartta sivulla on mahdollista vierailijan ja käyttäjän selata karttaa. Käyttäjällä on
                mahdollisuus jakaa sijaintia kaverille ja oman sijainnin jakamisen voi myös peruttaa. Kartalla
                on mahdollista lisätä reittiohjeet kaverin kohteelle. Sovelluksen käyttöliittymä olisi
                tavoitteena toteuttaa vuella. Palvelin puoli olisi tarkoitus toteuttaa node js ja tietokannan
                toteutus mysql.
            </p>
        </section>
    );
}

export default Description