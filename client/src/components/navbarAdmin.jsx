import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/react.svg';
import imgplaceholder from '../assets/img-placeholder.webp';

const NavbarAdmin = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleLogoClick = () => {
        navigate('/');
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

    return (
        <div className="h-24 bg-white shadow">
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
                        <a href="#" className="hover:underline">Dashboard</a>
                        <a href="#" className="hover:underline">Assign Tickets</a>
                        <a href="#" className="hover:underline">Manage Status</a>
                    </div>
                </div>

                <div className="w-1/6 flex justify-end">
                    <button
                        onClick={handleProfileClick}
                        className="p-2 bg-white border-2 border-gray-300 rounded-full hover:border-[var(--hotpink)] transition-all"
                    >
                        <img
                            src={imgplaceholder} 
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover" 
                        />
                    </button>
                </div>

            </div>
        </div>
    );
};

export default NavbarAdmin;