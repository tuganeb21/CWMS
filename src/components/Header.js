import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    axios.get('http://localhost:5000/api/auth/logout', { withCredentials: true })
      .then(() => navigate('/login'))
      .catch(() => navigate('/login'));
  };

  return (
    <header className="bg-green-600 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo / Brand */}
        <Link to="/" className="text-2xl font-bold hover:text-green-100 transition">
          SmartPark EPMS
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition shadow"
        >
          Logout
        </button>
      </div>
    </header>
  );
}