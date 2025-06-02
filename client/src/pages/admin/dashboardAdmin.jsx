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
    const [unassignedTickets, setUnassignedTickets] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

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
                const [ticketsRes, usersRes, staffRes, unassignedRes] = await Promise.all([
                    adminService.getAllTickets(token),
                    adminService.getAllUsers(token),
                    adminService.getStaff(token),
                    adminService.getUnassignedTickets(token),
                ]);
                setTickets(ticketsRes);
                setUsers(usersRes);
                setStaffMembers(staffRes);
                setUnassignedTickets(unassignedRes);
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
    const unassignedTicketsCount = unassignedTickets.length;
    const assignedTickets = tickets.filter(ticket => ticket.assignedTo).length;
    const inProgressTickets = tickets.filter(ticket => ticket.status === 'in progress').length;
    const resolvedTickets = tickets.filter(ticket => ticket.status === 'closed').length;

    // User stats
    const activeUsers = users.filter(u => u.status === 'active').length;
    const inactiveUsers = users.filter(u => u.status === 'inactive').length;

    // Staff performance
    const staffPerformance = staffMembers
        .filter(staff => staff.role === 'staff') // Only include staff members
        .map(staff => {
            const assignedTickets = tickets.filter(ticket => ticket.assignedTo && ticket.assignedTo._id === staff._id);
            const ticketsAssigned = assignedTickets.length;
            const ticketsResolved = assignedTickets.filter(ticket => ticket.status === 'resolved').length;
            // Calculate avg response time in hours for resolved/in progress tickets
            const relevantTickets = assignedTickets.filter(ticket => ticket.status === 'resolved' || ticket.status === 'in progress');
            let avgResponseTime = null;
            if (relevantTickets.length > 0) {
                const totalHours = relevantTickets.reduce((sum, ticket) => {
                    const created = new Date(ticket.createdAt);
                    const updated = new Date(ticket.updatedAt);
                    return sum + (updated - created) / 3600000;
                }, 0);
                avgResponseTime = (totalHours / relevantTickets.length).toFixed(2);
            }
            // Calculate performance percentage
            let performance = 'N/A';
            if (ticketsAssigned > 0) {
                performance = ((ticketsResolved / ticketsAssigned) * 100).toFixed(1);
            }
            return {
                ...staff,
                ticketsAssigned,
                ticketsResolved,
                avgResponseTime: avgResponseTime !== null ? avgResponseTime : 'N/A',
                performance,
            };
        });

    // Chart Data
    const ticketAssignmentData = {
        labels: ['Assigned', 'Unassigned'],
        datasets: [{
            data: [assignedTickets, unassignedTicketsCount],
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
            data: [assignedTickets, unassignedTicketsCount, inProgressTickets, resolvedTickets],
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

    // User registration chart: filter by selected time period
    const getChartData = () => {
        const now = new Date();
        let startDate;
        
        switch(selectedTimePeriod) {
            case '24h':
                startDate = new Date(now - 24 * 60 * 60 * 1000);
                break;
            case '7d':
                startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
                break;
            case '14d':
                startDate = new Date(now - 14 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
                break;
            case '90d':
                startDate = new Date(now - 90 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now - 24 * 60 * 60 * 1000);
        }

        // Format dates for display
        const formatDate = (date) => {
            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
        };

        // Get all active users
        const activeUsers = users.filter(user => user.status === 'active');

        // Create an array of dates for the selected period
        const dates = [];
        const currentDate = new Date(startDate);
        while (currentDate <= now) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Calculate cumulative active users for each date
        const activeUsersData = dates.reduce((acc, date) => {
            const dateStr = formatDate(date);
            // Count users who were active on or before this date
            const activeCount = activeUsers.filter(user => 
                new Date(user.createdAt) <= date
            ).length;
            acc[dateStr] = activeCount;
            return acc;
        }, {});

        // Sort dates chronologically
        const registrationLabels = Object.keys(activeUsersData).sort((a, b) => {
            const dateA = new Date(a.split(' ').reverse().join(' '));
            const dateB = new Date(b.split(' ').reverse().join(' '));
            return dateA - dateB;
        });
        const registrationCounts = registrationLabels.map(date => activeUsersData[date]);

        return {
            labels: registrationLabels,
            datasets: [{
                label: 'Total Active Customers',
                data: registrationCounts,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                fill: true,
                backgroundColor: 'rgba(75, 192, 192, 0.2)'
            }],
            dateRange: {
                start: formatDate(startDate),
                end: formatDate(now)
            }
        };
    };

    const handleStaffSelect = (ticketId, staffId) => {
        setTempStaffSelection(prev => ({
            ...prev,
            [ticketId]: staffId
        }));
    };

    const handleAssignClick = (ticket) => {
        const staffId = tempStaffSelection[ticket._id];
        if (!staffId) return;
        setSelectedTicket(ticket);
        setSelectedStaff(staffId);
        setShowConfirmModal(true);
    };

    const handleConfirmAssignment = async () => {
        if (!selectedTicket || !selectedStaff) return;
        try {
            const token = localStorage.getItem('accessToken');
            await adminService.assignTicket(selectedTicket._id, selectedStaff, token);
            toast.success(`Ticket #${selectedTicket._id} assigned successfully!`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            // Remove the ticket from unassignedTickets and update tickets
            setUnassignedTickets(prev => prev.filter(t => t._id !== selectedTicket._id));
            setTickets(prev => prev.map(t => t._id === selectedTicket._id ? { ...t, assignedTo: { _id: selectedStaff } } : t));
        } catch (err) {
            toast.error('Failed to assign ticket. Please try again.');
        } finally {
            setShowConfirmModal(false);
            setSelectedTicket(null);
            setSelectedStaff('');
        }
    };

    const handleSort = (key) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const sortedStaffPerformance = [...staffPerformance].sort((a, b) => {
        if (sortConfig.key === 'name') {
            const nameA = (a.name || a.username || a.email).toLowerCase();
            const nameB = (b.name || b.username || b.email).toLowerCase();
            return sortConfig.direction === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        } else if (sortConfig.key === 'performance') {
            const perfA = a.performance === 'N/A' ? -1 : parseFloat(a.performance);
            const perfB = b.performance === 'N/A' ? -1 : parseFloat(b.performance);
            return sortConfig.direction === 'asc' ? perfA - perfB : perfB - perfA;
        }
        return 0;
    });

    return (
        <div className={`flex-1 bg-gray-50 p-6 min-h-screen overflow-auto transition-all duration-300 ${sidebarWidth === '20' ? 'ml-20' : 'ml-64'}`}>
            <ToastContainer />
            <DashboardHeader staffName={adminUser?.name || 'Admin'} role={adminUser?.role} />

            <div className="h-full flex flex-col space-y-6 pt-8">
                {/* Counters Row */}
                <div className="grid grid-cols-4 gap-6">
                    {/* Unassigned Tickets */}
                    <div className="col-span-2">
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-sm font-semibold text-gray-700">Unassigned Tickets</h3>
                            <span className="text-3xl font-bold text-[var(--hotpink)]">{unassignedTicketsCount}</span>
                        </div>
                    </div>

                    {/* User Statistics */}
                    <div className="col-span-2">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">User Statistics</h3>
                        <div className="flex gap-6">
                            <div className="flex flex-col items-center">
                                <span className="text-sm text-gray-600">Current Staff</span>
                                <span className="text-lg font-semibold text-[var(--hotpink)]">{staffMembers.filter(staff => staff.role === 'staff').length}</span>
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
                                                const value = Math.round(context.raw || 0);
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
                                        },
                                        ticks: {
                                            stepSize: 1
                                        }
                                    }
                                },
                                plugins: {
                                    legend: {
                                        position: 'top'
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: (context) => {
                                                return `${context.dataset.label}: ${Math.round(context.raw)}`;
                                            }
                                        }
                                    }
                                }
                            }} />
                        </div>
                    </div>

                    {/* User Registration Chart */}
                    <div className="bg-white p-4 rounded-xl shadow-lg h-[300px]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Total Active Customers</h3>
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
                        <div className="text-sm text-gray-600 mb-2">
                            {getChartData().dateRange.start} - {getChartData().dateRange.end}
                        </div>
                        <div className="h-[calc(100%-80px)]">
                            <Line data={getChartData()} options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: 'Total Active Customers'
                                        },
                                        ticks: {
                                            stepSize: 1
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
                                                return `Day: ${context[0].label}`;
                                            },
                                            label: (context) => {
                                                return `Total Active Customers: ${Math.round(context.raw)}`;
                                            }
                                        }
                                    }
                                }
                            }} />
                        </div>
                    </div>
                </div>

                {/* Tables Row */}
                <div className="grid grid-cols-3 gap-6">
                    {/* Unassigned Tickets Section */}
                    <div className="col-span-2 bg-white p-4 rounded-xl shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Unassigned Tickets</h2>
                            <button 
                                onClick={() => navigate('/assign-tickets')}
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
                                    {unassignedTickets.map(ticket => (
                                        <tr key={ticket._id} className="border-b">
                                            <td className="px-3 py-2 text-sm">{ticket._id}</td>
                                            <td className="px-3 py-2 text-sm">{ticket.customer?.name || ticket.customer?.email || 'Unknown'}</td>
                                            <td className="px-3 py-2 text-sm">{ticket.subject}</td>
                                            <td className="px-3 py-2 text-sm">{ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : ''}</td>
                                            <td className="px-3 py-2 text-sm">
                                                <div className="flex items-center gap-2 w-full">
                                                    <select 
                                                        className="flex-1 px-3 py-1 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--hotpink)] bg-white cursor-pointer"
                                                        value={tempStaffSelection[ticket._id] || ''}
                                                        onChange={(e) => handleStaffSelect(ticket._id, e.target.value)}
                                                    >
                                                        <option value="">Assign to...</option>
                                                        {staffMembers
                                                            .filter(staff => staff.role === 'staff')
                                                            .map(staff => (
                                                                <option key={staff._id} value={staff._id}>{staff.name}</option>
                                                            ))}
                                                    </select>
                                                    <button
                                                        onClick={() => handleAssignClick(ticket)}
                                                        disabled={!tempStaffSelection[ticket._id]}
                                                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                                                            tempStaffSelection[ticket._id]
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
                    <div className="col-span-1 bg-white p-4 rounded-xl shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Staff Overview</h2>
                            <button 
                                onClick={() => navigate('/manage-staff')}
                                className="text-[var(--hotpink)] hover:text-[var(--roseberry)] transition-colors cursor-pointer"
                            >
                                Manage Staff
                            </button>
                        </div>

                        <div className="overflow-auto max-h-[400px]">
                            <table className="w-full table-auto rounded-lg overflow-hidden border border-gray-300">
                                <thead className="bg-[var(--hotpink)] text-white sticky top-0">
                                    <tr>
                                        <th 
                                            className="px-3 py-2 text-left text-sm w-[40%] cursor-pointer hover:bg-[var(--roseberry)]"
                                            onClick={() => handleSort('name')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Staff Name
                                                {sortConfig.key === 'name' && (
                                                    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                                )}
                                            </div>
                                        </th>
                                        <th className="px-3 py-2 text-left text-sm w-[20%]">Assigned</th>
                                        <th className="px-3 py-2 text-left text-sm w-[20%]">Resolved</th>
                                        <th 
                                            className="px-3 py-2 text-left text-sm w-[20%] cursor-pointer hover:bg-[var(--roseberry)]"
                                            onClick={() => handleSort('performance')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Performance
                                                {sortConfig.key === 'performance' && (
                                                    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                                )}
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedStaffPerformance.map(staff => (
                                        <tr key={staff._id} className="border-b">
                                            <td className="px-3 py-2 text-sm truncate" title={staff.name || staff.username || staff.email}>
                                                {staff.name || staff.username || staff.email}
                                            </td>
                                            <td className="px-3 py-2 text-sm">{staff.ticketsAssigned}</td>
                                            <td className="px-3 py-2 text-sm">{staff.ticketsResolved}</td>
                                            <td className="px-3 py-2 text-sm">
                                                {staff.performance !== 'N/A' ? (
                                                    <span className={`font-medium ${
                                                        parseFloat(staff.performance) >= 75 ? 'text-green-500' :
                                                        parseFloat(staff.performance) >= 50 ? 'text-yellow-500' :
                                                        'text-red-500'
                                                    }`}>
                                                        {staff.performance}%
                                                    </span>
                                                ) : 'N/A'}
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
                                Are you sure you want to assign Ticket #{selectedTicket?._id} to {staffMembers.find(s => s._id === selectedStaff)?.name}?
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