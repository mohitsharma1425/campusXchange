import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Package, BarChart3, Shield, Eye, Edit, Trash2,
  CheckCircle, XCircle, Search, Filter, ChevronLeft,
  ChevronRight, UserCheck, UserX, TrendingUp, Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { apiUrl, authHeaders } from '../lib/api';

const AdminDashboard = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const canManageUsers = user?.role === 'admin';
  const canModerateListings = user?.role === 'admin' || user?.role === 'moderator';
  const currentUserId = user?.id;

  useEffect(() => {
    if (!user || !canModerateListings) {
      navigate('/');
      return;
    }

    if (!canManageUsers && activeTab !== 'listings') {
      setActiveTab('listings');
      loadListings().finally(() => setLoading(false));
      return;
    }

    loadDashboard();
  }, [user, navigate, activeTab]);

  const loadDashboard = async () => {
    try {
      if (canManageUsers) {
        const statsResponse = await fetch(apiUrl('/admin/stats'), {
          headers: authHeaders(),
        });
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      if (activeTab === 'users') {
        await loadUsers();
      } else if (activeTab === 'listings') {
        await loadListings();
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async (page = 1, search = '') => {
    try {
      const response = await fetch(apiUrl(`/admin/users?page=${page}&limit=20&search=${search}`), {
        headers: authHeaders(),
      });
      const data = await response.json();
      setUsers(data.users);
      setCurrentPage(data.pagination.page);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadListings = async (page = 1, search = '') => {
    try {
      const response = await fetch(apiUrl(`/admin/listings?page=${page}&limit=20&search=${search}`), {
        headers: authHeaders(),
      });
      const data = await response.json();
      setListings(data.listings);
      setCurrentPage(data.pagination.page);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error('Error loading listings:', error);
    }
  };

  const handleTabChange = (tab) => {
    if ((tab === 'dashboard' || tab === 'users') && !canManageUsers) return;

    setActiveTab(tab);
    setCurrentPage(1);
    setSearchTerm('');

    if (tab === 'users') {
      loadUsers();
    } else if (tab === 'listings') {
      loadListings();
    }
  };

  const handleUserAction = async (userId, action, value) => {
    try {
      const response = await fetch(apiUrl(`/admin/users/${userId}`), {
        method: 'PUT',
        headers: authHeaders({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ [action]: value })
      });

      if (response.ok) {
        loadUsers(currentPage, searchTerm);
        alert(`${action} updated successfully`);
      } else {
        const data = await response.json().catch(() => ({}));
        alert(data.error || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    }
  };

  const handleListingAction = async (listingId, action, value) => {
    try {
      const response = await fetch(apiUrl(`/admin/listings/${listingId}`), {
        method: 'PUT',
        headers: authHeaders({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ [action]: value })
      });

      if (response.ok) {
        loadListings(currentPage, searchTerm);
        alert(`${action} updated successfully`);
      } else {
        const data = await response.json().catch(() => ({}));
        alert(data.error || 'Failed to update listing');
      }
    } catch (error) {
      console.error('Error updating listing:', error);
      alert('Error updating listing');
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      const response = await fetch(apiUrl(`/admin/${type}s/${id}`), {
        method: 'DELETE',
        headers: authHeaders(),
      });

      if (response.ok) {
        if (type === 'user') {
          loadUsers(currentPage, searchTerm);
        } else {
          loadListings(currentPage, searchTerm);
        }
        alert(`${type} deleted successfully`);
      } else {
        const data = await response.json().catch(() => ({}));
        alert(data.error || `Failed to delete ${type}`);
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      alert(`Error deleting ${type}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">
                  {canManageUsers ? 'Manage CampusXchange platform' : 'Moderate CampusXchange listings'}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              ← Back to Site
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              ...(canManageUsers ? [
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { id: 'users', label: 'Users', icon: Users },
              ] : []),
              { id: 'listings', label: 'Listings', icon: Package },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center px-1 py-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard */}
        {canManageUsers && activeTab === 'dashboard' && stats && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.stats.totalUsers}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <UserCheck className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.stats.activeUsers}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <Package className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Listings</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.stats.totalListings}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <Activity className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Listings</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.stats.activeListings}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Users */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Users</h3>
                <div className="space-y-3">
                  {stats.recent.users.map((user) => (
                    <div key={user._id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Listings */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Listings</h3>
                <div className="space-y-3">
                  {stats.recent.listings.map((listing) => (
                    <div key={listing._id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="w-8 h-8 rounded object-cover"
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 truncate max-w-48">
                            {listing.title}
                          </p>
                          <p className="text-xs text-gray-500">{listing.seller.name}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Management */}
        {canManageUsers && activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">User Management</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        loadUsers(1, e.target.value);
                      }}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.role}
                          onChange={(e) => handleUserAction(user._id, 'role', e.target.value)}
                          disabled={user._id === currentUserId}
                          className="text-xs font-semibold rounded-md border border-gray-300 px-2 py-1 bg-white"
                        >
                          <option value="student">student</option>
                          <option value="moderator">moderator</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleUserAction(user._id, 'isActive', !user.isActive)}
                          disabled={user._id === currentUserId}
                          className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                            user.isActive
                              ? 'bg-red-100 text-red-800 hover:bg-red-200'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {user.isActive ? <UserX className="w-3 h-3 mr-1" /> : <UserCheck className="w-3 h-3 mr-1" />}
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleUserAction(user._id, 'isVerified', !user.isVerified)}
                          className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                            user.isVerified
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          }`}
                        >
                          {user.isVerified ? 'Unverify' : 'Verify'}
                        </button>
                        <button
                          onClick={() => handleDelete('user', user._id)}
                          disabled={user._id === currentUserId}
                          className="inline-flex items-center px-2 py-1 rounded text-xs bg-red-100 text-red-800 hover:bg-red-200"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-3 border-t flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => loadUsers(currentPage - 1, searchTerm)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => loadUsers(currentPage + 1, searchTerm)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Listings Management */}
        {activeTab === 'listings' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Listing Management</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search listings..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        loadListings(1, e.target.value);
                      }}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Listing
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Seller
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {listings.map((listing) => (
                    <tr key={listing._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={listing.image}
                            alt={listing.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{listing.title}</div>
                            <div className="text-sm text-gray-500">{listing.categoryLabel}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{listing.seller.name}</div>
                        <div className="text-sm text-gray-500">{listing.seller.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          listing.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : listing.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {listing.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{listing.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleListingAction(listing._id, 'status',
                            listing.status === 'active' ? 'inactive' : 'active')}
                          className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                            listing.status === 'active'
                              ? 'bg-red-100 text-red-800 hover:bg-red-200'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {listing.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete('listing', listing._id)}
                          className="inline-flex items-center px-2 py-1 rounded text-xs bg-red-100 text-red-800 hover:bg-red-200"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-3 border-t flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => loadListings(currentPage - 1, searchTerm)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => loadListings(currentPage + 1, searchTerm)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
