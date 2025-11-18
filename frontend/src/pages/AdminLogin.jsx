import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check for verification success/error from backend redirect
    const token = searchParams.get('token');
    const verified = searchParams.get('verified');
    const error = searchParams.get('error');

    if (token && verified) {
      // Verification successful - store token and redirect
      console.log('Verification successful, storing token and redirecting...');
      localStorage.setItem('adminToken', token);
      navigate('/admin/dashboard');
    } else if (error) {
      // Handle verification errors
      console.log('Verification error:', error);
      if (error === 'invalid_token') {
        setError('Invalid or expired verification link. Please try logging in again.');
      } else if (error === 'verification_failed') {
        setError('Email verification failed. Please try again.');
      } else {
        setError('Verification failed. Please try logging in again.');
      }
    }
  }, [searchParams, navigate]);

  // Handle direct token verification from URL (when user clicks email link)
  useEffect(() => {
    const pathSegments = window.location.pathname.split('/');
    const tokenFromPath = pathSegments[pathSegments.length - 1];

    // Check if this looks like a verification token (64 characters, hex)
    if (tokenFromPath && tokenFromPath.length === 64 && /^[a-f0-9]+$/.test(tokenFromPath)) {
      // This is a verification token - verify it with backend
      verifyToken(tokenFromPath);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      // The backend route /admin/verify/:token will handle this and redirect
      // But since we're on the frontend, we need to call the backend API
      const response = await fetch(`/api/admin/verify/${token}`, {
        method: 'GET',
        redirect: 'manual' // Don't follow redirects automatically
      });

      if (response.status === 302) {
        // Backend redirected - get the redirect URL
        const redirectUrl = response.headers.get('location');
        if (redirectUrl) {
          // Extract token from redirect URL
          const url = new URL(redirectUrl);
          const token = url.searchParams.get('token');
          const verified = url.searchParams.get('verified');

          if (token && verified) {
            localStorage.setItem('adminToken', token);
            navigate('/admin/dashboard');
          } else {
            setError('Verification failed. Please try logging in again.');
          }
        }
      } else {
        setError('Invalid verification link. Please try logging in again.');
      }
    } catch (error) {
      console.error('Token verification error:', error);
      setError('Verification failed. Please try logging in again.');
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/api/admin/login', credentials);

      if (response.data.success) {
        setSuccess(response.data.message || 'Verification email sent! Please check your email.');
        setCredentials({ email: '', password: '' }); // Clear form
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access the admin panel
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={credentials.email}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={credentials.password}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;