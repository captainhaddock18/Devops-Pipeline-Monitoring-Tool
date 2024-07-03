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
    <div>
      <h2>List Jenkins Jobs</h2>
      <button onClick={job_list}>Fetch Jobs</button>
      <ul>
        {jobs.map((job, index) => (
          <li key={index}>
            <strong>{job.name}</strong> - {job.color}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default List;

