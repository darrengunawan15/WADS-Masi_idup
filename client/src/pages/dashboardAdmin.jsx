import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { getTickets, reset as resetTickets } from '../redux/slices/ticketSlice';
import { getAllUsers, reset as resetUsers } from '../redux/slices/userSlice';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { tickets, isLoading: isLoadingTickets, isError: isErrorTickets, message: messageTickets } = useSelector(
        (state) => state.ticket
    );
    const { users, isLoading: isLoadingUsers, isError: isErrorUsers, message: messageUsers } = useSelector(
        (state) => state.user
    );
    const { user } = useSelector((state) => state.auth);

    const customers = [
        { id: 101, username: 'John Doe', status: 'Active' },
        { id: 102, username: 'Jane Smith', status: 'Inactive' },
        { id: 103, username: 'Sam Wilson', status: 'Active' },
    ];

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
        }

        if (isErrorTickets) {
            console.log('Ticket Error:', messageTickets);
        }
        if (isErrorUsers) {
            console.log('User Error:', messageUsers);
        }

        if (user && user.role === 'admin') {
            dispatch(getTickets());
            dispatch(getAllUsers());
        }

        return () => {
            dispatch(resetTickets());
            dispatch(resetUsers());
        };
    }, [user, navigate, isErrorTickets, messageTickets, isErrorUsers, messageUsers, dispatch]);

    const totalTickets = tickets.length;
    const unassignedTickets = tickets.filter(ticket => !ticket.assignedTo).length;

    const activeUsers = users.filter(user => user.status === 'active' || user.status === 'Active').length;
    const inactiveUsers = users.filter(user => user.status === 'inactive' || user.status === 'Inactive').length;

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
                                    <th className="px-4 py-2 text-left">Subject</th>
                                    <th className="px-4 py-2 text-left">Customer</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                    <th className="px-4 py-2 text-left">Assigned To</th>
                                    <th className="px-4 py-2 text-left">Category</th>
                                    <th className="px-4 py-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map(ticket => (
                                    <tr key={ticket._id} className="border-b">
                                        <td className="px-4 py-2">
                                            <Link to={`/tickets/${ticket._id}`} className='text-blue-500 hover:underline'>
                                                {ticket._id}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-2">{ticket.subject}</td>
                                        <td className="px-4 py-2">{ticket.customer ? ticket.customer.name : 'N/A'}</td>
                                        <td className="px-4 py-2">{ticket.status}</td>
                                        <td className="px-4 py-2">{ticket.assignedTo ? ticket.assignedTo.name : 'Unassigned'}</td>
                                        <td className="px-4 py-2">{ticket.category ? ticket.category.categoryName : 'N/A'}</td>
                                        <td className="px-4 py-2">
                                            <Link to={`/tickets/${ticket._id}`} className="py-1 px-4 bg-[var(--hotpink)] text-white rounded-md hover:bg-[var(--roseberry)] transition">
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

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
                                    <th className="px-4 py-2 text-left">User ID</th>
                                    <th className="px-4 py-2 text-left">Name</th>
                                    <th className="px-4 py-2 text-left">Email</th>
                                    <th className="px-4 py-2 text-left">Role</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                    <th className="px-4 py-2 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id} className="border-b">
                                        <td className="px-4 py-2">{user._id}</td>
                                        <td className="px-4 py-2">{user.name}</td>
                                        <td className="px-4 py-2">{user.email}</td>
                                        <td className="px-4 py-2">{user.role}</td>
                                        <td className="px-4 py-2">{user.status || 'N/A'}</td>
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