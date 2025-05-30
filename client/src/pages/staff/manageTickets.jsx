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
            customerId: 'CUST-001',
            username: 'johndoe',
            issue: 'Order #12345 Issue',
            status: 'open',
            createdAt: '2024-03-15 10:30 AM'
        },
        {
            id: 'TICK-002',
            customerId: 'CUST-002',
            username: 'janesmith',
            issue: 'Payment Refund Request',
            status: 'in-progress',
            createdAt: '2024-03-14 02:15 PM'
        },
        {
            id: 'TICK-003',
            customerId: 'CUST-003',
            username: 'mikejohnson',
            issue: 'Delivery Delay',
            status: 'resolved',
            createdAt: '2024-03-13 09:00 AM'
        },
        {
            id: 'TICK-004',
            customerId: 'CUST-004',
            username: 'sarahwilson',
            issue: 'Product Quality Issue',
            status: 'open',
            createdAt: '2024-03-15 08:45 AM'
        }
    ]);

    // Filter tickets based on status and search query
    const filteredTickets = tickets.filter(ticket => {
        const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus;
        const matchesSearch = ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            ticket.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            ticket.issue.toLowerCase().includes(searchQuery.toLowerCase());
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
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--hotpink)] focus:border-transparent appearance-none pr-8 bg-no-repeat bg-[length:12px] bg-[right_12px_center] cursor-pointer"
                                style={{
                                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")"
                                }}
                            >
                                <option value="all" className="cursor-pointer">All Status</option>
                                <option value="open" className="cursor-pointer">Open</option>
                                <option value="in-progress" className="cursor-pointer">In Progress</option>
                                <option value="resolved" className="cursor-pointer">Resolved</option>
                            </select>
                            <button
                                onClick={() => navigate('/customer-support')}
                                className="px-4 py-2 bg-[var(--hotpink)] text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                            >
                                Open Chat
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tickets Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full table-fixed rounded-lg overflow-hidden border border-gray-300">
                            <thead className="bg-[var(--hotpink)] text-white sticky top-0">
                                <tr>
                                    <th className="px-3 py-2 text-left text-sm w-[8%]">Ticket #</th>
                                    <th className="px-3 py-2 text-left text-sm w-[10%]">Customer ID</th>
                                    <th className="px-3 py-2 text-left text-sm w-[12%]">Username</th>
                                    <th className="px-3 py-2 text-left text-sm w-[30%]">Issue</th>
                                    <th className="px-3 py-2 text-left text-sm w-[10%]">Status</th>
                                    <th className="px-3 py-2 text-left text-sm w-[15%]">Date Issued</th>
                                    <th className="px-3 py-2 text-left text-sm w-[8%]">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTickets.map((ticket) => (
                                    <tr key={ticket.id} className="border-b">
                                        <td className="px-3 py-2 text-sm truncate">{ticket.id}</td>
                                        <td className="px-3 py-2 text-sm truncate">{ticket.customerId}</td>
                                        <td className="px-3 py-2 text-sm truncate">{ticket.username}</td>
                                        <td className="px-3 py-2 text-sm truncate">{ticket.issue}</td>
                                        <td className="px-3 py-2 text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 text-sm truncate">{ticket.createdAt}</td>
                                        <td className="px-3 py-2 text-sm">
                                            <button 
                                                onClick={() => navigate(`/ticket-details/${ticket.id}`)}
                                                className="py-1 px-3 bg-[var(--hotpink)] text-white rounded-md hover:bg-[var(--roseberry)] transition text-sm cursor-pointer"
                                            >
                                                Resolve
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