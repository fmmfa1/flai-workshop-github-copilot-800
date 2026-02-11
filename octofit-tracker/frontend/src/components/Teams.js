import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', order: 'asc' });
  const [showModal, setShowModal] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', description: '' });
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    fetchTeams();
  }, []);

  const sortTeams = (data, key, order) => {
    return [...data].sort((a, b) => {
      let aVal = a[key] || '';
      let bVal = b[key] || '';
      
      if (key === 'members') {
        aVal = Array.isArray(a.members) ? a.members.length : 0;
        bVal = Array.isArray(b.members) ? b.members.length : 0;
        return order === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
        return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      
      return order === 'asc' ? aVal - bVal : bVal - aVal;
    });
  };

  const fetchTeams = () => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;
    console.log('Teams API Endpoint:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Teams - Fetched data:', data);
        // Handle both paginated (.results) and plain array responses
        const teamsData = data.results || data;
        console.log('Teams - Processed data:', teamsData);
        const sortedData = sortTeams(Array.isArray(teamsData) ? teamsData : [], 'name', 'asc');
        setTeams(sortedData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Teams - Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      });
  };

  const handleSort = (key) => {
    const newOrder = sortConfig.key === key && sortConfig.order === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, order: newOrder });
    setTeams(sortTeams(teams, key, newOrder));
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key === columnKey) {
      return sortConfig.order === 'asc' ? ' ▲' : ' ▼';
    }
    return '';
  };

  const handleOpenModal = () => {
    setNewTeam({ name: '', description: '' });
    setSaveMessage('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewTeam({ name: '', description: '' });
    setSaveMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeam(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateTeam = () => {
    if (!newTeam.name.trim()) {
      setSaveMessage('Error: Team name is required');
      return;
    }

    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newTeam.name,
        description: newTeam.description,
        members: []
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to create team');
        }
        return response.json();
      })
      .then(data => {
        setSaveMessage('Team created successfully!');
        setTimeout(() => {
          handleCloseModal();
          fetchTeams(); // Refresh the teams list
        }, 1500);
      })
      .catch(error => {
        console.error('Error creating team:', error);
        setSaveMessage('Error: Failed to create team');
      });
  };

  if (loading) return <div className="container mt-4"><p>Loading teams...</p></div>;
  if (error) return <div className="container mt-4"><p className="text-danger">Error: {error}</p></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Teams</h2>
        <button 
          className="btn btn-success"
          onClick={handleOpenModal}
        >
          ➕ Add New Team
        </button>
      </div>
      
      <div className="mb-3">
        <button 
          className="btn btn-sm btn-outline-primary me-2"
          onClick={() => handleSort('name')}
        >
          Sort by Name {getSortIcon('name')}
        </button>
        <button 
          className="btn btn-sm btn-outline-primary"
          onClick={() => handleSort('members')}
        >
          Sort by Members {getSortIcon('members')}
        </button>
      </div>
      <div className="row">
        {teams.length > 0 ? (
          teams.map(team => (
            <div key={team.id || team._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{team.name}</h5>
                  <p className="card-text">{team.description}</p>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <strong>Members:</strong> {team.members ? (Array.isArray(team.members) ? team.members.length : 0) : 0}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-center">No teams found</p>
          </div>
        )}
      </div>

      {/* Add New Team Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Team</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                {saveMessage && (
                  <div className={`alert ${saveMessage.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
                    {saveMessage}
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label">Team Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={newTeam.name}
                    onChange={handleInputChange}
                    placeholder="Enter team name"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={newTeam.description}
                    onChange={handleInputChange}
                    placeholder="Enter team description"
                    rows="3"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="button" className="btn btn-success" onClick={handleCreateTeam}>
                  Create Team
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Teams;
