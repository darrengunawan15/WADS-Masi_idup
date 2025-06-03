import React, { Component, useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react"; 
import imgplaceholder from '../assets/img-placeholder.webp';
import risolImage from "../assets/risol.png"; 
import macaroniImage from "../assets/macaroni.png";
import bakcang from '../assets/bakcang.jpg';
import bubur from '../assets/bubur.jpg';
import hekeng from '../assets/hekeng.jpg';
import risol1 from '../assets/risol1.jpg';
import risolcake from '../assets/risol_cake.jpg';
import siomay from '../assets/siomay.jpg';
import macaroniBrule from '../assets/macaroni_brule.jpg';
import Jay from '../assets/Jay.png';
import Cooking from '../assets/Cooking.png';

class Home extends Component {
    render() {
        const ProductCarousel = () => {
            const scrollRef = useRef(null);
            const [productList, setProductList] = useState([
                { id: 1, name: "Bakcang", image: bakcang },
                { id: 2, name: "Bubur", image: bubur },
                { id: 3, name: "Hekeng", image: hekeng },
                { id: 4, name: "Risol", image: risol1 },
                { id: 5, name: "Risol Cake", image: risolcake },
                { id: 6, name: "Siomay", image: siomay },
                { id: 7, name: "Macaroni Brule", image: macaroniBrule },
            ]);
        
            // ID counter to prevent duplicate keys
            const idCounter = useRef(productList.length + 1);
        
            // Auto scroll effect
            useEffect(() => {
                const scrollInterval = setInterval(() => {
                    if (scrollRef.current) {
                        scrollRef.current.scrollBy({
                            left: 1,
                            behavior: "smooth",
                        });
                    }
                }, 30); // Adjust speed by changing this value (lower = faster)
        
                return () => clearInterval(scrollInterval);
            }, []);
        
            const handleScroll = () => {
                const container = scrollRef.current;
                if (!container) return;
        
                const scrollRightEdge = container.scrollLeft + container.clientWidth;
                const scrollThreshold = container.scrollWidth - 300; // Trigger before actual end
        
                if (scrollRightEdge >= scrollThreshold) {
                    const newProducts = productList.map((product) => ({
                        ...product,
                        id: idCounter.current++,
                    }));
                    setProductList((prev) => [...prev, ...newProducts]);
                }
            };
        
            return (
                <div className="relative bg-[#683949] py-24 w-full" id='products'>
                    <div className="px-4">
                        <h2 className="text-white text-5xl font-bold drop-shadow-lg text-center mb-8">Our Products</h2>
                        <p className="text-lg text-center mb-8 text-white">
                            Discover our handcrafted delights, each product is thoughtfully prepared with premium ingredients, bringing homemade goodness and vibrant flavors to your table.
                        </p>
                    </div>
        
                    {/* Product Scroll Container */}
                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="flex space-x-6 overflow-x-auto scroll-smooth px-8 py-4"
                        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
                    >
                        {productList.map((product) => (
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
                <div className="bg-[#FFC4CE] py-12 px-4" id='faqs'>
                    <h2 className="text-white text-8xl font-bold drop-shadow-lg text-center mb-8">FaQs</h2>
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
        <div className="bg-[#FFC4CE] py-12 px-4" id='discover'>
            <div className="flex justify-center mb-12">
                <h2 className="text-white text-8xl font-bold drop-shadow-lg text-center">Kitchen Serve+</h2>
            </div>

            <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-12">
                <div className="bg-[#F47CA6] rounded-[40px] p-6 text-white w-full md:w-[895px] md:h-[365px]">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Discover Us</h2>
                    <p className="text-base leading-7">
                      We take immense pride in our handcrafted selections, made from quality ingredients and seasoned with a personal touch that makes each bite memorable. From our savory classics like Siomay and Hekeng, to our uniquely creative offerings like the golden, crispy Risol Cake, every product is a testament to our commitment to excellence and authenticity.

You can experience the essence of Cihen Kitchen beyond the plate by visiting our Instagram page @cihen_kitchen. There, you'll find a vibrant showcase of our latest creations, seasonal specials, behind-the-scenes preparation stories, and heartfelt customer testimonials. Our feed is more than just photos — it's a window into our kitchen and the love we pour into everything we do.

We update regularly with exciting new content to keep you inspired and connected. 
                            </p>
                </div>
                <img className="rounded-[40px] w-full max-w-[270px]" src={Jay} alt="Discover Us" />
            </div>

            <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                <img className="rounded-[40px] w-full max-w-[270px]" src={Cooking} alt="Contact Us" />
                <div className="bg-white rounded-[40px] p-6 text-black w-full md:w-[895px] md:h-[365px]">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h2>
                    <p className="text-base leading-7">
                    The fastest and most convenient way to reach us is through WhatsApp at +62 888-1762-606. Our dedicated customer service team is available to answer your inquiries, take your orders, and offer personalized recommendations tailored to your taste and needs. We value every interaction and aim to make your communication with us as smooth, friendly, and responsive as possible.

We believe in building relationships, not just transactions. Whether you're a loyal returning customer or someone curious to try us for the first time, your questions and feedback are always welcome. No inquiry is too small — from checking ingredient details and confirming delivery times to helping you decide between our delicious Risol Cake or comforting Bubur, we're just a message away.
                     </p>
                </div>
            </div>
        </div>
    );

        return (
            <main className="flex-grow">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className='py-16'></div>
                {/* Hero Section */}
                <section className="flex flex-col md:flex-row items-center justify-center py-16 px-8 bg-[#FFC4CE] rounded-3xl">
                <div className="md:w-1/2 mb-8 md:mb-0 md:px-8">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center md:text-left">
                    Savor the Comfort, Taste the Love
                    </h2>
                    <p className="text-lg text-[#683949] text-center md:text-left">
                    Indulge in the rich, creamy, and irresistibly cheesy goodness that brings warmth to your heart 
                    and a smile to your face. At Cihen Kitchen, we believe that comfort food is more than just a meal,
                    it's a memory, a moment, a feeling of home. Our dishes are carefully crafted using time-honored recipes, 
                    high-quality ingredients, and a generous helping of love. Whether you're enjoying a quiet night in or 
                    sharing with family and friends, every bite is designed to nourish both your body and soul. 
                    Come experience the magic where tradition meets modern delight, because great food should always feel this good.
                    </p>
                </div>
                <div className="md:w-1/2 w-full md:px-8">
                    <img
                    src={macaroniImage}
                    alt="Hero visual"
                    className="w-full h-auto rounded-xl object-cover"
                    />
                </div>
                </section>


                {/* About Us */}
                <section className="flex flex-col md:flex-row items-center py-16 px-4 bg-gray-100 mt-12 rounded-3xl" id='about'>
                <div className="md:w-1/2 mb-8 md:mb-0">
                    <img
                        src={risolImage}
                        alt="About us"
                        className="w-full h-auto rounded-xl object-cover"
                    />
                </div>

                <div className="md:w-1/2 md:pl-12 text-lg text-gray-700 text-justify">
                    <h2 className="text-[#683949] text-4xl md:text-5xl font-bold mb-6 text-center mx-auto w-full">
                        About Us
                    </h2>
                    <p>
                        At Cihen Kitchen, we believe that food is more than just sustenance it's an experience. Founded with a passion for culinary creativity and a deep appreciation for authentic flavors, we strive to bring people together through delicious, thoughtfully prepared meals. Our kitchen blends traditional techniques with modern inspiration, offering a diverse menu that caters to all tastes.
                    </p>
                    <p className="mt-4">
                        Whether you're dining in or ordering for a special event, Cihen Kitchen promises quality ingredients, warm service, and unforgettable flavors in every bite. Join us on a journey where food meets heart.
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
