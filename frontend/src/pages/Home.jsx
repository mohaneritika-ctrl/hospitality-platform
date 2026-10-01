import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { hotelApi } from '../api/hotelApi';
import HotelCard from '../components/HotelCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, MapPin, ShieldCheck, Clock, Award, Sparkles, BedDouble, ChevronRight } from 'lucide-react';

const Home = () => {
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await hotelApi.getAllHotels();
        setFeaturedHotels(data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load featured hotels', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      navigate(`/hotels?city=${encodeURIComponent(searchCity.trim())}`);
    } else {
      navigate('/hotels');
    }
  };

  const destinations = [
    { city: 'Pune', state: 'Maharashtra', count: 'Cultural & Tech Hub', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80' },
    { city: 'Mumbai', state: 'Maharashtra', count: 'Arabian Sea Vistas', img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80' },
    { city: 'Goa', state: 'Goa', count: 'Beaches & Sunset Shacks', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80' },
    { city: 'Nashik', state: 'Maharashtra', count: 'Vineyards & Hill Retreats', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80' },
    { city: 'Bangalore', state: 'Karnataka', count: 'Garden City Luxury', img: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        backgroundColor: 'var(--primary)',
        color: '#ffffff',
        padding: '5rem 0 6rem 0',
        overflow: 'hidden',
        backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(217, 119, 6, 0.15) 0%, transparent 40%)'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <Sparkles size={16} color="var(--accent)" />
            <span>Discover Premium Stays & Exclusive Hospitality</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            maxWidth: '850px',
            margin: '0 auto 1.5rem auto'
          }}>
            Experience Exceptional Stays Across India’s Finest Destinations
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-light)',
            maxWidth: '650px',
            margin: '0 auto 2.5rem auto',
            lineHeight: 1.6
          }}>
            Explore verified hotels, check real-time room availability, experience instant booking with double-booking protection, and chat with our 24/7 AI Concierge.
          </p>

          {/* Search Box */}
          <div style={{
            maxWidth: '700px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '0.6rem',
            boxShadow: '0 20px 35px -5px rgba(0, 0, 0, 0.3)',
          }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <div style={{
                flex: 1,
                minWidth: '220px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0 0.85rem',
              }}>
                <MapPin size={20} color="var(--accent)" />
                <input
                  type="text"
                  placeholder="Where are you going? (e.g., Pune, Mumbai, Goa)"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    padding: '0.75rem 0',
                    fontSize: '0.95rem',
                    color: 'var(--text-main)',
                  }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
                <Search size={18} />
                <span>Search Hotels</span>
              </button>
            </form>
          </div>

          {/* Quick Destination Chips */}
          <div style={{
            marginTop: '2rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.6rem',
            flexWrap: 'wrap',
            fontSize: '0.85rem'
          }}>
            <span style={{ color: 'var(--text-light)' }}>Popular searches:</span>
            {['Pune', 'Mumbai', 'Goa', 'Nashik', 'Bangalore'].map((city) => (
              <button
                key={city}
                onClick={() => navigate(`/hotels?city=${city}`)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  padding: '0.3rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  fontSize: '0.825rem',
                  fontWeight: 600
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.12)'}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hotels Section */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Curated Selection</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em' }}>
                Featured Luxury Hotels
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Top-rated properties with exceptional hospitality and world-class guest amenities.
              </p>
            </div>
            <Link to="/hotels" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>View All Hotels</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading curated hotels..." />
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem'
            }}>
              {featuredHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Destinations Grid */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#ffffff', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge badge-warning" style={{ marginBottom: '0.5rem' }}>Top Getaways</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em' }}>
              Popular Travel Destinations
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto' }}>
              From the vibrant business hubs of Pune and Bangalore to the serene beaches of Goa and vineyards of Nashik.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
          }}>
            {destinations.map((dest, i) => (
              <div
                key={i}
                onClick={() => navigate(`/hotels?city=${dest.city}`)}
                style={{
                  position: 'relative',
                  height: '260px',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <img
                  src={dest.img}
                  alt={dest.city}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.2) 60%, transparent 100%)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  color: '#ffffff'
                }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.2rem' }}>{dest.city}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>{dest.count}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--bg-main)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge badge-dark" style={{ marginBottom: '0.5rem' }}>Guest Confidence</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em' }}>
              Why Choose Hospitality Platform
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Engineered with modern full-stack reliability, verified properties, and intelligent guest assistance.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.75rem',
          }}>
            <div className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(217, 119, 6, 0.12)',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}>
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Guaranteed Zero Double-Booking</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Our backend validates date intervals in real-time, completely preventing overlapping reservations.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(5, 150, 105, 0.12)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}>
                <Clock size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Instant Confirmation & Free Cancellation</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Immediate booking confirmations with one-click penalty-free cancellations directly from your dashboard.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(2, 132, 199, 0.12)',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}>
                <Sparkles size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>24/7 AI-Powered Concierge</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Ask questions about hotel recommendations in Pune, policies, room types, or pricing anytime.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(15, 23, 42, 0.1)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}>
                <Award size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Verified Premium Properties</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Handpicked hotels across premier locations in India featuring authentic high-end hospitality standards.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
