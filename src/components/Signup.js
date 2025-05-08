import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp, confirmSignUp } from 'aws-amplify/auth';
import '../style.css';

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

            if (isSignUpComplete) {
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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="text-2xl font-bold mb-4">Signup</h2>
            
            {!showConfirmation ? (
                <form onSubmit={handleSignup} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Name</label>
                        <input
                            type="text"
                            placeholder="Your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="p-2 border rounded w-full"
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="p-2 border rounded w-full"
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            placeholder="At least 8 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="p-2 border rounded w-full"
                            required
                            minLength="8"
                        />
                    </div>
                    
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded w-full disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : 'Create Account'}
                    </button>
                    
                    <div className="mt-4 text-center">
                        <span className="text-gray-600">Already have an account? </span>
                        <button 
                            type="button" 
                            className="text-green-500 hover:underline"
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
    );
}

export default Signup;