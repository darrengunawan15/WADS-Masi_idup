import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import imgplaceholder from '../../assets/img-placeholder.webp';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';

const CreateAccount = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
                <div
                    className="w-1/2 bg-cover bg-center rounded-l-lg"
                    style={{ backgroundImage: `url(${imgplaceholder})` }}
                ></div>

                <div className="w-full sm:w-1/2 p-8 flex justify-center items-center bg-gray-50 rounded-r-lg">
                    <div className="w-full max-w-md space-y-6">
                        <h2 className="text-2xl font-bold text-center text-[var(--blush)]">Create Account</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--blush)]"
                                    placeholder="Create a password"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-[var(--blush)] text-white rounded-md text-lg font-semibold hover:bg-[var(--roseberry)] transition-colors"
                            >
                                Create Account
                            </button>

                            <button
                                type="button"
                                className="w-full py-3 bg-red-500 text-white rounded-md text-lg font-semibold mt-4 hover:bg-red-600 transition-colors"
                            >
                                Sign up with Google
                            </button>
                        </form>

                        <div className="text-center text-sm text-gray-600 mt-4">
                            <span>Already have an account? </span>
                            <button onClick={redirectToLogin} className="text-[var(--blush)] hover:underline">
                                Log in
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateAccount;