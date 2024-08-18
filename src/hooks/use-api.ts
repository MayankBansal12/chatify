import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const backend = import.meta.env.VITE_SERVER

const useApi = () => {
    const navigate = useNavigate()
    const callApi = async (endpoint: string, method = 'GET', data = null) => {
        const token = localStorage.getItem('token')
        if (!token) {
            navigate('/auth/login')
        }
        try {
            const config = {
                method: method,
                url: backend + endpoint,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                data: data,
            }

            const result = await axios(config)

            return result
        } catch (error) {
            if (error.response.data.token === false) {
                navigate('/auth/login')
            }
            if (error.response.data.valid === false) {
                localStorage.removeItem('token')
                navigate('/auth/login')
            }
            console.log('Error while calling api: ', error)
            return error.response
        }
    }
    return callApi
}

export default useApi