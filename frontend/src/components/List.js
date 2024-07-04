import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const List = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null); // To track the selected job for detailed view
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      const username = sessionStorage.getItem('username');
      const apiToken = sessionStorage.getItem('apiToken');

      if (!username || !apiToken) {
        navigate('/login'); // Redirect to login if username or apiToken not found
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3010/get-jobs`, {
          params: {
            username: username,
            apiToken: apiToken
          }
        });
        setJobs(response.data);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      }
    };

    fetchJobs(); // Call fetchJobs immediately when component mounts
  }, [navigate]); // Depend on navigate to re-check authentication on navigation change

  const handleRefresh = async () => {
    try {
      const response = await axios.get(`http://localhost:3010/get-jobs`, {
        params: {
          username: sessionStorage.getItem('username'),
          apiToken: sessionStorage.getItem('apiToken')
        }
      });
      setJobs(response.data);
    } catch (error) {
      console.error('Failed to refresh jobs:', error);
    }
  };

  // Function to handle clicking on a job item
  const handleJobClick = (job) => {
    setSelectedJob(job); // Set the selected job for detailed view
  };

  // Function to close the detailed view modal
  const handleCloseModal = () => {
    setSelectedJob(null); // Clear the selected job when closing the modal
  };

  // Function to open the job's detailed page
  const handleKnowMore = (jobName) => {
    window.open(`http://localhost:8080/job/${jobName}/`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-4xl font-bold mb-4 text-center text-gray-800">List Jenkins Jobs</h2>
        <button 
          onClick={handleRefresh}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 mb-6"
        >
          Fetch Jobs
        </button>
        <ul className="space-y-4">
          {jobs.map((job, index) => (
            <li 
              key={index} 
              className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-200 transition duration-300"
              onClick={() => handleJobClick(job)} // Handle click on job item
            >
              <div>
                <strong className="text-lg text-gray-800">{job.name}</strong>
                <span 
                  className={`text-sm py-1 px-3 rounded-full ${job.color === 'blue' ? 'bg-blue-200 text-blue-800' : 'bg-red-200 text-red-800'}`}
                >
                  {job.color}
                </span>
              </div>
              <button 
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
              >
                Know More
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal for displaying detailed job information */}
      {selectedJob && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">{selectedJob.name} Details</h2>
            <p className="text-lg text-gray-700 mb-6">Job Color:              <span 
                  className={`text-sm py-1 px-3 rounded-full ${selectedJob.color === 'blue' ? 'bg-blue-200 text-blue-800' : 'bg-red-200 text-red-800'}`}
                >
                  {selectedJob.color}  
                </span></p>
            <div className="mb-6">
              <p className="text-gray-700">Know more about the job:</p>
              <button 
                onClick={() => handleKnowMore(selectedJob.name)}
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
              >
                Visit Job Site
              </button>
            </div>
            {/* Add more job details as needed */}
            <button 
              onClick={handleCloseModal}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
