import React, {useEffect, useState} from "react";

import Register from '../components/User/Register'

import Login from '../components/User/Login'

import Panels from '../components/Home/Panels'

import '../styles/UserPage.scss'
import {useParams} from "react-router-dom";

const UserPage = () => {

    const {id} = useParams()

    const [currentPage, setCurrentPage] = useState("")

    const [time, setTime] = useState()

    useEffect(() => {

        clearTimeout(time)

        setTime(setTimeout(() => { setCurrentPage(id) }, 1000))

    }, [id])

    useEffect(() => {

        setCurrentPage(id)

    }, [])

    return (

        <div className={id == 'register' ? "container sign-up-mode" : "container"}>
            <div className="forms-container">
                <div className="signin-signup">
                    {currentPage=="register" && <Register />}
                    {currentPage=="login" && <Login /> }
                </div>
            </div>
            <Panels page={id}></Panels>
        </div>

    )
}

export default UserPage