const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewareimport React, { useState, useEffect } from 'react';
import './App.css';

// Replace this with your Railway backend URL after deployment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [backendStatus, setBackendStatus] = useState('Checking...');
  const [users, setUsers] = useState([]);
  const [testData, setTestData] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [formResponse, setFormResponse] = useState('');
  const [loading, setLoading] = useState(false);

  // Test backend connection on component mount
  useEffect(() => {
    testBackendConnection();
    fetchUsers();
    fetchTestData();
  }, []);

  const testBackendConnection = async () => {
    try {
      console.log('Testing backend connection to:', API_BASE_URL);
      const response = await fetch(`${API_BASE_URL}/`);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.log('Non-JSON response:', text.substring(0, 200));
        throw new Error(`Expected JSON, got ${contentType}. Response: ${text.substring(0, 100)}...`);
      }
      
      const data = await response.json();
      setBackendStatus(`✅ Connected: ${data.message}`);
    } catch (error) {
      console.error('Backend connection error:', error);
      setBackendStatus(`❌ Connection failed: ${error.message}`);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`);
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchTestData = async () => {
    try {
      console.log('Fetching test data from:', `${API_BASE_URL}/api/test`);
      const response = await fetch(`${API_BASE_URL}/api/test`);
      
      console.log('Response status:', response.status);
      console.log('Response content-type:', response.headers.get('content-type'));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Non-OK response:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const htmlResponse = await response.text();
        console.error('Received HTML instead of JSON:', htmlResponse.substring(0, 500));
        throw new Error('Server returned HTML instead of JSON');
      }
      
      const data = await response.json();
      setTestData(data);
    } catch (error) {
      console.error('Error fetching test data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setFormResponse(`✅ Success: ${data.message}`);
        setFormData({ name: '', email: '' });
      } else {
        setFormResponse(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setFormResponse(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 MERN Stack API Tester</h1>
        <p>Frontend on Vercel + Backend on Railway</p>
      </header>

      <main className="App-main">
        {/* Backend Connection Status */}
        <section className="status-section">
          <h2>Backend Connection Status</h2>
          <div className="status-box">
            <p>{backendStatus}</p>
            <button onClick={testBackendConnection}>
              🔄 Test Connection
            </button>
          </div>
        </section>

        {/* API Test Data */}
        <section className="data-section">
          <h2>API Test Data</h2>
          {testData && (
            <div className="data-box">
              <p><strong>Message:</strong> {testData.message}</p>
              <p><strong>Sample Data:</strong></p>
              <ul>
                {testData.data.users.map((user, index) => (
                  <li key={index}>{user}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Users List */}
        <section className="users-section">
          <h2>Users from API</h2>
          <div className="users-grid">
            {users.map(user => (
              <div key={user.id} className="user-card">
                <h3>{user.name}</h3>
                <p>{user.email}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Form Test */}
        <section className="form-section">
          <h2>Test POST Request</h2>
          <form onSubmit={handleSubmit} className="test-form">
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? '⏳ Sending...' : '📤 Send Data'}
            </button>
          </form>
          {formResponse && (
            <div className="response-box">
              <p>{formResponse}</p>
            </div>
          )}
        </section>

        {/* API Endpoints Info */}
        <section className="endpoints-section">
          <h2>Available API Endpoints</h2>
          <div className="endpoints-list">
            <div className="endpoint">
              <span className="method get">GET</span>
              <code>/</code> - Backend status
            </div>
            <div className="endpoint">
              <span className="method get">GET</span>
              <code>/api/test</code> - Test data
            </div>
            <div className="endpoint">
              <span className="method get">GET</span>
              <code>/api/users</code> - Users list
            </div>
            <div className="endpoint">
              <span className="method post">POST</span>
              <code>/api/data</code> - Submit data
            </div>
            <div className="endpoint">
              <span className="method get">GET</span>
              <code>/health</code> - Health check
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
app.use(cors({
  origin: ['http://localhost:3000', 'https://vercel-railway-test.vercel.app/'],
  credentials: true
}));
app.use(express.json());

// MongoDB connection (optional - you can skip this for testing)
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mernapp')
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.log('MongoDB connection error:', err));

// Test routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend API is working!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API endpoint is working correctly!',
    data: {
      users: ['John', 'Jane', 'Bob'],
      count: 3
    }
  });
});

app.post('/api/data', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ 
      error: 'Name and email are required' 
    });
  }
  
  res.json({ 
    message: 'Data received successfully!',
    received: { name, email },
    timestamp: new Date().toISOString()
  });
});

app.get('/api/users', (req, res) => {
  // Mock user data
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
  ];
  
  res.json({ 
    success: true,
    users: users,
    total: users.length
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});