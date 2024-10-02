// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';
import BusinessRequestForm from './components/BusinessRequestForm';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import BusinessDetails from './pages/BusinessDetails';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';


const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} />
          <Route path="/admin-dashboard" element={<AdminRoute component={AdminDashboard} />} />
          <Route path="/business-request" element={<ProtectedRoute component={BusinessRequestForm} />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/business/:name" element={<BusinessDetails />} /> {/* Updated route for business details */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;