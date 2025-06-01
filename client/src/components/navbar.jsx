import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/react.svg';

const Navbar = () => {
    const navigate = useNavigate(); 

    const handleLoginClick = () => {
        navigate('/login'); 
    };

    const handleLogoClick = () => {
        navigate('/');
    };

    return (
        <div className="h-24 bg-white">
            <div className="flex items-center justify-between max-w-7xl mx-auto w-full h-full px-4 lg:px-8">
                <div className="flex items-center w-1/6 min-w-[80px]">
                    <img
                        src={logo}
                        alt="Logo"
                        className="h-10 cursor-pointer"
                        onClick={handleLogoClick}
                    />
                </div>

                <div className="flex flex-col flex-grow items-center">
                    <div className="flex items-center justify-center h-1/2">
                        <h2 className="text-[var(--blush)] text-3xl md:text-4xl font-bold">Kitchen Serve+</h2>
                    </div>
                    <div className="flex space-x-8 text-[var(--roseberry)] text-lg font-semibold h-1/2 items-center">
                        <a href="#" className="hover:underline">About Us</a>
                        <a href="#" className="hover:underline">FAQs</a>
                        <a href="#" className="hover:underline">Our Products</a>
                        <a href="#" className="hover:underline">Discover Us</a>
                    </div>
                </div>

                <div className="w-1/6 flex justify-end">
                    <button
                        onClick={handleLoginClick}
                        className="py-2 px-6 bg-white text-[var(--hotpink)] border-2 border-[var(--hotpink)] rounded-[20px] hover:bg-[var(--hotpink)] hover:text-white transition-all"
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
