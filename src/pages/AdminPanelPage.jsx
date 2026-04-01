import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import BookingCard from '../components/BookingCard';
import adminService from '../services/adminService';

/**
 * Admin panel for managing parking lots, slots, bookings, and users.
 * Features tabbed navigation between management sections.
 */
export default function AdminPanelPage() {
  const [activeTab, setActiveTab] = useState('lots');
  const [lots, setLots] = useState([]);
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Forms
  const [lotForm, setLotForm] = useState({ name: '', location: '' });
  const [slotForm, setSlotForm] = useState({ slotNumber: '', parkingLotId: '', status: 'AVAILABLE' });
  const [editingLot, setEditingLot] = useState(null);
  const [editingSlot, setEditingSlot] = useState(null);
  const [showLotForm, setShowLotForm] = useState(false);
  const [showSlotForm, setShowSlotForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [lotsData, slotsData, bookingsData, usersData] = await Promise.all([
        adminService.getLots(),
        adminService.getSlots(),
        adminService.getAllBookings(),
        adminService.getUsers(),
      ]);
      setLots(lotsData);
      setSlots(slotsData);
      setBookings(bookingsData);
      setUsers(usersData);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load data' });
    } finally {
      setLoading(false);
    }
  };

  // === Lot CRUD ===
  const handleLotSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLot) {
        await adminService.updateLot(editingLot.id, lotForm);
        setMessage({ type: 'success', text: 'Lot updated successfully' });
      } else {
        await adminService.createLot(lotForm);
        setMessage({ type: 'success', text: 'Lot created successfully' });
      }
      setLotForm({ name: '', location: '' });
      setEditingLot(null);
      setShowLotForm(false);
      loadData();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Operation failed' });
    }
  };

  const editLot = (lot) => {
    setEditingLot(lot);
    setLotForm({ name: lot.name, location: lot.location });
    setShowLotForm(true);
  };

  const deleteLot = async (id) => {
    if (!window.confirm('Delete this parking lot?')) return;
    try {
      await adminService.deleteLot(id);
      setMessage({ type: 'success', text: 'Lot deleted' });
      loadData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete lot' });
    }
  };

  // === Slot CRUD ===
  const handleSlotSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...slotForm, parkingLotId: Number(slotForm.parkingLotId) };
      if (editingSlot) {
        await adminService.updateSlot(editingSlot.id, data);
        setMessage({ type: 'success', text: 'Slot updated successfully' });
      } else {
        await adminService.createSlot(data);
        setMessage({ type: 'success', text: 'Slot created successfully' });
      }
      setSlotForm({ slotNumber: '', parkingLotId: '', status: 'AVAILABLE' });
      setEditingSlot(null);
      setShowSlotForm(false);
      loadData();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Operation failed' });
    }
  };

  const editSlot = (slot) => {
    setEditingSlot(slot);
    setSlotForm({
      slotNumber: slot.slotNumber,
      parkingLotId: slot.parkingLot?.id?.toString() || '',
      status: slot.status,
    });
    setShowSlotForm(true);
  };

  const deleteSlot = async (id) => {
    if (!window.confirm('Delete this parking slot?')) return;
    try {
      await adminService.deleteSlot(id);
      setMessage({ type: 'success', text: 'Slot deleted' });
      loadData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete slot' });
    }
  };

  // === User management ===
  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await adminService.deleteUser(id);
      setMessage({ type: 'success', text: 'User deleted' });
      loadData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete user' });
    }
  };

  const tabs = [
    { id: 'lots', label: '🏗️ Parking Lots', count: lots.length },
    { id: 'slots', label: '🅿️ Slots', count: slots.length },
    { id: 'bookings', label: '📋 Bookings', count: bookings.length },
    { id: 'users', label: '👥 Users', count: users.length },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50">
        <Navbar />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-surface-900">Admin Panel</h1>
          <p className="text-surface-700 mt-1">Manage your parking infrastructure</p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-medium animate-slide-up ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all-smooth ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-surface-700 hover:bg-primary-50 border border-gray-200'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* === LOTS TAB === */}
        {activeTab === 'lots' && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-surface-900">Parking Lots</h2>
              <button
                onClick={() => { setShowLotForm(!showLotForm); setEditingLot(null); setLotForm({ name: '', location: '' }); }}
                className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-800 transition-all-smooth shadow-md text-sm"
              >
                + Add Lot
              </button>
            </div>

            {showLotForm && (
              <form onSubmit={handleLotSubmit} className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 mb-6 animate-slide-up">
                <h3 className="font-semibold mb-4">{editingLot ? 'Edit Lot' : 'New Lot'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Lot name"
                    value={lotForm.name}
                    onChange={(e) => setLotForm({ ...lotForm, name: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={lotForm.location}
                    onChange={(e) => setLotForm({ ...lotForm, location: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                    required
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium text-sm">
                    {editingLot ? 'Update' : 'Create'}
                  </button>
                  <button type="button" onClick={() => { setShowLotForm(false); setEditingLot(null); }} className="px-6 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 font-medium text-sm">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lots.map((lot) => (
                <div key={lot.id} className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 hover:shadow-card-hover transition-all-smooth">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-surface-900">{lot.name}</h3>
                      <p className="text-sm text-surface-700 mt-1">📍 {lot.location}</p>
                      <p className="text-xs text-surface-700 mt-2">{lot.totalSlots || 0} slots</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => editLot(lot)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 text-sm">✏️</button>
                      <button onClick={() => deleteLot(lot.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600 text-sm">🗑️</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === SLOTS TAB === */}
        {activeTab === 'slots' && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-surface-900">Parking Slots</h2>
              <button
                onClick={() => { setShowSlotForm(!showSlotForm); setEditingSlot(null); setSlotForm({ slotNumber: '', parkingLotId: '', status: 'AVAILABLE' }); }}
                className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-800 transition-all-smooth shadow-md text-sm"
              >
                + Add Slot
              </button>
            </div>

            {showSlotForm && (
              <form onSubmit={handleSlotSubmit} className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 mb-6 animate-slide-up">
                <h3 className="font-semibold mb-4">{editingSlot ? 'Edit Slot' : 'New Slot'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Slot number (e.g. A01)"
                    value={slotForm.slotNumber}
                    onChange={(e) => setSlotForm({ ...slotForm, slotNumber: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                    required
                  />
                  <select
                    value={slotForm.parkingLotId}
                    onChange={(e) => setSlotForm({ ...slotForm, parkingLotId: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                    required
                  >
                    <option value="">Select Lot</option>
                    {lots.map(lot => (
                      <option key={lot.id} value={lot.id}>{lot.name}</option>
                    ))}
                  </select>
                  <select
                    value={slotForm.status}
                    onChange={(e) => setSlotForm({ ...slotForm, status: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="BOOKED">Booked</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>
                <div className="flex gap-2 mt-4">
                  <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium text-sm">
                    {editingSlot ? 'Update' : 'Create'}
                  </button>
                  <button type="button" onClick={() => { setShowSlotForm(false); setEditingSlot(null); }} className="px-6 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 font-medium text-sm">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-surface-700 uppercase">Slot</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-surface-700 uppercase">Lot</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-surface-700 uppercase">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-surface-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {slots.map((slot) => (
                      <tr key={slot.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium">{slot.slotNumber}</td>
                        <td className="px-6 py-4 text-sm text-surface-700">{slot.parkingLot?.name}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            slot.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700' :
                            slot.status === 'BOOKED' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {slot.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => editSlot(slot)} className="text-blue-600 hover:text-blue-800 mr-3 text-sm">Edit</button>
                          <button onClick={() => deleteSlot(slot.id)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* === BOOKINGS TAB === */}
        {activeTab === 'bookings' && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-surface-900 mb-4">All Bookings</h2>
            {bookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} showUser={true} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                <p className="text-surface-700">No bookings found</p>
              </div>
            )}
          </div>
        )}

        {/* === USERS TAB === */}
        {activeTab === 'users' && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-surface-900 mb-4">Users</h2>
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-surface-700 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-surface-700 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-surface-700 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-surface-700 uppercase">Role</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-surface-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm">{u.id}</td>
                        <td className="px-6 py-4 font-medium">{u.name}</td>
                        <td className="px-6 py-4 text-sm text-surface-700">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => deleteUser(u.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                            disabled={u.role === 'ADMIN'}
                          >
                            {u.role === 'ADMIN' ? '—' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
