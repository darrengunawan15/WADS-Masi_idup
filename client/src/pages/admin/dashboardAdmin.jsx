import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, Pie, Line } from 'react-chartjs-2';
import DashboardHeader from '../../components/DashboardHeader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const DashboardAdmin = () => {
    const navigate = useNavigate();
    const [sidebarWidth, setSidebarWidth] = useState('20');
    const [adminName, setAdminName] = useState('Admin User'); // This should come from your auth context/state
    const [selectedTimePeriod, setSelectedTimePeriod] = useState('24h');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState('');
    const [tempStaffSelection, setTempStaffSelection] = useState({});

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

    // Mock data for staff members with response time
    const staffMembers = [
        { id: 1, name: 'John Smith', ticketsAssigned: 15, ticketsResolved: 12, avgResponseTime: '2.5 hours' },
        { id: 2, name: 'Sarah Johnson', ticketsAssigned: 12, ticketsResolved: 10, avgResponseTime: '3.1 hours' },
        { id: 3, name: 'Mike Brown', ticketsAssigned: 18, ticketsResolved: 15, avgResponseTime: '2.8 hours' },
        { id: 4, name: 'Lisa Davis', ticketsAssigned: 10, ticketsResolved: 8, avgResponseTime: '3.5 hours' },
    ];

    // Mock data for tickets
    const tickets = [
        { id: 1, customerId: 101, username: 'John Doe', issue: 'Login Issue', status: 'Unassigned', dateIssued: '2025-04-25' },
        { id: 2, customerId: 102, username: 'Jane Smith', issue: 'Payment Problem', status: 'Assigned', assignedTo: 'John Smith', dateIssued: '2025-04-24' },
        { id: 3, customerId: 103, username: 'Sam Wilson', issue: 'Account Locked', status: 'Unassigned', dateIssued: '2025-04-23' },
    ];

    const totalTickets = tickets.length;
    const unassignedTickets = tickets.filter(ticket => ticket.status === 'Unassigned').length;

    // Mock data for user registration with different time periods
    const userRegistrationData = {
        '24h': {
            labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
            data: [5, 8, 12, 15, 10, 7, 4]
        },
        '7d': {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [25, 32, 28, 35, 42, 38, 45]
        },
        '14d': {
            labels: ['Week 1', 'Week 2'],
            data: [185, 215]
        },
        '30d': {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [185, 215, 198, 245]
        },
        '90d': {
            labels: ['Jan', 'Feb', 'Mar'],
            data: [450, 520, 480]
        }
    };

    const getChartData = (period) => ({
        labels: userRegistrationData[period].labels,
        datasets: [{
            label: 'New Users',
            data: userRegistrationData[period].data,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            fill: true,
            backgroundColor: 'rgba(75, 192, 192, 0.2)'
        }]
    });

    // Chart Data
    const ticketAssignmentData = {
        labels: ['Assigned', 'Unassigned'],
        datasets: [{
            data: [
                tickets.filter(ticket => ticket.status === 'Assigned').length,
                tickets.filter(ticket => ticket.status === 'Unassigned').length
            ],
            backgroundColor: [
                'rgba(75, 192, 192, 0.5)',
                'rgba(255, 99, 132, 0.5)',
            ],
            borderColor: [
                'rgb(75, 192, 192)',
                'rgb(255, 99, 132)',
            ],
            borderWidth: 1
        }]
    };

    const staffPerformanceData = {
        labels: staffMembers.map(staff => staff.name),
        datasets: [
            {
                label: 'Tickets Assigned',
                data: staffMembers.map(staff => staff.ticketsAssigned),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 1
            },
            {
                label: 'Tickets Resolved',
                data: staffMembers.map(staff => staff.ticketsResolved),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1
            }
        ]
    };

    const ticketStatusData = {
        labels: ['Assigned', 'Unassigned', 'In Progress', 'Resolved'],
        datasets: [{
            data: [45, 23, 15, 67],
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 206, 86)',
                'rgb(75, 192, 192)',
            ],
            borderWidth: 1
        }]
    };

    const responseTimeData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Average Response Time (hours)',
            data: [2.5, 3.1, 2.8, 2.3, 2.7, 3.5, 2.9],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    // Mock data for users
    const users = [
        { id: 1, username: 'John Doe', status: 'active' },
        { id: 2, username: 'Jane Smith', status: 'inactive' },
        { id: 3, username: 'Sam Wilson', status: 'active' },
        { id: 4, username: 'Mike Brown', status: 'active' },
        { id: 5, username: 'Lisa Davis', status: 'inactive' },
    ];

    const activeUsers = users.filter(user => user.status === 'active').length;
    const inactiveUsers = users.filter(user => user.status === 'inactive').length;

    const handleStaffSelect = (ticketId, staffId) => {
        setTempStaffSelection(prev => ({
            ...prev,
            [ticketId]: staffId
        }));
    };

    const handleAssignClick = (ticket) => {
        const staffId = tempStaffSelection[ticket.id];
        if (!staffId) return;
        
        setSelectedTicket(ticket);
        setSelectedStaff(staffId);
        setShowConfirmModal(true);
    };

    const handleConfirmAssignment = () => {
        // Here you would typically make an API call to update the ticket
        console.log(`Assigning ticket ${selectedTicket.id} to staff ${selectedStaff}`);
        
        // Show success toast
        toast.success(`Ticket #${selectedTicket.id} assigned successfully!`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });

        // Close modal and reset states
        setShowConfirmModal(false);
        setSelectedTicket(null);
        setSelectedStaff('');
    };

    return (
        <div className={`flex-1 bg-gray-50 p-6 h-screen overflow-hidden transition-all duration-300 ${sidebarWidth === '20' ? 'ml-20' : 'ml-64'}`}>
            <DashboardHeader staffName={adminName} />

            <div className="h-full flex flex-col space-y-6 pt-8">
                {/* Counters Row */}
                <div className="grid grid-cols-4 gap-6">
                    {/* Unassigned Tickets */}
                    <div className="col-span-2">
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-sm font-semibold text-gray-700">Unassigned Tickets</h3>
                            <span className="text-3xl font-bold text-[var(--hotpink)]">{unassignedTickets}</span>
                        </div>
                    </div>

                    {/* User Statistics */}
                    <div className="col-span-2">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">User Statistics</h3>
                        <div className="flex gap-6">
                            <div className="flex flex-col items-center">
                                <span className="text-sm text-gray-600">Current Admin</span>
                                <span className="text-lg font-semibold text-[var(--hotpink)]">1</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-sm text-gray-600">Active Users</span>
                                <span className="text-lg font-semibold text-green-500">{activeUsers}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-sm text-gray-600">Inactive Users</span>
                                <span className="text-lg font-semibold text-red-500">{inactiveUsers}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-3 gap-6">
                    {/* Ticket Assignment Status Chart */}
                    <div className="bg-white p-4 rounded-xl shadow-lg h-[300px]">
                        <h3 className="text-lg font-semibold mb-4">Ticket Assignment Status</h3>
                        <div className="h-[calc(100%-40px)]">
                            <Pie data={ticketAssignmentData} options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'right'
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: function(context) {
                                                const label = context.label || '';
                                                const value = context.raw || 0;
                                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                                const percentage = Math.round((value / total) * 100);
                                                return `${label}: ${value} tickets (${percentage}%)`;
                                            }
                                        }
                                    }
                                }
                            }} />
                        </div>
                    </div>

                    {/* Staff Performance Chart */}
                    <div className="bg-white p-4 rounded-xl shadow-lg h-[300px]">
                        <h3 className="text-lg font-semibold mb-4">Staff Performance</h3>
                        <div className="h-[calc(100%-40px)]">
                            <Bar data={staffPerformanceData} options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: 'Number of Tickets'
                                        }
                                    }
                                },
                                plugins: {
                                    legend: {
                                        position: 'top'
                                    }
                                }
                            }} />
                        </div>
                    </div>

                    {/* User Registration Chart */}
                    <div className="bg-white p-4 rounded-xl shadow-lg h-[300px]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">User Registration</h3>
                            <select 
                                className="px-3 py-1 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--hotpink)]"
                                value={selectedTimePeriod}
                                onChange={(e) => setSelectedTimePeriod(e.target.value)}
                            >
                                <option value="24h">Last 24 Hours</option>
                                <option value="7d">Last 7 Days</option>
                                <option value="14d">Last 14 Days</option>
                                <option value="30d">Last 30 Days</option>
                                <option value="90d">Last 90 Days</option>
                            </select>
                        </div>
                        <div className="h-[calc(100%-60px)]">
                            <Line data={getChartData(selectedTimePeriod)} options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: 'Number of Users'
                                        }
                                    }
                                },
                                plugins: {
                                    legend: {
                                        display: false
                                    },
                                    tooltip: {
                                        callbacks: {
                                            title: (context) => {
                                                const period = selectedTimePeriod;
                                                if (period === '24h') {
                                                    return `Time: ${context[0].label}`;
                                                } else if (period === '7d') {
                                                    return `Day: ${context[0].label}`;
                                                } else if (period === '14d' || period === '30d') {
                                                    return `Week: ${context[0].label}`;
                                                } else {
                                                    return `Month: ${context[0].label}`;
                                                }
                                            }
                                        }
                                    }
                                }
                            }} />
                        </div>
                    </div>
                </div>

                {/* Tables Row */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Unassigned Tickets Section */}
                    <div className="bg-white p-4 rounded-xl shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Unassigned Tickets</h2>
                            <button 
                                onClick={() => navigate('/manage-tickets')}
                                className="text-[var(--hotpink)] hover:text-[var(--roseberry)] transition-colors cursor-pointer"
                            >
                                View All
                            </button>
                        </div>

                        <div className="overflow-auto max-h-[400px]">
                            <table className="min-w-full table-auto rounded-lg overflow-hidden border border-gray-300">
                                <thead className="bg-[var(--hotpink)] text-white sticky top-0">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-sm">Ticket #</th>
                                        <th className="px-3 py-2 text-left text-sm">Customer</th>
                                        <th className="px-3 py-2 text-left text-sm">Issue</th>
                                        <th className="px-3 py-2 text-left text-sm">Date</th>
                                        <th className="px-3 py-2 text-left text-sm">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tickets.filter(ticket => ticket.status === 'Unassigned').map(ticket => (
                                        <tr key={ticket.id} className="border-b">
                                            <td className="px-3 py-2 text-sm">{ticket.id}</td>
                                            <td className="px-3 py-2 text-sm">{ticket.username}</td>
                                            <td className="px-3 py-2 text-sm">{ticket.issue}</td>
                                            <td className="px-3 py-2 text-sm">{ticket.dateIssued}</td>
                                            <td className="px-3 py-2 text-sm">
                                                <div className="flex items-center gap-2 w-full">
                                                    <select 
                                                        className="flex-1 px-3 py-1 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--hotpink)] bg-white cursor-pointer"
                                                        value={tempStaffSelection[ticket.id] || ''}
                                                        onChange={(e) => handleStaffSelect(ticket.id, e.target.value)}
                                                    >
                                                        <option value="">Assign to...</option>
                                                        {staffMembers.map(staff => (
                                                            <option key={staff.id} value={staff.id}>{staff.name}</option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        onClick={() => handleAssignClick(ticket)}
                                                        disabled={!tempStaffSelection[ticket.id]}
                                                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                                                            tempStaffSelection[ticket.id]
                                                                ? 'bg-[var(--hotpink)] text-white hover:bg-[var(--roseberry)] cursor-pointer'
                                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                        }`}
                                                    >
                                                        Confirm
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Staff Overview Section */}
                    <div className="bg-white p-4 rounded-xl shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Staff Overview</h2>
                            <button 
                                onClick={() => navigate('/staff-management')}
                                className="text-[var(--hotpink)] hover:text-[var(--roseberry)] transition-colors cursor-pointer"
                            >
                                Manage Staff
                            </button>
                        </div>

                        <div className="overflow-auto max-h-[400px]">
                            <table className="w-full table-auto rounded-lg overflow-hidden border border-gray-300">
                                <thead className="bg-[var(--hotpink)] text-white sticky top-0">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-sm w-1/4">Staff Name</th>
                                        <th className="px-3 py-2 text-left text-sm w-1/4">Assigned</th>
                                        <th className="px-3 py-2 text-left text-sm w-1/4">Resolved</th>
                                        <th className="px-3 py-2 text-left text-sm w-1/4">Avg Response Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {staffMembers.map(staff => (
                                        <tr key={staff.id} className="border-b">
                                            <td className="px-3 py-2 text-sm">{staff.name}</td>
                                            <td className="px-3 py-2 text-sm">{staff.ticketsAssigned}</td>
                                            <td className="px-3 py-2 text-sm">{staff.ticketsResolved}</td>
                                            <td className="px-3 py-2 text-sm">
                                                <span className={`font-medium ${
                                                    parseFloat(staff.avgResponseTime) <= 2.5 ? 'text-green-500' :
                                                    parseFloat(staff.avgResponseTime) <= 3.0 ? 'text-yellow-500' :
                                                    'text-red-500'
                                                }`}>
                                                    {staff.avgResponseTime}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Confirmation Modal */}
                {showConfirmModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="absolute inset-0 backdrop-blur-sm bg-white/30"></div>
                        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl relative z-10">
                            <h3 className="text-lg font-semibold mb-4">Confirm Assignment</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to assign Ticket #{selectedTicket?.id} to {staffMembers.find(s => s.id === parseInt(selectedStaff))?.name}?
                            </p>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmAssignment}
                                    className="px-4 py-2 bg-[var(--hotpink)] text-white rounded-md hover:bg-[var(--roseberry)] transition-colors cursor-pointer"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Toast Container */}
                <ToastContainer />
            </div>
        </div>
    );
};

export default DashboardAdmin;