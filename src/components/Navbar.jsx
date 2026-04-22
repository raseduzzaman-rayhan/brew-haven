import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import logo from '../assets/logo.png';
import bgImage from '../assets/bg_pattern.jpg';
import { FaMagnifyingGlass, FaChevronDown } from 'react-icons/fa6';
import { RiMenu2Line } from 'react-icons/ri';
import { FaSignInAlt, FaUserPlus, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { ShoppingCart } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // cart count
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // links
  const publicLinks = [
    { path: "/", name: "Home" },
    { path: "/menu", name: "Menu" },
    { path: "/about", name: "About" }
  ];

  return (
    <nav className="relative" style={{ fontFamily: 'Rancho, cursive' }}>
      <div
        className="flex items-center justify-between px-3 py-2 border-b-2 border-[#1E1E1E]"
        style={{
          backgroundColor: '#372727',
          backgroundImage: `url(${bgImage})`,
          backgroundPosition: 'center',
          backgroundSize: 'contain',
          backgroundRepeat: 'repeat',
        }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1">
          <img src={logo} alt="logo" className="w-14" />
          <h1 className="hidden md:block text-white text-2xl md:text-4xl font-bold">
            Brew Haven
          </h1>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">

          {/* Links */}
          <div className="flex gap-3 text-white">
            {publicLinks.map(link => (
              <NavLink key={link.path} to={link.path}>
                {link.name}
              </NavLink>
            ))}

            {user?.role === 'admin' && (
              <NavLink to="/add-coffee">Add Coffee</NavLink>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <FaMagnifyingGlass className="absolute left-3 top-2 text-gray-300" />
            <input
              type="search"
              placeholder="Search"
              className="pl-9 pr-3 py-1 rounded bg-transparent border text-white"
            />
          </div>

          {/* Cart (ONLY when logged in) */}
          {user && (
            <Link to="/cart" className="relative text-white">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-xs px-1 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {/* Auth */}
          <div className="relative" ref={dropdownRef}>
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-300/20 bg-red-300/10 text-white hover:bg-red-500 transition"
              >
                <FaSignOutAlt />
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border bg-white/10 text-white hover:bg-white hover:text-[#372727]"
                >
                  <FaUserCircle />
                  Join Us
                  <FaChevronDown className={`${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#372727] border rounded-xl shadow-lg z-50">
                    <NavLink
                      to="/login"
                      className="flex gap-2 px-4 py-2 text-white hover:bg-white/10"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FaSignInAlt /> Login
                    </NavLink>
                    <NavLink
                      to="/register"
                      className="flex gap-2 px-4 py-2 text-white hover:bg-white/10"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FaUserPlus /> Register
                    </NavLink>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden text-white">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <RiMenu2Line size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#372727] text-white px-4 py-4 space-y-3">

          {/* Links */}
          {publicLinks.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className="block"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}

          {/* Admin */}
          {user?.role === 'admin' && (
            <NavLink
              to="/add-coffee"
              className="block"
              onClick={() => setMobileMenuOpen(false)}
            >
              Add Coffee
            </NavLink>
          )}

          {/* Cart (ONLY when logged in) */}
          {user && (
            <NavLink
              to="/cart"
              className="block"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cart ({cartCount})
            </NavLink>
          )}

          <hr className="border-white/20" />

          {/* Auth */}
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-300"
            >
              <FaSignOutAlt /> Logout
            </button>
          ) : (
            <>
              <NavLink to="/login" className="flex gap-2">
                <FaSignInAlt /> Login
              </NavLink>
              <NavLink to="/register" className="flex gap-2">
                <FaUserPlus /> Register
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;