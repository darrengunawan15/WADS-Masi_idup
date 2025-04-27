import './App.css';
import Navbar from './components/navbar';
import Footer from './components/footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Import Router components
import Home from './pages/home';  // Import Home page
import CreateAccount from './pages/createAccount';
import Login from './pages/login';
import Ticket from './pages/ticket'

function App() {
  return (
    <Router> 
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>  
            <Route path="/" element={<Home />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/login" element={<Login />} />
            <Route path="/ticket" element={<Ticket />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
