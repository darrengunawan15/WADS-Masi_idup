import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { getTickets, reset } from '../redux/slices/ticketSlice';
// Assuming you have a Spinner component
// import Spinner from '../components/Spinner';

function DashboardStaff() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { tickets, isLoading, isError, message } = useSelector(
    (state) => state.tickets
  );
  const { user } = useSelector((state) => state.auth); // Get user from auth state

  useEffect(() => {
    // Redirect if not logged in or not staff/admin
    if (!user || (user.role !== 'staff' && user.role !== 'admin')) {
      navigate('/login'); // Or redirect to an unauthorized page
    }

    if (isError) {
      console.log(message); // You might want to display this in the UI
    }

    // Fetch all tickets for staff/admin
    if (user) {
        dispatch(getTickets());
    }

    // Clean up on unmount or when dependencies change
    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch]);

  // if (isLoading) {
  //   return <Spinner />;
  // }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Staff Dashboard</h1>

      <h2 className='text-xl font-bold mb-2'>All Tickets</h2>
      {tickets.length > 0 ? (
        <div className='overflow-x-auto'>
          <table className='min-w-full bg-white'>
            <thead>
              <tr>
                <th className='py-2 px-4 border-b'>Ticket ID</th>
                <th className='py-2 px-4 border-b'>Subject</th>
                <th className='py-2 px-4 border-b'>Status</th>
                <th className='py-2 px-4 border-b'>Customer</th>
                <th className='py-2 px-4 border-b'>Assigned To</th>
                <th className='py-2 px-4 border-b'>Category</th>
                {/* Add more headers as needed */}
                <th className='py-2 px-4 border-b'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id} className='hover:bg-gray-100'>
                  <td className='py-2 px-4 border-b'>
                    <Link to={`/tickets/${ticket._id}`} className='text-blue-500 hover:underline'>
                      {ticket._id}
                    </Link>
                  </td>
                  <td className='py-2 px-4 border-b'>{ticket.subject}</td>
                  <td className='py-2 px-4 border-b'>{ticket.status}</td>
                  <td className='py-2 px-4 border-b'>{ticket.customer ? ticket.customer.name : 'N/A'}</td>
                  <td className='py-2 px-4 border-b'>{ticket.assignedTo ? ticket.assignedTo.name : 'Unassigned'}</td>
                  <td className='py-2 px-4 border-b'>{ticket.category ? ticket.category.categoryName : 'N/A'}</td>
                  <td className='py-2 px-4 border-b'>
                    <Link to={`/tickets/${ticket._id}`} className='text-blue-500 hover:underline mr-2'>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : ( user && !isLoading &&
        <p>No tickets found.</p>
      )}
    </div>
  );
}

export default DashboardStaff;