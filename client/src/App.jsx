import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import SellMedicine from './pages/SellMedicine';
import Marketplace from './pages/Marketplace';
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';
import RiderRegister from './pages/RiderRegister';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
            <Toaster position="top-right" />
            <Navbar />

            <main className="flex-1 w-full relative z-10">
              <Routes>
                <Route path="/" element={<Marketplace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/register-rider" element={<RiderRegister />} />
                <Route path="/sell" element={<SellMedicine />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Navigate to="/dashboard" replace />} />

                {/* Placeholders */}
                <Route path="/wallet" element={<div className="p-8 text-center text-gray-500">Wallet Page Coming Soon</div>} />
              </Routes>
            </main>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
