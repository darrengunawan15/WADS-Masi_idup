import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getTicket, addComment, updateTicket, assignTicket, uploadFile, reset } from '../redux/slices/ticketSlice'; // Import uploadFile
import { logout } from '../redux/slices/authSlice'; // Import logout action
// Assuming you have a Spinner component
import Spinner from '../components/Spinner'; // Uncommented Spinner import

function TicketDetails() {
  const { ticketId } = useParams(); // Get ticket ID from URL
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { ticket, isLoading, isError, message } = useSelector(
    (state) => {
      console.log('Redux state in TicketDetails useSelector:', state); // Log the entire state
      return state.tickets;
    }
  );
  const { user } = useSelector((state) => state.auth); // Get user from auth state

  const [newCommentContent, setNewCommentContent] = useState(''); // State for new comment input
  const [ticketStatus, setTicketStatus] = useState(''); // State for ticket status update
  const [assignedToUser, setAssignedToUser] = useState(''); // State for assigned user update
  const [selectedFile, setSelectedFile] = useState(null); // State for file upload

  useEffect(() => {
    // Redirect and logout if not logged in
    if (!user) {
      dispatch(logout()); // Dispatch logout action
      navigate('/'); // Redirect to home page
    }

    if (isError) {
      console.log(message); // You might want to display this in the UI
    }

    // Fetch the specific ticket when component mounts and user is available
    if (user && ticketId) {
        dispatch(getTicket(ticketId));
    }

    // Clean up on unmount or when dependencies change
    return () => {
      dispatch(reset());
    };

  }, [user, ticketId, navigate, isError, message, dispatch]); // Add user, ticketId to dependencies

   // Update local state when ticket data is fetched or changes
   useEffect(() => {
       if (ticket && ticket._id) {
           setTicketStatus(ticket.status);
           setAssignedToUser(ticket.assignedTo ? ticket.assignedTo._id : '');
       }
   }, [ticket]);

   const handleCommentChange = (e) => {
    setNewCommentContent(e.target.value);
  };

  const handleAddComment = (e) => {
    e.preventDefault();

    if (!newCommentContent.trim()) {
        console.log('Comment content cannot be empty');
        return;
    }

    // Dispatch addComment thunk
    dispatch(addComment({ ticketId, commentData: { content: newCommentContent } }));

    // Clear comment input after submission
    setNewCommentContent('');
  };

  const handleStatusChange = (e) => {
      setTicketStatus(e.target.value);
      // Optionally dispatch updateTicket immediately or with a save button
       dispatch(updateTicket(ticketId, { status: e.target.value }));
  };

   const handleAssignedToChange = (e) => {
       setAssignedToUser(e.target.value);
       // Optionally dispatch assignTicket immediately or with a save button
       // Note: You'll likely want a way to select/search for staff/admin users instead of a raw input
       if (e.target.value) { // Only dispatch if a user is selected/entered
         dispatch(assignTicket({ ticketId, assignedToUserId: e.target.value }));
       } else {
           // Handle unassigning if necessary
            dispatch(assignTicket({ ticketId, assignedToUserId: null })); // Assuming backend handles null for unassigning
       }
   };

   const handleFileChange = (e) => {
       setSelectedFile(e.target.files[0]); // Select the first file
   };

   const handleUploadFile = (e) => {
       e.preventDefault();

       if (!selectedFile) {
           console.log('No file selected');
           return;
       }

       const formData = new FormData();
       formData.append('file', selectedFile);

       // Dispatch uploadFile thunk
       dispatch(uploadFile({ ticketId, fileData: formData }));

       // Clear selected file after submission
       setSelectedFile(null);
   };


  // if (isLoading) {
  //   return <Spinner />;
  // }

  // Ensure ticket data is loaded before rendering details
  if (isLoading || !ticket || !ticket._id) {
      // Use Spinner component
      return <Spinner />;
  }

   // Check if there was an error and display it
   if (isError) {
       return <p className='text-red-500'>Error loading ticket: {message}</p>;
   }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Ticket Details (ID: {ticket._id})</h1>

      <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
        <h2 className='text-xl font-semibold mb-2'>Subject: {ticket.subject}</h2>
        <p className='text-gray-700 mb-4'>Description: {ticket.description}</p>
        <p>Status: {ticket.status}</p>
        <p>Created By: {ticket.customer ? ticket.customer.name : 'N/A'}</p>
        <p>Assigned To: {ticket.assignedTo ? ticket.assignedTo.name : 'Unassigned'}</p>
        <p>Category: {ticket.category ? ticket.category.categoryName : 'N/A'}</p>
        <p>Created At: {new Date(ticket.createdAt).toLocaleString()}</p>
        <p>Last Updated: {new Date(ticket.updatedAt).toLocaleString()}</p>
      </div>

      {/* Section for Comments */}
      <div className='mb-6'>
        <h3 className='text-lg font-bold mb-2'>Comments</h3>
        {ticket.comments && ticket.comments.length > 0 ? (
            <ul>
                {ticket.comments.map(comment => (
                    comment && comment._id ? (
                        <li key={comment._id} className='border-b py-2'>
                            <p className='text-gray-800'>{comment.content}</p>
                            <p className='text-sm text-gray-600'>
                                By: {comment.author ? `${comment.author.name} (${comment.author.role})` : 'N/A'} at {new Date(comment.createdAt).toLocaleString()}
                            </p>
                        </li>
                    ) : null
                ))}
            </ul>
        ) : (
            <p>No comments yet.</p>
        )}

        {/* Add Comment Form */}
        {user && (ticket.customer._id === user._id || user.role === 'staff' || user.role === 'admin') && ( // Allow customer owner, staff, or admin to comment
            <div className='mt-4'>
                <h4 className='text-md font-bold mb-2'>Add a Comment</h4>
                <form onSubmit={handleAddComment}>
                    <textarea
                        value={newCommentContent}
                        onChange={handleCommentChange}
                        placeholder='Type your comment here...'
                        rows='4'
                        className='form-textarea mt-1 block w-full border rounded p-2'
                        required
                    ></textarea>
                    <button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded mt-2'>
                        Post Comment
                    </button>
                </form>
            </div>
        )}
      </div>

      {/* Section for File Attachments */}
      <div className='mb-6'>
        <h3 className='text-lg font-bold mb-2'>Attachments</h3>
        {ticket.fileAttachments && ticket.fileAttachments.length > 0 ? (
             <ul>
                 {ticket.fileAttachments.map(file => (
                     <li key={file._id} className='py-1'>
                         <a href={file.link} target='_blank' rel='noopener noreferrer' className='text-blue-500 hover:underline'>{file.fileName}</a>
                     </li>
                 ))}
             </ul>
        ) : (
            <p>No attachments.</p>
        )}

        {/* Add File Upload Form */}
        {user && (ticket.customer._id === user._id || user.role === 'staff' || user.role === 'admin') && ( // Allow customer owner, staff, or admin to upload files
            <div className='mt-4'>
                 <h4 className='text-md font-bold mb-2'>Upload File</h4>
                 <form onSubmit={handleUploadFile}>
                    <input
                        type='file'
                        onChange={handleFileChange}
                        className='form-input mt-1 block w-full'
                    />
                    <button type='submit' className='bg-green-500 text-white px-4 py-2 rounded mt-2' disabled={!selectedFile}>
                        Upload
                    </button>
                 </form>
            </div>
        )}
      </div>

      {/* Section for Staff/Admin Actions (Update Status, Assign, etc.) */}
       {user && (user.role === 'staff' || user.role === 'admin') && (
           <div className='mt-6 p-4 border rounded'>
               <h3 className='text-lg font-bold mb-2'>Staff/Admin Actions</h3>
               {/* Update Status */}
               <div className='mb-4'>
                   <label className='block text-gray-700 mb-1'>Update Status</label>
                   <select
                       name='status'
                       value={ticketStatus}
                       onChange={handleStatusChange}
                       className='form-select block w-full border rounded p-2'
                   >
                       <option value='open'>Open</option>
                       <option value='in progress'>In Progress</option>
                       <option value='closed'>Closed</option>
                   </select>
               </div>

               {/* Assign Ticket */}
                <div className='mb-4'>
                   <label className='block text-gray-700 mb-1'>Assign To (User ID)</label>
                    {/* Ideally, this would be a dropdown/search for staff/admin users */}
                   <input
                        type='text' // Or select/search input for users
                        name='assignedTo'
                        value={assignedToUser}
                        onChange={handleAssignedToChange}
                         placeholder='Enter Staff/Admin User ID'
                         className='form-input block w-full border rounded p-2'
                   />
                </div>

           </div>
       )}

    </div>
  );
}

export default TicketDetails;