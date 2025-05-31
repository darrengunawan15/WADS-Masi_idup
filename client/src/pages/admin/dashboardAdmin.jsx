import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, Pie, Line } from 'react-chartjs-2';
import DashboardHeader from '../../components/DashboardHeader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import adminService from '../../services/adminService';
import Spinner from '../../components/Spinner';
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
    const [selectedTimePeriod, setSelectedTimePeriod] = useState('24h');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState('');
    const [tempStaffSelection, setTempStaffSelection] = useState({});
    const [tickets, setTickets] = useState([]);
    const [users, setUsers] = useState([]);
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
                const [ticketsRes, usersRes, staffRes] = await Promise.all([
                    adminService.getAllTickets(token),
                    adminService.getAllUsers(token),
                    adminService.getStaff(token),
                ]);
                setTickets(ticketsRes);
                setUsers(usersRes);
                setStaffMembers(staffRes);
            } catch (err) {
                setError('Failed to load admin dashboard data');
                toast.error('Failed to load admin dashboard data');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return <Spinner />;
    }
    if (error) {
        return <div className="p-6 text-red-500">{error}</div>;
    }

    // Calculate stats from real data
    const totalTickets = tickets.length;
    const unassignedTickets = tickets.filter(ticket => !ticket.assignedTo).length;
    const assignedTickets = tickets.filter(ticket => ticket.assignedTo).length;
    const inProgressTickets = tickets.filter(ticket => ticket.status === 'in progress').length;
    const resolvedTickets = tickets.filter(ticket => ticket.status === 'closed').length;

    // User stats
    const activeUsers = users.filter(u => u.status === 'active').length;
    const inactiveUsers = users.filter(u => u.status === 'inactive').length;

    // Staff performance
    const staffPerformance = staffMembers.map(staff => {
        const assigned = tickets.filter(ticket => ticket.assignedTo && ticket.assignedTo._id === staff._id).length;
        const resolved = tickets.filter(ticket => ticket.assignedTo && ticket.assignedTo._id === staff._id && ticket.status === 'closed').length;
        return {
            ...staff,
            ticketsAssigned: assigned,
            ticketsResolved: resolved,
        };
    });

    // Chart Data
    const ticketAssignmentData = {
        labels: ['Assigned', 'Unassigned'],
        datasets: [{
            data: [assignedTickets, unassignedTickets],
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
        labels: staffPerformance.map(staff => staff.name || staff.username || staff.email),
        datasets: [
            {
                label: 'Tickets Assigned',
                data: staffPerformance.map(staff => staff.ticketsAssigned),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 1
            },
            {
                label: 'Tickets Resolved',
                data: staffPerformance.map(staff => staff.ticketsResolved),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1
            }
        ]
    };

    const ticketStatusData = {
        labels: ['Assigned', 'Unassigned', 'In Progress', 'Resolved'],
        datasets: [{
            data: [assignedTickets, unassignedTickets, inProgressTickets, resolvedTickets],
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

    // User registration chart: fallback to user createdAt for now
    const userRegistrationData = users.reduce((acc, user) => {
        const date = new Date(user.createdAt).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});
    const registrationLabels = Object.keys(userRegistrationData).sort();
    const registrationCounts = registrationLabels.map(date => userRegistrationData[date]);
    const getChartData = () => ({
        labels: registrationLabels,
        datasets: [{
            label: 'New Users',
            data: registrationCounts,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            fill: true,
            backgroundColor: 'rgba(75, 192, 192, 0.2)'
        }]
    });

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
            <ToastContainer />
            <DashboardHeader staffName={adminUser?.name || 'Admin'} />

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
                            <Line data={getChartData()} options={{
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
                                    {tickets.filter(ticket => !ticket.assignedTo).map(ticket => (
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
                                    {staffPerformance.map(staff => (
                                        <tr key={staff.id} className="border-b">
                                            <td className="px-3 py-2 text-sm">{staff.name || staff.username || staff.email}</td>
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
            </div>
        </div>
    );
};

export default DashboardAdmin;