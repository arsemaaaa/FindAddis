import { useContext, useEffect, useCallback, useState } from "react";
import UserProfile from "../components/user/UserProfile";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";

function UserProfilePage() {
  const { user, token, isAdmin, isOwner, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Owner State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', menu: '', category: '', price: '', address: '' });
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);
  const [myRestaurant, setMyRestaurant] = useState(null);

  const [pendingRestaurants, setPendingRestaurants] = useState([]);
  const [requests, setRequests] = useState([]);

  const [isNotFound, setIsNotFound] = useState(false);

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const fetchAdminData = useCallback(() => {
    if (isAdmin() && token) {
      axios.get('http://localhost:5000/api/requests', config)
        .then(res => setRequests(res.data))
        .catch(err => setError("Error fetching requests: " + err.message));
    }
  }, [isAdmin, token]);

  const fetchOwnerData = useCallback(() => {
    if (isOwner() && user?.managedRestaurantId && token) {
      setIsNotFound(false);
      axios.get(`http://localhost:5000/api/restaurants/${user.managedRestaurantId}`, config)
        .then(res => {
          setMyRestaurant(res.data);
          setFormData({
            name: res.data.name,
            description: res.data.description || '',
            menu: Array.isArray(res.data.menu) ? res.data.menu.join(', ') : '',
            category: res.data.category,
            price: res.data.price,
            address: res.data.address
          });
        })
        .catch(err => {
          if (err.response?.status === 404) {
            setIsNotFound(true);
            setError(null);
          } else {
            setError("Error fetching restaurant details: " + err.message);
          }
        });
    }
  }, [isOwner, user?.managedRestaurantId, token]);

  useEffect(() => {
    if (user) {
      if (isAdmin()) fetchAdminData();
      if (isOwner()) fetchOwnerData();
    }
  }, [user, isAdmin, isOwner, fetchAdminData, fetchOwnerData]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  function clearFeedback() {
    setMsg(null);
    setError(null);
  }

  const handleApproveRequest = (id) => {
    clearFeedback();
    axios.post(`http://localhost:5000/api/requests/${id}/approve`, {}, config)
      .then(() => {
        setMsg("Request approved!");
        fetchAdminData();
      })
      .catch(err => setError(err.response?.data?.message || "Error approving"));
  };

  const handleRejectRequest = (id) => {
    clearFeedback();
    axios.post(`http://localhost:5000/api/requests/${id}/reject`, {}, config)
      .then(() => {
        setMsg("Request rejected.");
        fetchAdminData();
      })
      .catch(err => setError(err.response?.data?.message || "Error rejecting"));
  };

  const handleApproveRestaurant = (id) => {
    clearFeedback();
    axios.put(`http://localhost:5000/api/restaurants/${id}/approve`, {}, config)
      .then(() => {
        setMsg("Restaurant approved!");
        fetchAdminData();
      })
      .catch(err => setError(err.response?.data?.message || "Error approving"));
  };

  const handleRejectRestaurant = (id) => {
    clearFeedback();
    axios.delete(`http://localhost:5000/api/restaurants/${id}`, config)
      .then(() => {
        setMsg("Restaurant rejected/removed.");
        fetchAdminData();
      })
      .catch(err => setError(err.response?.data?.message || "Error rejecting"));
  };

  const submitUpdate = (e) => {
    e.preventDefault();
    clearFeedback();
    const payload = {
      type: 'UPDATE',
      target: user.managedRestaurantId,
      data: {
        ...formData,
        menu: typeof formData.menu === 'string' ? formData.menu.split(',').map(s => s.trim()) : formData.menu
      }
    };

    axios.post('http://localhost:5000/api/requests', payload, config)
      .then(() => {
        setMsg("Update request submitted for approval.");
        setIsEditing(false);
      })
      .catch(err => setError("Error submitting request: " + err.message));
  };

  const submitCreation = (e) => {
    e.preventDefault();
    clearFeedback();
    const payload = {
      type: 'CREATE',
      data: {
        ...formData,
        menu: typeof formData.menu === 'string' ? formData.menu.split(',').map(s => s.trim()) : []
      }
    };

    axios.post('http://localhost:5000/api/requests', payload, config)
      .then(() => {
        setMsg("Registration request submitted! Please wait for admin approval.");
        setIsEditing(false);
        // We don't reload anymore, just show the message and let the UI state handle what it can, 
        // OR we can reload to refresh managedRestaurantId if the backend had a different logic,
        // but here it only gets linked AFTER approval.
      })
      .catch(err => setError(err.response?.data?.message || "Error submitting registration"));
  };

  if (!user) return <div className="container"><h2>Please log in to view your profile.</h2></div>;

  return (
    <div className="profile-page container">
      <div className="profile-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title">Dashboard</h1>
        <button className="button button-outline" onClick={handleLogout}>Log Out</button>
      </div>

      <UserProfile user={user} />

      {error && <div className="alert-error" style={{ padding: '1rem', background: '#ffebee', color: '#c62828', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ef9a9a' }}>{error}</div>}
      {msg && <div className="alert-box" style={{ padding: '1rem', background: '#e0f7fa', color: '#006064', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #b2ebf2' }}>{msg}</div>}

      {isAdmin() && (
        <section className="admin-dashboard" style={{ marginTop: '2rem' }}>
          <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>Admin Dashboard</h2>

          <h3 style={{ marginTop: '1.5rem' }}>Pending Requests ({requests.length})</h3>
          {requests.length === 0 ? (
            <p className="muted">No pending requests.</p>
          ) : (
            <div className="requests-list" style={{ display: 'grid', gap: '1rem' }}>
              {requests.map(req => (
                <div key={req._id} className="request-card" style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', background: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>{req.type} Request</strong>
                    <span className="muted">{new Date(req.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p><strong>User:</strong> {req.userId?.name} ({req.userId?.email})</p>
                  {req.type !== 'CREATE' && <p><strong>Target ID:</strong> {req.target}</p>}
                  <pre style={{ background: '#f5f5f5', padding: '0.5rem', fontSize: '0.85em', overflow: 'auto' }}>
                    {JSON.stringify(req.data, null, 2)}
                  </pre>
                  <div className="request-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button className="button button-primary" onClick={() => handleApproveRequest(req._id)} style={{ background: '#4caf50', borderColor: '#4caf50' }}>Approve</button>
                    <button className="button button-outline" onClick={() => handleRejectRequest(req._id)} style={{ color: '#f44336', borderColor: '#f44336' }}>Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {isOwner() && (
        <section className="owner-dashboard" style={{ marginTop: '2rem' }}>
          <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>My Restaurant</h2>

          {!user.managedRestaurantId && !isEditing ? (
            <div style={{ marginTop: '1rem' }}>
              <p>You haven't listed a restaurant yet.</p>
              <button className="button button-primary" onClick={() => setIsEditing(true)}>Register Restaurant</button>
            </div>
          ) : !isEditing ? (
            <div style={{ marginTop: '1rem' }}>
              <p><strong>Managed Restaurant ID:</strong> {user.managedRestaurantId}</p>

              <div style={{ background: myRestaurant?.isApproved ? '#e8f5e9' : '#fff3e0', padding: '1rem', marginTop: '1rem', borderRadius: '8px', border: `1px solid ${myRestaurant?.isApproved ? '#4caf50' : '#ff9800'}` }}>
                {myRestaurant ? (
                  myRestaurant.isApproved ? (
                    <p style={{ color: '#2e7d32' }}><strong>✅ Request Approved</strong><br />Your restaurant is live and visible to users.</p>
                  ) : (
                    <p style={{ color: '#ef6c00' }}><strong>⏳ Registration Waiting for Approval</strong><br />Your restaurant is currently pending. Once an admin approves it, it will be visible.</p>
                  )
                ) : isNotFound ? (
                  <div style={{ color: '#c62828' }}>
                    <p><strong>⚠️ Restaurant Not Found</strong></p>
                    <p>It seems your restaurant registration was removed or the database was reset. You may need to register again.</p>
                    <button className="button button-outline" style={{ marginTop: '0.5rem', fontSize: '0.8em' }} onClick={() => { setIsNotFound(false); setIsEditing(true); }}>Register New Restaurant</button>
                  </div>
                ) : (
                  <p>Loading status...</p>
                )}
              </div>

              {!isNotFound && (
                <button className="button button-primary" style={{ marginTop: '1rem' }} onClick={() => setIsEditing(true)}>Edit Details</button>
              )}
              <p className="muted" style={{ marginTop: '0.5rem', fontSize: '0.9em' }}>* Updates require admin approval before going live.</p>
            </div>
          ) : (
            <form onSubmit={(user.managedRestaurantId && !isNotFound) ? submitUpdate : submitCreation} style={{ maxWidth: '500px', marginTop: '1rem' }}>
              <h3>{(user.managedRestaurantId && !isNotFound) ? 'Edit Restaurant' : 'Register New Restaurant'}</h3>

              <div className="form-group">
                <label>Restaurant Name</label>
                <input className="input-field" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select className="input-field" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required>
                  <option value="">Select Category</option>
                  <option value="Ethiopian">Ethiopian</option>
                  <option value="Italian">Italian</option>
                  <option value="Cafe">Cafe</option>
                  <option value="Fast Food">Fast Food</option>
                </select>
              </div>

              <div className="form-group">
                <label>Price Range</label>
                <select className="input-field" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required>
                  <option value="">Select Price</option>
                  <option value="$">$</option>
                  <option value="$$">$$</option>
                  <option value="$$$">$$$</option>
                </select>
              </div>

              <div className="form-group">
                <label>Address</label>
                <input className="input-field" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} required />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea className="input-field" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Menu Items (comma separated)</label>
                <input className="input-field" value={formData.menu} onChange={e => setFormData({ ...formData, menu: e.target.value })} placeholder="Burger, Pizza, Coke" />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="button button-primary">Submit {user.managedRestaurantId ? 'Update' : 'Registration'}</button>
                <button type="button" className="button button-outline" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </form>
          )}
        </section>
      )}

      {!isAdmin() && !isOwner() && (
        <section className="profile-section" style={{ marginTop: '2rem' }}>
          <h3>My Favorites</h3>
          {/* Reuse Favorite Logic or Component later */}
          <p className="muted">Visit the favorites page to manage your list.</p>
        </section>
      )}
    </div>
  );
}

export default UserProfilePage;
