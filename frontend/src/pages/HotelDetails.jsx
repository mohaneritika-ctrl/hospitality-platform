import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { hotelApi } from '../api/hotelApi';
import RoomCard from '../components/RoomCard';
import BookingModal from '../components/BookingModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { Star, MapPin, Wifi, Waves, Utensils, Car, Sparkles, Bed, ShieldCheck, ArrowLeft } from 'lucide-react';

const HotelDetails = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const data = await hotelApi.getHotelById(id);
        setHotel(data);
      } catch (err) {
        console.error('Failed to load hotel details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  const handleBookRoom = (room) => {
    setSelectedRoom(room);
    setIsBookingModalOpen(true);
  };

  const amenities = [
    { icon: Wifi, label: 'High-Speed Wi-Fi' },
    { icon: Waves, label: 'Swimming Pool' },
    { icon: Utensils, label: 'Fine Dining Restaurant' },
    { icon: Car, label: 'Valet Parking' },
    { icon: Sparkles, label: 'Spa & Wellness' },
    { icon: ShieldCheck, label: '24/7 Security & Concierge' },
  ];

  if (loading) {
    return (
      <div style={{ padding: '4rem 0' }}>
        <LoadingSpinner message="Loading hotel details & room availability..." />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Hotel Not Found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem 0' }}>
          The hotel you requested may have been removed or does not exist.
        </p>
        <Link to="/hotels" className="btn btn-primary">Back to Hotels</Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', paddingBottom: '5rem' }}>
      {/* Back button */}
      <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '1rem' }}>
        <Link to="/hotels" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: 'var(--text-muted)',
          fontSize: '0.875rem',
          fontWeight: 600,
          transition: 'color 0.2s'
        }}>
          <ArrowLeft size={16} />
          <span>Back to All Hotels</span>
        </Link>
      </div>

      <div className="container">
        {/* Hero Image & Primary Info Card */}
        <div className="card" style={{ overflow: 'hidden', marginBottom: '2.5rem' }}>
          <div style={{ position: 'relative', height: '420px', width: '100%', backgroundColor: 'var(--bg-card-subtle)' }}>
            <img
              src={hotel.imageUrl || '/assets/hotels/placeholder.jpg'}
              alt={hotel.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/hotels/placeholder.jpg';
              }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.3) 55%, transparent 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '2rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                {hotel.hotelType && (
                  <div style={{
                    backgroundColor: 'var(--accent)',
                    color: '#ffffff',
                    padding: '0.3rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}>
                    {hotel.hotelType}
                  </div>
                )}
                <div style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.95)',
                  color: '#ffffff',
                  padding: '0.3rem 0.65rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontWeight: 700,
                  fontSize: '0.9rem'
                }}>
                  <Star size={16} fill="#ffffff" />
                  <span>{hotel.rating?.toFixed(1)} / 5.0</span>
                </div>
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(8px)',
                  color: '#ffffff',
                  padding: '0.3rem 0.65rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}>
                  <MapPin size={15} />
                  <span>{hotel.city}, {hotel.state}, {hotel.country}</span>
                </div>
              </div>

              <h1 style={{
                color: '#ffffff',
                fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              }}>
                {hotel.name}
              </h1>
              <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                {hotel.address}
              </p>
            </div>
          </div>

          {/* Hotel Description & Details */}
          <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem' }}>
                About This Property
              </h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                {hotel.description}
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem' }}>
                Property Amenities & Highlights
              </h3>
              {hotel.amenities && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  {hotel.amenities.split(',').map((a, i) => (
                    <span key={i} style={{
                      backgroundColor: 'var(--bg-card-subtle)',
                      color: 'var(--text-main)',
                      padding: '0.3rem 0.7rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      border: '1px solid var(--border)'
                    }}>
                      ✓ {a.trim()}
                    </span>
                  ))}
                </div>
              )}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.75rem'
              }}>
                {amenities.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      color: 'var(--text-main)',
                      fontWeight: 500
                    }}>
                      <div style={{
                        padding: '0.4rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-card-subtle)',
                        color: 'var(--accent)',
                        display: 'flex'
                      }}>
                        <Icon size={16} />
                      </div>
                      <span>{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Room Selection Section */}
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>Stay Options</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em' }}>
              Available Rooms & Suites
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
              Select your room type to book with instant confirmation.
            </p>
          </div>

          {hotel.rooms && hotel.rooms.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}>
              {hotel.rooms.map((room) => (
                <RoomCard key={room.id} room={room} onBook={handleBookRoom} />
              ))}
            </div>
          ) : (
            <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Bed size={36} style={{ margin: '0 auto 0.75rem auto', color: 'var(--text-light)' }} />
              <h4>No rooms currently listed for this hotel.</h4>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && selectedRoom && (
        <BookingModal
          hotel={hotel}
          room={selectedRoom}
          onClose={() => setIsBookingModalOpen(false)}
        />
      )}
    </div>
  );
};

export default HotelDetails;
