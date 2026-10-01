import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Hotel, User, Calendar, Shield, LogOut, LogIn, UserPlus, Menu, X, BotMessageSquare } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            backgroundColor: 'var(--primary)',
            color: 'var(--accent)',
            padding: '0.5rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Hotel size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              HOSPITALITY<span style={{ color: 'var(--accent)' }}>.</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Hotel Booking Platform
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
          <Link
            to="/"
            style={{
              fontWeight: 600,
              fontSize: '0.925rem',
              color: isActive('/') ? 'var(--accent)' : 'var(--text-main)',
              transition: 'color 0.2s'
            }}
          >
            Home
          </Link>
          <Link
            to="/hotels"
            style={{
              fontWeight: 600,
              fontSize: '0.925rem',
              color: isActive('/hotels') ? 'var(--accent)' : 'var(--text-main)',
              transition: 'color 0.2s'
            }}
          >
            Hotels
          </Link>

          {isAuthenticated && (
            <Link
              to="/my-bookings"
              style={{
                fontWeight: 600,
                fontSize: '0.925rem',
                color: isActive('/my-bookings') ? 'var(--accent)' : 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'color 0.2s'
              }}
            >
              <Calendar size={16} />
              My Bookings
            </Link>
          )}

          {isAuthenticated && isAdmin && (
            <Link
              to="/admin"
              style={{
                fontWeight: 600,
                fontSize: '0.925rem',
                color: isActive('/admin') ? 'var(--accent)' : 'var(--primary)',
                backgroundColor: 'var(--accent-light)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s'
              }}
            >
              <Shield size={16} color="var(--accent)" />
              Admin Dashboard
            </Link>
          )}

          <Link
            to="/chatbot"
            style={{
              fontWeight: 600,
              fontSize: '0.925rem',
              color: isActive('/chatbot') ? 'var(--accent)' : 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'color 0.2s'
            }}
          >
            <BotMessageSquare size={16} />
            AI Concierge
          </Link>
        </nav>

        {/* Auth CTA Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }} className="desktop-auth">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link
                to="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-card-subtle)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}
              >
                <User size={16} />
                <span>{user?.name}</span>
                <span className={`badge ${isAdmin ? 'badge-dark' : 'badge-primary'}`} style={{ fontSize: '0.65rem' }}>
                  {user?.role}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
                title="Log Out"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <LogIn size={15} />
                <span>Login</span>
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <UserPlus size={15} />
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ display: 'none', color: 'var(--primary)', padding: '0.5rem' }}
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--border)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>Home</Link>
          <Link to="/hotels" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>Hotels</Link>
          {isAuthenticated && (
            <Link to="/my-bookings" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>My Bookings</Link>
          )}
          {isAuthenticated && isAdmin && (
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: 'var(--accent)' }}>Admin Dashboard</Link>
          )}
          <Link to="/chatbot" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>AI Concierge</Link>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
          {isAuthenticated ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>
                Profile ({user?.name})
              </Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start' }}>
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 820px) {
          .desktop-nav, .desktop-auth { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
