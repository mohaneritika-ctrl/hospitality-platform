import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';
import { hotelApi } from '../api/hotelApi';
import { roomApi } from '../api/roomApi';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Users, Building2, BedDouble, Calendar, CheckCircle2,
  XCircle, IndianRupee, Plus, Edit, Trash2, Shield, Eye
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, hotels, rooms, bookings, users
  const [stats, setStats] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hotel selection for rooms tab
  const [selectedHotelId, setSelectedHotelId] = useState('');

  // Modals state
  const [hotelModalOpen, setHotelModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [hotelForm, setHotelForm] = useState({
    name: '', description: '', address: '', city: '', state: '', country: 'India', rating: 4.5, imageUrl: ''
  });

  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomForm, setRoomForm] = useState({
    hotelId: '', roomNumber: '', roomType: 'STANDARD', pricePerNight: 2500, capacity: 2, available: true, description: ''
  });

  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const showFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback({ type: '', text: '' }), 4000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsData, hotelsData, bookingsData, usersData] = await Promise.all([
        adminApi.getStatistics(),
        hotelApi.getAllHotels(),
        adminApi.getAllBookings(),
        adminApi.getAllUsers(),
      ]);
      setStats(statsData);
      setHotels(hotelsData);
      setBookings(bookingsData);
      setUsers(usersData);

      if (hotelsData.length > 0 && !selectedHotelId) {
        setSelectedHotelId(hotelsData[0].id.toString());
        loadRoomsForHotel(hotelsData[0].id);
      }
    } catch (err) {
      console.error('Failed to load admin data', err);
      showFeedback('error', 'Error loading administrative records.');
    } finally {
      setLoading(false);
    }
  };

  const loadRoomsForHotel = async (hotelId) => {
    try {
      const roomData = await roomApi.getRoomsByHotel(hotelId);
      setRooms(roomData);
    } catch (err) {
      console.error('Failed to load rooms', err);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleHotelSelectChange = (e) => {
    const hId = e.target.value;
    setSelectedHotelId(hId);
    if (hId) loadRoomsForHotel(hId);
  };

  // Hotel Handlers
  const openAddHotelModal = () => {
    setEditingHotel(null);
    setHotelForm({
      name: '', description: '', address: '', city: '', state: '', country: 'India', rating: 4.5, imageUrl: ''
    });
    setHotelModalOpen(true);
  };

  const openEditHotelModal = (h) => {
    setEditingHotel(h);
    setHotelForm({
      name: h.name,
      description: h.description || '',
      address: h.address || '',
      city: h.city || '',
      state: h.state || '',
      country: h.country || 'India',
      rating: h.rating || 4.5,
      imageUrl: h.imageUrl || ''
    });
    setHotelModalOpen(true);
  };

  const handleHotelFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingHotel) {
        await hotelApi.updateHotel(editingHotel.id, hotelForm);
        showFeedback('success', `Hotel '${hotelForm.name}' updated successfully!`);
      } else {
        await hotelApi.createHotel(hotelForm);
        showFeedback('success', `Hotel '${hotelForm.name}' created successfully!`);
      }
      setHotelModalOpen(false);
      loadAllData();
    } catch (err) {
      showFeedback('error', err.response?.data?.message || 'Hotel save failed.');
    }
  };

  const handleDeleteHotel = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete hotel '${name}'? This will also remove all its rooms.`)) return;
    try {
      await hotelApi.deleteHotel(id);
      showFeedback('success', `Hotel '${name}' deleted successfully.`);
      loadAllData();
    } catch (err) {
      showFeedback('error', err.response?.data?.message || 'Failed to delete hotel.');
    }
  };

  // Room Handlers
  const openAddRoomModal = () => {
    setEditingRoom(null);
    setRoomForm({
      hotelId: selectedHotelId,
      roomNumber: '',
      roomType: 'STANDARD',
      pricePerNight: 2500,
      capacity: 2,
      available: true,
      description: ''
    });
    setRoomModalOpen(true);
  };

  const openEditRoomModal = (r) => {
    setEditingRoom(r);
    setRoomForm({
      hotelId: r.hotelId,
      roomNumber: r.roomNumber,
      roomType: r.roomType,
      pricePerNight: r.pricePerNight,
      capacity: r.capacity,
      available: r.available,
      description: r.description || ''
    });
    setRoomModalOpen(true);
  };

  const handleRoomFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await roomApi.updateRoom(editingRoom.id, roomForm);
        showFeedback('success', `Room #${roomForm.roomNumber} updated!`);
      } else {
        await roomApi.createRoom(selectedHotelId, roomForm);
        showFeedback('success', `Room #${roomForm.roomNumber} added!`);
      }
      setRoomModalOpen(false);
      loadRoomsForHotel(selectedHotelId);
      loadAllData();
    } catch (err) {
      showFeedback('error', err.response?.data?.message || 'Room save failed.');
    }
  };

  const handleToggleRoomAvailability = async (id) => {
    try {
      await roomApi.toggleAvailability(id);
      loadRoomsForHotel(selectedHotelId);
      showFeedback('success', 'Room availability toggled.');
    } catch (err) {
      showFeedback('error', 'Failed to toggle availability.');
    }
  };

  const handleDeleteRoom = async (id, roomNum) => {
    if (!window.confirm(`Delete Room #${roomNum}?`)) return;
    try {
      await roomApi.deleteRoom(id);
      showFeedback('success', `Room #${roomNum} deleted.`);
      loadRoomsForHotel(selectedHotelId);
      loadAllData();
    } catch (err) {
      showFeedback('error', err.response?.data?.message || 'Failed to delete room.');
    }
  };

  if (loading && !stats) {
    return (
      <div style={{ padding: '4rem 0' }}>
        <LoadingSpinner message="Loading Admin Management Center..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem 0 5rem 0', backgroundColor: 'var(--bg-main)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-dark">
                <Shield size={14} /> ADMIN ACCESS
              </span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em' }}>
              System Administration
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
              Real-time platform overview, properties, room allocations, bookings, and users.
            </p>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback.text && (
          <div className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Dashboard Analytics
          </button>
          <button
            className={`tab-btn ${activeTab === 'hotels' ? 'active' : ''}`}
            onClick={() => setActiveTab('hotels')}
          >
            Manage Hotels ({hotels.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'rooms' ? 'active' : ''}`}
            onClick={() => setActiveTab('rooms')}
          >
            Manage Rooms
          </button>
          <button
            className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            All Bookings ({bookings.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Registered Users ({users.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && stats && (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2.5rem'
            }}>
              <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="#0284c7" />
              <StatCard title="Total Hotels" value={stats.totalHotels} icon={Building2} color="#8b5cf6" />
              <StatCard title="Total Rooms" value={stats.totalRooms} icon={BedDouble} color="#d97706" />
              <StatCard title="Total Bookings" value={stats.totalBookings} icon={Calendar} color="#0f172a" />
              <StatCard title="Confirmed" value={stats.confirmedBookings} icon={CheckCircle2} color="#059669" />
              <StatCard title="Cancelled" value={stats.cancelledBookings} icon={XCircle} color="#dc2626" />
              <StatCard
                title="Gross Revenue"
                value={`₹${stats.totalRevenue?.toLocaleString('en-IN')}`}
                icon={IndianRupee}
                color="#059669"
                subtitle="Confirmed bookings total"
              />
            </div>

            {/* Recent Bookings Quick Table */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem' }}>
                Recent System Bookings
              </h3>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Guest</th>
                      <th>Hotel & Room</th>
                      <th>Dates</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 5).map((b) => (
                      <tr key={b.id}>
                        <td><strong>#{b.id}</strong></td>
                        <td>
                          <div>{b.userName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.userEmail}</div>
                        </td>
                        <td>{b.hotelName} ({b.roomType} #{b.roomNumber})</td>
                        <td>{b.checkInDate} → {b.checkOutDate}</td>
                        <td><strong>₹{b.totalAmount?.toLocaleString('en-IN')}</strong></td>
                        <td>
                          <span className={`badge ${b.bookingStatus === 'CONFIRMED' ? 'badge-success' : 'badge-danger'}`}>
                            {b.bookingStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE HOTELS */}
        {activeTab === 'hotels' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>Hotels Directory</h3>
              <button onClick={openAddHotelModal} className="btn btn-primary btn-sm">
                <Plus size={16} />
                <span>Add New Hotel</span>
              </button>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Hotel</th>
                    <th>City / State</th>
                    <th>Rating</th>
                    <th>Rooms</th>
                    <th>Starting Rate</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hotels.map((h) => (
                    <tr key={h.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={h.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=100&q=80'}
                            alt={h.name}
                            style={{ width: '45px', height: '40px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700 }}>{h.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{h.address}</div>
                          </div>
                        </div>
                      </td>
                      <td>{h.city}, {h.state}</td>
                      <td>⭐ {h.rating}</td>
                      <td>{h.totalRooms} rooms</td>
                      <td>₹{h.startingPrice?.toLocaleString('en-IN')}/night</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => openEditHotelModal(h)} className="btn btn-outline btn-sm" title="Edit">
                            <Edit size={14} />
                          </button>
                          <button onClick={() => handleDeleteHotel(h.id, h.name)} className="btn btn-danger-outline btn-sm" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: MANAGE ROOMS */}
        {activeTab === 'rooms' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.25rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <label style={{ fontWeight: 700, fontSize: '0.9rem' }}>Select Hotel:</label>
                <select
                  className="form-select"
                  value={selectedHotelId}
                  onChange={handleHotelSelectChange}
                  style={{ width: 'auto', minWidth: '240px' }}
                >
                  {hotels.map((h) => (
                    <option key={h.id} value={h.id}>{h.name} ({h.city})</option>
                  ))}
                </select>
              </div>

              <button onClick={openAddRoomModal} className="btn btn-primary btn-sm" disabled={!selectedHotelId}>
                <Plus size={16} />
                <span>Add Room to Hotel</span>
              </button>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Room Number</th>
                    <th>Type</th>
                    <th>Price / Night</th>
                    <th>Capacity</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No rooms configured for this hotel. Click 'Add Room' to create one.
                      </td>
                    </tr>
                  ) : (
                    rooms.map((r) => (
                      <tr key={r.id}>
                        <td><strong>#{r.roomNumber}</strong></td>
                        <td><span className="badge badge-dark">{r.roomType}</span></td>
                        <td><strong>₹{r.pricePerNight?.toLocaleString('en-IN')}</strong></td>
                        <td>{r.capacity} Guests</td>
                        <td>
                          <button
                            onClick={() => handleToggleRoomAvailability(r.id)}
                            className={`badge ${r.available ? 'badge-success' : 'badge-danger'}`}
                            style={{ cursor: 'pointer' }}
                            title="Click to toggle availability"
                          >
                            {r.available ? 'Available' : 'Unavailable'}
                          </button>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => openEditRoomModal(r)} className="btn btn-outline btn-sm" title="Edit">
                              <Edit size={14} />
                            </button>
                            <button onClick={() => handleDeleteRoom(r.id, r.roomNumber)} className="btn btn-danger-outline btn-sm" title="Delete">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ALL BOOKINGS */}
        {activeTab === 'bookings' && (
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.25rem' }}>
              All System Bookings
            </h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer Name</th>
                    <th>Customer Email</th>
                    <th>Hotel & Location</th>
                    <th>Room</th>
                    <th>Dates</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td><strong>#{b.id}</strong></td>
                      <td>{b.userName}</td>
                      <td>{b.userEmail}</td>
                      <td>{b.hotelName} ({b.hotelCity})</td>
                      <td>{b.roomType} (#{b.roomNumber})</td>
                      <td>{b.checkInDate} to {b.checkOutDate} ({b.numberOfNights}N)</td>
                      <td><strong>₹{b.totalAmount?.toLocaleString('en-IN')}</strong></td>
                      <td>
                        <span className={`badge ${b.bookingStatus === 'CONFIRMED' ? 'badge-success' : 'badge-danger'}`}>
                          {b.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: REGISTERED USERS */}
        {activeTab === 'users' && (
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.25rem' }}>
              Registered User Accounts
            </h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email Address</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Registered On</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td><strong>#{u.id}</strong></td>
                      <td><strong>{u.name}</strong></td>
                      <td>{u.email}</td>
                      <td>{u.phone || 'N/A'}</td>
                      <td>
                        <span className={`badge ${u.role === 'ADMIN' ? 'badge-dark' : 'badge-primary'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* HOTEL MODAL (ADD / EDIT) */}
        {hotelModalOpen && (
          <div className="modal-overlay" onClick={() => setHotelModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingHotel ? 'Edit Hotel Details' : 'Add New Property'}</h3>
                <button onClick={() => setHotelModalOpen(false)}>✕</button>
              </div>
              <form onSubmit={handleHotelFormSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Hotel Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={hotelForm.name}
                      onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      className="form-textarea"
                      value={hotelForm.description}
                      onChange={(e) => setHotelForm({ ...hotelForm, description: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={hotelForm.city}
                        onChange={(e) => setHotelForm({ ...hotelForm, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input
                        type="text"
                        className="form-input"
                        value={hotelForm.state}
                        onChange={(e) => setHotelForm({ ...hotelForm, state: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Address *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={hotelForm.address}
                      onChange={(e) => setHotelForm({ ...hotelForm, address: e.target.value })}
                      required
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label>Rating (1.0 - 5.0) *</label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        className="form-input"
                        value={hotelForm.rating}
                        onChange={(e) => setHotelForm({ ...hotelForm, rating: parseFloat(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Country</label>
                      <input
                        type="text"
                        className="form-input"
                        value={hotelForm.country}
                        onChange={(e) => setHotelForm({ ...hotelForm, country: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://..."
                      value={hotelForm.imageUrl}
                      onChange={(e) => setHotelForm({ ...hotelForm, imageUrl: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setHotelModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{editingHotel ? 'Save Changes' : 'Create Hotel'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ROOM MODAL (ADD / EDIT) */}
        {roomModalOpen && (
          <div className="modal-overlay" onClick={() => setRoomModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingRoom ? 'Edit Room' : 'Add Room to Hotel'}</h3>
                <button onClick={() => setRoomModalOpen(false)}>✕</button>
              </div>
              <form onSubmit={handleRoomFormSubmit}>
                <div className="modal-body">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label>Room Number *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. 101, 205, B-12"
                        value={roomForm.roomNumber}
                        onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Room Type *</label>
                      <select
                        className="form-select"
                        value={roomForm.roomType}
                        onChange={(e) => setRoomForm({ ...roomForm, roomType: e.target.value })}
                      >
                        <option value="STANDARD">STANDARD</option>
                        <option value="DELUXE">DELUXE</option>
                        <option value="SUITE">SUITE</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label>Price per Night (₹) *</label>
                      <input
                        type="number"
                        min="100"
                        className="form-input"
                        value={roomForm.pricePerNight}
                        onChange={(e) => setRoomForm({ ...roomForm, pricePerNight: parseFloat(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Max Guests Capacity *</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        className="form-input"
                        value={roomForm.capacity}
                        onChange={(e) => setRoomForm({ ...roomForm, capacity: parseInt(e.target.value, 10) })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      className="form-textarea"
                      placeholder="Room features, bed size, view..."
                      value={roomForm.description}
                      onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      id="roomAvail"
                      checked={roomForm.available}
                      onChange={(e) => setRoomForm({ ...roomForm, available: e.target.checked })}
                    />
                    <label htmlFor="roomAvail" style={{ cursor: 'pointer' }}>Available for Booking</label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setRoomModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{editingRoom ? 'Update Room' : 'Add Room'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
