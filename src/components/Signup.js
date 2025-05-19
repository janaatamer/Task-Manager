import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp, confirmSignUp } from 'aws-amplify/auth';
import '../style.css';
import axios from 'axios';

function Signup() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmationCode, setConfirmationCode] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { isSignUpComplete, userId, nextStep } = await signUp({
                username: email,
                password,
                options: {
                    userAttributes: {
                        email,
                        name,
                    },
                    autoSignIn: false // Set to true if you want automatic login after confirmation
                }
            });

            console.log('Signup result:', { isSignUpComplete, userId, nextStep });
            
            
            if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
                setShowConfirmation(true);                
                alert('Confirmation code sent to your email');

            }
        } catch (error) {
            console.error('Signup error:', error);
            setError(error.message || 'Signup failed');

        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmation = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { isSignUpComplete } = await confirmSignUp({
                username: email,
                confirmationCode
            });
            const payload = {
                name:name,
                email:email,
            };
            if (isSignUpComplete) {
                await axios.post('https://scfwc7ifpa.execute-api.us-east-1.amazonaws.com/dev/users', payload);
                alert('Account confirmed successfully! You can now log in.');
                navigate('/login');
                }

        } catch (error) {
            console.error('Confirmation error:', error);
            setError(error.message || 'Confirmation failed');
        } finally {
            setIsLoading(false);
        }
    };
//  <div className="auth-container">
//         <div className="auth-card">
//             <div className="auth-header">
//                 <h2 className="auth-title">Welcome Back</h2>
//                 <p className="auth-subtitle">Login to access your account</p>
//             </div>
    return (
        <div className="auth-container">
            <div className="auth-card">
                 <div className="auth-header">
                    <h2 className="auth-title">Signup</h2>
                 </div>
                
                
                {!showConfirmation ? (
                    <form onSubmit={handleSignup} className="auth-form">
                        <div className="form-group">
                            <label className="input-label">Name</label>
                            <input
                                type="text"
                                placeholder="Enter you full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="auth-input"
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label className="input-label">Email</label>
                            <input
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="auth-input"
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label className="input-label">Password</label>
                            <input
                                type="password"
                                placeholder="At least 8 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="auth-input"
                                required
                                minLength="8"
                            />
                        </div>
                        
                        {error && <div className="text-red-500 mb-4">{error}</div>}
                        
                        <button
                            type="submit"
                        className={"auth-button ${loading ? 'loading' : ''}"}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : 'Create Account'}
                        </button>
                        
                        <div className="mt-4 text-center">
                            <span className="input-label">Already have an account? </span>
                            <button 
                                type="button" 
                                className={"auth-button ${loading ? 'loading' : ''}"}
                                onClick={() => navigate('/login')}
                            >
                                Log in
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleConfirmation} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Confirm Your Email</h3>
                        <p className="mb-4">We sent a confirmation code to {email}</p>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Confirmation Code</label>
                            <input
                                type="text"
                                placeholder="Enter 6-digit code"
                                value={confirmationCode}
                                onChange={(e) => setConfirmationCode(e.target.value)}
                                className="p-2 border rounded w-full"
                                required
                            />
                        </div>
                        
                        {error && <div className="text-red-500 mb-4">{error}</div>}
                        
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded w-full disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Verifying...' : 'Confirm Account'}
                        </button>
                        
                        <button
                            type="button"
                            className="mt-4 text-green-500 hover:underline w-full text-center"
                            onClick={() => setShowConfirmation(false)}
                        >
                            Back to Sign Up
                        </button>
                    </form>
                    
                )}
            </div>
        </div>
    );
}

export default Signup;