import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { hotelApi } from '../api/hotelApi';
import HotelCard from '../components/HotelCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, Filter, RotateCcw, Building2 } from 'lucide-react';

const Hotels = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [name, setName] = useState(searchParams.get('name') || '');
  const [hotelType, setHotelType] = useState(searchParams.get('hotelType') || '');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'rating_desc');

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const params = {};
      if (city) params.city = city;
      if (name) params.name = name;
      if (hotelType) params.hotelType = hotelType;
      if (minRating) params.minRating = parseFloat(minRating);
      if (minPrice) params.minPrice = parseFloat(minPrice);
      if (maxPrice) params.maxPrice = parseFloat(maxPrice);
      if (sortBy) params.sortBy = sortBy;

      const data = await hotelApi.searchHotels(params);
      setHotels(data);
    } catch (err) {
      console.error('Error fetching hotels', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [city, hotelType, minRating, minPrice, maxPrice, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHotels();
  };

  const handleResetFilters = () => {
    setCity('');
    setName('');
    setHotelType('');
    setMinRating('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('rating_desc');
    setSearchParams({});
  };

  const cities = [
    'All', 'Pune', 'Mumbai', 'Goa', 'Jaipur', 'Udaipur',
    'Manali', 'Lonavala', 'Nashik', 'Bangalore', 'Hyderabad', 'Kerala', 'Agra'
  ];

  const hotelTypes = ['All', 'LUXURY', 'RESORT', 'HERITAGE', 'BOUTIQUE', 'BUSINESS'];

  return (
    <div style={{ padding: '2.5rem 0 4rem 0', backgroundColor: 'var(--bg-main)' }}>
      <div className="container">
        {/* Header Bar */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
            Explore Luxury Hotels & Resorts
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Book the ideal stay tailored to your preferences, budget, and destination.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
          <form onSubmit={handleSearchSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1rem',
              alignItems: 'flex-end',
            }}>
              {/* Hotel Name Input */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Hotel Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search by hotel name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* City Select */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Destination City</label>
                <select
                  className="form-select"
                  value={city}
                  onChange={(e) => setCity(e.target.value === 'All' ? '' : e.target.value)}
                >
                  {cities.map((c) => (
                    <option key={c} value={c === 'All' ? '' : c}>
                      {c === 'All' ? 'All Destinations' : c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Property Type Select */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Property Type</label>
                <select
                  className="form-select"
                  value={hotelType}
                  onChange={(e) => setHotelType(e.target.value === 'All' ? '' : e.target.value)}
                >
                  {hotelTypes.map((t) => (
                    <option key={t} value={t === 'All' ? '' : t}>
                      {t === 'All' ? 'All Types' : t.charAt(0) + t.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Minimum Rating */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Minimum Rating</label>
                <select
                  className="form-select"
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.7">4.7+ Stars</option>
                  <option value="4.8">4.8+ Stars</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Sort By</label>
                <select
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="rating_desc">Highest Rated</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  <Search size={16} />
                  <span>Filter</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="btn btn-outline"
                  title="Reset Filters"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Results Counter */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          fontSize: '0.925rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            Showing <strong style={{ color: 'var(--primary)' }}>{hotels.length}</strong> {hotels.length === 1 ? 'hotel' : 'hotels'}
            {city && <span> in <strong style={{ color: 'var(--accent)' }}>{city}</strong></span>}
            {hotelType && <span> &bull; <strong style={{ color: 'var(--primary)' }}>{hotelType.charAt(0) + hotelType.slice(1).toLowerCase()}</strong></span>}
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <LoadingSpinner message="Searching for available hotels..." />
        ) : hotels.length === 0 ? (
          <div className="card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-card-subtle)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              <Building2 size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.4rem' }}>
              No hotels found
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Try adjusting your search criteria or resetting filters.
            </p>
            <button onClick={handleResetFilters} className="btn btn-primary btn-sm">
              Reset All Filters
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2rem',
          }}>
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hotels;
