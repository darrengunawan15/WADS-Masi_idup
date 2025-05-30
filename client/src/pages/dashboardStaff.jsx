import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, Pie, Line } from 'react-chartjs-2';
import DashboardHeader from '../components/DashboardHeader';
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
    const [staffName, setStaffName] = useState('John Doe'); // This should come from your auth context/state

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

  const { tickets, isLoading, isError, message } = useSelector(
    (state) => state.tickets
  );
  const { user } = useSelector((state) => state.auth); // Get user from auth state

    // Add mock data for monthly tickets and status counts
    const thisMonthTickets = 156;
    const lastMonthTickets = 142;
    const ticketStatusCounts = {
        open: 45,
        new: 23,
        closed: 67,
        pending: 21
    };

    const messages = [
        { id: 1, username: 'John Doe', message: 'Need help with my order', isNew: true },
        { id: 2, username: 'Jane Smith', message: 'Received wrong item', isNew: false },
        { id: 3, username: 'Sam Wilson', message: "Can't log into my account", isNew: true },
    ];

    if (isError) {
      console.log(message); // You might want to display this in the UI
    }

    // Fetch all tickets for staff/admin
    if (user) {
        dispatch(getTickets());
    }

    const handleViewTickets = () => navigate('/manage-tickets');
    const handleViewMessages = () => navigate('/support-messages');

    // Chart Data
    const ticketsPerDayData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Tickets per Day',
            data: [12, 19, 15, 17, 14, 8, 10],
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1
        }]
    };

    const ticketStatusData = {
        labels: ['Opened', 'New', 'Pending', 'Closed'],
        datasets: [{
            data: [30, 20, 15, 35],
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

    return (
        <div className={`flex-1 bg-gray-50 p-6 h-screen overflow-hidden transition-all duration-300 ${sidebarWidth === '20' ? 'ml-20' : 'ml-64'}`}>
            <DashboardHeader staffName={staffName} />

            <div className="h-full flex flex-col space-y-6 pt-8">
                {/* Counters Row */}
                <div className="grid grid-cols-4 gap-6">
                    {/* Monthly Tickets */}
                    <div className="col-span-2">
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-sm font-semibold text-gray-700">This Month's Tickets</h3>
                            <span className="text-3xl font-bold text-[var(--hotpink)]">{thisMonthTickets}</span>
                            <span className={`text-sm ${thisMonthTickets > lastMonthTickets ? 'text-green-500' : 'text-red-500'}`}>
                                ({thisMonthTickets > lastMonthTickets ? '+' : '-'}{Math.abs(thisMonthTickets - lastMonthTickets)})
                            </span>
                        </div>
                        <div className="mt-2">
                            <span className="text-sm text-gray-600">Last Month: {lastMonthTickets}</span>
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
                                <span className="text-lg font-semibold text-blue-500">{ticketStatusCounts.new}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-sm text-gray-600">Open</span>
                                <span className="text-lg font-semibold text-[var(--hotpink)]">{ticketStatusCounts.open}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-sm text-gray-600">Pending</span>
                                <span className="text-lg font-semibold text-yellow-500">{ticketStatusCounts.pending}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-sm text-gray-600">Closed</span>
                                <span className="text-lg font-semibold text-green-500">{ticketStatusCounts.closed}</span>
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
                                    {tickets.map((ticket) => (
                                        <tr key={ticket.id} className="border-b">
                                            <td className="px-3 py-2 text-sm">{ticket.id}</td>
                                            <td className="px-3 py-2 text-sm">{ticket.customerId}</td>
                                            <td className="px-3 py-2 text-sm">{ticket.username}</td>
                                            <td className="px-3 py-2 text-sm">{ticket.issue}</td>
                                            <td className="px-3 py-2 text-sm">{ticket.status}</td>
                                            <td className="px-3 py-2 text-sm">{ticket.dateIssued}</td>
                                            <td className="px-3 py-2 text-sm">
                                                <button className="py-1 px-3 bg-[var(--hotpink)] text-white rounded-md hover:bg-[var(--roseberry)] transition text-sm cursor-pointer">Resolve</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Customer Support Section - Takes 1 column */}
                    <div className="bg-white p-4 rounded-xl shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Live Chats</h2>
                            <button 
                                onClick={() => navigate('/customer-support')}
                                className="text-[var(--hotpink)] hover:text-[var(--roseberry)] transition-colors cursor-pointer"
                            >
                                View More
                            </button>
                        </div>

                        <div className="overflow-auto">
                            <table className="min-w-full table-auto rounded-lg overflow-hidden border border-gray-300">
                                <thead className="bg-[var(--hotpink)] text-white sticky top-0">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-sm">Username</th>
                                        <th className="px-3 py-2 text-left text-sm">Message</th>
                                        <th className="px-3 py-2 text-left text-sm">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {messages.map(msg => (
                                        <tr key={msg.id} className="border-b">
                                            <td className="px-3 py-2 text-sm">{msg.username}</td>
                                            <td className="px-3 py-2 text-sm">{msg.message}</td>
                                            <td className="px-3 py-2 text-sm">
                                                <button className="py-1 px-3 bg-[var(--hotpink)] text-white rounded-md hover:bg-[var(--roseberry)] transition text-sm cursor-pointer">Reply</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardStaff;