import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomerSupport = () => {
    const navigate = useNavigate();
    const [sidebarWidth, setSidebarWidth] = useState('20');
    const [selectedChat, setSelectedChat] = useState(null);
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, chatId: null });
    const [showArchived, setShowArchived] = useState(false);

    // Mock data for chats
    const [chats, setChats] = useState([
        {
            id: 1,
            name: 'John Doe',
            lastMessage: 'I need help with my order',
            time: '10:30 AM',
            unread: 2,
            avatar: '👨',
            archived: false,
            messages: [
                { id: 1, sender: 'customer', text: 'Hello, I need help with my order', time: '10:25 AM' },
                { id: 2, sender: 'staff', text: 'Hi! How can I help you today?', time: '10:26 AM' },
                { id: 3, sender: 'customer', text: 'I need help with my order', time: '10:30 AM' },
            ]
        },
        {
            id: 2,
            name: 'Jane Smith',
            lastMessage: 'Received wrong item',
            time: '9:45 AM',
            unread: 0,
            avatar: '👩',
            archived: false,
            messages: [
                { id: 1, sender: 'customer', text: 'Hi, I received the wrong item', time: '9:40 AM' },
                { id: 2, sender: 'staff', text: 'I apologize for the inconvenience. Could you please provide your order number?', time: '9:42 AM' },
                { id: 3, sender: 'customer', text: 'Received wrong item', time: '9:45 AM' },
            ]
        },
        {
            id: 3,
            name: 'Sam Wilson',
            lastMessage: "Can't log into my account",
            time: 'Yesterday',
            unread: 1,
            avatar: '👨',
            archived: true,
            messages: [
                { id: 1, sender: 'customer', text: "I can't log into my account", time: 'Yesterday' },
                { id: 2, sender: 'staff', text: 'Let me help you with that. Have you tried resetting your password?', time: 'Yesterday' },
            ]
        }
    ]);

    // Function to sort chats by most recent message
    const sortChatsByRecent = (chatList) => {
        return [...chatList].sort((a, b) => {
            // Convert time strings to comparable values
            const getTimeValue = (timeStr) => {
                if (timeStr === 'Yesterday') return new Date().getTime() - 86400000; // 24 hours ago
                const [time, period] = timeStr.split(' ');
                const [hours, minutes] = time.split(':');
                let hour = parseInt(hours);
                if (period === 'PM' && hour !== 12) hour += 12;
                if (period === 'AM' && hour === 12) hour = 0;
                return new Date().setHours(hour, parseInt(minutes), 0, 0);
            };

            const timeA = getTimeValue(a.time);
            const timeB = getTimeValue(b.time);
            
            // Sort by time (latest to earliest)
            return timeB - timeA;
        });
    };

    // State for sorted chats
    const [sortedChats, setSortedChats] = useState(sortChatsByRecent(chats));

    // Update sorted chats whenever chats change
    useEffect(() => {
        setSortedChats(sortChatsByRecent(chats));
    }, [chats]);

    // Toggle sidebar width and navigate
    const handleLogoClick = () => {
        setSidebarWidth('20');
        navigate('/dashboard-staff');
    };

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
    }, [selectedChat?.messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message.trim() || !selectedChat) return;

        const newMessage = {
            id: selectedChat.messages.length + 1,
            sender: 'staff',
            text: message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // Update the selected chat's messages and move it to top
        const updatedChats = chats.map(chat => {
            if (chat.id === selectedChat.id) {
                return {
                    ...chat,
                    messages: [...chat.messages, newMessage],
                    lastMessage: message,
                    time: newMessage.time,
                    unread: 0 // Mark as read for active chat
                };
            }
            return chat;
        });

        setChats(updatedChats);
        setSelectedChat(updatedChats.find(chat => chat.id === selectedChat.id));
        setMessage('');

        // Simulate customer response after 2 seconds
        setTimeout(() => {
            const customerResponse = {
                id: selectedChat.messages.length + 2,
                sender: 'customer',
                text: 'Thank you for your help!',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            const updatedChatsWithResponse = chats.map(chat => {
                if (chat.id === selectedChat.id) {
                    return {
                        ...chat,
                        messages: [...chat.messages, newMessage, customerResponse],
                        lastMessage: customerResponse.text,
                        time: customerResponse.time,
                        unread: 0 // Keep as read for active chat
                    };
                }
                return chat;
            });

            setChats(updatedChatsWithResponse);
            setSelectedChat(updatedChatsWithResponse.find(chat => chat.id === selectedChat.id));
        }, 2000);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Here you would typically upload the file to your backend
            console.log('Uploading file:', file.name);
        }
    };

    // Handle context menu
    const handleContextMenu = (e, chatId) => {
        e.preventDefault();
        const menuWidth = 200; // Approximate width of the menu
        const windowWidth = window.innerWidth;
        
        // Calculate position to keep menu within viewport
        let x = e.clientX;
        let y = e.clientY + 10; // Always show below cursor with 10px padding
        
        // Adjust horizontal position if menu would go off screen
        if (x + menuWidth > windowWidth) {
            x = windowWidth - menuWidth - 10;
        }
        
        setContextMenu({
            show: true,
            x,
            y,
            chatId
        });
    };

    // Close context menu when clicking outside
    useEffect(() => {
        const handleClick = () => setContextMenu({ show: false, x: 0, y: 0, chatId: null });
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    // Handle context menu actions
    const handleContextMenuAction = (action, chatId) => {
        switch (action) {
            case 'markUnread':
                setChats(chats.map(chat => 
                    chat.id === chatId ? { ...chat, unread: chat.unread + 1 } : chat
                ));
                break;
            case 'markRead':
                setChats(chats.map(chat => 
                    chat.id === chatId ? { ...chat, unread: 0 } : chat
                ));
                break;
            case 'archive':
                setChats(chats.map(chat => 
                    chat.id === chatId ? { ...chat, archived: true } : chat
                ));
                break;
            case 'unarchive':
                setChats(chats.map(chat => 
                    chat.id === chatId ? { ...chat, archived: false } : chat
                ));
                break;
            case 'delete':
                setChats(chats.filter(chat => chat.id !== chatId));
                if (selectedChat?.id === chatId) {
                    setSelectedChat(null);
                }
                break;
            default:
                break;
        }
        setContextMenu({ show: false, x: 0, y: 0, chatId: null });
    };

    // Filter chats based on archive status
    const filteredChats = sortedChats.filter(chat => chat.archived === showArchived);

    return (
        <div className={`fixed inset-0 bg-gray-50 transition-all duration-300 ${sidebarWidth === '20' ? 'ml-20' : 'ml-64'}`}>
            <div className="h-full flex">
                {/* Chat List Sidebar */}
                <div className="w-1/3 border-r bg-white shadow-lg flex flex-col">
                    <div className="px-6 py-6 flex-shrink-0 bg-white">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Messages
                            </h2>
                            <button
                                onClick={() => setShowArchived(!showArchived)}
                                className="w-32 px-4 py-2 text-sm font-medium text-[var(--hotpink)] bg-gray-100 hover:bg-gray-200 rounded-full transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                                <span>{showArchived ? 'Active' : 'Archived'}</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {filteredChats.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => {
                                    const updatedChats = chats.map(c => 
                                        c.id === chat.id ? { ...c, unread: 0 } : c
                                    );
                                    setChats(updatedChats);
                                    setSelectedChat(updatedChats.find(c => c.id === chat.id));
                                }}
                                onContextMenu={(e) => handleContextMenu(e, chat.id)}
                                className={`p-4 cursor-pointer transition-all duration-200 ${
                                    selectedChat?.id === chat.id 
                                        ? 'bg-pink-100 border-l-4 border-[var(--hotpink)]' 
                                        : 'hover:bg-gray-50 border-l-4 border-transparent'
                                }`}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl text-white shadow-md ${
                                        selectedChat?.id === chat.id
                                            ? 'bg-[var(--hotpink)]'
                                            : 'bg-gradient-to-br from-[var(--hotpink)] to-[var(--roseberry)]'
                                    }`}>
                                        {chat.avatar}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className={`text-sm font-semibold truncate ${
                                                selectedChat?.id === chat.id ? 'text-gray-900' : 'text-gray-900'
                                            }`}>
                                                {chat.name}
                                            </h3>
                                            <span className={`text-xs ${
                                                selectedChat?.id === chat.id ? 'text-gray-600' : 'text-gray-500'
                                            }`}>
                                                {chat.time}
                                            </span>
                                        </div>
                                        <p className={`text-sm truncate ${
                                            selectedChat?.id === chat.id ? 'text-gray-700' : 'text-gray-500'
                                        }`}>
                                            {chat.lastMessage}
                                        </p>
                                    </div>
                                    {chat.unread > 0 && selectedChat?.id !== chat.id && (
                                        <div className="w-5 h-5 rounded-full bg-[var(--hotpink)] text-white text-xs flex items-center justify-center shadow-sm">
                                            {chat.unread}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Context Menu */}
                {contextMenu.show && (
                    <div 
                        className="fixed bg-white rounded-lg shadow-lg py-2 z-50 min-w-[200px]"
                        style={{ 
                            top: contextMenu.y, 
                            left: contextMenu.x,
                            transform: 'none'
                        }}
                    >
                        {!showArchived ? (
                            <>
                                <button
                                    onClick={() => handleContextMenuAction('markUnread', contextMenu.chatId)}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span>Mark as unread</span>
                                </button>
                                <button
                                    onClick={() => handleContextMenuAction('markRead', contextMenu.chatId)}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Mark as read</span>
                                </button>
                                <button
                                    onClick={() => handleContextMenuAction('archive', contextMenu.chatId)}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                    </svg>
                                    <span>Archive chat</span>
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => handleContextMenuAction('unarchive', contextMenu.chatId)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                </svg>
                                <span>Unarchive chat</span>
                            </button>
                        )}
                        <div className="border-t my-1"></div>
                        <button
                            onClick={() => handleContextMenuAction('delete', contextMenu.chatId)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Delete chat</span>
                        </button>
                    </div>
                )}

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-gray-50">
                    {selectedChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="px-6 py-4 bg-white border-b shadow-sm flex-shrink-0">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-full bg-[var(--hotpink)] flex items-center justify-center text-2xl text-white shadow-md">
                                        {selectedChat.avatar}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{selectedChat.name}</h3>
                                        <p className="text-sm text-gray-500">Online</p>
                                    </div>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                                {selectedChat.messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sender === 'staff' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[70%] rounded-2xl p-4 shadow-sm ${
                                                msg.sender === 'staff'
                                                    ? 'bg-[var(--hotpink)] text-white'
                                                    : 'bg-white text-gray-800'
                                            }`}
                                        >
                                            <p className="text-sm">{msg.text}</p>
                                            <span className={`text-xs mt-1 block ${
                                                msg.sender === 'staff' ? 'text-white text-opacity-70' : 'text-gray-500'
                                            }`}>
                                                {msg.time}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input */}
                            <div className="p-6 bg-white border-t shadow-lg flex-shrink-0">
                                <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-2 text-gray-500 hover:text-[var(--hotpink)] transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                        </svg>
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 p-3 border rounded-full focus:outline-none focus:border-[var(--hotpink)] focus:ring-2 focus:ring-[var(--hotpink)] focus:ring-opacity-20"
                                    />
                                    <button
                                        type="submit"
                                        className="p-3 bg-[var(--hotpink)] text-white rounded-full hover:opacity-90 transition-opacity shadow-md"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center bg-gray-50">
                            <div className="text-center text-gray-500">
                                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-[var(--hotpink)] to-[var(--roseberry)] flex items-center justify-center text-white shadow-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <p className="text-lg font-medium">Select a chat to start messaging</p>
                                <p className="text-sm mt-2">Choose from your active conversations</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerSupport; 