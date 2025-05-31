import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../../components/navbarAdmin';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageStaff = () => {
    const navigate = useNavigate();
    const [sidebarWidth, setSidebarWidth] = useState('20');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock data for staff members
    const [staffMembers, setStaffMembers] = useState([
        {
            id: 'STAFF-001',
            username: 'johnsmith',
            email: 'john.smith@kitchenserve.com',
            fullName: 'John Smith',
            dateJoined: '2024-01-15 09:00 AM',
            lastLogin: '2024-03-20 02:15 PM',
            ticketsAssigned: 5,
            ticketsResolved: 45,
            performance: 'Excellent'
        },
        {
            id: 'STAFF-002',
            username: 'sarahjones',
            email: 'sarah.jones@kitchenserve.com',
            fullName: 'Sarah Jones',
            dateJoined: '2024-02-01 10:30 AM',
            lastLogin: '2024-03-20 09:30 AM',
            ticketsAssigned: 3,
            ticketsResolved: 28,
            performance: 'Good'
        },
        {
            id: 'STAFF-003',
            username: 'mikebrown',
            email: 'mike.brown@kitchenserve.com',
            fullName: 'Mike Brown',
            dateJoined: '2024-01-20 11:45 AM',
            lastLogin: '2024-03-18 11:45 AM',
            ticketsAssigned: 0,
            ticketsResolved: 15,
            performance: 'Average'
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

    // Filter staff based on search query
    const filteredStaff = staffMembers.filter(staff => {
        return searchQuery === '' || 
            staff.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            staff.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            staff.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const getPerformanceColor = (performance) => {
        switch (performance.toLowerCase()) {
            case 'excellent':
                return 'bg-green-100 text-green-800';
            case 'good':
                return 'bg-blue-100 text-blue-800';
            case 'average':
                return 'bg-yellow-100 text-yellow-800';
            case 'poor':
                return 'bg-red-100 text-red-800';
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
                                    {filteredStaff.map((staff) => (
                                        <tr key={staff.id} className="border-b group relative hover:bg-gray-50">
                                            <td className="px-3 py-2 text-sm truncate">{staff.id}</td>
                                            <td className="px-3 py-2 text-sm truncate">{staff.fullName}</td>
                                            <td className="px-3 py-2 text-sm truncate">{staff.username}</td>
                                            <td className="px-3 py-2 text-sm truncate">{staff.email}</td>
                                            <td className="px-3 py-2 text-sm">
                                                <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${getPerformanceColor(staff.performance)}`}>
                                                    {staff.performance}
                                                </span>
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
                            {filteredStaff.length === 0 && (
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