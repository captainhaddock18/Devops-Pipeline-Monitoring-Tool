// src/components/Home.js
import React from 'react';
import {useState } from 'react';
import axios
 from 'axios';
const Home = () => {
  const username = sessionStorage.getItem('username');
  const apiToken = sessionStorage.getItem('apiToken');

  const [jobs, setJobs] = useState([]);
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

  return (
    <div>
      <h2>Home</h2>
      <p>Welcome, {username}!</p>
      <p>Your API Token is: {apiToken}</p>
      <button onClick={job_list}>Click me!</button>
    </div>
  );
};

export default Home;
