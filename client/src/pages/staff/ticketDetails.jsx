import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTicket, addComment, updateTicket, assignTicket, uploadFile, reset } from '../../redux/slices/ticketSlice';
import Spinner from '../../components/Spinner';

const TicketDetails = () => {
    const { ticketId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { ticket, isLoading, isError, message } = useSelector((state) => state.tickets);
    const { user } = useSelector((state) => state.auth);

    const [newCommentContent, setNewCommentContent] = useState('');
    const [ticketStatusLocal, setTicketStatusLocal] = useState('');
    const [assignedToUserLocal, setAssignedToUserLocal] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        if (ticketId) {
            dispatch(getTicket(ticketId));
        }
        return () => {
            dispatch(reset());
        };
    }, [ticketId, dispatch]);

    useEffect(() => {
        if (ticket && ticket._id) {
            setTicketStatusLocal(ticket.status || '');
            setAssignedToUserLocal(ticket.assignedTo ? ticket.assignedTo._id : '');
        }
    }, [ticket]);

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        setTicketStatusLocal(newStatus);
        dispatch(updateTicket({ ticketId, updateData: { status: newStatus } }));
    };

    const handleAssignedToChange = (e) => {
        const newAssignedTo = e.target.value;
        setAssignedToUserLocal(newAssignedTo);
        if (newAssignedTo) {
            dispatch(assignTicket({ ticketId, assignedToUserId: newAssignedTo }));
        } else {
            dispatch(assignTicket({ ticketId, assignedToUserId: null }));
        }
    };

    const handleCommentChange = (e) => {
        setNewCommentContent(e.target.value);
    };

    const handleAddComment = (e) => {
        e.preventDefault();
        if (!newCommentContent.trim()) return;

        dispatch(addComment({ ticketId: ticketId, content: newCommentContent }));

        setNewCommentContent('');
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUploadFile = (e) => {
        e.preventDefault();
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);

        dispatch(uploadFile({ ticketId, fileData: formData }));

        setSelectedFile(null);
    };

    if (isLoading) {
        return <Spinner />;
    }

    if (isError) {
        return <div className='p-6 text-red-500'>Error loading ticket: {message}</div>;
    }

    if (!ticket || !ticket._id) {
        return <div className="p-6">Ticket not found or loading...</div>;
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'open':
                return 'bg-red-100 text-red-800';
            case 'in progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'closed':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const isStaffOrAdmin = user && (user.role === 'staff' || user.role === 'admin');
    const isCustomerOwner = user && ticket.customer && ticket.customer._id === user._id;

    const canInteract = isStaffOrAdmin || isCustomerOwner;

    return (
        <div className={`flex-1 bg-gray-50 p-6 h-screen overflow-y-auto transition-all duration-300 ml-20`}>
            <div className="mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Ticket Details</h1>
                        <p className="text-gray-600">Ticket ID: {ticket._id}</p>
                    </div>
                    <button
                        onClick={() => {
                            if (user?.role === 'admin') {
                                navigate('/dashboard-admin');
                            } else if (user?.role === 'staff') {
                                navigate('/dashboard-staff');
                            } else {
                                navigate('/dashboard-customer');
                            }
                        }}
                        className="px-4 py-2 text-[var(--hotpink)] hover:text-[var(--roseberry)] transition-colors"
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4">Ticket Information</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Customer</p>
                                <p className="font-medium">{ticket.customer ? ticket.customer.name : 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Subject</p>
                                <p className="font-medium">{ticket.subject}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Category</p>
                                <p className="font-medium">{ticket.category ? ticket.category.categoryName : 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Assigned To</p>
                                <p className="font-medium">{ticket.assignedTo ? ticket.assignedTo.name : 'Unassigned'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Created At</p>
                                <p className="font-medium">{ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Last Updated</p>
                                <p className="font-medium">{ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleString() : 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Status</p>
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                    {ticket.status ? ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1) : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4">Issue Description</h2>
                        <p className="text-gray-700">{ticket.description}</p>
                        
                        {ticket.fileAttachments && ticket.fileAttachments.length > 0 && (
                            <div className="mt-4">
                                <h3 className="text-sm font-medium text-gray-600 mb-2">Attachments</h3>
                                <div className="flex flex-wrap gap-2">
                                    {ticket.fileAttachments.map((file) => (
                                        <a
                                            key={file._id}
                                            href={file.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 py-1 bg-gray-100 rounded-md text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                                        >
                                            {file.fileName}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                        <h2 className="text-lg font-semibold mb-4">Comments</h2>
                        {ticket.comments && ticket.comments.length > 0 ? (
                            <div className='space-y-4'>
                                {[...ticket.comments].map(comment => (
                                    <div key={comment._id} className='border-b pb-4'>
                                        <p className='text-gray-800'>{comment.content}</p>
                                        <p className='text-sm text-gray-600'>
                                            By: {comment.author ? `${comment.author.name} (${comment.author.role})` : 'N/A'} at {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : 'N/A'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No comments yet.</p>
                        )}

                        {canInteract && (
                            <div className='mt-4'>
                                <h4 className='text-md font-bold mb-2'>Add a Comment</h4>
                                <form onSubmit={handleAddComment}>
                                    <textarea
                                        value={newCommentContent}
                                        onChange={handleCommentChange}
                                        placeholder='Type your comment here...'
                                        rows='4'
                                        className='form-textarea mt-1 block w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-[var(--hotpink)] focus:border-transparent'
                                        required
                                    ></textarea>
                                    <button type='submit' className='bg-[var(--hotpink)] text-white px-4 py-2 rounded mt-2 hover:bg-[var(--roseberry)] transition-colors'>
                                        Post Comment
                                    </button>
                                </form>
                            </div>
                        )}

                        {canInteract && (
                            <div className='mt-4'>
                                <h4 className='text-md font-bold mb-2'>Upload File</h4>
                                <form onSubmit={handleUploadFile}>
                                    <input
                                        type='file'
                                        onChange={handleFileChange}
                                        className='form-input mt-1 block w-full'
                                    />
                                    <button type='submit' className='bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-600 transition-colors' disabled={!selectedFile}>
                                        Upload
                                    </button>
                                </form>
                            </div>
                        )}

                    </div>

                </div>

                <div className="space-y-6">
                    {isStaffOrAdmin && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4">Staff/Admin Actions</h2>
                            <div className="space-y-4">
                                <div className='mb-4'>
                                    <label className='block text-gray-700 mb-1'>Update Status</label>
                                    <select
                                        name='status'
                                        value={ticketStatusLocal}
                                        onChange={handleStatusChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--hotpink)] focus:border-transparent appearance-none pr-8 bg-no-repeat bg-[length:12px] bg-[right_12px_center] cursor-pointer"
                                        style={{
                                            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")"
                                        }}
                                    >
                                        <option value='open'>Open</option>
                                        <option value='in progress'>In Progress</option>
                                        <option value='closed'>Closed</option>
                                    </select>
                                </div>

                                <div className='mb-4'>
                                    <label className='block text-gray-700 mb-1'>Assign To (User ID)</label>
                                    <input
                                        type='text'
                                        name='assignedTo'
                                        value={assignedToUserLocal}
                                        onChange={handleAssignedToChange}
                                        placeholder='Enter Staff/Admin User ID'
                                        className='form-input block w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-[var(--hotpink)] focus:border-transparent'
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4">Ticket History</h2>
                        <div className="space-y-4">
                            {ticket.comments.map((comment, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-[var(--hotpink)]"></div>
                                    <div>
                                        <p className="text-sm font-medium">{comment.content}</p>
                                        <p className="text-xs text-gray-500">
                                            {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketDetails; 