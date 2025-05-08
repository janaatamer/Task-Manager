import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, getCurrentUser } from 'aws-amplify/auth';
import '../style.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // First check if user is already authenticated
            try {
                const user = await getCurrentUser();
                console.log('User already authenticated:', user);
                navigate('/dashboard');
                return;
            } catch (error) {
                // Not authenticated, proceed with sign in
            }

            // Perform sign in
            const { isSignedIn, nextStep } = await signIn({ 
                username: email, 
                password 
            });

            console.log('Login result:', { isSignedIn, nextStep });

            // Check authentication status again after sign in
            const user = await getCurrentUser();
            if (user) {
                navigate('/dashboard');
                return;
            }

            // Handle special cases if not authenticated
            if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
                navigate('/new-password', { state: { username: email } });
            } else if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_SMS_CODE') {
                navigate('/confirm-signin', { state: { username: email } });
            } else {
                setError('Authentication successful but unable to redirect');
            }
        } catch (error) {
            console.error('Error signing in:', error);
            let errorMessage = 'Login failed. Please check your credentials.';
            
            if (error.name === 'UserNotConfirmedException') {
                errorMessage = 'Please verify your email first.';
                navigate('/confirm-signup', { state: { username: email } });
            } else if (error.name === 'NotAuthorizedException') {
                errorMessage = 'Incorrect username or password.';
            } else if (error.name === 'UserNotFoundException') {
                errorMessage = 'User not found. Please sign up first.';
            } else if (error.name === 'PasswordResetRequiredException') {
                errorMessage = 'Password reset required.';
                navigate('/reset-password', { state: { username: email } });
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Login</h2>
                {error && <div className="auth-error">{error}</div>}
                
                <form onSubmit={handleLogin} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            className="auth-input"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-input">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                className="auth-input"
                            />
                            <button 
                                type="button" 
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                
                {/* Replace the auth-links div with this: */}
<div className="auth-footer">
  <a 
    href="/forgot-password" 
    className="footer-link"
    onClick={(e) => {
      e.preventDefault();
      navigate('/forgot-password');
    }}
  >
    Forgot password?
  </a>
  <span className="divider">|</span>
    <a 
    href="/signup" 
    className="footer-link"
    onClick={(e) => {
      e.preventDefault();
      navigate('/signup');
    }}
     >
      Create account
  </a>
  </div>
               

            </div>
        </div>
    );
}

export default Login;