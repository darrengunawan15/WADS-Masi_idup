import React, { Component } from 'react';
import imgplaceholder from '../assets/img-placeholder.webp';

class Home extends Component {
    render() {
        const ProductCarousel = () => {
            return (
                <div className="bg-gray-50 py-12 px-4">
                    <h2 className="text-3xl font-semibold text-center mb-6">Our Products</h2>
                    <p className="text-lg text-center mb-12">
                        Explore our amazing products that are designed with quality and precision.
                    </p>

                    <div className="flex overflow-x-auto space-x-4">
                        <div className="w-64 bg-white p-4 rounded-lg shadow-lg">
                            <img src={imgplaceholder} alt="Product 1" className="w-full h-40 object-cover rounded-lg" />
                            <h3 className="mt-4 text-xl font-semibold">Product 1</h3>
                        </div>
                        <div className="w-64 bg-white p-4 rounded-lg shadow-lg">
                            <img src={imgplaceholder} alt="Product 2" className="w-full h-40 object-cover rounded-lg" />
                            <h3 className="mt-4 text-xl font-semibold">Product 2</h3>
                        </div>
                        <div className="w-64 bg-white p-4 rounded-lg shadow-lg">
                            <img src={imgplaceholder} alt="Product 3" className="w-full h-40 object-cover rounded-lg" />
                            <h3 className="mt-4 text-xl font-semibold">Product 3</h3>
                        </div>
                    </div>
                </div>
            );
        };

        const FAQAccordion = () => {
            return (
                <div className="bg-gray-100 py-12 px-4">
                    <h2 className="text-3xl font-semibold text-center mb-6">Frequently Asked Questions</h2>

                    <div className="space-y-4">
                        <div className="bg-white rounded-lg shadow-md">
                            <button className="w-full text-left px-6 py-4 text-xl font-semibold text-gray-800">
                                What is our return policy?
                            </button>
                            <div className="px-6 pb-4 hidden">
                                <p className="text-gray-700">
                                    We offer a 30-day return policy for unused products. Please ensure that the items are in original condition.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md">
                            <button className="w-full text-left px-6 py-4 text-xl font-semibold text-gray-800">
                                How do I track my order?
                            </button>
                            <div className="px-6 pb-4 hidden">
                                <p className="text-gray-700">
                                    You can track your order by visiting the "Track Order" section on our website.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            );
        };

        const DeveloperCard = ({ imgSrc, name, jobTitle, description, email, socialLinks }) => {
            return (
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <img src={imgplaceholder} alt={name} className="w-24 h-24 rounded-full mx-auto" />
                    <h3 className="text-xl font-semibold mt-4 text-center">{name}</h3>
                    <p className="text-lg text-center text-gray-700">{jobTitle}</p>
                    <p className="text-gray-600 mt-2 text-center">{description}</p>
                    <p className="mt-2 text-center text-sm text-gray-600">{email}</p>

                    <div className="flex justify-center space-x-4 mt-4">
                        <a href={socialLinks.instagram} className="text-pink-500 hover:text-pink-600">
                            Instagram
                        </a>
                        <a href={socialLinks.linkedin} className="text-blue-600 hover:text-blue-700">
                            LinkedIn
                        </a>
                        <a href={socialLinks.github} className="text-gray-700 hover:text-gray-800">
                            GitHub
                        </a>
                    </div>
                </div>
            );
        };

        return (
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <section className="flex flex-col md:flex-row items-center py-16 px-4 bg-gray-50">
                        <div className="md:w-1/2 mb-8 md:mb-0">
                            <h2 className="text-3xl font-semibold text-[var(--blush)]">
                                Your Catchy Title Goes Here
                            </h2>
                            <p className="text-lg mt-4 text-gray-700">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.
                            </p>
                        </div>
                        <div
                            className="md:w-1/2 md:h-[300px] w-full h-[200px] bg-cover bg-center"
                            style={{ backgroundImage: `url(${imgplaceholder})` }}
                        >
                        </div>
                    </section>

                    <section className="flex flex-col md:flex-row items-center py-16 px-4 bg-gray-100">
                        <div className="md:w-1/2 mb-8 md:mb-0">
                            <div
                                className="w-full h-[300px] bg-cover bg-center"
                                style={{ backgroundImage: `url(${imgplaceholder})` }}
                            />
                        </div>
                        <div className="md:w-1/2 md:pl-12 text-lg text-gray-700">
                            <h3 className="text-2xl font-semibold text-[var(--blush)] mb-4">About Us</h3>
                            <p>
                                Our company has been creating exceptional solutions that drive success for our clients. We value creativity, dedication, and innovation.
                            </p>
                            <p className="mt-4">
                                Our team consists of passionate individuals who are always striving to go above and beyond to achieve the best results.
                            </p>
                        </div>
                    </section>

                    <ProductCarousel />

                    <FAQAccordion />

                    <section className="py-12 px-4 bg-gray-50">
                        <h2 className="text-3xl font-semibold text-center mb-6">Meet Our Developers</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            <DeveloperCard
                                imgSrc="/path/to/profile1.jpg"
                                name="Fajar Alfian"
                                jobTitle="Frontend Developer"
                                description="Passionate about building beautiful and functional user interfaces."
                                email="john.doe@example.com"
                                socialLinks={{
                                    instagram: "https://instagram.com/",
                                    linkedin: "https://linkedin.com/in/",
                                    github: "https://github.com/",
                                }}
                            />
                            <DeveloperCard
                                imgSrc="/path/to/profile2.jpg"
                                name="Magnus Carlsen"
                                jobTitle="Backend Developer"
                                description="Specializes in building scalable and efficient server-side applications."
                                email="jane.smith@example.com"
                                socialLinks={{
                                    instagram: "https://instagram.com/",
                                    linkedin: "https://linkedin.com/in/",
                                    github: "https://github.com/",
                                }}
                            />
                        </div>
                    </section>
                </div>
            </main>
        );
    }
}

export default Home;