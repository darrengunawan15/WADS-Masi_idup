import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardStaff = () => {
    const navigate = useNavigate();

    const tickets = [
        { id: 1, customerId: 101, username: 'John Doe', issue: 'Login Issue', status: 'Unsolved', dateIssued: '2025-04-25' },
        { id: 2, customerId: 102, username: 'Jane Smith', issue: 'Payment Problem', status: 'Resolved', dateIssued: '2025-04-24' },
        { id: 3, customerId: 103, username: 'Sam Wilson', issue: 'Account Locked', status: 'Unsolved', dateIssued: '2025-04-23' },
    ];

    const messages = [
        { id: 1, username: 'John Doe', message: 'Need help with my order', isNew: true },
        { id: 2, username: 'Jane Smith', message: 'Received wrong item', isNew: false },
        { id: 3, username: 'Sam Wilson', message: 'Can’t log into my account', isNew: true },
    ];

    const totalTickets = tickets.length;
    const unsolvedTickets = tickets.filter(ticket => ticket.status === 'Unsolved').length;

    const totalMessages = messages.length;
    const newMessages = messages.filter(msg => msg.isNew).length;

    const handleViewTickets = () => navigate('/manage-tickets');
    const handleViewMessages = () => navigate('/support-messages'); // Example route

    return (
        <main className="flex-grow bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-12 space-y-20">
                {/* === Manage Tickets Section === */}
                <section className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-semibold text-black px-16">Manage Tickets</h2>
                        <div className="flex space-x-4 w-1/2 pr-16">
                            <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-xl w-full">
                                <h3 className="text-lg font-semibold text-gray-700">Total Tickets</h3>
                                <span className="text-2xl font-bold text-[var(--hotpink)]">{totalTickets}</span>
                            </div>
                            <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-xl w-full">
                                <h3 className="text-lg font-semibold text-gray-700">Unsolved Tickets</h3>
                                <span className="text-2xl font-bold text-red-500">{unsolvedTickets}</span>
                            </div>
                        </div>
                    </div>

                    <div className="px-6">
                        <table className="bg-white min-w-full table-auto rounded-lg overflow-hidden border border-gray-300 shadow-xl">
                            <thead className="bg-[var(--hotpink)] text-white">
                                <tr>
                                    <th className="px-4 py-2 text-left">Ticket #</th>
                                    <th className="px-4 py-2 text-left">Customer ID</th>
                                    <th className="px-4 py-2 text-left">Username</th>
                                    <th className="px-4 py-2 text-left">Issue</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                    <th className="px-4 py-2 text-left">Date Issued</th>
                                    <th className="px-4 py-2 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map((ticket) => (
                                    <tr key={ticket.id} className="border-b">
                                        <td className="px-4 py-2">{ticket.id}</td>
                                        <td className="px-4 py-2">{ticket.customerId}</td>
                                        <td className="px-4 py-2">{ticket.username}</td>
                                        <td className="px-4 py-2">{ticket.issue}</td>
                                        <td className="px-4 py-2">{ticket.status}</td>
                                        <td className="px-4 py-2">{ticket.dateIssued}</td>
                                        <td className="px-4 py-2">
                                            <button className="py-1 px-4 bg-[var(--hotpink)] text-white rounded-md">Resolve</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="mt-4 text-center">
                            <button
                                onClick={handleViewTickets}
                                className="py-2 px-6 bg-[var(--blush)] text-white rounded-md text-lg font-semibold hover:bg-[var(--roseberry)] transition-colors"
                            >
                                View More
                            </button>
                        </div>
                    </div>
                </section>

                {/* === Customer Support Section === */}
                <section className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-semibold text-black px-16">Customer Support</h2>
                        <div className="flex space-x-4 w-1/2 pr-16">
                            <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-xl w-full">
                                <h3 className="text-lg font-semibold text-gray-700">Total Messages</h3>
                                <span className="text-2xl font-bold text-[var(--hotpink)]">{totalMessages}</span>
                            </div>
                            <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-xl w-full">
                                <h3 className="text-lg font-semibold text-gray-700">New Messages</h3>
                                <span className="text-2xl font-bold text-red-500">{newMessages}</span>
                            </div>
                        </div>
                    </div>

                    <div className="px-6">
                        <table className="bg-white min-w-full table-auto rounded-lg overflow-hidden border border-gray-300 shadow-xl">
                            <thead className="bg-[var(--hotpink)] text-white">
                                <tr>
                                    <th className="px-4 py-2 text-left">Username</th>
                                    <th className="px-4 py-2 text-left">Message</th>
                                    <th className="px-4 py-2 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {messages.map(msg => (
                                    <tr key={msg.id} className="border-b">
                                        <td className="px-4 py-2">{msg.username}</td>
                                        <td className="px-4 py-2">{msg.message}</td>
                                        <td className="px-4 py-2">
                                            <button className="py-1 px-4 bg-[var(--hotpink)] text-white rounded-md">Reply</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="mt-4 text-center">
                            <button
                                onClick={handleViewMessages}
                                className="py-2 px-6 bg-[var(--blush)] text-white rounded-md text-lg font-semibold hover:bg-[var(--roseberry)] transition-colors"
                            >
                                View More
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default DashboardStaff;