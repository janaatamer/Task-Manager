import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, getCurrentUser, signOut, fetchAuthSession } from 'aws-amplify/auth';
import '../style.css';

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
  return JSON.parse(jsonPayload);
}

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
      // Check if user is already authenticated
      try {
        const user = await getCurrentUser();
        console.log('User already authenticated:', user);

        if (user.signInDetails.loginId !== email) {
          await signOut();
          localStorage.clear();
          await new Promise((resolve) => setTimeout(resolve, 500));
          console.log('Signed out previous user');
        } else {
          try {
            const session = await fetchAuthSession();
            if (!session.tokens || !session.tokens.idToken) {
              throw new Error('No token in session');
            }

            const token = session.tokens.idToken.toString();
            localStorage.setItem('authToken', token);
            localStorage.setItem('userEmail', user.signInDetails.loginId);

            const decoded = parseJwt(token);
            console.log('User email:', decoded.email);
            navigate('/dashboard');
            return;
          } catch (sessionError) {
            console.error('Error fetching session:', sessionError);
            setError('Could not fetch session. Try logging in again.');
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.log('No user currently authenticated');
      }

      // Perform sign-in
      const { isSignedIn, nextStep } = await signIn({
        username: email,
        password,
      });

      console.log('Login result:', { isSignedIn, nextStep });

      const user = await getCurrentUser();
      if (user) {
        try {
          const session = await fetchAuthSession();
          if (!session.tokens || !session.tokens.idToken) {
            throw new Error('No token in session');
          }

          const token = session.tokens.idToken.toString();
          localStorage.setItem('authToken', token);
          localStorage.setItem('userEmail', user.signInDetails.loginId);
          const decoded = parseJwt(token);
          console.log('User email:', decoded.email);

          if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
            navigate('/new-password', { state: { username: email } });
            return;
          } else if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_SMS_CODE') {
            navigate('/confirm-signin', { state: { username: email } });
            return;
          }

          navigate('/dashboard');
          return;
        } catch (sessionError) {
          console.error('Error fetching session after login:', sessionError);
          setError('Login successful, but session could not be fetched.');
          setLoading(false);
          return;
        }
      }

      setError('Authentication successful but unable to redirect');
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
            <div className="auth-header">
                <h2 className="auth-title">Welcome Back</h2>
                <p className="auth-subtitle">Login to access your account</p>
            </div>
            
            {error && <div className="auth-error">{error}</div>}
            
            <form onSubmit={handleLogin} className="auth-form">
                <div className="form-group">
                    <label htmlFor="email" className="input-label">Email</label>
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
                    <label htmlFor="password" className="input-label">Password</label>
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
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M17.94 17.94A10 10 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5-5l2 2"></path>
                                    <path d="M1 1l22 22"></path>
                                    <path d="M9.9 4.24A9 9 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2 3"></path>
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
                
                <button 
                    type="submit" 
                    className={`auth-button ${loading ? 'loading' : ''}`}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="spinner"></span>
                            Logging in...
                        </>
                    ) : 'Login'}
                </button>
            </form>
            
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
