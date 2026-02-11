import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' or 'asc'

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;
    console.log('Activities API Endpoint:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Activities - Fetched data:', data);
        // Handle both paginated (.results) and plain array responses
        const activitiesData = data.results || data;
        console.log('Activities - Processed data:', activitiesData);
        const sortedData = sortActivitiesByDate(Array.isArray(activitiesData) ? activitiesData : [], 'desc');
        setActivities(sortedData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Activities - Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const sortActivitiesByDate = (data, order) => {
    return [...data].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return order === 'desc' ? dateB - dateA : dateA - dateB;
    });
  };

  const handleSortByDate = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    setActivities(sortActivitiesByDate(activities, newOrder));
  };

  if (loading) return <div className="container mt-4"><p>Loading activities...</p></div>;
  if (error) return <div className="container mt-4"><p className="text-danger">Error: {error}</p></div>;

  return (
    <div className="container mt-4">
      <h2>Activities</h2>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Activity Type</th>
              <th>Duration (min)</th>
              <th>Calories</th>
              <th 
                onClick={handleSortByDate} 
                style={{ cursor: 'pointer', userSelect: 'none' }}
                title="Click to sort"
              >
                Date {sortOrder === 'desc' ? '▼' : '▲'}
              </th>
            </tr>
          </thead>
          <tbody>
            {activities.length > 0 ? (
              activities.map(activity => (
                <tr key={activity.id || activity._id}>
                  <td>{activity.id || activity._id || 'N/A'}</td>
                  <td>{activity.user_name || activity.user || 'N/A'}</td>
                  <td>{activity.activity_type || 'N/A'}</td>
                  <td>{activity.duration || 'N/A'}</td>
                  <td>{activity.calories || activity.calories_burned || 'N/A'}</td>
                  <td>{activity.date ? new Date(activity.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No activities found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Activities;
