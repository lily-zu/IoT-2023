import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Switch from 'react-switch';
import ExcelJS from 'exceljs';

const API_URL = process.env.REACT_APP_API_URL || 'https://iot-robotx-server.onrender.com';

const DeviceControl = ({
  device,
  onSwitchChange,
  onDeviceDelete,
  onDownloadExcel,
  switchNumber,
  onDownloadSensorData,
  onEditDevice,
  onCreateSwitch,
  onDeleteSwitch, // Add this prop
}) => {
  const switchName = switchNumber === 1 ? 'switch1' : 'switch2';
  const [showEvents, setShowEvents] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(device.name);
  const [editedDescription, setEditedDescription] = useState(device.description);
  const [temperature, setTemperature] = useState(device.temperature || '');
  const [humidity, setHumidity] = useState(device.humidity || '');

  const handleToggleEvents = () => {
    setShowEvents(!showEvents);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    axios
      .put(`${API_URL}/devices/${device._id}`, {
        name: editedName,
        description: editedDescription,
      })
      .then((response) => {
        console.log(response.data);
        setIsEditing(false);
        onEditDevice(device._id, editedName, editedDescription);
      })
      .catch((error) => {
        console.error('Error updating device:', error);
      });
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedName(device.name);
    setEditedDescription(device.description);
  };

  const handleCreateSwitch = () => {
    onCreateSwitch(device._id);
  };

  const handleDeleteSwitch = () => {
    onDeleteSwitch(device._id);
  };

  return (
    <div className="device-control">
      <h3>
        {isEditing ? (
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
        ) : (
          editedName
        )}
      </h3>
      <p className="device-id">Device ID: {device._id}</p>
      <p className="device-description">
        Description:{' '}
        {isEditing ? (
          <input
            type="text"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
          />
        ) : (
          editedDescription
        )}
      </p>
      <div className="switch-container">
        {`Switch ${switchNumber}:`}{' '}
        <Switch
          onChange={(checked) => onSwitchChange(device._id, switchName, checked)}
          checked={device[switchName]}
        />
      </div>
      <button className="create-switch-button" onClick={handleCreateSwitch}>
        Create Switch
      </button>
      <button className="delete-switch-button" onClick={handleDeleteSwitch}>
        Delete Switch
      </button>
      <button className="download-button" onClick={() => onDownloadExcel(device)}>
        Download Data Event to Excel File
      </button>
      <button className="delete-button" onClick={() => onDeviceDelete(device._id)}>
        Delete Device
      </button>
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
      <button className="toggle-button" onClick={handleToggleEvents}>
        {showEvents ? 'Hide Events' : 'Show Events'}
      </button>
      {showEvents && (
        <div className="event-list">
          <h4>Switch Events:</h4>
          <ul>
            {device.switchEvents.map((event, index) => (
              <li key={index}>
                {`Switch ${event.switchNumber} turned ${
                  event.switchedOn ? 'on' : 'off'
                } at ${event.timestamp.toLocaleString()}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="gauge-container">
        <div className="gauge">
          <h4>Temperature</h4>
          {device.temperature !== undefined ? (
            <>
              <button
                className="download-button"
                onClick={() => onDownloadSensorData(device, 'temperature')}
              >
                Download Sensor Data
              </button>
              <p>{device.temperature.toFixed(2)}°C</p>
            </>
          ) : (
            <p>Temperature data not available</p>
          )}
        </div>
        <div className="gauge">
          <h4>Humidity</h4>
          {device.humidity !== undefined ? (
            <>
              <button
                className="download-button"
                onClick={() => onDownloadSensorData(device, 'humidity')}
              >
                Download Sensor Data
              </button>
              <p>{device.humidity.toFixed(2)}%</p>
            </>
          ) : (
            <p>Humidity data not available</p>
          )}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [devices, setDevices] = useState([]);
  const [newDevice, setNewDevice] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = () => {
    axios
      .get(`${API_URL}/devices`)
      .then((response) => {
        setDevices(response.data);
      })
      .catch((error) => {
        console.error('Error fetching devices:', error);
      });
  };

  const toggleSwitch = (deviceId, switchName, switchState) => {
    axios
      .post(`${API_URL}/toggle/${deviceId}`, { [switchName]: switchState })
      .then((response) => {
        console.log(response.data);
        fetchDevices();
      })
      .catch((error) => {
        console.error('Error toggling switch:', error);
      });
  };

  const deleteDevice = (deviceId) => {
    axios
      .delete(`${API_URL}/devices/${deviceId}`)
      .then((response) => {
        console.log(response.data);
        fetchDevices();
      })
      .catch((error) => {
        console.error('Error deleting device:', error);
      });
  };

  const createDevice = () => {
    axios
      .post(`${API_URL}/devices`, newDevice)
      .then((response) => {
        console.log(response.data);
        fetchDevices();
        setNewDevice({ name: '', description: '' });
      })
      .catch((error) => {
        console.error('Error creating device:', error);
      });
  };

  const downloadExcel = (device) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Switch Events');
    worksheet.columns = [
      { header: 'Switch Number', key: 'switchNumber', width: 15 },
      { header: 'Switch State', key: 'switchState', width: 15 },
      { header: 'Timestamp', key: 'timestamp', width: 25 },
    ];
    device.switchEvents.forEach((event) => {
      worksheet.addRow({
        switchNumber: event.switchNumber,
        switchState: event.switchedOn ? 'On' : 'Off',
        timestamp: event.timestamp.toLocaleString(),
      });
    });
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SwitchEvents_${device.name}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  const downloadSensorData = (device, dataType) => {
    const workbook = new ExcelJS.Workbook();
    const sensorWorksheet = workbook.addWorksheet('Sensor Data');
    sensorWorksheet.columns = [
      { header: 'Timestamp', key: 'timestamp', width: 25 },
      { header: dataType, key: dataType, width: 20 },
    ];
    device.sensorData.forEach((data) => {
      sensorWorksheet.addRow({
        timestamp: data.timestamp.toLocaleString(),
        [dataType]: dataType === 'temperature' ? data.temperature.toFixed(2) : data.humidity.toFixed(2),
      });
    });
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SensorData_${device.name}_${dataType}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  const editDevice = (deviceId, editedName, editedDescription) => {
    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device._id === deviceId
          ? { ...device, name: editedName, description: editedDescription }
          : device
      )
    );
  };

  const createSwitch = (deviceId) => {
    axios
      .post(`${API_URL}/create-switch/${deviceId}`)
      .then((response) => {
        console.log(response.data);
        fetchDevices();
      })
      .catch((error) => {
        console.error('Error creating switch:', error);
      });
  };

  const deleteSwitch = (deviceId) => {
    axios
      .delete(`${API_URL}/delete-switch/${deviceId}`)
      .then((response) => {
        console.log(response.data);
        fetchDevices();
      })
      .catch((error) => {
        console.error('Error deleting switch:', error);
      });
  };

  return (
    <div className="App">
      <h1>IoT Device Control</h1>
      <div className="new-device">
        <h2>Create New Device</h2>
        <input
          type="text"
          placeholder="Device Name"
          value={newDevice.name}
          onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Device Description"
          value={newDevice.description}
          onChange={(e) =>
            setNewDevice({ ...newDevice, description: e.target.value })
          }
        />
        <button className="create-button" onClick={createDevice}>
          Create Device
        </button>
      </div>

      <div className="device-list">
        {devices.map((device) => (
          <div key={device._id} className="device-row">
            <DeviceControl
              device={device}
              onSwitchChange={toggleSwitch}
              onDeviceDelete={deleteDevice}
              onDownloadExcel={downloadExcel}
              onDownloadSensorData={downloadSensorData}
              onEditDevice={editDevice}
              onCreateSwitch={createSwitch}
              onDeleteSwitch={deleteSwitch} // Pass the deleteSwitch function
              switchNumber={1}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
