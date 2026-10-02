import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Hotel, UserPlus, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const errors = {};
    if (!formData.name || !formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2 || formData.name.trim().length > 50) {
      errors.name = 'Name must be between 2 and 50 characters';
    }

    if (!formData.email || !formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Invalid email format';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.phone || !formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      phone: formData.phone.trim(),
    };

    const result = await register(payload);
    if (result.success) {
      navigate('/', { replace: true });
    } else {
      setError(result.message);
      if (result.errors) {
        setFieldErrors(result.errors);
      }
    }
  };

  return (
    <div style={{
      padding: '4rem 1.5rem',
      backgroundColor: 'var(--bg-main)',
      minHeight: 'calc(100vh - 140px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '2.25rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary)',
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto'
          }}>
            <Hotel size={28} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>Create an Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Join Hospitality Platform for exclusive member rates & seamless bookings
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              className="form-input"
              placeholder="e.g. Sameer Deshmukh"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {fieldErrors.name && (
              <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{fieldErrors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              type="email"
              name="email"
              className="form-input"
              placeholder="e.g. sameer@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {fieldErrors.email && (
              <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{fieldErrors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password (at least 6 characters) *</label>
            <input
              id="password"
              type="password"
              name="password"
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {fieldErrors.password && (
              <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{fieldErrors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              id="phone"
              type="text"
              name="phone"
              className="form-input"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            {fieldErrors.phone && (
              <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{fieldErrors.phone}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.75rem' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <LoadingSpinner small />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <UserPlus size={16} />
                <span>Complete Registration</span>
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 700 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
