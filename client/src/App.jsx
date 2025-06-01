import './App.css';
import Navbar from './components/navbar';
import Footer from './components/footer';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';  
import Home from './pages/home';
import CreateAccount from './pages/authentication/register';
import Login from './pages/authentication/login';
import NavbarStaff from './components/navbarStaff';
import DashboardStaff from './pages/staff/dashboardStaff';
import NavbarAdmin from './components/navbarAdmin';
import AdminDashboard from './pages/admin/dashboardAdmin';
import CustomerSupport from './pages/staff/customerSupport';
import ManageTickets from './pages/staff/manageTickets';
import TicketDetails from './pages/staff/ticketDetails';
import PrivateRoute from './components/PrivateRoute';
import AssignTickets from './pages/admin/assignTickets';
import ManageUsers from './pages/admin/manageUsers';
import ManageStaff from './pages/admin/manageStaff';
import DashboardCustomer from './pages/customer/dashboardCustomer';
import ChatSupport from './pages/customer/chatSupport';
import NavbarCustomer from './components/navbarCustomer';
import MyTickets from './pages/customer/myTickets';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PrivateRoute allowedRoles={['staff']} />}>
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
          <Route
            path="/assign-tickets"
            element={
              <>
                <NavbarAdmin />
                <main className="flex-grow">
                  <AssignTickets />
                </main>
              </>
            }
          />
          <Route
            path="/manage-users"
            element={
              <>
                <NavbarAdmin />
                <main className="flex-grow">
                  <ManageUsers />
                </main>
              </>
            }
          />
          <Route
            path="/manage-staff"
            element={
              <>
                <NavbarAdmin />
                <main className="flex-grow">
                  <ManageStaff />
                </main>
              </>
            }
          />
        </Route>

        <Route element={<PrivateRoute allowedRoles={['customer']} />}>
          <Route
            path="/dashboard-customer"
            element={
              <div className="flex h-screen overflow-hidden relative">
                <NavbarCustomer />
                <main className="flex-1 transition-all duration-300">
                  <DashboardCustomer />
                </main>
              </div>
            }
          />
          <Route
            path="/mytickets"
            element={
              <div className="flex h-screen overflow-hidden relative">
                <NavbarCustomer />
                <main className="flex-1 transition-all duration-300">
                  <MyTickets />
                </main>
              </div>
            }
          />
          <Route
            path="/chat-support"
            element={
              <div className="flex h-screen overflow-hidden relative">
                <NavbarCustomer />
                <main className="flex-1 transition-all duration-300">
                  <ChatSupport />
                </main>
              </div>
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