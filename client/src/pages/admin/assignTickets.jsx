import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../../components/navbarAdmin';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import adminService from '../../services/adminService';
import Spinner from '../../components/Spinner';
import { useSelector } from 'react-redux';

const AssignTickets = () => {
    const navigate = useNavigate();
    const [sidebarWidth, setSidebarWidth] = useState('20');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [tempStaffSelection, setTempStaffSelection] = useState({});
    const [assignedTickets, setAssignedTickets] = useState(new Set());
    const [tickets, setTickets] = useState([]);
    const [staffMembers, setStaffMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user: adminUser } = useSelector((state) => state.auth);

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

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('accessToken');
                let ticketsRes;
                if (selectedStatus === 'all') {
                    ticketsRes = await adminService.getAllTickets(token);
                } else if (selectedStatus === 'unassigned') {
                    ticketsRes = await adminService.getUnassignedTickets(token);
                } else {
                    // Fetch all and filter client-side for other statuses
                    const allTickets = await adminService.getAllTickets(token);
                    ticketsRes = allTickets.filter(ticket => ticket.status === selectedStatus);
                }
                const staffRes = await adminService.getStaff(token);
                setTickets(ticketsRes);
                setStaffMembers(staffRes);
                // Pre-select staff for tickets that already have assignedTo
                const initialStaffSelection = {};
                ticketsRes.forEach(ticket => {
                    if (ticket.assignedTo && ticket.assignedTo._id) {
                        initialStaffSelection[ticket._id] = ticket.assignedTo._id;
                    }
                });
                setTempStaffSelection(initialStaffSelection);
            } catch (err) {
                setError('Failed to load tickets or staff');
                toast.error('Failed to load tickets or staff');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [selectedStatus]);

    const handleStaffSelect = (ticketId, staffId) => {
        setTempStaffSelection(prev => ({
            ...prev,
            [ticketId]: staffId
        }));
        if (assignedTickets.has(ticketId)) {
            setAssignedTickets(prev => {
                const newSet = new Set(prev);
                newSet.delete(ticketId);
                return newSet;
            });
        }
    };

    const handleAssignClick = (ticket) => {
        const staffId = tempStaffSelection[ticket._id];
        if (!staffId) return;
        setSelectedTicket(ticket);
        setSelectedStaff(staffId);
        setShowAssignModal(true);
    };

    const handleConfirmAssign = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('accessToken');
            await adminService.assignTicket(selectedTicket._id, selectedStaff, token, 'in progress');
            setAssignedTickets(prev => new Set([...prev, selectedTicket._id]));
            toast.success(`Ticket ${selectedTicket._id} has been assigned!`, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                style: {
                    width: '400px',
                    fontSize: '16px'
                }
            });
            // Refetch tickets after assignment, respecting current filter
            const token2 = localStorage.getItem('accessToken');
            let ticketsRes;
            if (selectedStatus === 'all') {
                ticketsRes = await adminService.getAllTickets(token2);
            } else if (selectedStatus === 'unassigned') {
                ticketsRes = await adminService.getUnassignedTickets(token2);
            } else {
                const allTickets = await adminService.getAllTickets(token2);
                ticketsRes = allTickets.filter(ticket => ticket.status === selectedStatus);
            }
            setTickets(ticketsRes);
        } catch (err) {
            toast.error('Failed to assign ticket');
        } finally {
            setIsLoading(false);
            setShowAssignModal(false);
            setSelectedTicket(null);
            setSelectedStaff(null);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'unassigned':
                return 'bg-yellow-100 text-yellow-800';
            case 'in progress':
                return 'bg-blue-100 text-blue-800';
            case 'resolved':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Filter tickets based on search query and status
    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = searchQuery === '' || 
            ticket._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (ticket.customer?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.subject.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    // Utility to map status for open/closed logic
    const mapStatusForOpenClosed = (status) => {
        if (status === 'resolved') return 'closed';
        return 'open'; // 'unassigned' and 'in progress' are 'open'
    };

    if (isLoading) {
        return <Spinner />;
    }
    if (error) {
        return <div className="p-6 text-red-500">{error}</div>;
    }

    return (
        <div className="flex">
            <NavbarAdmin />
            <div className={`flex-1 bg-gray-50 p-6 h-screen overflow-auto transition-all duration-300 ${sidebarWidth === '20' ? 'ml-20' : 'ml-64'}`}>
                <ToastContainer />
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-6">Assign Tickets</h1>

                    {/* Search and Filter Section */}
                    <div className="mb-6 flex gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search by ticket ID, customer ID, username, or issue..."
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--hotpink)]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--hotpink)]"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="unassigned">Unassigned</option>
                            <option value="in progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                        </select>
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
                                        <th className="px-3 py-2 text-left text-sm w-[15%]">Date Issued</th>
                                        <th className="px-3 py-2 text-left text-sm w-[15%]">Assign To</th>
                                        <th className="px-3 py-2 text-left text-sm w-[10%]">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTickets.map((ticket) => (
                                        <tr key={ticket._id} className="border-b group relative hover:bg-gray-50">
                                            <td className="px-3 py-2 text-sm truncate">{ticket._id}</td>
                                            <td className="px-3 py-2 text-sm truncate">{ticket.customer?._id || ''}</td>
                                            <td className="px-3 py-2 text-sm truncate">{ticket.customer?.name || ''}</td>
                                            <td className="px-3 py-2 text-sm truncate group relative">
                                                <span 
                                                    className="cursor-pointer text-[var(--hotpink)] hover:underline"
                                                    onClick={() => {
                                                        setSelectedTicket(ticket);
                                                        setShowDetailsModal(true);
                                                    }}
                                                >
                                                    {ticket.subject}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2 text-sm truncate">{ticket.createdAt}</td>
                                            <td className="px-3 py-2 text-sm">
                                                <select
                                                    className={`w-full px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--hotpink)] ${ticket.status === 'resolved' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
                                                    value={tempStaffSelection[ticket._id] || ''}
                                                    onChange={(e) => handleStaffSelect(ticket._id, e.target.value)}
                                                    disabled={ticket.status === 'resolved'}
                                                >
                                                    <option value="">Select Staff</option>
                                                    {staffMembers.filter(staff => staff.role === 'staff').map(staff => (
                                                        <option key={staff._id} value={staff._id}>
                                                            {staff.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-3 py-2 text-sm">
                                                {ticket.assignedTo && tempStaffSelection[ticket._id] === ticket.assignedTo._id ? (
                                                    <button
                                                        disabled
                                                        className="py-1 px-3 rounded-md text-white text-sm bg-gray-400 cursor-not-allowed"
                                                    >
                                                        Assigned
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleAssignClick(ticket)}
                                                        disabled={!tempStaffSelection[ticket._id]}
                                                        className={`py-1 px-3 rounded-md text-white text-sm transition ${
                                                            tempStaffSelection[ticket._id]
                                                                ? 'bg-[var(--hotpink)] hover:bg-[var(--roseberry)] cursor-pointer'
                                                                : 'bg-gray-300 cursor-not-allowed'
                                                        }`}
                                                    >
                                                        Assign
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredTickets.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    No tickets found matching your search criteria
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Issue Details Modal */}
                {showDetailsModal && selectedTicket && (
                    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-[var(--hotpink)]">Issue Details</h3>
                                <button 
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        setSelectedTicket(null);
                                    }}
                                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <p><span className="font-medium text-gray-600">Ticket ID:</span></p>
                                        <p><span className="font-medium text-gray-600">Customer Name:</span></p>
                                        <p><span className="font-medium text-gray-600">Assigned To:</span></p>
                                        <p><span className="font-medium text-gray-600">Status:</span></p>
                                        <p><span className="font-medium text-gray-600">Date:</span></p>
                                    </div>
                                    <div className="space-y-2">
                                        <p>{selectedTicket._id}</p>
                                        <p>{selectedTicket.customer?.name || 'N/A'}</p>
                                        <p>{selectedTicket.assignedTo?.name || 'Unassigned'}</p>
                                        <p className={`inline-block px-2 py-0.5 rounded-full text-xs ${getStatusColor(selectedTicket.status)}`}>
                                            {selectedTicket.status.charAt(0).toUpperCase() + selectedTicket.status.slice(1)}
                                        </p>
                                        <p>{new Date(selectedTicket.createdAt).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric'
                                        })}</p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t">
                                    <p className="font-medium text-gray-600 mb-2">Issue Description:</p>
                                    <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.subject}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Assign Confirmation Modal */}
                {showAssignModal && selectedTicket && selectedStaff && (
                    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-[var(--hotpink)]">Confirm Assignment</h3>
                                <button 
                                    onClick={() => {
                                        setShowAssignModal(false);
                                        setSelectedTicket(null);
                                        setSelectedStaff(null);
                                    }}
                                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                                >
                                    ✕
                                </button>
                            </div>
                            <p className="mb-6">
                                Are you sure you want to assign ticket {selectedTicket._id} to{' '}
                                <span className="font-medium">{staffMembers.find(s => s._id === selectedStaff)?.name}</span>?
                            </p>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => {
                                        setShowAssignModal(false);
                                        setSelectedTicket(null);
                                        setSelectedStaff(null);
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmAssign}
                                    className="px-4 py-2 bg-[var(--hotpink)] text-white rounded hover:bg-[var(--roseberry)] cursor-pointer"
                                >
                                    Confirm Assignment
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssignTickets; 