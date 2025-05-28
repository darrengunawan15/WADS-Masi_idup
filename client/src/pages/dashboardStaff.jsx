import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardStaff = () => {
    const navigate = useNavigate();
    const [sidebarWidth, setSidebarWidth] = useState('20');

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

    const tickets = [
        { id: 1, customerId: 101, username: 'John Doe', issue: 'Login Issue', status: 'Unsolved', dateIssued: '2025-04-25' },
        { id: 2, customerId: 102, username: 'Jane Smith', issue: 'Payment Problem', status: 'Resolved', dateIssued: '2025-04-24' },
        { id: 3, customerId: 103, username: 'Sam Wilson', issue: 'Account Locked', status: 'Unsolved', dateIssued: '2025-04-23' },
    ];

    const messages = [
        { id: 1, username: 'John Doe', message: 'Need help with my order', isNew: true },
        { id: 2, username: 'Jane Smith', message: 'Received wrong item', isNew: false },
        { id: 3, username: 'Sam Wilson', message: "Can't log into my account", isNew: true },
    ];

    const totalTickets = tickets.length;
    const unsolvedTickets = tickets.filter(ticket => ticket.status === 'Unsolved').length;

    const totalMessages = messages.length;
    const newMessages = messages.filter(msg => msg.isNew).length;

    const handleViewTickets = () => navigate('/manage-tickets');
    const handleViewMessages = () => navigate('/support-messages');

    return (
        <div className={`flex-1 bg-gray-50 p-6 h-screen overflow-hidden transition-all duration-300 ${sidebarWidth === '20' ? 'ml-20' : 'ml-64'}`}>
            <div className="h-full flex flex-col space-y-6">
                {/* === Manage Tickets Section === */}
                <section className="flex-1 flex flex-col">
                    <div className="max-w-4xl mx-auto w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-black">Manage Tickets</h2>
                            <div className="flex space-x-4">
                                <div className="flex flex-col items-center bg-white p-4 rounded-xl shadow-lg w-40">
                                    <h3 className="text-sm font-semibold text-gray-700">Total Tickets</h3>
                                    <span className="text-xl font-bold text-[var(--hotpink)]">{totalTickets}</span>
                                </div>
                                <div className="flex flex-col items-center bg-white p-4 rounded-xl shadow-lg w-40">
                                    <h3 className="text-sm font-semibold text-gray-700">Unsolved Tickets</h3>
                                    <span className="text-xl font-bold text-red-500">{unsolvedTickets}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-hidden">
                            <div className="h-full overflow-auto">
                                <table className="bg-white min-w-full table-auto rounded-lg overflow-hidden border border-gray-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]">
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
                                                    <button className="py-1 px-3 bg-[var(--hotpink)] text-white rounded-md hover:bg-[var(--roseberry)] transition text-sm">Resolve</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>

                {/* === Customer Support Section === */}
                <section className="flex-1 flex flex-col">
                    <div className="max-w-4xl mx-auto w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-black">Customer Support</h2>
                            <div className="flex space-x-4">
                                <div className="flex flex-col items-center bg-white p-4 rounded-xl shadow-lg w-40">
                                    <h3 className="text-sm font-semibold text-gray-700">Total Messages</h3>
                                    <span className="text-xl font-bold text-[var(--hotpink)]">{totalMessages}</span>
                                </div>
                                <div className="flex flex-col items-center bg-white p-4 rounded-xl shadow-lg w-40">
                                    <h3 className="text-sm font-semibold text-gray-700">New Messages</h3>
                                    <span className="text-xl font-bold text-red-500">{newMessages}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-hidden">
                            <div className="h-full overflow-auto">
                                <table className="bg-white min-w-full table-auto rounded-lg overflow-hidden border border-gray-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]">
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
                                                    <button className="py-1 px-3 bg-[var(--hotpink)] text-white rounded-md hover:bg-[var(--roseberry)] transition text-sm">Reply</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DashboardStaff;