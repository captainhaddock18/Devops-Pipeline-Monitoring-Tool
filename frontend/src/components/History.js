import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const History = () => {
  const [jobName, setJobName] = useState('');
  const [jobInfo, setJobInfo] = useState(null);
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
      const response = await axios.get(`http://localhost:3010/get-history`, {
        params: {
          username: username,
          apiToken: apiToken,
          jobName: jobName
        }
      });

      if (response.data) {
        setJobInfo(response.data);
        setError('');
      } else {
        setError('Job not found');
        setJobInfo(null);
      }
    } catch (error) {
      console.error('Failed to fetch job history:', error);
      setError('Failed to fetch job history. Check console for details.');
      setJobInfo(null);
    }
  };

  if (redirectToLogin) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-4xl font-bold mb-4 text-center text-gray-800">Jenkins Job History</h2>
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
        {jobInfo && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Job Information for {jobInfo.fullDisplayName}</h3>
            <p className="text-gray-700"><strong>Description:</strong> {jobInfo.description || 'No description'}</p>
            <p className="text-gray-700"><strong>URL:</strong> <a href={jobInfo.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{jobInfo.url}</a></p>
            <p className="text-gray-700"><strong>Buildable:</strong> {jobInfo.buildable ? 'Yes' : 'No'}</p>
            <h4 className="text-xl font-semibold text-gray-800 mt-4">Builds:</h4>
            <ul className="list-disc pl-6">
              {jobInfo.builds.map((build) => (
                <li key={build.number} className="text-gray-700">
                  Build #{build.number}: <a href={build.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{build.url}</a>
                </li>
              ))}
            </ul>
            <h4 className="text-xl font-semibold text-gray-800 mt-4">Health Report:</h4>
            {jobInfo.healthReport.map((report, index) => (
              <p key={index} className="text-gray-700">{report.description} (Score: {report.score})</p>
            ))}
            {jobInfo.lastSuccessfulBuild && (
              <p className="text-gray-700"><strong>Last Successful Build:</strong> <a href={jobInfo.lastSuccessfulBuild.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{jobInfo.lastSuccessfulBuild.url}</a></p>
            )}
            {jobInfo.lastCompletedBuild && (
              <p className="text-gray-700"><strong>Last Completed Build:</strong> <a href={jobInfo.lastCompletedBuild.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{jobInfo.lastCompletedBuild.url}</a></p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
