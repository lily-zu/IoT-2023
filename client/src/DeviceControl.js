import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-switch';

const DeviceControl = ({
  device,
  onSwitchChange,
  onDeviceDelete,
  onDownloadExcel,
  onDownloadSensorData,
  onEditDevice,
  onCreateSwitch, // Add this prop
  switchNumber, // Add this prop
}) => {
  const switchName = `switch${switchNumber}`;
  const [showEvents, setShowEvents] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(device.name);
  const [editedDescription, setEditedDescription] = useState(device.description);
  const [temperature, setTemperature] = useState(device.temperature || '');
  const [humidity, setHumidity] = useState(device.humidity || '');

  const handleToggleEvents = () => {
    setShowEvents(!showEvents);
  };

  const handleSaveClick = () => {
    console.log('Save button clicked');
  };

  const handleTemperatureChange = (e) => {
    setTemperature(e.target.value);
  };

  const handleHumidityChange = (e) => {
    setHumidity(e.target.value);
  };

  const handleSensorDataUpdate = () => {
    onSensorDataUpdate(device._id, temperature, humidity);
  };

  const handleDownloadSensorData = () => {
    onDownloadSensorData(device);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedName(device.name);
    setEditedDescription(device.description);
  };

  const handleCreateSwitch = () => {
    // Call the onCreateSwitch function with the device ID
    onCreateSwitch(device._id);
  };

  return (
    <div className="device-control">
      <div className="device-header">
        <img
          className="device-icon"
          src={device.imageUrl}
          alt={`${device.name} Icon`}
        />
        <h3>{device.name}</h3>
        <p className="device-id">Device ID: {device._id}</p>
        <p className="device-description">Description: {device.description}</p>
        <div className="switch-container">
          {Object.keys(device).map((key) => {
            // Check if the key represents a switch (e.g., switch1, switch2, ...)
            if (key.startsWith('switch')) {
              const switchNumber = key.slice(6); // Extract the switch number
              return (
                <div key={key}>
                  Switch {switchNumber}:{' '}
                  <Switch
                    onChange={(checked) => onSwitchChange(device._id, key, checked)}
                    checked={device[key]}
                  />
                </div>
              );
            }
            return null; // Ignore keys that are not switches
          })}
          <button className="create-switch-button" onClick={handleCreateSwitch}>
            Create Switch
          </button>
        </div>
      </div>
      {isEditing ? (
        <>
          <button className="save-button" onClick={handleSaveClick}>
            Save
          </button>
          <button className="cancel-button" onClick={handleCancelClick}>
            Cancel
          </button>
        </>
      ) : (
        <button className="edit-button" onClick={handleEditClick}>
          Edit
        </button>
      )}

      <button className="edit-button" onClick={() => onEditDevice(device)}>
        Edit Device
      </button>
      <button className="save-button" onClick={handleSaveClick}>
        Save
      </button>
      <button className="download-button" onClick={() => onDownloadExcel(device)}>
        Download Data Event to Excel File
      </button>
      <button className="delete-button" onClick={() => onDeviceDelete(device._id)}>
        Delete Device
      </button>
      <button className="toggle-button" onClick={handleToggleEvents}>
        {showEvents ? 'Hide Events' : 'Show Events'}
      </button>
      {showEvents && (
        <div className="event-list">
          <h4>Switch Events:</h4>
          <ul>
            {device.switchEvents.map((event, index) => (
              <li key={index}>
                {`Switch ${event.switchNumber} turned ${event.switchedOn ? 'on' : 'off'
                  } at ${event.timestamp.toLocaleString()}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sensor Data Section */}
      <div className="sensor-data">
        <h4>Sensor Data</h4>
        <div className="sensor-input">
          <label>Temperature:</label>
          <input
            type="number"
            value={temperature}
            onChange={handleTemperatureChange}
            placeholder="Temperature (°C)"
          />
        </div>
        <div className="sensor-input">
          <label>Humidity:</label>
          <input
            type="number"
            value={humidity}
            onChange={handleHumidityChange}
            placeholder="Humidity (%)"
          />
        </div>
        <button className="update-button" onClick={handleSensorDataUpdate}>
          Update Sensor Data
        </button>
        <button className="download-sensor-data-button" onClick={handleDownloadSensorData}>
          Download Sensor Data
        </button>
      </div>
    </div>
  );
};

DeviceControl.propTypes = {
  device: PropTypes.object.isRequired,
  onSwitchChange: PropTypes.func.isRequired,
  onDeviceDelete: PropTypes.func.isRequired,
  onDownloadExcel: PropTypes.func.isRequired,
  onDownloadSensorData: PropTypes.func.isRequired,
  onEditDevice: PropTypes.func.isRequired,
  onCreateSwitch: PropTypes.func.isRequired, // Add this prop
  switchNumber: PropTypes.number.isRequired, // Add this prop
};

export default DeviceControl;
