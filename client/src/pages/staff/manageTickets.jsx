import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTickets, reset } from '../../redux/slices/ticketSlice';
import Spinner from '../../components/Spinner';
import { format } from 'date-fns';
import NavbarAdmin from '../../components/navbarAdmin';
import NavbarStaff from '../../components/navbarStaff';
import { toast } from 'react-toastify';

const ManageTickets = () => {
    const navigate = useNavigate();
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const dispatch = useDispatch();
    const { tickets, isLoading, isError, message } = useSelector((state) => state.tickets);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isError && message) {
            toast.error(message);
            dispatch(reset());
        } else if (!isLoading && !isError && message === '') {
            // This will catch a successful update if you add direct status update in the future
            // toast.success('Ticket status updated successfully!');
            // dispatch(reset());
        }
    }, [isLoading, isError, message, dispatch]);

    useEffect(() => {
        if (isError) {
            console.log(message); // Handle error, e.g., show a toast
        }

        // Fetch tickets when the component mounts
        dispatch(getTickets());

        // Clean up on unmount
        return () => {
            dispatch(reset());
        };
    }, [dispatch, isError, message]);

    // Filter tickets based on status and search query
    const staffId = String(user?._id).trim();
    const filteredTickets = tickets.filter(ticket => {
        // Admin: show all tickets
        if (user?.role === 'admin') {
            let matchesStatus = false;
            if (selectedStatus === 'all') {
                matchesStatus = true;
            } else if (selectedStatus === 'unassigned') {
                matchesStatus = !ticket.assignedTo;
            } else if (selectedStatus === 'in progress' && ticket.status === 'in progress') {
                matchesStatus = true;
            } else if (selectedStatus === 'resolved' && ticket.status === 'resolved') {
                matchesStatus = true;
            } else if (selectedStatus === 'new') {
                const authorIds = (ticket.comments || [])
                    .map(comment => comment && comment.author && comment.author._id ? String(comment.author._id).trim() : null)
                    .filter(id => id !== null);
                const hasStaffComment = authorIds.includes(staffId);
                matchesStatus = ticket.status !== 'resolved' && !hasStaffComment;
            }
            const realDataMatchesSearch = ticket._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        (ticket.customer?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && realDataMatchesSearch;
        }
        // Staff: Only consider tickets assigned to this staff
        const isAssignedToStaff = ticket.assignedTo && String(ticket.assignedTo._id).trim() === staffId;
        if (!isAssignedToStaff) return false;
        let matchesStatus = false;
        if (selectedStatus === 'all') {
            matchesStatus = true;
        } else if (selectedStatus === 'in progress' && ticket.status === 'in progress') {
            matchesStatus = true;
        } else if (selectedStatus === 'resolved' && ticket.status === 'resolved') {
            matchesStatus = true;
        } else if (selectedStatus === 'new') {
            const authorIds = (ticket.comments || [])
                .map(comment => comment && comment.author && comment.author._id ? String(comment.author._id).trim() : null)
                .filter(id => id !== null);
            const hasStaffComment = authorIds.includes(staffId);
            matchesStatus = ticket.status !== 'resolved' && !hasStaffComment;
        }
        const realDataMatchesSearch = ticket._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                      (ticket.customer?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                                      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && realDataMatchesSearch;
    });

    // Get status badge color
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

    // Render correct navbar
    const Navbar = user?.role === 'admin' ? NavbarAdmin : NavbarStaff;

    if (isLoading) {
        return <Spinner />;
    }

    if (isError) {
        return <div className="text-center text-red-500">Error loading tickets: {message}</div>;
    }

    return (
        <div className="flex h-screen overflow-hidden relative">
            <Navbar />
            <div className={`flex-1 bg-gray-50 p-6 h-screen overflow-y-auto transition-all duration-300 ml-20`}>
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
                                {user?.role === 'admin' && (
                                    <option value="unassigned" className="cursor-pointer">Unassigned</option>
                                )}
                                <option value="new" className="cursor-pointer">New</option>
                                <option value="in progress" className="cursor-pointer">In Progress</option>
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
                                    <tr key={ticket._id} className="border-b border-gray-200 hover:bg-gray-100">
                                        <td className="px-3 py-2 text-sm text-gray-800 truncate">{ticket._id.substring(0, 6)}...</td>
                                        <td className="px-3 py-2 text-sm text-gray-800 truncate">{ticket.customer?._id?.substring(0, 6)}...</td>
                                        <td className="px-3 py-2 text-sm text-gray-800 truncate">{ticket.customer?.name || 'N/A'}</td>
                                        <td className="px-3 py-2 text-sm text-gray-800 truncate">{ticket.subject}</td>
                                        <td className="px-3 py-2 text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 text-sm text-gray-800 truncate">{format(new Date(ticket.createdAt), 'yyyy-MM-dd HH:mm')}</td>
                                        <td className="px-3 py-2 text-sm">
                                            <button 
                                                onClick={() => navigate(`/ticket-details/${ticket._id}`)}
                                                disabled={ticket.status === 'resolved' || ticket.status === 'closed'}
                                                className={`py-1 px-3 rounded-md text-sm transition cursor-pointer 
                                                    ${(ticket.status === 'resolved' || ticket.status === 'closed')
                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                        : 'bg-[var(--hotpink)] text-white hover:bg-[var(--roseberry)]'}`}
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