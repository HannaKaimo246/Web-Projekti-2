import React from "react";
import '../styles/HomePage.scss'
import logo from '../assets/logo.png';
import ImageSlider from "../components/ImageSlider";
import Description from "../components/Description";
import Images from "../components/Images";

const Home = () => {
    return(
        <div id="app">
            <div id="logo">
                <img src={logo} alt="Logo" />
                    <h1>Tervetuloa etusivulle</h1>
            </div>
            <ImageSlider />
            <Description />
            <Images />
        </div>
    )
}

export default Home