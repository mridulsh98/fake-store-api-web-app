// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import ProductDetails from './components/ProductDetails/ProductDetails';
import Navbar from './components/Navbar/Navbar';
import Cart from './components/Cart/Cart';

const ProtectedRoute = ({ element }) => {
  const token = sessionStorage.getItem('token');

  return token ? element : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<ProtectedRoute element={<Dashboard />} />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} />}
        />
        <Route
          path="/product/:id"
          element={<ProtectedRoute element={<ProductDetails />} />}
        />
        <Route
          path="/cart"
          element={<ProtectedRoute element={<Cart />} />}
        />
      </Routes>
    </Router>
  );
};

export default App;

