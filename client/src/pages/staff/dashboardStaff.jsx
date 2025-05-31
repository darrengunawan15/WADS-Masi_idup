import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, Pie, Line } from 'react-chartjs-2';
import DashboardHeader from '../../components/DashboardHeader';
import { useDispatch, useSelector } from 'react-redux';
import { getTickets, reset as resetTickets, fetchDailyTicketStats, fetchAverageResponseTime } from '../../redux/slices/ticketSlice';
import Spinner from '../../components/Spinner';
import { format } from 'date-fns';
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

const DashboardStaff = () => {
    const navigate = useNavigate();
    const [sidebarWidth, setSidebarWidth] = useState('20');
    const { user } = useSelector((state) => state.auth);
    const { tickets, isLoading, isError, message, dailyStats, isStatsLoading, isStatsError, statsMessage, averageResponseTime, isResponseTimeLoading, isResponseTimeError, responseTimeMessage } = useSelector((state) => state.tickets);

    const dispatch = useDispatch();

    useEffect(() => {
        if (isError) {
            console.log(message);
        }
        if (isStatsError) {
            console.log(statsMessage);
        }
        if (isResponseTimeError) {
            console.log(responseTimeMessage);
        }

        if (user) {
            dispatch(getTickets());
            dispatch(fetchDailyTicketStats());
            dispatch(fetchAverageResponseTime());
        }

        return () => {
            dispatch(resetTickets());
        };
    }, [dispatch, user]);

    const staffTickets = tickets.filter(ticket => ticket.assignedTo?._id === user?._id);

    useEffect(() => {
        const handleResize = () => {
            const sidebar = document.querySelector('[class*="w-20"]');
            if (sidebar) {
                const width = sidebar.classList.contains('w-20') ? '20' : '64';
                setSidebarWidth(width);
            }
        };

        // Initial check
        handleResize();

        // Create a MutationObserver to watch for class changes
        const observer = new MutationObserver(handleResize);
        const sidebar = document.querySelector('[class*="w-20"]');
        if (sidebar) {
            observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] });
        }

        return () => observer.disconnect();
    }, []);

    // Calculate ticket status counts from fetched data
    const calculatedStatusCounts = staffTickets.reduce((counts, ticket) => {
        if (ticket.status === 'open') {
            counts.open++;
        } else if (ticket.status === 'in progress') {
            counts.inProgress++;
        } else if (ticket.status === 'closed') {
            counts.closed++;
        } else if (ticket.status === 'new') { // Assuming 'new' is a possible status
            counts.new++;
        } else if (ticket.status === 'pending') { // Assuming 'pending' is a possible status
            counts.pending++;
        }
        return counts;
    }, { open: 0, inProgress: 0, closed: 0, new: 0, pending: 0 }); // Initialize counts

    // You can keep mock data for monthly tickets if you don't have a backend endpoint for that
    const thisMonthTickets = 156; // Keep mock for now
    const lastMonthTickets = 142; // Keep mock for now

    const messages = [
        { id: 1, username: 'John Doe', message: 'Need help with my order', isNew: true },
        { id: 2, username: 'Jane Smith', message: 'Received wrong item', isNew: false },
        { id: 3, username: 'Sam Wilson', message: "Can't log into my account", isNew: true },
    ];

    const totalStaffTickets = staffTickets.length;
    // Unsolved tickets are typically 'open', 'in progress', 'new', 'pending'
    const unsolvedStaffTickets = staffTickets.filter(ticket => 
        ticket.status === 'open' || 
        ticket.status === 'in progress' ||
        ticket.status === 'new' ||
        ticket.status === 'pending'
    ).length;

    const totalMessages = messages.length;
    const newMessages = messages.filter(msg => msg.isNew).length;

    const handleViewTickets = () => navigate('/manage-tickets');
    const handleViewMessages = () => navigate('/manage-tickets');

    // Chart Data
    const ticketsPerDayData = {
        labels: dailyStats.map(stat => format(new Date(stat._id), 'MMM dd')),
        datasets: [{
            label: 'Tickets per Day',
            data: dailyStats.map(stat => stat.count),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1
        }]
    };

    const ticketStatusData = {
        labels: ['New', 'Open', 'In Progress', 'Pending', 'Closed'], // Updated labels
        datasets: [{
            data: [calculatedStatusCounts.new, calculatedStatusCounts.open, calculatedStatusCounts.inProgress, calculatedStatusCounts.pending, calculatedStatusCounts.closed], // Use calculated data
            backgroundColor: [
                'rgba(54, 162, 235, 0.5)', // Blue for New
                'rgba(255, 159, 64, 0.5)', // Orange for Open
                'rgba(75, 192, 192, 0.5)', // Green for In Progress
                'rgba(255, 205, 86, 0.5)', // Yellow for Pending
                'rgba(153, 102, 255, 0.5)', // Purple for Closed
            ],
            borderColor: [
                'rgb(54, 162, 235)',
                'rgb(255, 159, 64)',
                'rgb(75, 192, 192)',
                'rgb(255, 205, 86)',
                'rgb(153, 102, 255)',
            ],
            borderWidth: 1
        }]
    };

    const responseTimeData = {
        labels: averageResponseTime.map(stat => format(new Date(stat._id), 'MMM dd')),
        datasets: [{
            label: 'Average Response Time (hours)',
            data: averageResponseTime.map(stat => stat.averageResponseTimeHours),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.1
        }]
    };

    if (isLoading || isStatsLoading || isResponseTimeLoading) {
        return <Spinner />;
    }

    const recentStaffTickets = staffTickets.slice(0, 5);

    // Process tickets to find recent customer messages on assigned tickets
    const ticketsWithRecentCustomerComments = staffTickets
        .map(ticket => {
            // Find the latest comment
            const latestComment = ticket.comments && ticket.comments.length > 0 
                ? ticket.comments[ticket.comments.length - 1] 
                : null;

            // Check if the latest comment exists and is from the customer
            const isLatestCommentFromCustomer = latestComment?.author?.role === 'customer';

            // You could add more complex logic here if needed, e.g., check if staff has commented after the latest customer comment.
            // For now, we'll consider a ticket with the latest comment from a customer as having a "recent message".

            if (isLatestCommentFromCustomer) {
                return { // Return relevant info for display
                    _id: ticket._id,
                    subject: ticket.subject,
                    // Use the comment author's name if available, fallback to ticket.customer
                    customerName: latestComment.author?.name || ticket.customer?.name || 'Unknown Customer',
                    latestCommentContent: latestComment.content,
                    latestCommentCreatedAt: latestComment.createdAt,
                };
            } else {
                return null; // Exclude tickets without a recent customer comment
            }
        })
        .filter(item => item !== null) // Remove null entries
        .sort((a, b) => new Date(b.latestCommentCreatedAt) - new Date(a.latestCommentCreatedAt)) // Sort by latest comment date
        .slice(0, 5); // Get only the top 5 recent messages

    return (
        <div className={`flex-1 bg-gray-50 p-6 h-screen overflow-hidden transition-all duration-300 ${sidebarWidth === '20' ? 'ml-20' : 'ml-64'}`}>
            <DashboardHeader staffName={user?.name || 'Staff'} />

            <div className="h-full flex flex-col space-y-6 pt-8">
                {/* Counters Row */}
                <div className="grid grid-cols-4 gap-6">
                    {/* Monthly Tickets */}
                    <div className="col-span-2">
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-sm font-semibold text-gray-700">Your Total Tickets</h3>
                            <span className="text-3xl font-bold text-[var(--hotpink)]">{totalStaffTickets}</span>
                        </div>
                        <div className="mt-2">
                            <span className="text-sm text-gray-600">Unsolved: {unsolvedStaffTickets}</span>
                        </div>
                    </div>

                    {/* Spacer */}
                    <div></div>

                    {/* Ticket Status Counts */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Ticket Status</h3>
                        <div className="flex gap-6">
                            <div className="flex flex-col items-center">
                                <span className="text-sm text-gray-600">New</span>
                                <span className="text-lg font-semibold text-blue-500">{calculatedStatusCounts.new}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-sm text-gray-600">Open</span>
                                <span className="text-lg font-semibold text-[var(--hotpink)]">{calculatedStatusCounts.open}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-sm text-gray-600">In Progress</span>
                                <span className="text-lg font-semibold text-[var(--cyan)]">{calculatedStatusCounts.inProgress}</span> {/* Assuming --cyan is a color variable */}
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-sm text-gray-600">Pending</span>
                                <span className="text-lg font-semibold text-yellow-500">{calculatedStatusCounts.pending}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-sm text-gray-600">Closed</span>
                                <span className="text-lg font-semibold text-green-500">{calculatedStatusCounts.closed}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-3 gap-6">
                    {/* Tickets per Day Chart */}
                    <div className="bg-white p-4 rounded-xl shadow-lg h-[300px]">
                        <h3 className="text-lg font-semibold mb-4">Tickets per Day</h3>
                        <div className="h-[calc(100%-40px)]">
                            <Bar data={ticketsPerDayData} options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        display: false
                                    }
                                }
                            }} />
                        </div>
                    </div>

                    {/* Ticket Status Chart */}
                    <div className="bg-white p-4 rounded-xl shadow-lg h-[300px]">
                        <h3 className="text-lg font-semibold mb-4">Ticket Status</h3>
                        <div className="h-[calc(100%-40px)]">
                            <Pie data={ticketStatusData} options={{
                                responsive: true,
                                maintainAspectRatio: false
                            }} />
                        </div>
                    </div>

                    {/* Response Time Chart */}
                    <div className="bg-white p-4 rounded-xl shadow-lg h-[300px]">
                        <h3 className="text-lg font-semibold mb-4">Response Time</h3>
                        <div className="h-[calc(100%-40px)]">
                            <Line data={responseTimeData} options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        display: false
                                    }
                                }
                            }} />
                        </div>
                    </div>
                </div>

                {/* Tables Row */}
                <div className="grid grid-cols-3 gap-6">
                    {/* Manage Tickets Section - Spans 2 columns */}
                    <div className="col-span-2 bg-white p-4 rounded-xl shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Recent Tickets</h2>
                            <button 
                                onClick={() => navigate('/manage-tickets')}
                                className="text-[var(--hotpink)] hover:text-[var(--roseberry)] transition-colors cursor-pointer"
                            >
                                View More
                            </button>
                        </div>

                        <div className="overflow-auto">
                            <table className="min-w-full table-auto rounded-lg overflow-hidden border border-gray-300">
                                <thead className="bg-[var(--hotpink)] text-white sticky top-0">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-sm">Ticket #</th>
                                        <th className="px-3 py-2 text-left text-sm">Customer ID</th>
                                        <th className="px-3 py-2 text-left text-sm">Username</th>
                                        <th className="px-3 py-2 text-left text-sm">Issue</th>
                                        <th className="px-3 py-2 text-left text-sm">Status</th>
                                        <th className="px-3 py-2 text-left text-sm">Date Issued</th>
                                        <th className="px-3 py-2 text-left text-sm">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentStaffTickets.map(ticket => (
                                        <tr key={ticket._id} className="border-b border-gray-200 hover:bg-gray-100">
                                            <td className="px-3 py-2 text-sm text-gray-800">{ticket._id.substring(0, 6)}...</td>
                                            <td className="px-3 py-2 text-sm text-gray-800">{ticket.user?._id.substring(0, 6)}...</td>
                                            <td className="px-3 py-2 text-sm text-gray-800">{ticket.user?.name || 'N/A'}</td>
                                            <td className="px-3 py-2 text-sm text-gray-800">{ticket.subject}</td>
                                            <td className="px-3 py-2 text-sm text-gray-800 capitalize">{ticket.status}</td>
                                            <td className="px-3 py-2 text-sm text-gray-800">{format(new Date(ticket.createdAt), 'yyyy-MM-dd')}</td>
                                            <td className="px-3 py-2 text-sm text-gray-800">
                                                <button 
                                                    onClick={() => navigate(`/ticket-details/${ticket._id}`)}
                                                    className="text-[var(--blush)] hover:underline"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent Messages Section - Spans 1 column */}
                    <div className="col-span-1 bg-white p-4 rounded-xl shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Recent Messages</h2>
                            <button 
                                onClick={handleViewMessages}
                                className="text-[var(--hotpink)] hover:text-[var(--roseberry)] transition-colors cursor-pointer"
                            >
                                View More
                            </button>
                        </div>

                        <div className="space-y-4">
                            {ticketsWithRecentCustomerComments.length > 0 ? (
                                ticketsWithRecentCustomerComments.map(message => (
                                    <div key={message._id} className="p-3 rounded-md bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors"
                                        onClick={() => navigate(`/ticket-details/${message._id}`)} // Navigate to ticket details on click
                                    >
                                        <p className="text-sm font-semibold text-gray-800">{message.customerName} on Ticket: {message.subject}</p>
                                        <p className="text-sm text-gray-600 truncate">{message.latestCommentContent}</p>
                                         <p className="text-xs text-gray-500 mt-1">{format(new Date(message.latestCommentCreatedAt), 'yyyy-MM-dd HH:mm')}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-600">No recent customer messages on your assigned tickets.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardStaff;