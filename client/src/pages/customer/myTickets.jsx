import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCustomerTickets } from '../../redux/slices/ticketSlice';
import Spinner from '../../components/Spinner';
import CreateTicketModal from '../../components/CreateTicketModal';
import { format } from 'date-fns';
import NavbarCustomer from '../../components/navbarCustomer';

const MyTickets = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { customerTickets, isCustomerTicketsLoading } = useSelector((state) => state.tickets);
    const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    
    useEffect(() => {
        dispatch(getCustomerTickets());
    }, [dispatch]);

    useEffect(() => {
        if (location.state && location.state.openCreateTicket) {
            setIsCreateTicketModalOpen(true);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    if (isCustomerTicketsLoading) {
        return <Spinner />;
    }

    const tickets = customerTickets;

    // Utility to map status for open/closed logic
    const mapStatusForOpenClosed = (status) => {
        if (status === 'resolved') return 'closed';
        return 'open'; // 'unassigned' and 'in progress' are 'open'
    };

    // Use mapped status for filtering
    const openTickets = tickets.filter(ticket => mapStatusForOpenClosed(ticket.status) === 'open');
    const closedTickets = tickets.filter(ticket => mapStatusForOpenClosed(ticket.status) === 'closed');

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

    const handleViewTicket = (ticket) => {
        setSelectedTicket(ticket);
    };

    const handleCloseDetails = () => {
        setSelectedTicket(null);
    };

    return (
        <div className="flex">
            <NavbarCustomer />
            <div className="flex-1 bg-gray-50 p-6 h-screen overflow-hidden ml-20">
                <div className={`flex justify-between items-center mb-6 ${selectedTicket ? 'blur-sm' : ''}`}>
                    <h1 className="text-2xl font-bold text-gray-800">My Tickets</h1>
                    <button
                        onClick={() => setIsCreateTicketModalOpen(true)}
                        className="px-4 py-2 bg-[var(--hotpink)] text-white rounded-lg hover:bg-[var(--roseberry)] transition-colors"
                    >
                        Create New Ticket
                    </button>
                </div>

                <div className={`grid grid-cols-2 gap-6 h-[calc(100vh-12rem)] ${selectedTicket ? 'blur-sm' : ''}`}>
                    {/* Open Tickets */}
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
                                        <th className="px-3 py-2 text-left text-sm">Date Created</th>
                                        <th className="px-3 py-2 text-left text-sm">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {openTickets.map((ticket) => (
                                        <tr key={ticket._id} className="border-b border-gray-200 hover:bg-gray-100">
                                            <td className="px-3 py-2 text-sm text-gray-800">{ticket._id}</td>
                                            <td className="px-3 py-2 text-sm text-gray-800">{ticket.subject}</td>
                                            <td className="px-3 py-2 text-sm">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                                    {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2 text-sm text-gray-800">{format(new Date(ticket.createdAt), 'yyyy-MM-dd')}</td>
                                            <td className="px-3 py-2 text-sm">
                                                <button 
                                                    onClick={() => handleViewTicket(ticket)}
                                                    className="text-[var(--hotpink)] hover:text-[var(--roseberry)] transition-colors"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {openTickets.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-3 py-2 text-sm text-gray-500 text-center">No open tickets</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Closed Tickets */}
                    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow h-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">Closed Tickets</h3>
                        </div>
                        <div className="overflow-auto h-[calc(100%-3rem)]">
                            <table className="min-w-full table-auto rounded-lg overflow-hidden border border-gray-300">
                                <thead className="bg-[var(--hotpink)] text-white sticky top-0">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-sm">Ticket #</th>
                                        <th className="px-3 py-2 text-left text-sm">Issue</th>
                                        <th className="px-3 py-2 text-left text-sm">Status</th>
                                        <th className="px-3 py-2 text-left text-sm">Date Closed</th>
                                        <th className="px-3 py-2 text-left text-sm">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {closedTickets.map((ticket) => (
                                        <tr key={ticket._id} className="border-b border-gray-200 hover:bg-gray-100">
                                            <td className="px-3 py-2 text-sm text-gray-800">{ticket._id}</td>
                                            <td className="px-3 py-2 text-sm text-gray-800">{ticket.subject}</td>
                                            <td className="px-3 py-2 text-sm">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                                    {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2 text-sm text-gray-800">{format(new Date(ticket.updatedAt), 'yyyy-MM-dd')}</td>
                                            <td className="px-3 py-2 text-sm">
                                                <button 
                                                    onClick={() => handleViewTicket(ticket)}
                                                    className="text-[var(--hotpink)] hover:text-[var(--roseberry)] transition-colors"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {closedTickets.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-3 py-2 text-sm text-gray-500 text-center">No closed tickets</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Ticket Details Modal */}
                {selectedTicket && (
                    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
                        <div className="bg-white rounded-xl p-6 w-[800px] max-h-[90vh] overflow-y-auto shadow-xl">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">Ticket Details</h2>
                                <button
                                    onClick={handleCloseDetails}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Ticket ID</label>
                                    <p className="mt-1 text-sm text-gray-900">{selectedTicket._id}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Subject</label>
                                    <p className="mt-1 text-sm text-gray-900">{selectedTicket.subject}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <p className="mt-1 text-sm text-gray-900">{selectedTicket.description}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <span className={`mt-1 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedTicket.status)}`}>
                                        {selectedTicket.status.charAt(0).toUpperCase() + selectedTicket.status.slice(1)}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Created At</label>
                                    <p className="mt-1 text-sm text-gray-900">{format(new Date(selectedTicket.createdAt), 'yyyy-MM-dd HH:mm')}</p>
                                </div>
                                {selectedTicket.updatedAt && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                                        <p className="mt-1 text-sm text-gray-900">{format(new Date(selectedTicket.updatedAt), 'yyyy-MM-dd HH:mm')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <CreateTicketModal
                    isOpen={isCreateTicketModalOpen}
                    onClose={() => setIsCreateTicketModalOpen(false)}
                    onTicketCreated={() => dispatch(getCustomerTickets())}
                />
            </div>
        </div>
    );
};

export default MyTickets; 