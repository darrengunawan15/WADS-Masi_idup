import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TicketDetails = () => {
    const { ticketId } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [status, setStatus] = useState('');
    const [response, setResponse] = useState('');
    const [isStatusChanged, setIsStatusChanged] = useState(false);

    // Mock data - In a real app, this would come from an API
    const mockTicket = {
        id: 'TICK-001',
        customerId: 'CUST-001',
        username: 'johndoe',
        issue: 'Order #12345 Issue',
        description: 'I received my order but the items are damaged. The packaging was torn and some products are broken.',
        status: 'open',
        priority: 'high',
        createdAt: '2024-03-15 10:30 AM',
        lastUpdated: '2024-03-15 11:45 AM',
        category: 'Order Issues',
        attachments: ['damage_photo1.jpg', 'damage_photo2.jpg'],
        history: [
            {
                date: '2024-03-15 10:30 AM',
                action: 'Ticket Created',
                user: 'johndoe'
            },
            {
                date: '2024-03-15 11:45 AM',
                action: 'Status Updated to Open',
                user: 'Support Staff'
            }
        ]
    };

    useEffect(() => {
        // In a real app, you would fetch the ticket data from an API
        setTicket(mockTicket);
        setStatus(mockTicket.status);
    }, [ticketId]);

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        setIsStatusChanged(true);
    };

    const handleStatusUpdate = () => {
        // In a real app, you would update the status via API
        const newHistoryItem = {
            date: new Date().toLocaleString(),
            action: `Status Updated to ${status.charAt(0).toUpperCase() + status.slice(1)}`,
            user: 'Support Staff'
        };

        setTicket(prev => ({
            ...prev,
            status: status,
            lastUpdated: new Date().toLocaleString(),
            history: [...prev.history, newHistoryItem]
        }));
        
        setIsStatusChanged(false);
    };

    const handleSubmitResponse = (e) => {
        e.preventDefault();
        // In a real app, you would send the response via API
        console.log('Response submitted:', response);
        setResponse('');
    };

    // Get status badge color
    const getStatusColor = (status) => {
        switch (status) {
            case 'open':
                return 'bg-red-100 text-red-800';
            case 'in-progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'resolved':
                return 'bg-green-100 text-green-800';
            case 'closed':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (!ticket) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className={`fixed inset-0 bg-gray-50 transition-all duration-300 ml-20`}>
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Ticket Details</h1>
                            <p className="text-gray-600">Ticket #{ticket.id}</p>
                        </div>
                        <button
                            onClick={() => navigate('/manage-tickets')}
                            className="px-4 py-2 text-[var(--hotpink)] hover:text-[var(--roseberry)] transition-colors"
                        >
                            ← Back to Tickets
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-3 gap-6">
                    {/* Left Column - Ticket Info */}
                    <div className="col-span-2 space-y-6">
                        {/* Ticket Details Card */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4">Ticket Information</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Customer ID</p>
                                    <p className="font-medium">{ticket.customerId}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Username</p>
                                    <p className="font-medium">{ticket.username}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Category</p>
                                    <p className="font-medium">{ticket.category}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Priority</p>
                                    <p className="font-medium capitalize">{ticket.priority}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Created</p>
                                    <p className="font-medium">{ticket.createdAt}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Last Updated</p>
                                    <p className="font-medium">{ticket.lastUpdated}</p>
                                </div>
                            </div>
                        </div>

                        {/* Issue Description Card */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4">Issue Description</h2>
                            <p className="text-gray-700">{ticket.description}</p>
                            
                            {ticket.attachments && ticket.attachments.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="text-sm font-medium text-gray-600 mb-2">Attachments</h3>
                                    <div className="flex gap-2">
                                        {ticket.attachments.map((file, index) => (
                                            <a
                                                key={index}
                                                href="#"
                                                className="px-3 py-1 bg-gray-100 rounded-md text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                                            >
                                                {file}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Response Form */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4">Add Response</h2>
                            <form onSubmit={handleSubmitResponse}>
                                <textarea
                                    value={response}
                                    onChange={(e) => setResponse(e.target.value)}
                                    className="w-full h-32 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--hotpink)] focus:border-transparent"
                                    placeholder="Type your response here..."
                                />
                                <div className="mt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-[var(--hotpink)] text-white rounded-lg hover:bg-[var(--roseberry)] transition-colors"
                                    >
                                        Send Response
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Column - Status & History */}
                    <div className="space-y-6">
                        {/* Status Card */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4">Status</h2>
                            <div className="space-y-4">
                                <select
                                    value={status}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--hotpink)] focus:border-transparent appearance-none pr-8 bg-no-repeat bg-[length:12px] bg-[right_12px_center] cursor-pointer"
                                    style={{
                                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")"
                                    }}
                                >
                                    <option value="open">Open</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="closed">Closed</option>
                                </select>
                                {isStatusChanged && (
                                    <button
                                        onClick={handleStatusUpdate}
                                        className="w-full px-4 py-2 bg-[var(--hotpink)] text-white rounded-lg hover:bg-[var(--roseberry)] transition-colors"
                                    >
                                        Update Status
                                    </button>
                                )}
                                <div className="mt-2">
                                    <p className="text-sm text-gray-600">Current Status:</p>
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(status)}`}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </span>
                                </div>
                                <button
                                    onClick={() => navigate(`/customer-support?user=${ticket.username}`)}
                                    className="w-full px-4 py-2 bg-[var(--hotpink)] text-white rounded-lg hover:bg-[var(--roseberry)] transition-colors mt-4"
                                >
                                    Chat with {ticket.username}
                                </button>
                            </div>
                        </div>

                        {/* History Card */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4">Ticket History</h2>
                            <div className="space-y-4">
                                {[...ticket.history].reverse().map((item, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="w-2 h-2 mt-2 rounded-full bg-[var(--hotpink)]"></div>
                                        <div>
                                            <p className="text-sm font-medium">{item.action}</p>
                                            <p className="text-xs text-gray-500">
                                                {item.date} by {item.user}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketDetails; 