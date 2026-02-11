import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', team: '' });
  const [saveMessage, setSaveMessage] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', order: 'asc' });
  const [teamFilter, setTeamFilter] = useState('all');
  const [availableTeams, setAvailableTeams] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const sortUsers = (data, key, order) => {
    return [...data].sort((a, b) => {
      let aVal = a[key] || '';
      let bVal = b[key] || '';
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
        return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      
      return order === 'asc' ? aVal - bVal : bVal - aVal;
    });
  };

  const fetchUsers = () => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;
    console.log('Users API Endpoint:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Users - Fetched data:', data);
        // Handle both paginated (.results) and plain array responses
        const usersData = data.results || data;
        console.log('Users - Processed data:', usersData);
        const sortedData = sortUsers(Array.isArray(usersData) ? usersData : [], 'name', 'asc');
        setUsers(sortedData);
        setFilteredUsers(sortedData);
        
        // Extract unique teams
        const teams = [...new Set(sortedData.map(u => u.team).filter(Boolean))];
        setAvailableTeams(teams);
        
        setLoading(false);
      })
      .catch(error => {
        console.error('Users - Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      team: user.team || ''
    });
    setSaveMessage('');
  };

  const handleCancel = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', team: '' });
    setSaveMessage('');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSort = (key) => {
    const newOrder = sortConfig.key === key && sortConfig.order === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, order: newOrder });
    const sorted = sortUsers(users, key, newOrder);
    setUsers(sorted);
    applyFilter(sorted, teamFilter);
  };

  const applyFilter = (data, team) => {
    if (team === 'all') {
      setFilteredUsers(data);
    } else {
      setFilteredUsers(data.filter(user => user.team === team));
    }
  };

  const handleTeamFilter = (e) => {
    const team = e.target.value;
    setTeamFilter(team);
    applyFilter(users, team);
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key === columnKey) {
      return sortConfig.order === 'asc' ? ' ▲' : ' ▼';
    }
    return '';
  };

  const handleSave = async () => {
    const userId = editingUser.id || editingUser._id;
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/${userId}/`;
    
    console.log('Updating user:', userId, formData);

    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const updatedUser = await response.json();
      console.log('User updated successfully:', updatedUser);

      // Update the users list with the new data
      setUsers(users.map(user => 
        (user.id || user._id) === userId ? { ...user, ...formData } : user
      ));

      setSaveMessage('User updated successfully!');
      setTimeout(() => {
        setEditingUser(null);
        setSaveMessage('');
      }, 2000);

    } catch (error) {
      console.error('Error updating user:', error);
      setSaveMessage('Error updating user. Please try again.');
    }
  };

  if (loading) return <div className="container mt-4"><p>Loading users...</p></div>;
  if (error) return <div className="container mt-4"><p className="text-danger">Error: {error}</p></div>;

  return (
    <div className="container mt-4">
      <h2>Users</h2>
      
      {saveMessage && (
        <div className={`alert ${saveMessage.includes('Error') ? 'alert-danger' : 'alert-success'} mt-3`}>
          {saveMessage}
        </div>
      )}

      {/* Filter Section */}
      <div className="mb-3">
        <label className="form-label fw-bold">Filter by Team:</label>
        <select className="form-select" value={teamFilter} onChange={handleTeamFilter} style={{ maxWidth: '300px' }}>
          <option value="all">All Teams</option>
          {availableTeams.map(team => (
            <option key={team} value={team}>{team}</option>
          ))}
        </select>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th 
                onClick={() => handleSort('name')}
                style={{ cursor: 'pointer', userSelect: 'none' }}
                title="Click to sort"
              >
                Name{getSortIcon('name')}
              </th>
              <th 
                onClick={() => handleSort('email')}
                style={{ cursor: 'pointer', userSelect: 'none' }}
                title="Click to sort"
              >
                Email{getSortIcon('email')}
              </th>
              <th 
                onClick={() => handleSort('team')}
                style={{ cursor: 'pointer', userSelect: 'none' }}
                title="Click to sort"
              >
                Team{getSortIcon('team')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.id || user._id}>
                  <td>{user.id || user._id || 'N/A'}</td>
                  <td>{user.name || 'N/A'}</td>
                  <td>{user.email || 'N/A'}</td>
                  <td>{user.team || 'N/A'}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={() => handleEdit(user)}
                    >
                      ✏️ Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button type="button" className="btn-close" onClick={handleCancel}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Team</label>
                  <input
                    type="text"
                    className="form-control"
                    name="team"
                    value={formData.team}
                    onChange={handleChange}
                    placeholder="Enter team name"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
