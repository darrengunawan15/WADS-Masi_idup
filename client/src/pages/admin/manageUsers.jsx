import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../../components/navbarAdmin';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import adminService from '../../services/adminService';
import Spinner from '../../components/Spinner';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import Select from 'react-select';

const ManageUsers = () => {
    const navigate = useNavigate();
    const [sidebarWidth, setSidebarWidth] = useState('20');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [changeType, setChangeType] = useState(''); // 'status' or 'role'
    const [newValue, setNewValue] = useState('');
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user: adminUser } = useSelector((state) => state.auth);
    const [pendingRoleChanges, setPendingRoleChanges] = useState({});
    const [pendingStatusChanges, setPendingStatusChanges] = useState({});
    const DROPDOWN_MIN_WIDTH = '120px'; // consistent width for both dropdowns

    const roleOptions = [
        { value: 'customer', label: 'Customer' },
        { value: 'staff', label: 'Staff' },
        { value: 'admin', label: 'Admin' },
    ];

    const statusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
    ];

    const getRoleStyles = (role) => {
        let bg = '', color = '';
        switch (role) {
            case 'admin':
                bg = '#ede9fe'; color = '#6d28d9'; break; // purple
            case 'staff':
                bg = '#dbeafe'; color = '#1e40af'; break; // blue
            case 'customer':
                bg = '#f3f4f6'; color = '#374151'; break; // gray
            default:
                bg = '#f3f4f6'; color = '#374151'; break;
        }
        return {
            control: (provided, state) => ({
                ...provided,
                backgroundColor: bg,
                color: color,
                borderColor: state.isFocused ? 'var(--hotpink)' : '#d1d5db',
                boxShadow: state.isFocused ? '0 0 0 2px var(--hotpink)' : undefined,
                minWidth: DROPDOWN_MIN_WIDTH,
                minHeight: '32px',
            }),
            singleValue: (provided) => ({
                ...provided,
                color: color,
            }),
            option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isSelected ? bg : state.isFocused ? '#f9fafb' : undefined,
                color: color,
            }),
        };
    };

    const getStatusStyles = (status) => {
        let bg = '', color = '';
        switch (status) {
            case 'active':
                bg = '#d1fae5'; color = '#065f46'; break; // green
            case 'inactive':
                bg = '#fee2e2'; color = '#991b1b'; break; // red
            default:
                bg = '#f3f4f6'; color = '#374151'; break; // gray
        }
        return {
            control: (provided, state) => ({
                ...provided,
                backgroundColor: bg,
                color: color,
                borderColor: state.isFocused ? 'var(--hotpink)' : '#d1d5db',
                boxShadow: state.isFocused ? '0 0 0 2px var(--hotpink)' : undefined,
                minWidth: DROPDOWN_MIN_WIDTH,
                minHeight: '32px',
            }),
            singleValue: (provided) => ({
                ...provided,
                color: color,
            }),
            option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isSelected ? bg : state.isFocused ? '#f9fafb' : undefined,
                color: color,
            }),
        };
    };

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
        const fetchUsers = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('accessToken');
                const usersRes = await adminService.getAllUsers(token);
                setUsers(usersRes);
            } catch (err) {
                setError('Failed to load users');
                toast.error('Failed to load users');
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleStatusChange = (user, newStatus) => {
        setPendingStatusChanges(prev => ({ ...prev, [user._id]: newStatus }));
    };

    const handleRoleChange = (user, newRole) => {
        setPendingRoleChanges(prev => ({ ...prev, [user._id]: newRole }));
    };

    const handleRoleConfirm = async (user) => {
        const newRole = pendingRoleChanges[user._id];
        if (!newRole || newRole === user.role) return;
        setIsLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            console.log('Token being used (role):', token);
            await adminService.updateUser(user._id, { role: newRole }, token);
            const usersRes = await adminService.getAllUsers(token);
            setUsers(usersRes);
            setPendingRoleChanges(prev => {
                const updated = { ...prev };
                delete updated[user._id];
                return updated;
            });
            toast.success('User role updated successfully', {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
                style: { width: '400px', fontSize: '16px' }
            });
        } catch (err) {
            toast.error('Failed to update user role');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusConfirm = async (user) => {
        const newStatus = pendingStatusChanges[user._id];
        if (!newStatus || newStatus === user.status) return;
        setIsLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            console.log('Token being used (status):', token);
            await adminService.updateUser(user._id, { status: newStatus }, token);
            const usersRes = await adminService.getAllUsers(token);
            setUsers(usersRes);
            setPendingStatusChanges(prev => {
                const updated = { ...prev };
                delete updated[user._id];
                return updated;
            });
            toast.success('User status updated successfully', {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
                style: { width: '400px', fontSize: '16px' }
            });
        } catch (err) {
            toast.error('Failed to update user status');
        } finally {
            setIsLoading(false);
        }
    };

    // Filter users based on search query and status
    const filteredUsers = users.filter(user => {
        const matchesSearch = searchQuery === '' || 
            user._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.username || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
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

    if (isLoading) {
        return <Spinner />;
    }
    if (error) {
        return <div className="p-6 text-red-500">{error}</div>;
    }

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

                    {/* Users Table (Flexbox version) */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <div className="w-full">
                                <div className="flex bg-[var(--hotpink)] text-white font-semibold text-sm sticky top-0">
                                    <div className="flex-[1.5] px-3 py-2">User ID</div>
                                    <div className="flex-[1.5] px-3 py-2">Username</div>
                                    <div className="flex-[2] px-3 py-2">Email</div>
                                    <div className="flex-[1.2] px-1 py-2">Role</div>
                                    <div className="flex-[1.5] px-3 py-2">Date Created</div>
                                    <div className="flex-[1.5] px-3 py-2">Last Login</div>
                                    <div className="flex-[1.5] px-3 py-2">Status</div>
                                </div>
                                {filteredUsers.map((user) => (
                                    <div key={user._id} className="flex border-b group relative hover:bg-gray-50 items-center text-sm">
                                        <div className="flex-[1.5] px-3 py-2 truncate">{user._id}</div>
                                        <div className="flex-[1.5] px-3 py-2 truncate">{user.username || user.name}</div>
                                        <div className="flex-[2] px-3 py-2 truncate">{user.email}</div>
                                        <div className="flex-[1.2] px-0 py-2 whitespace-nowrap w-0">
                                            <div className="relative w-full flex items-center justify-start">
                                                <Select
                                                    classNamePrefix="role-select"
                                                    value={roleOptions.find(opt => opt.value === (pendingRoleChanges[user._id] || user.role))}
                                                    onChange={opt => handleRoleChange(user, opt.value)}
                                                    options={roleOptions}
                                                    styles={getRoleStyles(pendingRoleChanges[user._id] || user.role)}
                                                    isSearchable={false}
                                                    menuPlacement="auto"
                                                />
                                                {(pendingRoleChanges[user._id] && pendingRoleChanges[user._id] !== user.role) && (
                                                    <button
                                                        type="button"
                                                        className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-[var(--hotpink)] text-white rounded hover:bg-[var(--roseberry)] text-xs whitespace-nowrap z-10 shadow-lg"
                                                        onClick={() => handleRoleConfirm(user)}
                                                    >
                                                        Confirm
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex-[1.5] px-3 py-2 truncate">{user.createdAt ? format(new Date(user.createdAt), 'yyyy-MM-dd') : ''}</div>
                                        <div className="flex-[1.5] px-3 py-2 truncate">{user.updatedAt ? format(new Date(user.updatedAt), 'yyyy-MM-dd') : ''}</div>
                                        <div className="flex-[1.5] px-3 py-2">
                                            <div className="relative w-full flex items-center justify-start">
                                                <div className="w-full" style={{ minWidth: DROPDOWN_MIN_WIDTH, maxWidth: DROPDOWN_MIN_WIDTH }}>
                                                    <Select
                                                        classNamePrefix="status-select"
                                                        value={statusOptions.find(opt => opt.value === (pendingStatusChanges[user._id] || user.status))}
                                                        onChange={opt => handleStatusChange(user, opt.value)}
                                                        options={statusOptions}
                                                        styles={getStatusStyles(pendingStatusChanges[user._id] || user.status)}
                                                        isSearchable={false}
                                                        menuPlacement="auto"
                                                    />
                                                </div>
                                                {(pendingStatusChanges[user._id] && pendingStatusChanges[user._id] !== user.status) && (
                                                    <button
                                                        type="button"
                                                        className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-[var(--hotpink)] text-white rounded hover:bg-[var(--roseberry)] text-xs whitespace-nowrap z-10 shadow-lg"
                                                        onClick={() => handleStatusConfirm(user)}
                                                    >
                                                        Confirm
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;