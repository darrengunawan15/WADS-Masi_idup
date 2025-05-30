import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { getTickets, createTicket, reset } from '../redux/slices/ticketSlice';
// Assuming you have a Spinner component
// import Spinner from '../components/Spinner';

function CustTicket() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { tickets, isLoading, isError, message } = useSelector(
    (state) => state.ticket
  );
  const { user } = useSelector((state) => state.auth); // Get user from auth state

  const [showCreateForm, setShowCreateForm] = useState(false); // State to toggle create form
  const [newTicketData, setNewTicketData] = useState({
    subject: '',
    description: '',
    category: '', // Assuming category selection is needed
  });

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/login');
    }

    if (isError) {
      console.log(message); // You might want to display this in the UI
    }

    // Fetch tickets when the component loads and user is available
    if (user) {
        dispatch(getTickets());
    }

    // Clean up on unmount or when dependencies change
    return () => {
      dispatch(reset());
    };

  }, [user, navigate, isError, message, dispatch]); // Add user to dependencies

  const handleCreateFormChange = (e) => {
    setNewTicketData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreateFormSubmit = (e) => {
    e.preventDefault();
    dispatch(createTicket(newTicketData));
    setNewTicketData({ subject: '', description: '', category: '' }); // Reset form
    setShowCreateForm(false); // Hide form after submission
  };

  // if (isLoading) {
  //   return <Spinner />;
  // }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>My Tickets</h1>

      <button
        onClick={() => setShowCreateForm(!showCreateForm)}
        className='bg-green-500 text-white px-4 py-2 rounded mb-4'
      >
        {showCreateForm ? 'Cancel Create Ticket' : 'Create New Ticket'}
      </button>

      {showCreateForm && (
        <div className='mb-4 p-4 border rounded'>
          <h2 className='text-xl font-bold mb-2'>Create New Ticket</h2>
          <form onSubmit={handleCreateFormSubmit}>
            <div className='mb-2'>
              <label className='block text-gray-700'>Subject</label>
              <input
                type='text'
                name='subject'
                value={newTicketData.subject}
                onChange={handleCreateFormChange}
                className='form-input mt-1 block w-full'
                required
              />
            </div>
            <div className='mb-2'>
              <label className='block text-gray-700'>Description</label>
              <textarea
                name='description'
                value={newTicketData.description}
                onChange={handleCreateFormChange}
                className='form-textarea mt-1 block w-full'
                required
              ></textarea>
            </div>
             {/* Category selection - you would populate options from backend categories */}
             <div className='mb-2'>
              <label className='block text-gray-700'>Category</label>
              <select
                name='category'
                value={newTicketData.category}
                onChange={handleCreateFormChange}
                className='form-select mt-1 block w-full'
              >
                <option value=''>Select Category</option>
                {/* Map over fetched categories here */}
              </select>
            </div>
            <button
              type='submit'
              className='bg-blue-500 text-white px-4 py-2 rounded mt-2'
            >
              Submit Ticket
            </button>
          </form>
        </div>
      )}

      <h2 className='text-xl font-bold mb-2'>Open Tickets</h2>
      {tickets.length > 0 ? (
        <ul>
          {tickets.map((ticket) => (
            <li key={ticket._id} className='border p-3 mb-2 rounded'>
              {/* Wrap ticket info in a Link */}
              <Link to={`/tickets/${ticket._id}`} className='block'>
                <h3 className='text-lg font-semibold'>{ticket.subject}</h3>
                <p>Status: {ticket.status}</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no tickets.</p>
      )}
    </div>
  );
}

export default CustTicket;
