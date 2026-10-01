import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, ArrowRight, BedDouble } from 'lucide-react';

const HotelCard = ({ hotel }) => {
  const fallbackImage = '/assets/hotels/placeholder.jpg';

  const amenityList = hotel.amenities
    ? hotel.amenities.split(',').map((a) => a.trim()).filter(Boolean).slice(0, 3)
    : [];

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Image Container with Badges */}
      <div style={{ position: 'relative', width: '100%', height: '220px', overflow: 'hidden', backgroundColor: 'var(--bg-card-subtle)' }}>
        <img
          src={hotel.imageUrl || fallbackImage}
          alt={hotel.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackImage;
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)'; }}
          onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; }}
        />

        {/* Hotel Type Badge */}
        {hotel.hotelType && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            backgroundColor: 'var(--accent)',
            color: '#ffffff',
            padding: '0.25rem 0.6rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.72rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
          }}>
            {hotel.hotelType}
          </div>
        )}

        {/* Rating Badge */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(4px)',
          color: '#ffffff',
          padding: '0.3rem 0.6rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          fontWeight: 700,
          fontSize: '0.85rem'
        }}>
          <Star size={14} color="#f59e0b" fill="#f59e0b" />
          <span>{hotel.rating?.toFixed(1) || '4.5'}</span>
        </div>

        {/* City Location Pill */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '0.25rem 0.6rem',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--primary)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <MapPin size={12} color="var(--accent)" />
          <span>{hotel.city}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
          {hotel.name}
        </h3>
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--text-muted)',
          lineHeight: 1.5,
          marginBottom: '0.75rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1
        }}>
          {hotel.description}
        </p>

        {/* Amenities Badges */}
        {amenityList.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
            {amenityList.map((amenity, idx) => (
              <span key={idx} style={{
                fontSize: '0.72rem',
                backgroundColor: 'var(--bg-main)',
                color: 'var(--text-main)',
                padding: '0.2rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                fontWeight: 500
              }}>
                {amenity}
              </span>
            ))}
          </div>
        )}

        {/* Footer: Price & CTA */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border)',
          paddingTop: '0.85rem',
          marginTop: 'auto'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Starts from
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent)' }}>
                ₹{hotel.startingPrice ? hotel.startingPrice.toLocaleString('en-IN') : '2,500'}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/night</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <Link to={`/hotels/${hotel.id}`} className="btn btn-primary btn-sm">
              <BedDouble size={14} />
              <span>Book Now</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
