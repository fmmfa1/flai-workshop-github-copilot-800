import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import logo from './octofitapp-small.png';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <img src={logo} alt="OctoFit Logo" className="App-logo" />
              OctoFit Tracker
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/users">Users</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/teams">Teams</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/activities">Activities</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/workouts">Workouts</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/leaderboard">Leaderboard</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={
            <div className="container mt-4">
              <h1>Welcome to OctoFit Tracker</h1>
              <p className="lead">Track your fitness activities, compete with your team, and stay motivated!</p>
              
              <div className="row mt-5">
                <div className="col-md-4 mb-4">
                  <Link to="/users" style={{ textDecoration: 'none' }}>
                    <div className="card h-100" style={{ cursor: 'pointer' }}>
                      <div className="card-body text-center">
                        <div style={{ fontSize: '3rem', color: '#2c5aa0' }}>👥</div>
                        <h3 className="card-title mt-3">Users</h3>
                        <p className="card-text">View all registered users and their team assignments</p>
                      </div>
                    </div>
                  </Link>
                </div>
                
                <div className="col-md-4 mb-4">
                  <Link to="/activities" style={{ textDecoration: 'none' }}>
                    <div className="card h-100" style={{ cursor: 'pointer' }}>
                      <div className="card-body text-center">
                        <div style={{ fontSize: '3rem', color: '#00a86b' }}>🏃</div>
                        <h3 className="card-title mt-3">Activities</h3>
                        <p className="card-text">Browse all logged fitness activities and workouts</p>
                      </div>
                    </div>
                  </Link>
                </div>
                
                <div className="col-md-4 mb-4">
                  <Link to="/leaderboard" style={{ textDecoration: 'none' }}>
                    <div className="card h-100" style={{ cursor: 'pointer' }}>
                      <div className="card-body text-center">
                        <div style={{ fontSize: '3rem', color: '#ff6b35' }}>🏆</div>
                        <h3 className="card-title mt-3">Leaderboard</h3>
                        <p className="card-text">See top performers and compete for the top spot</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              
              <div className="row mt-4">
                <div className="col-md-6 mb-4">
                  <Link to="/teams" style={{ textDecoration: 'none' }}>
                    <div className="card h-100" style={{ cursor: 'pointer' }}>
                      <div className="card-body text-center">
                        <div style={{ fontSize: '3rem', color: '#764ba2' }}>🤝</div>
                        <h3 className="card-title mt-3">Teams</h3>
                        <p className="card-text">Explore teams and their members</p>
                      </div>
                    </div>
                  </Link>
                </div>
                
                <div className="col-md-6 mb-4">
                  <Link to="/workouts" style={{ textDecoration: 'none' }}>
                    <div className="card h-100" style={{ cursor: 'pointer' }}>
                      <div className="card-body text-center">
                        <div style={{ fontSize: '3rem', color: '#28a745' }}>💪</div>
                        <h3 className="card-title mt-3">Workouts</h3>
                        <p className="card-text">Discover suggested workout routines and exercises</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          } />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
