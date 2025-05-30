import './App.css';
import Navbar from './components/navbar';
import Footer from './components/footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  
import Home from './pages/home';
import CreateAccount from './pages/createAccount';
import Login from './pages/login';
import NavbarStaff from './components/navbarStaff';
import CustTicket from './pages/custTicket'; 
import DashboardStaff from './pages/dashboardStaff';
import NavbarAdmin from './components/navbarAdmin';
import AdminDashboard from './pages/dashboardAdmin';
import TicketDetails from './pages/TicketDetails';
import PrivateRoute from './components/PrivateRoute';
import BasicLayout from './components/BasicLayout';
import CustomerSupport from './pages/customerSupport';
import ManageTickets from './pages/manageTickets';

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

        <Route element={<PrivateRoute />}>
           <Route path="/tickets/:ticketId" element={<TicketDetails />} />
        </Route>

        <Route
          path="/"
          element={
            <BasicLayout>
              <Home />
            </BasicLayout>
          }
        />
        <Route
          path="/create-account"
          element={
            <BasicLayout>
              <CreateAccount />
            </BasicLayout>
          }
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/custticket"
          element={
            <BasicLayout>
              <CustTicket />
            </BasicLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;