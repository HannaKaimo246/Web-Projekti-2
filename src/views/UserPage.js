import React, {useEffect, useState} from "react";

import Register from '../components/Register'

import Login from '../components/Login'

import Panels from '../components/Panels'

import '../styles/UserPage.scss'
import {useParams} from "react-router-dom";

const UserPage = () => {

    const [currentPage, setCurrentPage] = useState('')

    const { id } = useParams();

    useEffect(() => {

        if (id !== "" || id != null)
            setCurrentPage(id)

    }, [id])

    return(

        <div className={currentPage=='register' ? "container sign-up-mode" : "container"}>
            <div className="forms-container">
                <div className="signin-signup">


                        {currentPage == 'register' && <Register></Register>}

                    {currentPage=='login' && <Login></Login>}






                </div>
            </div>
            <Panels page={currentPage}></Panels>
        </div>

    )
}

export default UserPage