import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user on mount
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("google_token");
    setUser(null);
    navigate('/');
  };

  return (
    <div className="bg-white px-4 py-3 flex justify-between items-center shadow">
      <h1 className="text-xl font-bold text-blue-800">Tutor AI</h1>

      <div className="relative">
        {user ? (
          <img
            src={user.picture}
            alt="Profile"
            className="w-10 h-10 rounded-full cursor-pointer border-2 border-blue-600"
            onClick={() => setShowMenu(!showMenu)}
          />
        ) : (
          <FaUserCircle
            className="text-3xl cursor-pointer text-gray-700"
            onClick={() => setShowMenu(!showMenu)}
          />
        )}

        {showMenu && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded border z-50">
            {user ? (
              <>
                <div className="px-4 py-2 text-sm border-b text-gray-800 font-medium">
                  {user.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-blue-600"
              >
                Login
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
