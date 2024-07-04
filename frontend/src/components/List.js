import React, { useState } from 'react';
import axios from 'axios';

const List = () => {
  const [jobs, setJobs] = useState([]);

  const username = sessionStorage.getItem('username');
  const apiToken = sessionStorage.getItem('apiToken');

  const job_list = () => {
    axios.get(`http://localhost:3010/get-jobs?username=${username}&apiToken=${apiToken}`)
      .then((response) => {
        console.log("GET REQUEST PERFECT");
        setJobs(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-4xl font-bold mb-4 text-center text-gray-800">List Jenkins Jobs</h2>
        <button 
          onClick={job_list}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 mb-6"
        >
          Fetch Jobs
        </button>
        <ul className="space-y-4">
          {jobs.map((job, index) => (
            <li 
              key={index} 
              className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md"
            >
              <strong className="text-lg text-gray-800">{job.name}</strong>
              <span 
                className={`text-sm py-1 px-3 rounded-full ${job.color === 'blue' ? 'bg-blue-200 text-blue-800' : 'bg-red-200 text-red-800'}`}
              >
                {job.color}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default List;
