import React, { useState } from 'react';
import '../style.css';
function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSignup = (e) => {
        e.preventDefault();
        console.log('Signing up with:', { name, email, password });
        // Add registration logic here
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="text-2xl font-bold mb-4">Signup</h2>
            <form onSubmit={handleSignup} className="bg-white p-6 rounded-lg shadow-md">
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mb-3 p-2 border rounded w-full"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mb-3 p-2 border rounded w-full"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-3 p-2 border rounded w-full"
                    required
                />
                <button
                    type="submit"
                    className="bg-green-500 text-white p-2 rounded w-full"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
}

export default Signup;
