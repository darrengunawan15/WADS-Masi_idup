import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleRegisterClick = () => {
        navigate('/create-account');
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const navbarHeight = 96; // Height of the navbar (h-24 = 96px)
            const offset = sectionId === 'discover' ? + 100 : navbarHeight; // Negative offset for discover to scroll down more
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const handleSectionClick = (sectionId) => {
        // If we're not on the home page, navigate there first
        if (window.location.pathname !== '/') {
            navigate('/');
            // Use setTimeout to ensure navigation happens before scrolling
            setTimeout(() => {
                scrollToSection(sectionId);
            }, 100);
        } else {
            scrollToSection(sectionId);
        }
    };

    return (
        <nav className="bg-white shadow-md fixed w-full top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-24">
                    {/* Logo */}
                    <div 
                        className="flex items-center cursor-pointer"
                        onClick={handleHomeClick}
                    >
                        <img 
                            src={logo}
                            alt="Kitchen Serve Logo" 
                            className="h-16 w-auto"
                        />
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <button 
                            onClick={() => handleSectionClick('about')}
                            className="text-[var(--roseberry)] hover:text-[var(--hotpink)] font-medium cursor-pointer"
                        >
                            About Us
                        </button>
                        <button 
                            onClick={() => handleSectionClick('products')}
                            className="text-[var(--roseberry)] hover:text-[var(--hotpink)] font-medium cursor-pointer"
                        >
                            Our Products
                        </button>
                        <button 
                            onClick={() => handleSectionClick('faqs')}
                            className="text-[var(--roseberry)] hover:text-[var(--hotpink)] font-medium cursor-pointer"
                        >
                            FAQs
                        </button>
                        <button 
                            onClick={() => handleSectionClick('discover')}
                            className="text-[var(--roseberry)] hover:text-[var(--hotpink)] font-medium cursor-pointer"
                        >
                            Discover Us
                        </button>
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button
                            onClick={handleLoginClick}
                            className="w-32 px-6 py-2.5 text-[var(--hotpink)] border-2 border-[var(--hotpink)] rounded-full hover:bg-[var(--hotpink)] hover:text-white transition-all text-lg cursor-pointer"
                        >
                            Login
                        </button>
                        <button
                            onClick={handleRegisterClick}
                            className="w-32 px-6 py-2.5 bg-[var(--hotpink)] text-white rounded-full hover:bg-[var(--roseberry)] transition-all text-lg cursor-pointer"
                        >
                            Register
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-[var(--roseberry)] hover:text-[var(--hotpink)] cursor-pointer"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <button 
                                onClick={() => {
                                    handleSectionClick('about');
                                    setIsMenuOpen(false);
                                }}
                                className="w-full text-left px-3 py-2 text-[var(--roseberry)] hover:text-[var(--hotpink)] font-medium cursor-pointer"
                            >
                                About Us
                            </button>
                            <button 
                                onClick={() => {
                                    handleSectionClick('products');
                                    setIsMenuOpen(false);
                                }}
                                className="w-full text-left px-3 py-2 text-[var(--roseberry)] hover:text-[var(--hotpink)] font-medium cursor-pointer"
                            >
                                Our Products
                            </button>
                            <button 
                                onClick={() => {
                                    handleSectionClick('faqs');
                                    setIsMenuOpen(false);
                                }}
                                className="w-full text-left px-3 py-2 text-[var(--roseberry)] hover:text-[var(--hotpink)] font-medium cursor-pointer"
                            >
                                FAQs
                            </button>
                            <button 
                                onClick={() => {
                                    handleSectionClick('discover');
                                    setIsMenuOpen(false);
                                }}
                                className="w-full text-left px-3 py-2 text-[var(--roseberry)] hover:text-[var(--hotpink)] font-medium cursor-pointer"
                            >
                                Discover Us
                            </button>
                            <div className="pt-4 pb-3 border-t border-gray-200">
                                <button
                                    onClick={handleLoginClick}
                                    className="w-full text-left px-3 py-2 text-[var(--hotpink)] hover:text-[var(--roseberry)] font-medium cursor-pointer"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={handleRegisterClick}
                                    className="w-full text-left px-3 py-2 text-[var(--hotpink)] hover:text-[var(--roseberry)] font-medium cursor-pointer"
                                >
                                    Register
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
