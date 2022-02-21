import React, {useEffect} from "react";
import Aos from "aos";
import '../styles/Images.scss'
import "aos/dist/aos.css";

const Images = () => {

    useEffect(() => {

        Aos.init({duration: 3000});

    }, [])

    return (
        <section className="images">
            <img data-aos="flip-up" src={require("../assets/asetukset2.png")} alt="asetukset" />
            <img data-aos="flip-down" src={require("../assets/openchat.png")}alt="openchat" />
            <img data-aos="flip-left" src={require("../assets/privatechat.png")} alt="privatechat" />
            <img data-aos="flip-right" src={require("../assets/kartta.png")} alt="kartta" />
        </section>
    );
}

export default Images