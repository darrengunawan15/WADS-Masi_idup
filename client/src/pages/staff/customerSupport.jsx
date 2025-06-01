import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTickets, getTicket, addComment, reset } from '../../redux/slices/ticketSlice';
import Spinner from '../../components/Spinner';
import { format } from 'date-fns'; // Assuming date-fns is needed for comment timestamps

const CustomerSupport = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarWidth, setSidebarWidth] = useState('20');
    const [activeTicketId, setActiveTicketId] = useState(null);
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, chatId: null });
    const [showArchived, setShowArchived] = useState(false);

    const dispatch = useDispatch();
    // Get the list of all tickets and the currently selected ticket details from Redux state
    const { tickets, ticket: activeTicket, isLoading, isError, message: ticketError } = useSelector((state) => state.tickets);
    const { user } = useSelector((state) => state.auth); // To identify current user as staff

    // Fetch all tickets when the component mounts
    useEffect(() => {
        dispatch(getTickets());
        // Reset ticket state on unmount
        return () => {
            dispatch(reset());
        };
    }, [dispatch]);

    // Fetch details of the active ticket when activeTicketId changes
    useEffect(() => {
        if (activeTicketId) {
            dispatch(getTicket(activeTicketId));
        }
    }, [activeTicketId, dispatch]);

    // Handle initial ticket selection from URL parameter (if any)
    // Handle user parameter from URL
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const ticketIdFromUrl = searchParams.get('ticketId'); // Assuming parameter is now ticketId
        if (ticketIdFromUrl) {
            setActiveTicketId(ticketIdFromUrl);
        }
    }, [location.search, tickets]);

    // Auto-select the latest chat session when tickets are loaded and no ticket is selected
    useEffect(() => {
        if (!activeTicketId && tickets && tickets.length > 0) {
            // Find the ticket with the latest updatedAt
            const latestTicket = tickets.reduce((latest, ticket) => {
                if (!latest) return ticket;
                return new Date(ticket.updatedAt) > new Date(latest.updatedAt) ? ticket : latest;
            }, null);
            if (latestTicket) {
                setActiveTicketId(latestTicket._id);
            }
        }
    }, [tickets, activeTicketId]);

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
    }, [activeTicket?.comments]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message.trim() || !activeTicketId) return;

        const commentData = {
            content: message,
            ticketId: activeTicketId, // Associate comment with the active ticket
        };

        dispatch(addComment(commentData));

        setMessage('');
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && activeTicketId) {
            const formData = new FormData();
            formData.append('file', file);
            // Assuming uploadFileAttachment thunk handles the ticketId and file
            // dispatch(uploadFileAttachment({ ticketId: activeTicketId, fileData: formData }));
            console.log('File upload initiated for ticket', activeTicketId, ':', file.name);
            // TODO: Implement actual file upload dispatch
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
            ticketId: chatId // Use ticketId instead of chatId
        });
    };

    // Close context menu when clicking outside
    useEffect(() => {
        const handleClick = () => setContextMenu({ show: false, x: 0, y: 0, chatId: null });
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    // Handle context menu actions
    const handleContextMenuAction = (action, ticketId) => {
        console.log(`Action: ${action} on Ticket ID: ${ticketId}`);
        // TODO: Implement backend calls for relevant actions (e.g., closing ticket, assigning)
        // Note: 'markRead/Unread', 'archive/unarchive', 'delete' might not directly map
        setContextMenu({ show: false, x: 0, y: 0, chatId: null }); // Close menu
    };

    // Filter tickets (not chats) based on status (using archived for now, but ideally backend filters)
    // Note: Our backend does not have an 'archived' field for tickets. 
    // We will display all fetched tickets for now, ignoring the showArchived state.
    // To implement archiving, backend changes would be needed.
    const filteredTickets = tickets; // Use all fetched tickets for now

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
                            {/* Removed Archived button as backend doesn't support archiving */}
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {/* Display tickets */}
                        {filteredTickets.map((ticket) => (
                            <div
                                key={ticket._id}
                                onClick={() => {
                                    setActiveTicketId(ticket._id);
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
                                        {ticket.customer?.name ? ticket.customer.name.charAt(0).toUpperCase() : '-'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className={`text-sm font-semibold truncate ${
                                                activeTicketId === ticket._id ? 'text-gray-900' : 'text-gray-900'
                                            }`}>
                                                {ticket.customer?.name || 'Unknown User'}
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
                    {isLoading ? (
                        <Spinner />
                    ) : isError ? (
                        <div className="text-center text-red-500 p-4">Error loading ticket details: {ticketError}</div>
                    ) : activeTicket ? (
                        <>
                            {/* Chat Header */}
                            <div className="px-6 py-4 bg-white border-b shadow-sm flex-shrink-0">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-full bg-[var(--hotpink)] flex items-center justify-center text-2xl text-white shadow-md">
                                        {activeTicket.customer?.name ? activeTicket.customer.name.charAt(0).toUpperCase() : '-'}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Ticket: {activeTicket.subject}</h3>
                                        <p className="text-sm text-gray-500">Customer: {activeTicket.customer?.name || 'Unknown'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                                {activeTicket.comments && activeTicket.comments.map((comment) => (
                                    <div
                                        key={comment._id}
                                        className={`flex ${comment.author?._id === user?._id ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[70%] rounded-2xl p-4 shadow-sm ${
                                                comment.author?._id === user?._id
                                                    ? 'bg-[var(--hotpink)] text-white'
                                                    : 'bg-white text-gray-800'
                                            }`}
                                        >
                                            <p className="text-sm">{comment.content}</p>
                                            <span className={`text-xs mt-1 block ${
                                                comment.author?._id === user?._id ? 'text-white text-opacity-70' : 'text-gray-500'
                                            }`}>
                                                {comment.createdAt ? format(new Date(comment.createdAt), 'MMM d, h:mm a') : 'N/A'}
                                            </span>
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
                                        value={message}
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
                            Select a ticket from the sidebar to view details and messages
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerSupport; 