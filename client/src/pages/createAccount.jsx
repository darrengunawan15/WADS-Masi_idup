import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register, reset } from '../redux/slices/authSlice';
import imgplaceholder from '../assets/img-placeholder.webp';

const CreateAccount = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: '',
        // role: 'customer', // Default role can be set here or handled on backend
    });

    const { name, email, password, password2 /*, role*/ } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            console.log(message); // You might want to display this in the UI
        }

        // Redirect when registered or logged in successfully
        if (isSuccess || user) {
            navigate('/'); // Redirect to home or login page
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (password !== password2) {
            console.log('Passwords do not match'); // You might want to display this in the UI
        } else {
            const userData = {
                name,
                email,
                password,
                // role, // Include role if you want to allow selection on frontend
            };

            dispatch(register(userData));
        }
    };

    // if (isLoading) {
    //   return <Spinner />;
    // }

    return (
        <div className="flex flex-col min-h-full max-h-screen justify-center items-center bg-gray-50 py-8">
            <div className="max-w-4xl w-full flex bg-white rounded-lg shadow-lg">
                <div
                    className="w-1/2 bg-cover bg-center rounded-l-lg"
                    style={{ backgroundImage: `url(${imgplaceholder})` }}
                ></div>

                <div className="w-full sm:w-1/2 p-8 flex justify-center items-center bg-gray-50 rounded-r-lg">
                    <div className="w-full max-w-md space-y-6">
                        <h2 className="text-2xl font-bold text-center text-[var(--blush)]">Create Account</h2>

                        <form onSubmit={onSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={name}
                                    onChange={onChange}
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
                                    name="email"
                                    value={email}
                                    onChange={onChange}
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
                                    name="password"
                                    value={password}
                                    onChange={onChange}
                                    className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--blush)]"
                                    placeholder="Create a password"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="password2" className="block text-sm font-semibold text-gray-700">Confirm Password</label>
                                <input
                                    type="password"
                                    id="password2"
                                    name="password2"
                                    value={password2}
                                    onChange={onChange}
                                    className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--blush)]"
                                    placeholder="Confirm your password"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-[var(--blush)] text-white rounded-md text-lg font-semibold hover:bg-[var(--roseberry)] transition-colors"
                            >
                                Register
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
                            <button onClick={() => navigate('/login')} className="text-[var(--blush)] hover:underline">
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