import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Choose your preferred code style

const Config = () => {
  const [jobName, setJobName] = useState('');
  const [configXml, setConfigXml] = useState('');
  const [error, setError] = useState('');
  const [redirectToLogin, setRedirectToLogin] = useState(false); // State for redirection

  useEffect(() => {
    const checkAuth = () => {
      const username = sessionStorage.getItem('username');
      const apiToken = sessionStorage.getItem('apiToken');
      if (!username || !apiToken) {
        setRedirectToLogin(true); // Redirect if username or apiToken is missing
      }
    };
    checkAuth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = sessionStorage.getItem('username');
    const apiToken = sessionStorage.getItem('apiToken');

    if (!username || !apiToken) {
      alert('Username or API token not found in session storage.');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:3010/get-config?username=${username}&apiToken=${apiToken}&jobName=${jobName}`, {
      });

      if (response.data) {
        setConfigXml(response.data);
        setError('');
      } else {
        setError('Config.xml not found');
        setConfigXml('');
      }
    } catch (error) {
      console.error('Failed to fetch config.xml:', error);
      setError('Failed to fetch config.xml. Check console for details.');
      setConfigXml('');
    }
  };

  if (redirectToLogin) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-4xl font-bold mb-4 text-center text-gray-800">Jenkins Config.xml Viewer</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-lg font-medium text-gray-700">
              Job Name:
            </label>
            <input
              type="text"
              value={jobName}
              onChange={(e) => setJobName(e.target.value)}
              required
              className="mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Submit
          </button>
        </form>
        {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
        {configXml && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Config.xml for {jobName}</h3>
            <SyntaxHighlighter language="xml" style={darcula} className="rounded-lg">
              {configXml}
            </SyntaxHighlighter>
          </div>
        )}
      </div>
    </div>
  );
};

export default Config;
