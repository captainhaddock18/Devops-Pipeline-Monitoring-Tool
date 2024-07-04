import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const username = sessionStorage.getItem('username');
  const apiToken = sessionStorage.getItem('apiToken');
  const [jobName, setJobName] = useState('');
  const [preJob, setPreJob] = useState('');
  const [configXmlContent, setConfigXmlContent] = useState('');

  let but = () => {
    axios.get('http://localhost:3010/thar')
      .then(() => {
        console.log("GET REQUEST PERFECT");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let job_list = () => {
    axios.get(`http://localhost:3010/get-jobs?username=${username}&apiToken=${apiToken}`)
      .then((response) => {
        console.log(response.data[0]);
        // setJobs(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const create_job = () => {
    if (!configXmlContent) {
      alert('Please provide the config.xml content.');
      return;
    }

    axios.post(`http://localhost:3010/create-job?username=${username}&apiToken=${apiToken}&jobName=${jobName}`, configXmlContent, {
      headers: {
        'Content-Type': 'application/xml'
      }
    })
    .then((response) => {
      console.log(response);
      alert('Job created successfully!');
    })
    .catch((err) => {
      console.error(err);
      alert('Failed to create job.');
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-green-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-4xl font-bold mb-4 text-center text-gray-800">Home</h2>
        <p className="text-xl text-center text-gray-700 mb-6">Welcome, {username}!</p>
        <p className="text-xl text-center text-gray-700 mb-6">Your API Token is: {apiToken}</p>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Job Name:</label>
            <input
              type="text"
              value={jobName}
              onChange={(e) => setJobName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
     
          <div>
            <label className="block text-gray-700 font-medium mb-2">Config XML:</label>
            <textarea
              value={configXmlContent}
              onChange={(e) => setConfigXmlContent(e.target.value)}
              rows="10"
              cols="50"
              placeholder="Paste the config.xml content here"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <button
            onClick={create_job}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Click me!
          </button>
        </div>
        <div className="mt-6 flex justify-around">
          <Link to="/build">
            <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300">
              Build Job
            </button>
          </Link>
          <Link to="/list">
            <button className="bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition duration-300">
              Fetch List
            </button>
          </Link>
          <Link to="/config">
            <button className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300">
              Get Config.xml
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
