import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext.js';

const Navbar = () => {
  const { username, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="text-white text-2xl font-bold">
          <Link to="/">DevOps Dashboard</Link>
        </div>
        <ul className="flex space-x-6">
          <li>
            <Link to="/home" className="text-white text-lg hover:text-gray-300">Home</Link>
          </li>
          <li>
            <Link to="/build" className="text-white text-lg hover:text-gray-300">Build Job</Link>
          </li>
          <li>
            <Link to="/list" className="text-white text-lg hover:text-gray-300">List Jobs</Link>
          </li>
          <li>
            <Link to="/history" className="text-white text-lg hover:text-gray-300">History</Link>
          </li>
          <li>
            <Link to="/config" className="text-white text-lg hover:text-gray-300">Get Config</Link>
          </li>
        </ul>
        <div>
          {username ? (
            <button
              onClick={handleLogout}
              className="text-white text-lg border-2 border-white px-3 py-1 rounded hover:bg-white hover:text-blue-500"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="text-white text-lg border-2 border-white px-3 py-1 rounded hover:bg-white hover:text-blue-500">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
