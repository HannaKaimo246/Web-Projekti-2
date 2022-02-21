import React from "react";
import { Carousel } from 'react-carousel-minimal';

const ImageSlider = () => {

const data = [
    {
        image: require("../assets/openchat.png"),
        caption: "Open PrivateChat"
    },
    {
        image: require("../assets/privatechat.png"),
        caption: "Private PrivateChat"
    },
    {
        image: require("../assets/kartta.png"),
        caption: "Kartta"
    },
    {
        image: require("../assets/asetukset2.png"),
        caption: "Asetukset"
    },
    {
        image: require("../assets/log.png"),
        caption: "Kirjautumis-sivu"
    },
    {
        image: require("../assets/reg.png"),
        caption: "Rekisteröitymis-sivu"
    },
    {
        image: require("../assets/selaa.png"),
        caption: "Selaa"
    },
    {
        image: require("../assets/hae.png"),
        caption: "Hae"
    },
    {
        image: require("../assets/kutsu.png"),
        caption: "Kutsu"
    }
];
const captionStyle = {
    fontSize: '2em',
    fontWeight: 'bold',
    color: 'black'
}
const slideNumberStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'black'
}

    return (
        <div className="image">
            <div style={{ textAlign: "center" }}>
                <div style={{
                    padding: "0 20px"
                }}>
                    <Carousel
                        data={data}
                        time={2000}
                        width="850px"
                        height="500px"
                        captionStyle={captionStyle}
                        radius="10px"
                        slideNumber={true}
                        slideNumberStyle={slideNumberStyle}
                        captionPosition="bottom"
                        automatic={true}
                        dots={true}
                        pauseIconColor="white"
                        pauseIconSize="40px"
                        slideBackgroundColor="darkgrey"
                        slideImageFit="cover"
                        thumbnails={true}
                        thumbnailWidth="100px"
                        style={{
                            textAlign: "center",
                            maxWidth: "850px",
                            maxHeight: "500px",
                            margin: "40px auto",
                        }}
                    />
                </div>
            </div>
        </div>
    );

}

export default ImageSlider