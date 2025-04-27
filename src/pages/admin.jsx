import './App.css';
import Navbar from './components/navbar';
import Footer from './components/footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Import Router components
import Home from './pages/home';  // Import Home page
import CreateAccount from './pages/createAccount';
import Login from './pages/login';
import NavbarStaff from './components/navbarStaff';
import DashboardStaff from './pages/dashboardStaff';
import AdminDashboard from './pages/dashboardAdmin';


function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Routes>
          <Route
            path="/dashboard-staff"
            element={
              <>
                <NavbarStaff />
                <main className="flex-grow">
                  <DashboardStaff />
                </main>
              </>
            }
          />

          <Route
            path="/dashboard-admin"
            element={
              <>
                <NavbarStaff />
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
            path="/ticket"
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