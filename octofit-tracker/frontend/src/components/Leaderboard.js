import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [filteredLeaderboard, setFilteredLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'total_calories', order: 'desc' });
  const [teamFilter, setTeamFilter] = useState('all');
  const [availableTeams, setAvailableTeams] = useState([]);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;
    console.log('Leaderboard API Endpoint:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Leaderboard - Fetched data:', data);
        // Handle both paginated (.results) and plain array responses
        const leaderboardData = data.results || data;
        console.log('Leaderboard - Processed data:', leaderboardData);
        const sortedData = sortLeaderboard(Array.isArray(leaderboardData) ? leaderboardData : [], 'total_calories', 'desc');
        setLeaderboard(sortedData);
        setFilteredLeaderboard(sortedData);
        
        // Extract unique teams
        const teams = [...new Set(sortedData.map(l => l.team).filter(Boolean))];
        setAvailableTeams(teams);
        
        setLoading(false);
      })
      .catch(error => {
        console.error('Leaderboard - Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const sortLeaderboard = (data, key, order) => {
    return [...data].sort((a, b) => {
      let aVal = a[key] || a.total_points || 0;
      let bVal = b[key] || b.total_points || 0;
      
      if (key === 'rank') {
        aVal = a.rank || 0;
        bVal = b.rank || 0;
      } else if (key === 'user_name') {
        aVal = (a.user_name || a.user || '').toLowerCase();
        bVal = (b.user_name || b.user || '').toLowerCase();
        return order === 'desc' ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
      }
      
      return order === 'desc' ? bVal - aVal : aVal - bVal;
    });
  };

  const handleSort = (key) => {
    const newOrder = sortConfig.key === key && sortConfig.order === 'desc' ? 'asc' : 'desc';
    setSortConfig({ key, order: newOrder });
    const sorted = sortLeaderboard(leaderboard, key, newOrder);
    setLeaderboard(sorted);
    applyFilter(sorted, teamFilter);
  };

  const applyFilter = (data, team) => {
    if (team === 'all') {
      setFilteredLeaderboard(data);
    } else {
      setFilteredLeaderboard(data.filter(entry => entry.team === team));
    }
  };

  const handleTeamFilter = (e) => {
    const team = e.target.value;
    setTeamFilter(team);
    applyFilter(leaderboard, team);
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key === columnKey) {
      return sortConfig.order === 'desc' ? ' ▼' : ' ▲';
    }
    return '';
  };

  if (loading) return <div className="container mt-4"><p>Loading leaderboard...</p></div>;
  if (error) return <div className="container mt-4"><p className="text-danger">Error: {error}</p></div>;

  return (
    <div className="container mt-4">
      <h2>Leaderboard</h2>
      
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
              <th 
                onClick={() => handleSort('rank')}
                style={{ cursor: 'pointer', userSelect: 'none' }}
                title="Click to sort"
              >
                Rank{getSortIcon('rank')}
              </th>
              <th 
                onClick={() => handleSort('user_name')}
                style={{ cursor: 'pointer', userSelect: 'none' }}
                title="Click to sort"
              >
                User{getSortIcon('user_name')}
              </th>
              <th>Team</th>
              <th 
                onClick={() => handleSort('total_calories')}
                style={{ cursor: 'pointer', userSelect: 'none' }}
                title="Click to sort"
              >
                Total Calories{getSortIcon('total_calories')}
              </th>
              <th 
                onClick={() => handleSort('total_activities')}
                style={{ cursor: 'pointer', userSelect: 'none' }}
                title="Click to sort"
              >
                Total Activities{getSortIcon('total_activities')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaderboard.length > 0 ? (
              filteredLeaderboard.map((entry, index) => (
                <tr key={entry.id || entry._id || index}>
                  <td>{entry.rank || index + 1}</td>
                  <td>{entry.user_name || entry.user || 'N/A'}</td>
                  <td>{entry.team || 'N/A'}</td>
                  <td>{entry.total_calories || entry.total_points || 0}</td>
                  <td>{entry.total_activities || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No leaderboard data found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;
