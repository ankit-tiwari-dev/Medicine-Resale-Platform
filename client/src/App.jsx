import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Medicines from './pages/Medicines';
import RiderDashboard from './pages/RiderDashboard';

import Wallet from './pages/Wallet';
import Orders from './pages/Orders';

const NotFound = () => <div className="p-20 text-center glass m-10 rounded-3xl font-black text-4xl">404 <br /><span className="text-primary text-lg">Page Not Found</span></div>;

import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            className: 'glass !rounded-2xl !bg-background/80 !text-foreground !border !border-border !shadow-2xl !font-bold',
          }}
        />
        <div className='min-h-screen flex flex-col'>
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/medicines" element={<Medicines />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/rider" element={<RiderDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/orders" element={<Orders />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
