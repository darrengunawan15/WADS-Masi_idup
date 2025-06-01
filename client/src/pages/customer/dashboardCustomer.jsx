import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomerTickets } from '../../redux/slices/ticketSlice';
import DashboardHeader from '../../components/DashboardHeader';
import Spinner from '../../components/Spinner';
import { format } from 'date-fns';

const DashboardCustomer = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { customerTickets, isCustomerTicketsLoading } = useSelector((state) => state.tickets);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');

    useEffect(() => {
        if (user) {
            dispatch(getCustomerTickets());
        }
    }, [dispatch, user]);

    // Utility to map status for open/closed logic
    const mapStatusForOpenClosed = (status) => {
        if (status === 'resolved') return 'closed';
        return 'open'; // 'unassigned' and 'in progress' are 'open'
    };

    // Filter tickets based on search query and status
    const filteredTickets = customerTickets.filter(ticket => {
        const matchesSearch = searchQuery === '' || 
            ticket._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.subject.toLowerCase().includes(searchQuery.toLowerCase());

        // Map status for filtering
        const mappedStatus = mapStatusForOpenClosed(ticket.status);
        const matchesStatus = selectedStatus === 'all' || mappedStatus === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    // Separate tickets into open and closed
    const openTickets = filteredTickets.filter(ticket => 
        mapStatusForOpenClosed(ticket.status) === 'open'
    );
    const closedTickets = filteredTickets.filter(ticket => 
        mapStatusForOpenClosed(ticket.status) === 'closed'
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'new':
                return 'bg-blue-100 text-blue-800';
            case 'open':
                return 'bg-red-100 text-red-800';
            case 'in progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'pending':
                return 'bg-yellow-200 text-yellow-900';
            case 'closed':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (isCustomerTicketsLoading) {
        return <Spinner />;
    }

    return (
        <div className="flex-1 bg-gray-50 p-6 min-h-screen overflow-auto ml-20">
            <DashboardHeader staffName={user?.name || 'Customer'} role={user?.role} />

            <div className="flex flex-col space-y-6 pt-8 h-[calc(100vh-10rem)]">
                {/* Bento Grid Layout */}
                <div className="grid grid-cols-2 gap-6 h-full">
                    {/* Open Tickets Bento */}
                    <div className="bg-white rounded-xl shadow-sm p-6 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">Open Tickets</h3>
                        </div>
                        <div className="overflow-auto flex-1">
                            <table className="min-w-full table-auto rounded-lg overflow-hidden border border-gray-300">
                                <thead className="bg-[var(--hotpink)] text-white sticky top-0">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-sm">Ticket #</th>
                                        <th className="px-3 py-2 text-left text-sm">Issue</th>
                                        <th className="px-3 py-2 text-left text-sm">Status</th>
                                        <th className="px-3 py-2 text-left text-sm">Assigned To</th>
                                        <th className="px-3 py-2 text-left text-sm">Date Created</th>
                                        <th className="px-3 py-2 text-left text-sm">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {openTickets.map((ticket) => (
                                        <tr key={ticket._id} className="border-b border-gray-200 hover:bg-gray-100">
                                            <td className="px-3 py-2 text-sm text-gray-800">{ticket._id.substring(0, 6)}...</td>
                                            <td className="px-3 py-2 text-sm text-gray-800">{ticket.subject}</td>
                                            <td className="px-3 py-2 text-sm">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                                    {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2 text-sm text-gray-800">{ticket.assignedTo?.name || 'Unassigned'}</td>
                                            <td className="px-3 py-2 text-sm text-gray-800">{format(new Date(ticket.createdAt), 'yyyy-MM-dd')}</td>
                                            <td className="px-3 py-2 text-sm">
                                                <button 
                                                    onClick={() => navigate(`/ticket-details/${ticket._id}`)}
                                                    className="text-[var(--hotpink)] hover:text-[var(--roseberry)] transition-colors"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {openTickets.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-3 py-2 text-sm text-gray-500 text-center">No open tickets</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Ticket History Bento */}
                    <div className="bg-white rounded-xl shadow-sm p-6 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">Ticket History</h3>
                        </div>
                        <div className="overflow-auto flex-1">
                            <table className="min-w-full table-auto rounded-lg overflow-hidden border border-gray-300">
                                <thead className="bg-[var(--hotpink)] text-white sticky top-0">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-sm">Ticket #</th>
                                        <th className="px-3 py-2 text-left text-sm">Issue</th>
                                        <th className="px-3 py-2 text-left text-sm">Status</th>
                                        <th className="px-3 py-2 text-left text-sm">Assigned To</th>
                                        <th className="px-3 py-2 text-left text-sm">Date Closed</th>
                                        <th className="px-3 py-2 text-left text-sm">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {closedTickets.map((ticket) => (
                                        <tr key={ticket._id} className="border-b border-gray-200 hover:bg-gray-100">
                                            <td className="px-3 py-2 text-sm text-gray-800">{ticket._id.substring(0, 6)}...</td>
                                            <td className="px-3 py-2 text-sm text-gray-800">{ticket.subject}</td>
                                            <td className="px-3 py-2 text-sm">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                                    {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2 text-sm text-gray-800">{ticket.assignedTo?.name || 'Unassigned'}</td>
                                            <td className="px-3 py-2 text-sm text-gray-800">{format(new Date(ticket.updatedAt), 'yyyy-MM-dd')}</td>
                                            <td className="px-3 py-2 text-sm">
                                                <button 
                                                    onClick={() => navigate(`/ticket-details/${ticket._id}`)}
                                                    className="text-[var(--hotpink)] hover:text-[var(--roseberry)] transition-colors"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {closedTickets.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-3 py-2 text-sm text-gray-500 text-center">No closed tickets</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Second Row - Three Bento Layout */}
                <div className="grid grid-cols-3 gap-6">
                    {/* Customer Support Bento */}
                    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col h-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">Customer Support</h3>
                            <span className="px-3 py-1 bg-[var(--hotpink)] text-white rounded-full text-sm">
                                Live Support
                            </span>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Need human assistance? Create a new ticket and our support team will help you.
                        </p>
                        <div className="mt-auto">
                            <button
                                onClick={() => navigate('/mytickets', { state: { openCreateTicket: true } })}
                                className="w-full py-3 bg-[var(--hotpink)] text-white rounded-lg hover:bg-[var(--roseberry)] transition-colors"
                            >
                                Create New Ticket
                            </button>
                        </div>
                    </div>

                    {/* AI Assistant Bento */}
                    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col h-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">AI Assistant</h3>
                            <span className="px-3 py-1 bg-[var(--hotpink)] text-white rounded-full text-sm">
                                Available 24/7
                            </span>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Get instant help from our AI assistant for common questions and issues.
                        </p>
                        <div className="mt-auto">
                            <button
                                onClick={() => navigate('/chat-support?chat=ai')}
                                className="w-full py-3 bg-[var(--hotpink)] text-white rounded-lg hover:bg-[var(--roseberry)] transition-colors"
                            >
                                Start Chat
                            </button>
                        </div>
                    </div>

                    {/* Blank Bento */}
                    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col h-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">Quick Actions</h3>
                            <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                                Coming Soon
                            </span>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Additional features and quick actions will be available here soon.
                        </p>
                        <div className="flex-1 flex items-center justify-center">
                            <span className="text-gray-400">More features coming soon...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardCustomer; 