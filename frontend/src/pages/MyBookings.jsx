import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingApi } from '../api/bookingApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { Calendar, MapPin, Users, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingApi.getMyBookings();
      setBookings(data);
    } catch (err) {
      console.error('Failed to load user bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    const confirmed = window.confirm(`Are you sure you want to cancel Booking #${bookingId}?`);
    if (!confirmed) return;

    setCancellingId(bookingId);
    setMessage({ type: '', text: '' });

    try {
      await bookingApi.cancelBooking(bookingId);
      setMessage({ type: 'success', text: `Booking #${bookingId} has been successfully cancelled.` });
      // Update state locally
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, bookingStatus: 'CANCELLED' } : b))
      );
    } catch (err) {
      const errText = err.response?.data?.message || 'Failed to cancel booking.';
      setMessage({ type: 'error', text: errText });
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem 0', backgroundColor: 'var(--bg-main)' }}>
      <div className="container">
        {/* Title */}
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>Reservations</span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
            My Stays & Bookings
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            View and manage all your past, current, and upcoming hotel reservations.
          </p>
        </div>

        {/* Feedback Banners */}
        {message.text && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{message.text}</span>
          </div>
        )}

        {loading ? (
          <LoadingSpinner message="Fetching your bookings..." />
        ) : bookings.length === 0 ? (
          <div className="card" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-card-subtle)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}>
              <Calendar size={30} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
              No Bookings Found
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              You haven't made any reservations yet. Discover our premium destinations and book your first stay!
            </p>
            <Link to="/hotels" className="btn btn-primary">
              Browse Hotels
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {bookings.map((booking) => {
              const isConfirmed = booking.bookingStatus === 'CONFIRMED';
              return (
                <div key={booking.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
                  {/* Hotel Thumbnail */}
                  <div style={{ width: '130px', height: '100px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}>
                    <img
                      src={booking.hotelImageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80'}
                      alt={booking.hotelName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Primary Details */}
                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                      <span className={`badge ${isConfirmed ? 'badge-success' : 'badge-danger'}`}>
                        {isConfirmed ? (
                          <>
                            <CheckCircle size={12} /> CONFIRMED
                          </>
                        ) : (
                          <>
                            <XCircle size={12} /> CANCELLED
                          </>
                        )}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        Booking #{booking.id}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.3rem' }}>
                      {booking.hotelName}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      <MapPin size={13} color="var(--accent)" />
                      <span>{booking.hotelCity}</span>
                      <span>•</span>
                      <span>{booking.roomType} (Room #{booking.roomNumber})</span>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Calendar size={15} color="var(--primary)" />
                        <span><strong>Check-in:</strong> {booking.checkInDate}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Calendar size={15} color="var(--primary)" />
                        <span><strong>Check-out:</strong> {booking.checkOutDate}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Users size={15} color="var(--primary)" />
                        <span>{booking.numberOfGuests} Guests ({booking.numberOfNights} Nights)</span>
                      </div>
                    </div>
                  </div>

                  {/* Amount & Actions */}
                  <div style={{
                    textAlign: 'right',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '0.75rem',
                    borderLeft: '1px solid var(--border)',
                    paddingLeft: '1.5rem'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                        Total Amount
                      </div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent)' }}>
                        ₹{booking.totalAmount?.toLocaleString('en-IN')}
                      </div>
                    </div>

                    {isConfirmed ? (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={cancellingId === booking.id}
                        className="btn btn-danger-outline btn-sm"
                      >
                        {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--danger)', fontWeight: 600 }}>
                        Cancelled
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
