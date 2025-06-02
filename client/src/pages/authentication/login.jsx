import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import logo from '../../assets/logo.png'; 
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
                    className="w-1/2 aspect-square bg-white rounded-l-lg flex items-center justify-center"
                >
                    <img 
                        src={logo} 
                        alt="Logo" 
                        className="w-3/4 h-auto object-contain"
                    />
                </div>

                <div className="w-1/2 p-8 flex justify-center items-center bg-gray-50 rounded-r-lg">
                    <div className="w-full max-w-md space-y-6">
                        <h2 className="text-2xl font-bold text-center text-black">Log In</h2>

                        <form onSubmit={handleSubmit} className="min-h-[400px] flex flex-col">
                            <div className="flex-1 flex flex-col justify-center">
                                <div className="space-y-6">
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
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={`w-full py-3 bg-[var(--hotpink)] text-white rounded-md text-lg font-semibold transition-colors ${
                                    isLoading 
                                    ? 'opacity-50 cursor-not-allowed' 
                                    : 'hover:bg-[var(--roseberry)]'
                                }`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Logging in...' : 'Log In'}
                            </button>
                        </form>

                        <div className="text-center text-sm text-gray-600 mt-4">
                            <span>Don't have an account? </span>
                            <button 
                                onClick={redirectToCreateAccount} 
                                className="text-blue-500 cursor-pointer hover:underline"
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