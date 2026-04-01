import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import EmployeeForm from './components/EmployeeForm';
import SalaryForm from './components/SalaryForm';
import Report from './components/Report';

function App() {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/auth/check', { withCredentials: true })
      .then(() => setAuth(true))
      .catch(() => setAuth(false));
  }, []);

  if (auth === null) return <div className="flex min-h-screen items-center justify-center">Loading…</div>;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/*"
          element={auth ? <ProtectedApp /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

function ProtectedApp() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/employee" element={<EmployeeForm />} />
        <Route path="/salary" element={<SalaryForm />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </>
  );
}

export default App;