import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Build = () => {
  const [jobName, setJobName] = useState('');
  const [delay, setDelay] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const username = sessionStorage.getItem('username');
    const apiToken = sessionStorage.getItem('apiToken');
    if (!username || !apiToken) {
      navigate('/login'); // Redirect to login if username or apiToken not found
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = sessionStorage.getItem('username');
    const apiToken = sessionStorage.getItem('apiToken');

    if (!username || !apiToken) {
      alert('Username or API token not found in session storage.');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:3010/build-job`, null, {
        params: {
          username: username,
          apiToken: apiToken,
          jobName: jobName,
          delay: delay || '0'
        }
      });
      
      console.log(response.data);
      alert('Job build request successful!');
    } catch (error) {
      console.error('Failed to build job:', error);
      alert('Failed to build job. Check console for details.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Build Jenkins Job</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Job Name:
            </label>
            <input
              type="text"
              value={jobName}
              onChange={(e) => setJobName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Delay (in seconds, optional):
            </label>
            <input
              type="text"
              value={delay}
              onChange={(e) => setDelay(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Build;
