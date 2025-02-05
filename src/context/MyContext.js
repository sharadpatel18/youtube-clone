"use client"

import {createContext, useEffect, useState} from 'react'
import jwt from 'jsonwebtoken'

export const MyContext = createContext()

export const MyProvider = (props) => {
    const [istoken , setIsToken] = useState(false)
    const [isShowForm , setIsShowForm] = useState(false)
    const [user, setUser] = useState(null)
    const [videoLink , setVideoLink] = useState(null)
    useEffect(()=>{
        const token = localStorage.getItem('token')
        if(token){
            const user = jwt.decode(token)
            setUser(user)
        }
    },[istoken])

    return (
        <MyContext.Provider value={{user , setIsToken , isShowForm , setIsShowForm , videoLink , setVideoLink}}>
            {props.children}
        </MyContext.Provider>
    )
}
