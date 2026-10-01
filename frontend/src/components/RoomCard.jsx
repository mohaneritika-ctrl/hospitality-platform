import React from 'react';
import { Users, BedDouble, CheckCircle2, XCircle } from 'lucide-react';

const RoomCard = ({ room, onBook }) => {
  const getBadgeStyle = (type) => {
    switch (type) {
      case 'SUITE':
        return 'badge-warning';
      case 'DELUXE':
        return 'badge-primary';
      default:
        return 'badge-dark';
    }
  };

  return (
    <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className={`badge ${getBadgeStyle(room.roomType)}`}>
              {room.roomType}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Room #{room.roomNumber}
            </span>
          </div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>
            {room.roomType === 'SUITE' ? 'Executive Suite' : room.roomType === 'DELUXE' ? 'Deluxe King Room' : 'Standard Cozy Room'}
          </h4>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent)' }}>
            ₹{room.pricePerNight?.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>per night</div>
        </div>
      </div>

      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
        {room.description || 'Premium comfort with luxury bedding, smart climate control, and modern private bathroom.'}
      </p>

      {/* Attributes & Availability */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.65rem 0',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        fontSize: '0.85rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)', fontWeight: 600 }}>
          <Users size={16} color="var(--accent)" />
          <span>Max {room.capacity} Guests</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, fontSize: '0.825rem' }}>
          {room.available ? (
            <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <CheckCircle2 size={15} /> Available
            </span>
          ) : (
            <span style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <XCircle size={15} /> Unavailable
            </span>
          )}
        </div>
      </div>

      {/* Booking CTA */}
      <button
        onClick={() => onBook(room)}
        disabled={!room.available}
        className="btn btn-primary"
        style={{ width: '100%', marginTop: '0.25rem' }}
      >
        <BedDouble size={16} />
        <span>{room.available ? 'Book This Room' : 'Currently Unavailable'}</span>
      </button>
    </div>
  );
};

export default RoomCard;
