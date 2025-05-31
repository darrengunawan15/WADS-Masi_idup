import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../../components/DashboardHeader';
import { useSelector } from 'react-redux';

const Chatbot = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            content: 'Hello! I\'m your AI assistant. How can I help you today?'
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        // Add user message
        const userMessage = {
            type: 'user',
            content: inputMessage
        };
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');

        // Simulate AI response (replace with actual AI integration)
        setTimeout(() => {
            const botResponse = {
                type: 'bot',
                content: 'I understand your concern. Let me help you with that. Could you please provide more details about your issue?'
            };
            setMessages(prev => [...prev, botResponse]);
        }, 1000);
    };

    return (
        <div className="flex-1 bg-gray-50 p-6 h-screen overflow-hidden ml-20">
            <DashboardHeader staffName={user?.name || 'Customer'} />

            <div className="h-full flex flex-col space-y-6 pt-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">AI Assistant</h2>
                    <button
                        onClick={() => navigate('/dashboard-customer')}
                        className="px-4 py-2 text-[var(--hotpink)] hover:text-[var(--roseberry)] transition-colors"
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                {/* Chat Container */}
                <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[70%] rounded-lg p-3 ${
                                        message.type === 'user'
                                            ? 'bg-[var(--hotpink)] text-white'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {message.content}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="border-t p-4">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--hotpink)]"
                            />
                            <button
                                type="submit"
                                className="px-6 py-2 bg-[var(--hotpink)] text-white rounded-lg hover:bg-[var(--roseberry)] transition-colors"
                            >
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chatbot; 