import React from 'react';

const AdminDashboard = () => {
    const tickets = [
        { id: 1, customerId: 101, username: 'John Doe', issue: 'Login Issue', status: 'Unassigned', dateIssued: '2025-04-25' },
        { id: 2, customerId: 102, username: 'Jane Smith', issue: 'Payment Problem', status: 'Assigned', dateIssued: '2025-04-24' },
        { id: 3, customerId: 103, username: 'Sam Wilson', issue: 'Account Locked', status: 'Unassigned', dateIssued: '2025-04-23' },
    ];

    const customers = [
        { id: 101, username: 'John Doe', status: 'Active' },
        { id: 102, username: 'Jane Smith', status: 'Inactive' },
        { id: 103, username: 'Sam Wilson', status: 'Active' },
    ];

    const totalTickets = tickets.length;
    const unassignedTickets = tickets.filter(ticket => ticket.status === 'Unassigned').length;

    const activeUsers = customers.filter(user => user.status === 'Active').length;
    const inactiveUsers = customers.filter(user => user.status === 'Inactive').length;

    return (
        <main className="flex-grow bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-12 space-y-20">
                <section className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-semibold text-black px-16">Assign Tickets to Staff</h2>
                        <div className="flex space-x-4 w-1/2 pr-16">
                            <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-xl w-full">
                                <h3 className="text-lg font-semibold text-gray-700">Total Tickets</h3>
                                <span className="text-2xl font-bold text-[var(--hotpink)]">{totalTickets}</span>
                            </div>
                            <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-xl w-full">
                                <h3 className="text-lg font-semibold text-gray-700">Unassigned Tickets</h3>
                                <span className="text-2xl font-bold text-red-500">{unassignedTickets}</span>
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
                                {tickets
                                    .filter(ticket => ticket.status === 'Unassigned')
                                    .map(ticket => (
                                        <tr key={ticket.id} className="border-b">
                                            <td className="px-4 py-2">{ticket.id}</td>
                                            <td className="px-4 py-2">{ticket.customerId}</td>
                                            <td className="px-4 py-2">{ticket.username}</td>
                                            <td className="px-4 py-2">{ticket.issue}</td>
                                            <td className="px-4 py-2">{ticket.status}</td>
                                            <td className="px-4 py-2">{ticket.dateIssued}</td>
                                            <td className="px-4 py-2">
                                                <button className="py-1 px-4 bg-[var(--hotpink)] text-white rounded-md hover:bg-[var(--roseberry)] transition">
                                                    Assign
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* === Manage Customer Stats Section === */}
                <section className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-semibold text-black px-16">Manage Customer Status</h2>
                        <div className="flex space-x-4 w-1/2 pr-16">
                            <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-xl w-full">
                                <h3 className="text-lg font-semibold text-gray-700">Active Users</h3>
                                <span className="text-2xl font-bold text-green-600">{activeUsers}</span>
                            </div>
                            <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-xl w-full">
                                <h3 className="text-lg font-semibold text-gray-700">Inactive Users</h3>
                                <span className="text-2xl font-bold text-red-500">{inactiveUsers}</span>
                            </div>
                        </div>
                    </div>

                    <div className="px-6">
                        <table className="bg-white min-w-full table-auto rounded-lg overflow-hidden border border-gray-300 shadow-xl">
                            <thead className="bg-[var(--hotpink)] text-white">
                                <tr>
                                    <th className="px-4 py-2 text-left">Customer ID</th>
                                    <th className="px-4 py-2 text-left">Username</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                    <th className="px-4 py-2 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map(user => (
                                    <tr key={user.id} className="border-b">
                                        <td className="px-4 py-2">{user.id}</td>
                                        <td className="px-4 py-2">{user.username}</td>
                                        <td className="px-4 py-2">{user.status}</td>
                                        <td className="px-4 py-2">
                                            <button className="py-1 px-4 bg-[var(--hotpink)] text-white rounded-md hover:bg-[var(--roseberry)] transition">
                                                {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default AdminDashboard;