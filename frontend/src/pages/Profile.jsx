import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/userApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { User, Mail, Phone, Shield, Calendar, CheckCircle, AlertCircle, Save } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userApi.getProfile();
        setProfile(data);
        setName(data.name || '');
        setPhone(data.phone || '');
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const updated = await userApi.updateProfile({ name, phone });
      setProfile(updated);
      updateUser({ name: updated.name, phone: updated.phone });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      const errText = err.response?.data?.message || 'Failed to update profile.';
      setMessage({ type: 'error', text: errText });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem 0' }}>
        <LoadingSpinner message="Loading your profile..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0 5rem 0', backgroundColor: 'var(--bg-main)' }}>
      <div className="container container-narrow">
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
            boxShadow: 'var(--shadow-md)'
          }}>
            <User size={36} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em' }}>
            User Account Settings
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            Manage your personal profile and account credentials.
          </p>
        </div>

        {message.text && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="card" style={{ padding: '2rem' }}>
          <form onSubmit={handleUpdate}>
            {/* Name */}
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="name"
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email (Read only) */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  value={profile?.email || ''}
                  disabled
                  style={{ backgroundColor: 'var(--bg-card-subtle)', cursor: 'not-allowed' }}
                />
              </div>
              <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Email cannot be modified as it is linked to your authentication identifier.
              </small>
            </div>

            {/* Phone */}
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="text"
                className="form-input"
                placeholder="+91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            {/* Role (Read only) */}
            <div className="form-group">
              <label>Account Role</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className={`badge ${profile?.role === 'ADMIN' ? 'badge-dark' : 'badge-primary'}`}>
                  <Shield size={13} /> {profile?.role}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {profile?.role === 'ADMIN' ? 'Full administrative system access' : 'Standard guest customer access'}
                </span>
              </div>
            </div>

            {/* Member Since */}
            {profile?.createdAt && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.825rem',
                color: 'var(--text-muted)',
                marginBottom: '1.5rem',
                borderTop: '1px solid var(--border)',
                paddingTop: '1rem',
                marginTop: '1.5rem'
              }}>
                <Calendar size={15} />
                <span>Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
              style={{ width: '100%' }}
            >
              {saving ? (
                <>
                  <LoadingSpinner small />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Update Profile</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
