import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', order: 'asc' });

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

  if (loading) return <div className="container mt-4"><p>Loading teams...</p></div>;
  if (error) return <div className="container mt-4"><p className="text-danger">Error: {error}</p></div>;

  return (
    <div className="container mt-4">
      <h2>Teams</h2>
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
    </div>
  );
}

export default Teams;
