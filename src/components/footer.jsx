import React, { Component } from 'react';
import logo from '../assets/react.svg';

class Footer extends Component {
    render() {
        return (
            <footer className="bg-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between gap-12">
                    <div className="md:w-1/2">
                        <div className="flex items-center space-x-3 mb-4">
                            <img src={logo} alt="Logo" className="h-10 w-auto" />
                            <span className="text-xl font-bold text-[var(--blush)]">Kitchen Serve+</span>
                        </div>
                        <p className="text-sm mb-6 text-gray-700">We connect people through creativity and purpose.</p>
                        <div className="flex space-x-4">
                            <a
                                href="https://api.whatsapp.com/send?phone=628881762606"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                            >
                                WhatsApp
                            </a>
                            <a
                                href="https://www.instagram.com/cihen_kitchen/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded"
                            >
                                Instagram
                            </a>
                        </div>
                    </div>

                    <div className="md:w-1/2 flex flex-col sm:flex-row justify-between gap-12">
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-3 text-[var(--blush)]">Quick Links</h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li><a href="#" className="hover:underline">About Us</a></li>
                                <li><a href="#" className="hover:underline">FAQs</a></li>
                                <li><a href="#" className="hover:underline">Discover Us</a></li>
                            </ul>
                        </div>

                        <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-3 text-[var(--blush)]">Contact</h3>
                            <p className="text-sm text-gray-700">
                                Jl. Pluit Selatan., RW.9, Pluit, Kec. Penjaringan, Jakarta Utara
                            </p>
                            <p className="text-sm mt-2 text-gray-700">Phone: 0888-176-2606</p>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer;