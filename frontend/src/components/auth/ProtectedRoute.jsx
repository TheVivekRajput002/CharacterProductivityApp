import { useEffect, useState } from "react"
import { Navigate } from 'react-router-dom'
import React from 'react'
import axios from "axios"

function ProtectedRoute({ children }) {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/auth/user`, { withCredentials: true })
            .then((res) => {
                setIsLoggedIn(res.data.isLoggedIn === true)
                console.log("you are logged in")
            })
            .catch(() => {
                setIsLoggedIn(false)
                console.log("you are not logged in")
            })
            .finally(() => setLoading(false));
    }, [])

    if (loading) return <div>Loading...</div>;

    if (!isLoggedIn) return <Navigate to="/auth" replace />;

    return children;

}

export default ProtectedRoute