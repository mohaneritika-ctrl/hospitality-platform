import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, ArrowRight } from 'lucide-react';

const HotelCard = ({ hotel }) => {
  const fallbackImage = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Image with Rating Badge */}
      <div style={{ position: 'relative', width: '100%', height: '220px', overflow: 'hidden' }}>
        <img
          src={hotel.imageUrl || fallbackImage}
          alt={hotel.name}
          onError={(e) => { e.target.src = fallbackImage; }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)'; }}
          onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; }}
        />
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
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1
        }}>
          {hotel.description}
        </p>

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
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent)' }}>
                ₹{hotel.startingPrice ? hotel.startingPrice.toLocaleString('en-IN') : '2,500'}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/night</span>
            </div>
          </div>

          <Link to={`/hotels/${hotel.id}`} className="btn btn-dark btn-sm">
            <span>View Details</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
