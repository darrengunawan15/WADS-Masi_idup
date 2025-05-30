import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = ({ staffName }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleProfileClick = () => {
        navigate('/profile');
        setIsMenuOpen(false);
    };

    const handleLogout = () => {
        setShowLogoutModal(true);
        setIsMenuOpen(false);
    };

    const confirmLogout = () => {
        navigate('/');
    };

    return (
        <>
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back, {staffName}!</p>
                </div>
                <div className="flex items-center gap-4 relative" ref={menuRef}>
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-800">{staffName}</p>
                        <p className="text-xs text-gray-500">Support Staff</p>
                    </div>
                    <div 
                        className="w-12 h-12 rounded-full bg-[var(--hotpink)] flex items-center justify-center text-white font-semibold text-lg cursor-pointer hover:bg-[var(--roseberry)] transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {staffName.split(' ').map(n => n[0]).join('')}
                    </div>

                    {/* Popup Menu */}
                    {isMenuOpen && (
                        <div className="absolute right-0 top-14 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                            <button
                                onClick={handleProfileClick}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Profile
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Logout Verification Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 backdrop-blur-md bg-white/30 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Logout</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md cursor-pointer"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DashboardHeader; 