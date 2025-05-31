import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../../components/navbarAdmin';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageUsers = () => {
    const navigate = useNavigate();
    const [sidebarWidth, setSidebarWidth] = useState('20');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [changeType, setChangeType] = useState(''); // 'status' or 'role'
    const [newValue, setNewValue] = useState('');

    // Mock data for users
    const [users, setUsers] = useState([
        {
            id: 'USR-001',
            username: 'johndoe',
            email: 'john@example.com',
            role: 'customer',
            status: 'active',
            dateCreated: '2024-03-15 10:30 AM',
            lastLogin: '2024-03-20 02:15 PM'
        },
        {
            id: 'USR-002',
            username: 'janesmith',
            email: 'jane@example.com',
            role: 'staff',
            status: 'active',
            dateCreated: '2024-03-14 02:15 PM',
            lastLogin: '2024-03-20 09:30 AM'
        },
        {
            id: 'USR-003',
            username: 'mikejohnson',
            email: 'mike@example.com',
            role: 'customer',
            status: 'inactive',
            dateCreated: '2024-03-13 09:00 AM',
            lastLogin: '2024-03-18 11:45 AM'
        }
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

    const handleStatusChange = (user, newStatus) => {
        setSelectedUser(user);
        setChangeType('status');
        setNewValue(newStatus);
        setShowConfirmModal(true);
    };

    const handleRoleChange = (user, newRole) => {
        setSelectedUser(user);
        setChangeType('role');
        setNewValue(newRole);
        setShowConfirmModal(true);
    };

    const handleConfirmChange = () => {
        if (!selectedUser) return;

        // Update the user in the state
        setUsers(prevUsers => 
            prevUsers.map(user => 
                user.id === selectedUser.id 
                    ? { ...user, [changeType]: newValue }
                    : user
            )
        );

        // Show success toast
        toast.success(`User ${changeType} updated successfully`, {
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

        // Close modal and reset state
        setShowConfirmModal(false);
        setSelectedUser(null);
        setChangeType('');
        setNewValue('');
    };

    // Filter users based on search query and status
    const filteredUsers = users.filter(user => {
        const matchesSearch = searchQuery === '' || 
            user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-100 text-purple-800';
            case 'staff':
                return 'bg-blue-100 text-blue-800';
            case 'customer':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="flex">
            <NavbarAdmin />
            <div className={`flex-1 bg-gray-50 p-6 h-screen overflow-auto transition-all duration-300 ${sidebarWidth === '20' ? 'ml-20' : 'ml-64'}`}>
                <ToastContainer />
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-6">Manage Users</h1>

                    {/* Search and Filter Section */}
                    <div className="mb-6 flex gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search by user ID, username, or email..."
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
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full table-fixed rounded-lg overflow-hidden border border-gray-300">
                                <thead className="bg-[var(--hotpink)] text-white sticky top-0">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-sm w-[10%]">User ID</th>
                                        <th className="px-3 py-2 text-left text-sm w-[15%]">Username</th>
                                        <th className="px-3 py-2 text-left text-sm w-[20%]">Email</th>
                                        <th className="px-3 py-2 text-left text-sm w-[10%]">Role</th>
                                        <th className="px-3 py-2 text-left text-sm w-[15%]">Date Created</th>
                                        <th className="px-3 py-2 text-left text-sm w-[15%]">Last Login</th>
                                        <th className="px-3 py-2 text-left text-sm w-[15%]">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="border-b group relative hover:bg-gray-50">
                                            <td className="px-3 py-2 text-sm truncate">{user.id}</td>
                                            <td className="px-3 py-2 text-sm truncate">{user.username}</td>
                                            <td className="px-3 py-2 text-sm truncate">{user.email}</td>
                                            <td className="px-3 py-2 text-sm">
                                                <select
                                                    className={`px-2 py-1 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--hotpink)] ${getRoleColor(user.role)}`}
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user, e.target.value)}
                                                >
                                                    <option value="customer">Customer</option>
                                                    <option value="staff">Staff</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                            <td className="px-3 py-2 text-sm truncate">{user.dateCreated}</td>
                                            <td className="px-3 py-2 text-sm truncate">{user.lastLogin}</td>
                                            <td className="px-3 py-2 text-sm">
                                                <select
                                                    className={`px-2 py-1 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--hotpink)] ${
                                                        user.status === 'active' 
                                                            ? 'bg-green-100 text-green-800 border-green-200' 
                                                            : 'bg-red-100 text-red-800 border-red-200'
                                                    }`}
                                                    value={user.status}
                                                    onChange={(e) => handleStatusChange(user, e.target.value)}
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredUsers.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    No users found matching your search criteria
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Confirmation Modal */}
                {showConfirmModal && selectedUser && (
                    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-[var(--hotpink)]">Confirm Change</h3>
                                <button 
                                    onClick={() => {
                                        setShowConfirmModal(false);
                                        setSelectedUser(null);
                                        setChangeType('');
                                        setNewValue('');
                                    }}
                                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                                >
                                    ✕
                                </button>
                            </div>
                            <p className="mb-6">
                                Are you sure you want to change {selectedUser.username}'s {changeType} to{' '}
                                <span className="font-medium">{newValue}</span>?
                            </p>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => {
                                        setShowConfirmModal(false);
                                        setSelectedUser(null);
                                        setChangeType('');
                                        setNewValue('');
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmChange}
                                    className="px-4 py-2 bg-[var(--hotpink)] text-white rounded hover:bg-[var(--roseberry)] cursor-pointer"
                                >
                                    Confirm Change
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageUsers; 