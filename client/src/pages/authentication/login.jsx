import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import imgplaceholder from '../../assets/img-placeholder.webp'; 
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            toast.dismiss(); // Dismiss any existing toast
            toast.error('Email or password is incorrect. Please try again.');
            dispatch(reset());
        }

        if (isSuccess && user) {
            // Redirect based on user role
            if (user.role === 'admin') {
                navigate('/dashboard-admin');
            } else if (user.role === 'staff') {
                navigate('/dashboard-staff');
            } else {
                navigate('/dashboard-customer'); // Redirect customers to their dashboard
            }
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = {
            email,
            password,
        };

        dispatch(login(userData));
    };

    const redirectToCreateAccount = () => {
        navigate('/create-account'); 
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-4xl w-full flex bg-white rounded-lg shadow-lg">
                <div
                    className="w-1/2 bg-cover bg-center rounded-l-lg"
                    style={{ backgroundImage: `url(${imgplaceholder})` }}
                ></div>

                <div className="w-full sm:w-1/2 p-8 flex justify-center items-center bg-gray-50 rounded-r-lg">
                    <div className="w-full max-w-md space-y-6">
                        <h2 className="text-2xl font-bold text-center text-[var(--blush)]">Log In</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--blush)]"
                                    placeholder="Enter your email"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--blush)]"
                                    placeholder="Enter your password"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <button
                                type="submit"
                                className={`w-full py-3 bg-[var(--blush)] text-white rounded-md text-lg font-semibold transition-colors ${
                                    isLoading 
                                    ? 'opacity-50 cursor-not-allowed' 
                                    : 'hover:bg-[var(--roseberry)]'
                                }`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Logging in...' : 'Log In'}
                            </button>

                            <button
                                type="button"
                                className="w-full py-3 bg-red-500 text-white rounded-md text-lg font-semibold mt-4 hover:bg-red-600 transition-colors"
                                disabled={isLoading}
                            >
                                Sign in with Google
                            </button>
                        </form>

                        <div className="text-center text-sm text-gray-600 mt-4">
                            <span>Don't have an account? </span>
                            <button 
                                onClick={redirectToCreateAccount} 
                                className="text-[var(--blush)] hover:underline"
                                disabled={isLoading}
                            >
                                Create an account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;