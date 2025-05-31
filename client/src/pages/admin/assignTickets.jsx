import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../../components/navbarAdmin';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

    // Mock data for unassigned tickets
    const [tickets] = useState([
        {
            id: 'TICK-001',
            customerId: 'CUST-001',
            username: 'johndoe',
            issue: 'Order #12345 Issue',
            status: 'unassigned',
            createdAt: '2024-03-15 10:30 AM'
        },
        {
            id: 'TICK-002',
            customerId: 'CUST-002',
            username: 'janesmith',
            issue: 'Payment Refund Request',
            status: 'unassigned',
            createdAt: '2024-03-14 02:15 PM'
        },
        {
            id: 'TICK-003',
            customerId: 'CUST-003',
            username: 'mikejohnson',
            issue: 'Delivery Delay',
            status: 'unassigned',
            createdAt: '2024-03-13 09:00 AM'
        }
    ]);

    // Mock data for staff members
    const [staffMembers] = useState([
        { id: 1, name: 'John Smith', role: 'Support Staff', ticketsAssigned: 5 },
        { id: 2, name: 'Sarah Johnson', role: 'Support Staff', ticketsAssigned: 3 },
        { id: 3, name: 'Mike Brown', role: 'Support Staff', ticketsAssigned: 7 }
    ]);

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

    const handleStaffSelect = (ticketId, staffId) => {
        setTempStaffSelection(prev => ({
            ...prev,
            [ticketId]: staffId
        }));
        
        // If ticket was previously assigned, remove it from assigned tickets
        if (assignedTickets.has(ticketId)) {
            setAssignedTickets(prev => {
                const newSet = new Set(prev);
                newSet.delete(ticketId);
                return newSet;
            });
        }
    };

    const handleAssignClick = (ticket) => {
        const staffId = tempStaffSelection[ticket.id];
        if (!staffId) return;
        
        setSelectedTicket(ticket);
        setSelectedStaff(staffId);
        setShowAssignModal(true);
    };

    const handleConfirmAssign = () => {
        // Here you would make an API call to assign the ticket
        console.log(`Assigning ticket ${selectedTicket.id} to staff member ${selectedStaff}`);
        
        // Add ticket to assigned set
        setAssignedTickets(prev => new Set([...prev, selectedTicket.id]));
        
        // Show success toast
        toast.success(`Ticket ${selectedTicket.id} has been assigned to ${staffMembers.find(s => s.id === parseInt(selectedStaff))?.name}`, {
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

        setShowAssignModal(false);
        setSelectedTicket(null);
        setSelectedStaff(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'unassigned':
                return 'bg-yellow-100 text-yellow-800';
            case 'in-progress':
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
            ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.issue.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

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
                            <option value="in-progress">In Progress</option>
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
                                        <tr key={ticket.id} className="border-b group relative hover:bg-gray-50">
                                            <td className="px-3 py-2 text-sm truncate">{ticket.id}</td>
                                            <td className="px-3 py-2 text-sm truncate">{ticket.customerId}</td>
                                            <td className="px-3 py-2 text-sm truncate">{ticket.username}</td>
                                            <td className="px-3 py-2 text-sm truncate group relative">
                                                <span 
                                                    className="cursor-pointer text-[var(--hotpink)] hover:underline"
                                                    onClick={() => {
                                                        setSelectedTicket(ticket);
                                                        setShowDetailsModal(true);
                                                    }}
                                                >
                                                    {ticket.issue}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2 text-sm truncate">{ticket.createdAt}</td>
                                            <td className="px-3 py-2 text-sm">
                                                <select
                                                    className="w-full px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--hotpink)]"
                                                    value={tempStaffSelection[ticket.id] || ''}
                                                    onChange={(e) => handleStaffSelect(ticket.id, e.target.value)}
                                                >
                                                    <option value="">Select Staff</option>
                                                    {staffMembers.map(staff => (
                                                        <option key={staff.id} value={staff.id}>
                                                            {staff.name} ({staff.ticketsAssigned} tickets)
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-3 py-2 text-sm">
                                                {assignedTickets.has(ticket.id) ? (
                                                    <button
                                                        disabled
                                                        className="py-1 px-3 rounded-md text-white text-sm bg-gray-400 cursor-not-allowed"
                                                    >
                                                        Assigned
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleAssignClick(ticket)}
                                                        disabled={!tempStaffSelection[ticket.id]}
                                                        className={`py-1 px-3 rounded-md text-white text-sm transition ${
                                                            tempStaffSelection[ticket.id]
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
                                        <p><span className="font-medium text-gray-600">Customer ID:</span></p>
                                        <p><span className="font-medium text-gray-600">Username:</span></p>
                                        <p><span className="font-medium text-gray-600">Status:</span></p>
                                        <p><span className="font-medium text-gray-600">Created:</span></p>
                                    </div>
                                    <div className="space-y-2">
                                        <p>{selectedTicket.id}</p>
                                        <p>{selectedTicket.customerId}</p>
                                        <p>{selectedTicket.username}</p>
                                        <p className={`inline-block px-2 py-0.5 rounded-full text-xs ${getStatusColor(selectedTicket.status)}`}>
                                            {selectedTicket.status.charAt(0).toUpperCase() + selectedTicket.status.slice(1)}
                                        </p>
                                        <p>{selectedTicket.createdAt}</p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t">
                                    <p className="font-medium text-gray-600 mb-2">Issue Description:</p>
                                    <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.issue}</p>
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
                                Are you sure you want to assign ticket {selectedTicket.id} to{' '}
                                <span className="font-medium">{staffMembers.find(s => s.id === parseInt(selectedStaff))?.name}</span>?
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