import './App.css';
import axios from 'axios';
import { useState } from 'react';

function App() {

  const [jobs, setJobs] = useState([]);

  let but = () =>{
      axios.get('http://localhost:3010/thar') 
      .then(()=>{
        console.log("GET REQUEST PERFECT");
      })
      .catch((err)=> {
        console.log(err);
      })
  }

  let job_list = () =>{
    axios.get('http://localhost:3010/get-jobs') 
    .then((response)=>{
      console.log("GET REQUEST PERFECT");
      setJobs(response.data);
    })
    .catch((err)=> {
      console.log(err);
    })
}

  return (
    <div className="App">
      Hi there
      <button onClick={but}>Click me! </button>
      <br></br>
      For all list of jobs: 
      <button onClick={job_list}>Click me! </button>
      {jobs.length > 0 && (
      <div>
        <h2>Jenkins Jobs</h2>
        <ul>
          {jobs.map((job, index) => (
            <li key={index}>{job.name} - {job.color}</li>
          ))}
        </ul>
      </div>
    )}


    </div>
  );
}


export default App;
