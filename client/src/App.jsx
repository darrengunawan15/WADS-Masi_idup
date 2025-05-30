import './App.css';
import Navbar from './components/navbar';
import Footer from './components/footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  
import Home from './pages/home';
import CreateAccount from './pages/authentication/register';
import Login from './pages/authentication/login';
import NavbarStaff from './components/navbarStaff';
import CustTicket from './pages/custTicket'; 
import DashboardStaff from './pages/staff/dashboardStaff';
import NavbarAdmin from './components/navbarAdmin';
import AdminDashboard from './pages/admin/dashboardAdmin';
import Ticket from './pages/custTicket';
import CustomerSupport from './pages/staff/customerSupport';
import ManageTickets from './pages/staff/manageTickets';
import TicketDetails from './pages/staff/ticketDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PrivateRoute allowedRoles={['staff', 'admin']} />}>
          <Route
            path="/dashboard-staff"
            element={
              <div className="flex h-screen overflow-hidden relative">
                <NavbarStaff />
                <div className="flex-1 transition-all duration-300">
                  <DashboardStaff />
                </div>
              </div>
            }
          />

          <Route
            path="/customer-support"
            element={
              <div className="flex h-screen overflow-hidden relative">
                <NavbarStaff />
                <div className="flex-1 transition-all duration-300">
                  <CustomerSupport />
                </div>
              </div>
            }
          />
        </Route>

        <Route element={<PrivateRoute allowedRoles={['admin']} />}>
          <Route
            path="/dashboard-admin"
            element={
              <>
                <NavbarAdmin />
                <main className="flex-grow">
                  <AdminDashboard />
                </main>
              </>
            }
          />
        </Route>

          {/* Normal */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Home />
                </main>
                <Footer />
              </>
            }
          />
          <Route
            path="/create-account"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <CreateAccount />
                </main>
                <Footer />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Login />
                </main>
                <Footer />
              </>
            }
          />
          <Route
            path="/custticket"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Ticket />
                </main>
                <Footer />
              </>
            }
          />
          <Route
            path="/manage-tickets"
            element={
              <div className="flex h-screen overflow-hidden relative">
                <NavbarStaff />
                <div className="flex-1 transition-all duration-300">
                  <ManageTickets />
                </div>
              </div>
            }
          />
          <Route
            path="/ticket-details/:ticketId"
            element={
              <div className="flex h-screen overflow-hidden relative">
                <NavbarStaff />
                <div className="flex-1 transition-all duration-300">
                  <TicketDetails />
                </div>
              </div>
            }
          />

      </Routes>
    </Router>
  );
}

export default App;