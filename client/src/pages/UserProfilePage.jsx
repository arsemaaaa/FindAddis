import React from "react";
import { useContext } from "react";
import UserProfile from "../components/user/UserProfile";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";

function UserProfilePage() {
  const { user, isAdmin, isOwner, logout } = useContext(AuthContext);
  const [requests, setRequests] = React.useState([]);

  // Owner State
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({ name: '', description: '', menu: '' });
  const [msg, setMsg] = React.useState(null);

  // Admin: Fetch pending requests
  /* React.useEffect(() => {
    if (isAdmin()) {
      fetchRequests();
    }
  }, [user]); */

  function fetchRequests() {
    axios.get('http://localhost:3000/api/requests')
      .then(res => setRequests(res.data))
      .catch(err => console.error("Failed to fetch requests", err));
  }

  function handleApprove(id) {
    axios.post(`http://localhost:3000/api/requests/${id}/approve`)
      .then(() => {
        alert("Request approved!");
        fetchRequests();
      })
      .catch(err => alert(err.response?.data?.message || "Error approving"));
  }

  function handleReject(id) {
    axios.post(`http://localhost:3000/api/requests/${id}/reject`)
      .then(() => {
        alert("Request rejected.");
        fetchRequests();
      })
      .catch(err => alert(err.response?.data?.message || "Error rejecting"));
  }

  function submitUpdate(e) {
    e.preventDefault();
    const payload = {
      type: 'update', // or create, if new
      targetRestaurantId: user.managedRestaurantId,
      data: {
        ...formData,
        menu: formData.menu.split(',').map(s => s.trim()) // simple CSV parsing
      }
    };

    axios.post('http://localhost:000/api/requests', payload)
      .then(() => {
        setMsg("Update request submitted for approval.");
        setIsEditing(false);
      })
      .catch(err => setMsg("Error submitting request: " + err.message));
  }
  const navigate = useNavigate();
  if (!user) return <div className="container"><h2>Please log in to view your profile.</h2></div>;

  return (
    <div className="profile-page container">
      <div className="profile-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="title">Profile</h1>
        {
          user.role === "owner" &&
          <div>
            <Button onClick={() => navigate("/OwnerDashboard")}>Go to your dashboard</Button>
          </div>
        }
        <button className="button button-outline" onClick={logout}>Log Out</button>


      </div>


      <UserProfile user={user} />

      {msg && <div className="alert-box" style={{ padding: '1rem', background: '#e0f7fa', color: '#006064', marginBottom: '1rem', borderRadius: '4px' }}>{msg}</div>}

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
                    <strong>{req.type.toUpperCase()} Request</strong>
                    <span className="muted">{new Date(req.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p><strong>User:</strong> {req.userId?.name} ({req.userId?.email})</p>
                  <p><strong>Target:</strong> {req.targetRestaurantId}</p>
                  <pre style={{ background: '#f5f5f5', padding: '0.5rem', fontSize: '0.85em' }}>
                    {JSON.stringify(req.data, null, 2)}
                  </pre>
                  <div className="request-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button className="button button-primary" onClick={() => handleApprove(req._id)} style={{ background: '#4caf50', borderColor: '#4caf50' }}>Approve</button>
                    <button className="button button-outline" onClick={() => handleReject(req._id)} style={{ color: '#f44336', borderColor: '#f44336' }}>Reject</button>
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

          {!isEditing ? (
            <div style={{ marginTop: '1rem' }}>
              <p><strong>Managed Restaurant ID:</strong> {user.managedRestaurantId || "None Assigned"}</p>
              {user.managedRestaurantId && (
                <button className="button button-primary" onClick={() => setIsEditing(true)}>Edit Details</button>
              )}
              <p className="muted" style={{ marginTop: '0.5rem', fontSize: '0.9em' }}>* Updates require admin approval before going live.</p>
            </div>
          ) : (
            <form onSubmit={submitUpdate} style={{ maxWidth: '500px', marginTop: '1rem' }}>
              <div className="form-group">
                <label>Restaurant Name</label>
                <input className="input-field" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
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
                <button type="submit" className="button button-primary">Submit for Approval</button>
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
