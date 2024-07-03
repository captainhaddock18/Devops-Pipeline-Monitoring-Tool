import React, { useState } from 'react';
import axios from 'axios';

const Home = () => {
  const username = sessionStorage.getItem('username')
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
    <div>
      <h2>Home</h2>
      <p>Welcome, {username}!</p>
      <p>Your API Token is: {apiToken}</p>
      <div>
        <label>
          Job Name:
          <input type="text" value={jobName} onChange={(e) => setJobName(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Pre Job:
          <input type="text" value={preJob} onChange={(e) => setPreJob(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Config XML:
          <textarea 
            value={configXmlContent} 
            onChange={(e) => setConfigXmlContent(e.target.value)} 
            rows="10" 
            cols="50" 
            placeholder="Paste the config.xml content here"
          />
        </label>
      </div>
      <button onClick={create_job}>Click me!</button>
    </div>
  );
};

export default Home;











