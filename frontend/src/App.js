import './App.css';
import axios from 'axios';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';

function App() {
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
    axios.get('http://localhost:3010/get-jobs')
      .then((response) => {
        console.log("GET REQUEST PERFECT");
        setJobs(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
