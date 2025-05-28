import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/react.svg';
import imgplaceholder from '../assets/img-placeholder.webp';

const NavbarStaff = () => {
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const sidebarRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsCollapsed(true);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogoClick = () => {
        setIsCollapsed(true);
        navigate('/dashboard-staff');
    };

    const handleLogout = () => {
        setIsCollapsed(true);
        navigate('/');
    };

    const handleLogoutClick = (e) => {
        e.stopPropagation();
        setShowLogoutConfirm(true);
    };

    const handleConfirmLogout = (e) => {
        e.stopPropagation();
        setShowLogoutConfirm(false);
        handleLogout();
    };

    const handleCancelLogout = (e) => {
        e.stopPropagation();
        setShowLogoutConfirm(false);
    };

    const handleDashboardClick = () => {
        setIsCollapsed(true);
        navigate('/dashboard-staff');
    };

    const handleTicketsClick = () => {
        setIsCollapsed(true);
        navigate('/manage-tickets');
    };

    const handleSupportClick = () => {
        setIsCollapsed(true);
        navigate('/customer-support');
    };

    const handleSidebarClick = () => {
        if (isCollapsed) {
            setIsCollapsed(false);
        }
    };

    const textTransitionClass = `transition-all duration-300 ease-in-out whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`;

    return (
        <>
            <div 
                ref={sidebarRef}
                className={`h-screen bg-white shadow-lg transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} fixed z-50`}
                onClick={handleSidebarClick}
            >
                <div className="flex flex-col h-full">
                    {/* Logo and Title */}
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <img
                                src={logo}
                                alt="Logo"
                                className="h-10 cursor-pointer flex-shrink-0"
                                onClick={handleLogoClick}
                            />
                            <h2 className={`text-[var(--blush)] text-xl font-bold ${textTransitionClass} leading-tight cursor-pointer`} onClick={handleLogoClick}>
                                Kitchen<br />Serve+
                            </h2>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 px-4 py-6">
                        <ul className="space-y-4">
                            <li>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDashboardClick();
                                    }}
                                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-[var(--roseberry)] font-semibold cursor-pointer"
                                >
                                    <span className="text-xl w-6 flex items-center justify-center flex-shrink-0">📊</span>
                                    <span className={textTransitionClass}>
                                        Dashboard
                                    </span>
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleTicketsClick();
                                    }}
                                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-[var(--roseberry)] font-semibold cursor-pointer"
                                >
                                    <span className="text-xl w-6 flex items-center justify-center flex-shrink-0">🎫</span>
                                    <span className={textTransitionClass}>
                                        Manage Tickets
                                    </span>
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSupportClick();
                                    }}
                                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-[var(--roseberry)] font-semibold cursor-pointer"
                                >
                                    <span className="text-xl w-6 flex items-center justify-center flex-shrink-0">💬</span>
                                    <span className={textTransitionClass}>
                                        Customer Support
                                    </span>
                                </button>
                            </li>
                        </ul>
                    </nav>

                    {/* Logout Button */}
                    <div className="p-2 px-5 border-t">
                        <button
                            onClick={handleLogoutClick}
                            className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 text-[var(--roseberry)] font-semibold cursor-pointer"
                        >
                            <span className="text-xl w-6 flex items-center justify-center flex-shrink-0">🚪</span>
                            <span className={textTransitionClass}>
                                Logout
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Logout Confirmation Popup */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={handleCancelLogout}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmLogout}
                                className="px-4 py-2 bg-[var(--roseberry)] text-white rounded-lg hover:bg-[var(--hotpink)] transition-colors cursor-pointer"
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

export default NavbarStaff;