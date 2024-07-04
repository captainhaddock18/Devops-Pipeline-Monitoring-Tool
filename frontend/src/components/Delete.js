import React, { useState } from 'react';
import axios from 'axios';

const Delete = () => {
  const [jobName, setJobName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Retrieve username and apiToken from sessionStorage
    const username = sessionStorage.getItem('username');
    const apiToken = sessionStorage.getItem('apiToken');

    if (!username || !apiToken) {
      alert('Username or API token not found in session storage.');
      return;
    }

    // Confirm deletion
    const confirmed = window.confirm(`Are you sure you want to delete Job "${jobName}"?`);
    if (!confirmed) {
      return; // If the user cancels, stop the process
    }

    try {
      const response = await axios.post(`http://localhost:3010/delete-job`, null, {
        params: {
          username: username,
          apiToken: apiToken,
          jobName: jobName,
        }
      });
      console.log(response.data); // Log response from server
      alert('Job delete request successful!');
    } catch (error) {
        if(error.response.status  ===  404){
            alert("job not found!")
        }
        else{
      console.error('Failed to delete job:', error);
      alert('Failed to delete job. Check console for details.');
        }
   }
  };

  return (
    <div>
      <h2>Delete Jenkins Job</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Job Name:
            <input type="text" value={jobName} onChange={(e) => setJobName(e.target.value)} required />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Delete;
