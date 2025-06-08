import React, { useState, useEffect } from 'react';
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
      const response = await fetch(`${API_BASE_URL}/`);
      const data = await response.json();
      setBackendStatus(`✅ Connected: ${data.message}`);
    } catch (error) {
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
      const response = await fetch(`${API_BASE_URL}/api/test`);
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