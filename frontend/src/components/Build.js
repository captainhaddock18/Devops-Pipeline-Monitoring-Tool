import React, { useState } from 'react';
import axios from 'axios';



const Build = () => {
  const [jobName, setJobName] = useState('');
  const [delay, setDelay] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Retrieve username and apiToken from sessionStorage
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
          delay: delay || '0' // Default delay to '0' if not provided
        }
      });
      
      console.log(response.data); // Log response from server
      alert('Job build request successful!');
    } catch (error) {
      console.error('Failed to build job:', error);
      alert('Failed to build job. Check console for details.');
    }
  };

  return (
    <div>
      <h2>Build Jenkins Job</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Job Name:
            <input type="text" value={jobName} onChange={(e) => setJobName(e.target.value)} required />
          </label>
        </div>
        <div>
          <label>
            Delay (in seconds, optional):
            <input type="text" value={delay} onChange={(e) => setDelay(e.target.value)} />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>



    </div>
  );
};

export default Build;
