import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const NavbarCustomer = () => {
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(true);
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
        navigate('/dashboard-customer');
    };

    const handleDashboardClick = () => {
        setIsCollapsed(true);
        navigate('/dashboard-customer');
    };

    const handleNewTicketClick = () => {
        setIsCollapsed(true);
        navigate('/mytickets');
    };

    const handleSupportClick = () => {
        setIsCollapsed(true);
        navigate('/chat-support');
    };

    const handleSidebarClick = () => {
        if (isCollapsed) {
            setIsCollapsed(false);
        }
    };

    const textTransitionClass = `transition-all duration-300 ease-in-out whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`;

    return (
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
                            className="h-10 flex-shrink-0 cursor-pointer"
                            onClick={handleLogoClick}
                        />
                        <h2 className={`text-[var(--blush)] text-xl font-bold ${textTransitionClass} leading-tight`}>
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
                                    handleNewTicketClick();
                                }}
                                className={`w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-[var(--roseberry)] font-semibold cursor-pointer ${
                                    location.pathname === '/mytickets' ? 'bg-gray-100' : ''
                                }`}
                            >
                                <span className="text-xl w-6 flex items-center justify-center flex-shrink-0">📝</span>
                                <span className={textTransitionClass}>
                                    My Tickets
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
            </div>
        </div>
    );
};

export default NavbarCustomer; 