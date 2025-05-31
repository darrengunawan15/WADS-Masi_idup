import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTickets } from '../../redux/slices/ticketSlice';
import DashboardHeader from '../../components/DashboardHeader';
import Spinner from '../../components/Spinner';
import { format } from 'date-fns';

const DashboardCustomer = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { tickets, isLoading } = useSelector((state) => state.tickets);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');

    // Example tickets for demonstration
    const exampleTickets = [
        {
            _id: '1',
            subject: 'Kitchen Equipment Not Working',
            status: 'in progress',
            createdAt: new Date('2024-03-15'),
            updatedAt: new Date('2024-03-16'),
            description: 'The main oven is not heating properly',
            assignedTo: { name: 'John Smith' }
        },
        {
            _id: '2',
            subject: 'New Menu Item Request',
            status: 'new',
            createdAt: new Date('2024-03-17'),
            updatedAt: new Date('2024-03-17'),
            description: 'Would like to add vegetarian options',
            assignedTo: null
        },
        {
            _id: '3',
            subject: 'Staff Training Schedule',
            status: 'pending',
            createdAt: new Date('2024-03-14'),
            updatedAt: new Date('2024-03-15'),
            description: 'Need to schedule new staff training',
            assignedTo: { name: 'Sarah Johnson' }
        },
        {
            _id: '4',
            subject: 'Supply Order Issue',
            status: 'closed',
            createdAt: new Date('2024-03-10'),
            updatedAt: new Date('2024-03-12'),
            description: 'Late delivery of kitchen supplies',
            assignedTo: { name: 'Mike Brown' }
        },
        {
            _id: '5',
            subject: 'Equipment Maintenance',
            status: 'closed',
            createdAt: new Date('2024-03-05'),
            updatedAt: new Date('2024-03-07'),
            description: 'Regular maintenance check completed',
            assignedTo: { name: 'Lisa Chen' }
        }
    ];

    useEffect(() => {
        if (user) {
            dispatch(getTickets());
        }
    }, [dispatch, user]);

    // Filter tickets based on search query and status
    const filteredTickets = exampleTickets.filter(ticket => {
        const matchesSearch = searchQuery === '' || 
            ticket._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.subject.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    // Separate tickets into open and closed
    const openTickets = filteredTickets.filter(ticket => 
        ['new', 'open', 'in progress', 'pending'].includes(ticket.status)
    );
    const closedTickets = filteredTickets.filter(ticket => 
        ticket.status === 'closed'
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

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="flex-1 bg-gray-50 p-6 h-screen overflow-hidden ml-20">
            <DashboardHeader staffName={user?.name || 'Customer'} />

            <div className="h-full flex flex-col space-y-6 pt-8">
                {/* Bento Grid Layout */}
                <div className="grid grid-cols-2 gap-6 h-[35vh]">
                    {/* Open Tickets Bento */}
                    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow h-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">Open Tickets</h3>
                        </div>
                        <div className="overflow-auto h-[calc(100%-3rem)]">
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
                    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow h-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">Ticket History</h3>
                        </div>
                        <div className="overflow-auto h-[calc(100%-3rem)]">
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
                <div className="grid grid-cols-3 gap-6 h-[35vh]">
                    {/* Customer Support Bento */}
                    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col h-full">
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
                                onClick={() => navigate('/custticket')}
                                className="w-full py-3 bg-[var(--hotpink)] text-white rounded-lg hover:bg-[var(--roseberry)] transition-colors"
                            >
                                Create New Ticket
                            </button>
                        </div>
                    </div>

                    {/* AI Assistant Bento */}
                    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col h-full">
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
                    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col h-full">
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