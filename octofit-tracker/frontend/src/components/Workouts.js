import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', order: 'asc' });

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const sortWorkouts = (data, key, order) => {
    return [...data].sort((a, b) => {
      let aVal = a[key] || 0;
      let bVal = b[key] || 0;
      
      if (key === 'exercises') {
        aVal = Array.isArray(a.exercises) ? a.exercises.length : 0;
        bVal = Array.isArray(b.exercises) ? b.exercises.length : 0;
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

  const fetchWorkouts = () => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;
    console.log('Workouts API Endpoint:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Workouts - Fetched data:', data);
        // Handle both paginated (.results) and plain array responses
        const workoutsData = data.results || data;
        console.log('Workouts - Processed data:', workoutsData);
        const sortedData = sortWorkouts(Array.isArray(workoutsData) ? workoutsData : [], 'name', 'asc');
        setWorkouts(sortedData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Workouts - Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      });
  };

  const handleSort = (key) => {
    const newOrder = sortConfig.key === key && sortConfig.order === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, order: newOrder });
    setWorkouts(sortWorkouts(workouts, key, newOrder));
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key === columnKey) {
      return sortConfig.order === 'asc' ? ' ▲' : ' ▼';
    }
    return '';
  };

  if (loading) return <div className="container mt-4"><p>Loading workouts...</p></div>;
  if (error) return <div className="container mt-4"><p className="text-danger">Error: {error}</p></div>;

  return (
    <div className="container mt-4">
      <h2>Workouts</h2>
      <div className="mb-3">
        <button 
          className="btn btn-sm btn-outline-primary me-2"
          onClick={() => handleSort('name')}
        >
          Sort by Name {getSortIcon('name')}
        </button>
        <button 
          className="btn btn-sm btn-outline-primary me-2"
          onClick={() => handleSort('difficulty')}
        >
          Sort by Difficulty {getSortIcon('difficulty')}
        </button>
        <button 
          className="btn btn-sm btn-outline-primary me-2"
          onClick={() => handleSort('duration')}
        >
          Sort by Duration {getSortIcon('duration')}
        </button>
        <button 
          className="btn btn-sm btn-outline-primary"
          onClick={() => handleSort('calories_estimate')}
        >
          Sort by Calories {getSortIcon('calories_estimate')}
        </button>
      </div>
      <div className="row">
        {workouts.length > 0 ? (
          workouts.map(workout => (
            <div key={workout.id || workout._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{workout.name || 'Unnamed Workout'}</h5>
                  <p className="card-text">{workout.description || 'No description available'}</p>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <strong>Duration:</strong> {workout.duration || 0} minutes
                    </li>
                    <li className="list-group-item">
                      <strong>Difficulty:</strong> {workout.difficulty || 'N/A'}
                    </li>
                    <li className="list-group-item">
                      <strong>Calories:</strong> {workout.calories_estimate || 0}
                    </li>
                    <li className="list-group-item">
                      <strong>Exercises:</strong> {workout.exercises ? (Array.isArray(workout.exercises) ? workout.exercises.length : 0) : 0}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-center">No workouts found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Workouts;
