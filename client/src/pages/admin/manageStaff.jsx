import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../../components/navbarAdmin';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import adminService from '../../services/adminService';
import Spinner from '../../components/Spinner';
import { useSelector } from 'react-redux';

const ManageStaff = () => {
    const navigate = useNavigate();
    const [sidebarWidth, setSidebarWidth] = useState('20');
    const [searchQuery, setSearchQuery] = useState('');
    const [staffMembers, setStaffMembers] = useState([]);
    const [tickets, setTickets] = useState([]);
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
                const [staffRes, ticketsRes] = await Promise.all([
                    adminService.getStaff(token),
                    adminService.getAllTickets(token),
                ]);
                setStaffMembers(staffRes);
                setTickets(ticketsRes);
            } catch (err) {
                setError('Failed to load staff data');
                toast.error('Failed to load staff data');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filter staff based on search query
    const filteredStaff = staffMembers.filter(staff => {
        return searchQuery === '' || 
            staff._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (staff.username || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (staff.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Calculate ticket stats for each staff
    const staffWithStats = filteredStaff.map(staff => {
        const assigned = tickets.filter(ticket => ticket.assignedTo && ticket.assignedTo._id === staff._id).length;
        const resolved = tickets.filter(ticket => ticket.assignedTo && ticket.assignedTo._id === staff._id && ticket.status === 'resolved').length;
        let performance = 'N/A';
        if (assigned > 0) {
            performance = `${resolved}/${assigned} (${((resolved / assigned) * 100).toFixed(1)}%)`;
        } else {
            performance = '0/0 (N/A)';
        }
        return {
            ...staff,
            ticketsAssigned: assigned,
            ticketsResolved: resolved,
            performance,
        };
    });

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
                    <h1 className="text-2xl font-semibold text-gray-800 mb-6">Manage Staff</h1>

                    {/* Search Section */}
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Search by staff ID, name, username, or email..."
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--hotpink)]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Staff Table */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full table-fixed rounded-lg overflow-hidden border border-gray-300">
                                <thead className="bg-[var(--hotpink)] text-white sticky top-0">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-sm w-[10%]">Staff ID</th>
                                        <th className="px-3 py-2 text-left text-sm w-[20%]">Full Name</th>
                                        <th className="px-3 py-2 text-left text-sm w-[20%]">Username</th>
                                        <th className="px-3 py-2 text-left text-sm w-[25%]">Email</th>
                                        <th className="px-3 py-2 text-left text-sm w-[15%]">Performance</th>
                                        <th className="px-3 py-2 text-left text-sm w-[15%]">Tickets</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {staffWithStats.map((staff) => (
                                        <tr key={staff._id} className="border-b group relative hover:bg-gray-50">
                                            <td className="px-3 py-2 text-sm truncate">{staff._id}</td>
                                            <td className="px-3 py-2 text-sm truncate">{staff.name}</td>
                                            <td className="px-3 py-2 text-sm truncate">{staff.username || staff.name}</td>
                                            <td className="px-3 py-2 text-sm truncate">{staff.email}</td>
                                            <td className="px-3 py-2 text-sm">
                                                {staff.performance}
                                            </td>
                                            <td className="px-3 py-2 text-sm">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-500">Assigned: {staff.ticketsAssigned}</span>
                                                    <span className="text-xs text-gray-500">Resolved: {staff.ticketsResolved}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {staffWithStats.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    No staff members found matching your search criteria
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageStaff; 