import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTickets, getTicket, addComment, reset } from '../../redux/slices/ticketSlice';
import Spinner from '../../components/Spinner';
import { format } from 'date-fns';
import axios from 'axios';
import ticketService from '../../services/ticketService';

const ChatSupport = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarWidth, setSidebarWidth] = useState('20');
    const [activeTicketId, setActiveTicketId] = useState(null);
    const [message, setMessage] = useState('');
    const [isAIChat, setIsAIChat] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, chatId: null });
    const [aiMessages, setAiMessages] = useState([]);

    const dispatch = useDispatch();
    const { tickets, ticket: activeTicket, isLoading, isError, message: ticketError } = useSelector((state) => state.tickets);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchTickets = async () => {
            if (user?.role === 'customer') {
                // Use getCustomerTickets for customers
                const token = localStorage.getItem('accessToken');
                const customerTickets = await ticketService.getCustomerTickets(token);
                dispatch({ type: 'tickets/getAll/fulfilled', payload: customerTickets });
            } else {
                dispatch(getTickets());
            }
        };
        fetchTickets();
        return () => {
            dispatch(reset());
        };
    }, [dispatch, user]);

    useEffect(() => {
        if (activeTicketId) {
            dispatch(getTicket(activeTicketId));
        }
    }, [activeTicketId, dispatch]);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const ticketIdFromUrl = searchParams.get('ticketId');
        const chatType = searchParams.get('chat');
        
        if (chatType === 'ai') {
            setIsAIChat(true);
            setActiveTicketId(null);
        } else if (ticketIdFromUrl) {
            setActiveTicketId(ticketIdFromUrl);
            setIsAIChat(false);
        }
    }, [location.search, tickets]);

    useEffect(() => {
        const handleResize = () => {
            const sidebar = document.querySelector('[class*="w-20"]');
            if (sidebar) {
                const width = sidebar.classList.contains('w-20') ? '20' : '64';
                setSidebarWidth(width);
            }
        };

        handleResize();
        const observer = new MutationObserver(handleResize);
        const sidebar = document.querySelector('[class*="w-20"]');
        if (sidebar) {
            observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] });
        }

        return () => observer.disconnect();
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeTicket?.comments]);

    useEffect(() => {
        // If not in AI chat, no ticket selected, and there are tickets, select the first ticket by default
        if (!isAIChat && !activeTicketId && tickets && tickets.length > 0) {
            setActiveTicketId(tickets[0]._id);
        }
    }, [isAIChat, activeTicketId, tickets]);

    useEffect(() => {
        // If AI chat is selected and there are no AI messages, show a local greeting from the AI
        if (isAIChat && aiMessages.length === 0) {
            setAiMessages([{ sender: 'ai', content: 'Hello! How can I assist you today?' }]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAIChat]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        if (isAIChat) {
            setAiMessages(prev => [...prev, { sender: 'user', content: message }]);
            try {
                const response = await axios.post('/api/ai-chat', {
                    message // Only send the message field
                });
                // Denser AI returns { answer: "..." }
                const aiReply = response.data.answer || 'Sorry, I could not understand that.';
                setAiMessages(prev => [...prev, { sender: 'ai', content: aiReply }]);
            } catch (err) {
                console.error('AI API error:', err.response ? err.response.data : err);
                setAiMessages(prev => [...prev, { sender: 'ai', content: 'Sorry, there was an error contacting the AI: ' + (err.response?.data?.error || err.message) }]);
            }
        } else if (activeTicketId) {
            const commentData = {
                content: message,
                ticketId: activeTicketId,
            };
            await dispatch(addComment(commentData));
            await dispatch(getTicket(activeTicketId));
        }
        setMessage('');
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && activeTicketId) {
            const formData = new FormData();
            formData.append('file', file);
            // TODO: Implement file upload
            console.log('File upload initiated for ticket', activeTicketId, ':', file.name);
        }
    };

    const handleAIChat = () => {
        setIsAIChat(true);
        setActiveTicketId(null);
    };

    const handleHumanSupport = () => {
        setIsAIChat(false);
    };

    if (isLoading) {
        return <Spinner />;
    }

    console.log('activeTicket.comments:', activeTicket?.comments);

    return (
        <div className={`fixed inset-0 bg-gray-50 transition-all duration-300 ${sidebarWidth === '20' ? 'ml-20' : 'ml-64'}`}>
            <div className="h-full flex">
                {/* Chat List Sidebar */}
                <div className="w-1/3 border-r bg-white shadow-lg flex flex-col">
                    <div className="px-6 py-6 flex-shrink-0 bg-white">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-800">Messages</h2>
                        </div>
                    </div>

                    {/* Chat List */}
                    <div className="flex-1 overflow-y-auto">
                        {/* AI Assistant Chat */}
                        <div
                            onClick={handleAIChat}
                            className={`p-4 cursor-pointer transition-all duration-200 ${
                                isAIChat 
                                    ? 'bg-pink-100 border-l-4 border-[var(--hotpink)]' 
                                    : 'hover:bg-gray-50 border-l-4 border-transparent'
                            }`}
                        >
                            <div className="flex items-center space-x-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl text-white shadow-md ${
                                    isAIChat
                                        ? 'bg-[var(--hotpink)]'
                                        : 'bg-gradient-to-br from-[var(--hotpink)] to-[var(--roseberry)]'
                                }`}>
                                    AI
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3 className={`text-sm font-semibold truncate ${
                                            isAIChat ? 'text-gray-900' : 'text-gray-900'
                                        }`}>
                                            AI Assistant
                                        </h3>
                                        <span className={`text-xs ${
                                            isAIChat ? 'text-gray-600' : 'text-gray-500'
                                        }`}>
                                            Available 24/7
                                        </span>
                                    </div>
                                    <p className={`text-sm truncate ${
                                        isAIChat ? 'text-gray-700' : 'text-gray-500'
                                    }`}>
                                        Get instant help from our AI
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Human Support Tickets (from backend only) */}
                        {tickets.map((ticket) => (
                            <div
                                key={ticket._id}
                                onClick={() => {
                                    setActiveTicketId(ticket._id);
                                    setIsAIChat(false);
                                }}
                                className={`p-4 cursor-pointer transition-all duration-200 ${
                                    activeTicketId === ticket._id 
                                        ? 'bg-pink-100 border-l-4 border-[var(--hotpink)]' 
                                        : 'hover:bg-gray-50 border-l-4 border-transparent'
                                }`}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl text-white shadow-md ${
                                        activeTicketId === ticket._id
                                            ? 'bg-[var(--hotpink)]'
                                            : 'bg-gradient-to-br from-[var(--hotpink)] to-[var(--roseberry)]'
                                    }`}>
                                        {ticket.assignedTo?.name ? ticket.assignedTo.name.charAt(0).toUpperCase() : 'S'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className={`text-sm font-semibold truncate ${
                                                activeTicketId === ticket._id ? 'text-gray-900' : 'text-gray-900'
                                            }`}>
                                                {ticket.assignedTo?.name || 'Support Staff'}
                                            </h3>
                                            <span className={`text-xs ${
                                                activeTicketId === ticket._id ? 'text-gray-600' : 'text-gray-500'
                                            }`}>
                                                {ticket.updatedAt ? format(new Date(ticket.updatedAt), 'MMM d, h:mm a') : 'N/A'}
                                            </span>
                                        </div>
                                        <p className={`text-sm truncate ${
                                            activeTicketId === ticket._id ? 'text-gray-700' : 'text-gray-500'
                                        }`}>
                                            {ticket.subject}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-gray-50">
                    {isAIChat ? (
                        <>
                            {/* AI Chat Header */}
                            <div className="px-6 py-4 bg-white border-b shadow-sm flex-shrink-0">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-full bg-[var(--hotpink)] flex items-center justify-center text-2xl text-white shadow-md">
                                        AI
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">AI Assistant</h3>
                                        <p className="text-sm text-gray-500">Available 24/7</p>
                                    </div>
                                </div>
                            </div>

                            {/* AI Messages Area */}
                            <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
                                {aiMessages.map((msg, idx) => (
                                    <div key={idx} className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`rounded-lg px-4 py-2 max-w-xs ${msg.sender === 'user' ? 'bg-[var(--hotpink)] text-white' : 'bg-white text-gray-800 border'}`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* AI Message Input */}
                            <div className="flex-shrink-0 bg-white px-6 py-4 border-t">
                                <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
                                    <input
                                        type="text"
                                        value={message || ''}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--hotpink)] focus:border-transparent"
                                    />
                                    <button
                                        type="submit"
                                        className="p-2 bg-[var(--hotpink)] text-white rounded-full hover:bg-[var(--roseberry)] transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : activeTicket ? (
                        <>
                            {/* Human Support Chat Header */}
                            <div className="px-6 py-4 bg-white border-b shadow-sm flex-shrink-0">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-full bg-[var(--hotpink)] flex items-center justify-center text-2xl text-white shadow-md">
                                        {activeTicket.assignedTo?.name ? activeTicket.assignedTo.name.charAt(0).toUpperCase() : 'S'}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Ticket: {activeTicket.subject}</h3>
                                        <p className="text-sm text-gray-500">Support Staff: {activeTicket.assignedTo?.name || 'Unassigned'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
                                {(activeTicket?.comments || []).map((comment, idx) => (
                                    <div key={comment._id || idx} className={`mb-4 flex ${comment.author && comment.author._id === user._id ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`rounded-lg px-4 py-2 max-w-xs ${comment.author && comment.author._id === user._id ? 'bg-[var(--hotpink)] text-white' : 'bg-white text-gray-800 border'}`}>
                                            {comment.content}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input Area */}
                            <div className="flex-shrink-0 bg-white px-6 py-4 border-t">
                                <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current.click()}
                                        className="p-2 text-gray-500 hover:text-[var(--hotpink)] transition-colors"
                                        title="Attach File"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.414 6.586a2 2 0 000 2.828l6.586 6.586a2 2 0 002.828 0L19 14.828" />
                                        </svg>
                                    </button>
                                    <input
                                        type="text"
                                        value={message || ''}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--hotpink)] focus:border-transparent"
                                    />
                                    <button
                                        type="submit"
                                        className="p-2 bg-[var(--hotpink)] text-white rounded-full hover:bg-[var(--roseberry)] transition-colors"
                                        title="Send Message"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            Select a chat from the sidebar to start messaging
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatSupport; 