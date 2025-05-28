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
import Ticket from './pages/custTicket'; 

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Routes>
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;