import React, { Component, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react"; 
import imgplaceholder from '../assets/img-placeholder.webp';

class Home extends Component {
    render() {
        const ProductCarousel = () => {
            const scrollRef = useRef(null);

            const scroll = (direction) => {
                if (scrollRef.current) {
                    scrollRef.current.scrollBy({
                        left: direction === "left" ? -300 : 300,
                        behavior: "smooth",
                    });
                }
            };

            const products = [
                { id: 1, name: "Product 1", image: imgplaceholder },
                { id: 2, name: "Product 2", image: imgplaceholder },
                { id: 3, name: "Product 3", image: imgplaceholder },
                { id: 4, name: "Product 4", image: imgplaceholder },
                { id: 5, name: "Product 5", image: imgplaceholder },
                { id: 6, name: "Product 6", image: imgplaceholder },
                { id: 7, name: "Product 7", image: imgplaceholder },
            ];

            return (
                <div className="relative bg-[#683949] py-12 w-full">
                    <div className="px-4">
                        <h2 className="text-white text-5xl font-bold drop-shadow-lg text-center mb-8">Our Products</h2>
                        <p className="text-lg text-center mb-8 text-white">
                            Explore our amazing products that are designed with quality and precision.
                        </p>
                    </div>

                    {/* Arrow Buttons */}
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow hover:bg-gray-100"
                    >
                        <ChevronLeft className="text-[#683949]" />
                    </button>

                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow hover:bg-gray-100"
                    >
                        <ChevronRight className="text-[#683949]" />
                    </button>

                    {/* Product Scroll Container */}
                    <div
                        ref={scrollRef}
                        className="flex space-x-6 overflow-x-auto scroll-smooth px-8 py-4"
                        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
                    >
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="min-w-[250px] flex-shrink-0 bg-white p-4 rounded-lg shadow-lg scroll-snap-align"
                            >
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-40 object-cover rounded-lg"
                                />
                                <h3 className="mt-4 text-xl font-semibold text-center">{product.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            );
        };

        const FAQAccordion = () => {
            const [activeIndex, setActiveIndex] = useState(null);
            const toggleFAQ = (index) => setActiveIndex(prev => prev === index ? null : index);

            const faqs = [
                { question: "What is our return policy?", answer: "We offer a 30-day return policy for unused products. Please ensure that the items are in original condition." },
                { question: "How do I track my order?", answer: "You can track your order by visiting the \"Track Order\" section on our website." },
                { question: "Can I cancel my order?", answer: "Yes, orders can be canceled within 12 hours of purchase." },
                { question: "Do you offer international shipping?", answer: "Currently, we only ship within the country." }
            ];

            return (
                <div className="bg-[#FFC4CE] py-12 px-4">
                    <h2 className="text-white text-5xl font-bold drop-shadow-lg text-center mb-8">FaQs</h2>
                    <div className="max-w-7xl mx-auto px-4 space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md">
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full flex justify-between items-center text-left px-6 py-4 text-xl font-semibold text-gray-800"
                                >
                                    {faq.question}
                                    <span className={`transition-transform duration-300 text-2xl ${activeIndex === index ? 'rotate-180' : ''}`}>
                                        ▼
                                    </span>
                                </button>
                                {activeIndex === index && (
                                    <div className="px-6 pb-4">
                                        <p className="text-gray-700">{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            );
        };

        const DiscoverUs = () => (
            <div className="bg-[#FFC4CE] py-12 px-4">
                <div className="flex justify-center mb-12">
                    <h2 className="text-white text-5xl font-bold drop-shadow-lg text-center">Kitchen Serve+</h2>
                </div>

                <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-12">
                    <div className="bg-[#F47CA6] rounded-[40px] p-6 text-white w-full md:w-[895px] md:h-[365px]">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Discover Us</h2>
                        <p className="text-base leading-7">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi fermentum, libero non pulvinar dapibus...
                        </p>
                    </div>
                    <img className="rounded-[40px] w-full max-w-[270px]" src="https://placehold.co/270x366" alt="Discover Us" />
                </div>

                <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                    <img className="rounded-[40px] w-full max-w-[270px]" src="https://placehold.co/270x366" alt="Contact Us" />
                    <div className="bg-white rounded-[40px] p-6 text-black w-full md:w-[895px] md:h-[365px]">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h2>
                        <p className="text-base leading-7">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi fermentum, libero non pulvinar dapibus...
                        </p>
                    </div>
                </div>
            </div>
        );

        return (
            <main className="flex-grow">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Hero Section */}
                <section className="flex flex-col md:flex-row items-center py-16 px-4 bg-[#FFC4CE] rounded-3xl">
                <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Your Catchy Title Goes Here</h2>
                    <p className="text-lg text-white">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.
                    </p>
                </div>
                <div className="md:w-1/2 w-full">
                    <img
                    src={imgplaceholder}
                    alt="Hero visual"
                    className="w-full h-auto rounded-xl object-cover"
                    />
                </div>
                </section>

                {/* About Us */}
                <section className="flex flex-col md:flex-row items-center py-16 px-4 bg-gray-100 mt-12 rounded-3xl">
                <div className="md:w-1/2 mb-8 md:mb-0">
                    <img
                    src={imgplaceholder}
                    alt="About us"
                    className="w-full h-auto rounded-xl object-cover"
                    />
                </div>
                <div className="md:w-1/2 md:pl-12 text-lg text-gray-700">
                    <h2 className="text-[#683949] text-4xl md:text-5xl font-bold text-center md:text-left mb-6">About Us</h2>
                    <p>
                    Our company has been creating exceptional solutions that drive success for our clients. We value creativity, dedication, and innovation.
                    </p>
                    <p className="mt-4">
                    Our team consists of passionate individuals who are always striving to go above and beyond to achieve the best results.
                    </p>
                </div>
                </section>
            </div>
            

            {/* Full-Width Product Section */}
                <ProductCarousel />

                {/* Other Sections */}
                <FAQAccordion />
                <DiscoverUs />
            </main>
        );
    }
}

export default Home;
