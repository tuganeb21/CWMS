import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({ employees: 0, departments: 0 });

  useEffect(() => {
    const fetch = async () => {
      const [e, d] = await Promise.all([
        axios.get('http://localhost:5000/api/employee', { withCredentials: true }),
        axios.get('http://localhost:5000/api/department', { withCredentials: true })
      ]);
      setStats({ employees: e.data.length, departments: d.data.length });
    };
    fetch();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-8 text-green-700">EPMS Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="border p-6 text-center rounded">
          <h3 className="text-lg font-medium">Total Employees</h3>
          <p className="text-3xl font-bold mt-2">{stats.employees}</p>
        </div>
        <div className="border p-6 text-center rounded">
          <h3 className="text-lg font-medium">Departments</h3>
          <p className="text-3xl font-bold mt-2">{stats.departments}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/employee">
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition">
            Manage Employees
          </button>
        </Link>
        <Link to="/salary">
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition">
            Salary Operations
          </button>
        </Link>
        <Link to="/report">
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition">
            View Reports
          </button>
        </Link>
      </div>
    </div>
  );
}