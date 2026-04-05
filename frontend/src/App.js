import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// We'll create these components next
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Movies from './pages/Movies';
import Watchlist from './pages/Watchlist';
import Reviews from './pages/Reviews';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/reviews" element={<Reviews />} />
          </Routes>
        </div>

        {/* Toast notifications */}
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;