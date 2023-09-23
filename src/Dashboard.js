// Dashboard.js
import React from 'react';
import IconButton from './IconButton';
import Switch from './Switch';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Modern Dashboard</h1>
      <div className="dashboard-controls">
        <IconButton icon="bell" label="Notifications" />
        <IconButton icon="user" label="Profile" />
        <Switch label="Toggle Lights" />
      </div>
    </div>
  );
};

export default Dashboard;
