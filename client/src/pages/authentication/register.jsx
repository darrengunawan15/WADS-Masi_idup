import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';

const CreateAccount = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isSuccess, isError, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isError) {
            if (message?.includes('already exists')) {
                toast.error('This email address is already registered. Please use a different email or try logging in.');
            } else {
                toast.error(message || 'Registration failed. Please try again.');
            }
            dispatch(reset());
        }

        if (isSuccess) {
            toast.success('Account created successfully! Please log in.');
            navigate('/login');
            dispatch(reset());
        }
    }, [isError, isSuccess, message, navigate, dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(register({ name, email, password, role: 'customer' })).unwrap();
        } catch (error) {
            // Error is already handled in the useEffect
            console.error('Registration error:', error);
        }
    };

    const redirectToLogin = () => {
        navigate('/login'); 
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-4xl w-full flex bg-white rounded-lg shadow-lg">
                <div className="w-1/2 p-8 flex justify-center items-center bg-gray-50 rounded-l-lg">
                    <div className="w-full max-w-md space-y-6">
                        <h2 className="text-2xl font-bold text-center text-black">Create Account</h2>

                        <form onSubmit={handleSubmit} className="min-h-[400px] flex flex-col">
                            <div className="flex-1 flex flex-col justify-center">
                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--blush)]"
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--blush)]"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--blush)] pr-10"
                                                placeholder="Create a password"
                                                required
                                            />
                                            <button
                                                type="button"
                                                tabIndex={-1}
                                                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-700 focus:outline-none"
                                                onClick={() => setShowPassword((v) => !v)}
                                            >
                                                {showPassword ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2"/></svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.832-.64 1.624-1.09 2.354M15.54 15.54A5.978 5.978 0 0112 17c-3.314 0-6-2.686-6-6 0-.657.1-1.29.282-1.885" /></svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-[var(--hotpink)] text-white rounded-md text-lg font-semibold hover:bg-[var(--roseberry)] transition-colors"
                            >
                                Create Account
                            </button>
                        </form>

                        <div className="text-center text-sm text-gray-600 mt-4">
                            <span>Already have an account? </span>
                            <button onClick={redirectToLogin} className="text-blue-500 cursor-pointer hover:underline">
                                Log in
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className="w-1/2 aspect-square bg-white rounded-r-lg flex items-center justify-center"
                >
                    <img 
                        src={logo} 
                        alt="Logo" 
                        className="w-3/4 h-auto object-contain"
                    />
                </div>
            </div>
        </div>
    );
};

export default CreateAccount;