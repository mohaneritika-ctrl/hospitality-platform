import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingApi } from '../api/bookingApi';
import { X, Calendar, Users, CheckCircle, AlertCircle, BedDouble } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const BookingModal = ({ hotel, room, onClose, onSuccess }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Date calculation defaults: tomorrow to day after tomorrow
  const getTodayStr = () => new Date().toISOString().split('T')[0];
  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };
  const getDayAfterTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  };

  const [checkInDate, setCheckInDate] = useState(getTomorrowStr());
  const [checkOutDate, setCheckOutDate] = useState(getDayAfterTomorrowStr());
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [numberOfNights, setNumberOfNights] = useState(1);
  const [totalAmount, setTotalAmount] = useState(room?.pricePerNight || 0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Recalculate nights and total price dynamically
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const start = new Date(checkInDate);
      const end = new Date(checkOutDate);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        setNumberOfNights(diffDays);
        setTotalAmount(diffDays * (room?.pricePerNight || 0));
        setError('');
      } else {
        setNumberOfNights(0);
        setTotalAmount(0);
        setError('Check-out date must be after check-in date');
      }
    }
  }, [checkInDate, checkOutDate, room]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/hotels/${hotel.id}` } });
      return;
    }

    if (numberOfNights < 1) {
      setError('Please select valid check-in and check-out dates.');
      return;
    }

    if (numberOfGuests > room.capacity) {
      setError(`Max capacity for this room is ${room.capacity} guests.`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        roomId: room.id,
        checkInDate,
        checkOutDate,
        numberOfGuests: parseInt(numberOfGuests, 10),
      };

      const result = await bookingApi.createBooking(payload);
      setBookingSuccess(result);
      if (onSuccess) onSuccess(result);
    } catch (err) {
      const message = err.response?.data?.message || 'Booking failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h3>Confirm Room Reservation</h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              {hotel?.name} • {hotel?.city}
            </p>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {bookingSuccess ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{
                display: 'inline-flex',
                padding: '1rem',
                borderRadius: '50%',
                backgroundColor: 'var(--success-bg)',
                color: 'var(--success)',
                marginBottom: '1rem'
              }}>
                <CheckCircle size={48} />
              </div>
              <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                Booking Confirmed!
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Your reservation at <strong>{hotel?.name}</strong> has been successfully booked.
                Booking ID: <strong>#{bookingSuccess.id}</strong>
              </p>

              <div style={{
                backgroundColor: 'var(--bg-card-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                textAlign: 'left',
                fontSize: '0.875rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Room:</span>
                  <span style={{ fontWeight: 600 }}>{room?.roomType} (#{room?.roomNumber})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Dates:</span>
                  <span style={{ fontWeight: 600 }}>{checkInDate} to {checkOutDate} ({numberOfNights} nights)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Guests:</span>
                  <span style={{ fontWeight: 600 }}>{numberOfGuests} Guest(s)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '0.5rem' }}>
                  <span style={{ fontWeight: 700 }}>Total Paid:</span>
                  <span style={{ fontWeight: 800, color: 'var(--accent)', fontSize: '1.1rem' }}>
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button
                  className="btn btn-outline"
                  onClick={onClose}
                >
                  Close
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    onClose();
                    navigate('/my-bookings');
                  }}
                >
                  View in My Bookings
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit}>
              {error && (
                <div className="alert alert-error">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              {/* Room Snapshot Card */}
              <div style={{
                backgroundColor: 'var(--bg-card-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                marginBottom: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.2rem' }}>
                    <span className="badge badge-dark">{room?.roomType}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Room #{room?.roomNumber}</span>
                  </div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    Max capacity: {room?.capacity} guests
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent)' }}>
                    ₹{room?.pricePerNight?.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>per night</div>
                </div>
              </div>

              {/* Date Inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="checkIn">Check-In Date</label>
                  <input
                    id="checkIn"
                    type="date"
                    className="form-input"
                    min={getTodayStr()}
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="checkOut">Check-Out Date</label>
                  <input
                    id="checkOut"
                    type="date"
                    className="form-input"
                    min={checkInDate || getTomorrowStr()}
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Guest Count */}
              <div className="form-group">
                <label htmlFor="guests">Number of Guests</label>
                <select
                  id="guests"
                  className="form-select"
                  value={numberOfGuests}
                  onChange={(e) => setNumberOfGuests(e.target.value)}
                >
                  {Array.from({ length: room?.capacity || 2 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Calculation Summary */}
              <div style={{
                border: '1px dashed var(--border-strong)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                margin: '1.25rem 0',
                backgroundColor: '#ffffff'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                  <span>₹{room?.pricePerNight?.toLocaleString('en-IN')} × {numberOfNights} night{numberOfNights > 1 ? 's' : ''}</span>
                  <span style={{ fontWeight: 600 }}>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
                  <span>Taxes & Service Fees</span>
                  <span>Included</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border)',
                  paddingTop: '0.6rem',
                  marginTop: '0.4rem',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  color: 'var(--primary)'
                }}>
                  <span>Total Amount</span>
                  <span style={{ color: 'var(--accent)' }}>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {!isAuthenticated && (
                <div className="alert alert-warning" style={{ fontSize: '0.85rem' }}>
                  <AlertCircle size={16} />
                  <span>You need to be logged in to confirm your booking. You will be redirected to Login.</span>
                </div>
              )}

              {/* CTA Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || numberOfNights < 1}
                >
                  {loading ? (
                    <>
                      <LoadingSpinner small />
                      <span>Confirming...</span>
                    </>
                  ) : (
                    <>
                      <BedDouble size={16} />
                      <span>{isAuthenticated ? 'Confirm Booking' : 'Login to Book'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
