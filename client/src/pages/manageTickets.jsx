import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ManageTickets = () => {
    const navigate = useNavigate();
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock data for tickets
    const [tickets] = useState([
        {
            id: 'TICK-001',
            customer: 'John Doe',
            subject: 'Order #12345 Issue',
            status: 'open',
            priority: 'high',
            createdAt: '2024-03-15 10:30 AM',
            lastUpdated: '2024-03-15 11:45 AM'
        },
        {
            id: 'TICK-002',
            customer: 'Jane Smith',
            subject: 'Payment Refund Request',
            status: 'in-progress',
            priority: 'medium',
            createdAt: '2024-03-14 02:15 PM',
            lastUpdated: '2024-03-15 09:30 AM'
        },
        {
            id: 'TICK-003',
            customer: 'Mike Johnson',
            subject: 'Delivery Delay',
            status: 'resolved',
            priority: 'low',
            createdAt: '2024-03-13 09:00 AM',
            lastUpdated: '2024-03-14 03:20 PM'
        },
        {
            id: 'TICK-004',
            customer: 'Sarah Wilson',
            subject: 'Product Quality Issue',
            status: 'open',
            priority: 'high',
            createdAt: '2024-03-15 08:45 AM',
            lastUpdated: '2024-03-15 08:45 AM'
        }
    ]);

    // Filter tickets based on status and search query
    const filteredTickets = tickets.filter(ticket => {
        const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus;
        const matchesSearch = ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            ticket.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            ticket.subject.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // Get status badge color
    const getStatusColor = (status) => {
        switch (status) {
            case 'open':
                return 'bg-red-100 text-red-800';
            case 'in-progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'resolved':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get priority badge color
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className={`fixed inset-0 bg-gray-50 transition-all duration-300 ml-20`}>
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Manage Tickets</h1>
                    <p className="text-gray-600">View and manage customer support tickets</p>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search tickets..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--hotpink)] focus:border-transparent"
                            />
                        </div>
                        <div className="flex gap-4">
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--hotpink)] focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="open">Open</option>
                                <option value="in-progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                            </select>
                            <button
                                onClick={() => navigate('/customer-support')}
                                className="px-4 py-2 bg-[var(--hotpink)] text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Open Chat
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tickets Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredTickets.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ticket.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.customer}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.subject}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.createdAt}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.lastUpdated}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button
                                                onClick={() => navigate('/customer-support')}
                                                className="text-[var(--hotpink)] hover:text-[var(--roseberry)]"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageTickets; 