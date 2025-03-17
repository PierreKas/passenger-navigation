// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/NavBar';
import Footer from './components/common/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BookingPage from './pages/BookingPage';
import BusManagement from './pages/BusManagement';
import DestinationManagement from './pages/DestinationManagement';
import UserManagement from './pages/UserManagement';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main className="min-vh-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Dashboard />} />

              {/* Customer routes */}
              <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
                <Route path="/book" element={<BookingPage />} />
                <Route path="/my-bookings" element={<BookingPage />} />
              </Route>

              {/* Driver routes */}
              <Route element={<ProtectedRoute allowedRoles={['DRIVER']} />}>
                <Route path="/my-schedule" element={<Dashboard />} />
                <Route path="/buses" element={<BusManagement />} />
              </Route>

              {/* Admin routes */}
              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="/users" element={<UserManagement />} />
                <Route path="/buses" element={<BusManagement />} />
                <Route path="/destinations" element={<DestinationManagement />} />
                <Route path="/bookings" element={<BookingPage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
}

export default App;