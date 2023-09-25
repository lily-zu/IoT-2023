# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)






import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Switch from 'react-switch';
import ExcelJS from 'exceljs';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const DeviceControl = ({
  device,
  onSwitchChange,
  onDeviceDelete,
  onDownloadExcel,
  switchNumber,
  onDownloadSensorData,
  onEditDevice,
}) => {
  const switchName1 = 'switch1';
  const switchName2 = 'switch2';
  const [showEvents, setShowEvents] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(device.name);
  const [editedDescription, setEditedDescription] = useState(device.description);

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
        {`Switch 1:`}{' '}
        <Switch
          onChange={(checked) => onSwitchChange(device._id, switchName1, checked)}
          checked={device[switchName1]}
        />
      </div>
      <div className="switch-container">
        {`Switch 2:`}{' '}
        <Switch
          onChange={(checked) => onSwitchChange(device._id, switchName2, checked)}
          checked={device[switchName2]}
        />
      </div>
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

  return (
    <div className="App">
      <h1>Factory.io Community of IIoT Platform</h1>
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
              switchNumber={1}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;





// server.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const schedule = require('node-schedule');

const app = express();
const port = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const deviceSchema = new mongoose.Schema({
  name: String,
  description: String,
  switch1: Boolean,
  switch2: Boolean,
  switch1Schedules: [
    {
      daysOfWeek: [Number], // Array of days (0-6, representing Sunday to Saturday)
      time: String, // Time in HH:mm format (e.g., "08:00")
    },
  ],
  switch2Schedules: [
    {
      daysOfWeek: [Number], // Array of days (0-6, representing Sunday to Saturday)
      time: String, // Time in HH:mm format (e.g., "17:30")
    },
  ],
  temperature: Number,
  humidity: Number,
  switchEvents: [
    {
      switchNumber: Number,
      switchedOn: Boolean,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const Device = mongoose.model('Device', deviceSchema);

app.use(cors());
app.use(express.json());

// Get all devices with switch events
app.get('/devices', async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Toggle device switches
app.post('/toggle/:deviceId', async (req, res) => {
  const { deviceId } = req.params;
  const { switch1, switch2 } = req.body;

  try {
    const device = await Device.findById(deviceId);
    if (!device) {
      res.status(404).json({ error: 'Device not found' });
      return;
    }

    const switchEvents = [];

    if (switch1 !== undefined) {
      device.switch1 = switch1;
      switchEvents.push({ switchNumber: 1, switchedOn: switch1 });
    }

    if (switch2 !== undefined) {
      device.switch2 = switch2;
      switchEvents.push({ switchNumber: 2, switchedOn: switch2 });
    }

    device.switchEvents = [...device.switchEvents, ...switchEvents];

    await device.save();

    res.json({ message: 'Device updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new device
app.post('/devices', async (req, res) => {
  const { name, description } = req.body;
  try {
    const newDevice = new Device({
      name,
      description,
      switch1: false,
      switch2: false,
      switch1Schedules: [],
      switch2Schedules: [],
      switchEvents: [],
    });
    await newDevice.save();
    res.json({ message: 'Device created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update sensor data for a device
app.post('/sensor-data/:deviceId', async (req, res) => {
  const { deviceId } = req.params;
  const { temperature, humidity } = req.body;

  try {
    const device = await Device.findById(deviceId);
    if (!device) {
      res.status(404).json({ error: 'Device not found' });
      return;
    }

    device.temperature = temperature;
    device.humidity = humidity;

    await device.save();

    res.json({ message: 'Sensor data updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a device by ID
app.delete('/devices/:deviceId', async (req, res) => {
  const { deviceId } = req.params;
  try {
    await Device.findByIdAndRemove(deviceId);
    res.json({ message: 'Device deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a device by ID
app.put('/devices/:deviceId', async (req, res) => {
  const { deviceId } = req.params;
  const { name, description } = req.body;

  try {
    const device = await Device.findByIdAndUpdate(deviceId, { name, description }, { new: true });

    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    res.json({ message: 'Device updated successfully', device });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Set up switch schedules based on user input
app.post('/set-schedules/:deviceId', async (req, res) => {
  const { deviceId } = req.params;
  const { switchNumber, daysOfWeek, time } = req.body;

  try {
    const device = await Device.findById(deviceId);
    if (!device) {
      res.status(404).json({ error: 'Device not found' });
      return;
    }

    if (switchNumber === 1) {
      device.switch1Schedules.push({ daysOfWeek, time });
    } else if (switchNumber === 2) {
      device.switch2Schedules.push({ daysOfWeek, time });
    } else {
      res.status(400).json({ error: 'Invalid switch number' });
      return;
    }

    await device.save();

    res.json({ message: `Switch ${switchNumber} schedule set successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove switch schedules based on user input
app.post('/remove-schedule/:deviceId', async (req, res) => {
  const { deviceId } = req.params;
  const { switchNumber, scheduleIndex } = req.body;

  try {
    const device = await Device.findById(deviceId);
    if (!device) {
      res.status(404).json({ error: 'Device not found' });
      return;
    }

    if (switchNumber === 1) {
      if (scheduleIndex >= 0 && scheduleIndex < device.switch1Schedules.length) {
        device.switch1Schedules.splice(scheduleIndex, 1);
      } else {
        res.status(400).json({ error: 'Invalid schedule index' });
        return;
      }
    } else if (switchNumber === 2) {
      if (scheduleIndex >= 0 && scheduleIndex < device.switch2Schedules.length) {
        device.switch2Schedules.splice(scheduleIndex, 1);
      } else {
        res.status(400).json({ error: 'Invalid schedule index' });
        return;
      }
    } else {
      res.status(400).json({ error: 'Invalid switch number' });
      return;
    }

    await device.save();

    res.json({ message: `Switch ${switchNumber} schedule removed successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Schedule function to turn on/off switches based on schedules
function scheduleSwitches(deviceId) {
  const device = devices.find((d) => d._id === deviceId);
  if (!device) {
    console.error(`Device with ID ${deviceId} not found`);
    return;
  }

  // Schedule Switch 1
  device.switch1Schedules.forEach((schedule) => {
    schedule.daysOfWeek.forEach((dayOfWeek) => {
      const [hours, minutes] = schedule.time.split(':').map(Number);
      scheduleSwitch(1, dayOfWeek, hours, minutes);
    });
  });

  // Schedule Switch 2
  device.switch2Schedules.forEach((schedule) => {
    schedule.daysOfWeek.forEach((dayOfWeek) => {
      const [hours, minutes] = schedule.time.split(':').map(Number);
      scheduleSwitch(2, dayOfWeek, hours, minutes);
    });
  });
}

// Helper function to schedule turning on/off a switch
function scheduleSwitch(switchNumber, dayOfWeek, hours, minutes) {
  const rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = dayOfWeek;
  rule.hour = hours;
  rule.minute = minutes;

  schedule.scheduleJob(rule, function () {
    // TODO: Implement logic to turn on/off the switch here
    console.log(`Scheduled event: Turn ${switchNumber === 1 ? 'On' : 'Off'} Switch ${switchNumber} at ${hours}:${minutes}`);
  });
}

mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
