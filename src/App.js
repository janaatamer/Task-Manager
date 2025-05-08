import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { getCurrentUser } from 'aws-amplify/auth';


import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';



function App() {
    const [user, setUser] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true); // Loading state

    useEffect(() => {
        const checkUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch {
                setUser(null);
            } finally {
                setCheckingAuth(false);
            }
        };
        checkUser();
    }, []);

    if (checkingAuth) return <div>Loading...</div>; // Optional spinner

    return (
        <Router>
            <div className="min-h-screen bg-gray-200">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route
                        path="/dashboard"
                        element={user ? <Dashboard /> : <Navigate to="/login" />}
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
