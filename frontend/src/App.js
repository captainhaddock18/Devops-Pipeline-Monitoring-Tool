import './App.css';
import axios from 'axios';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Build from './components/Build';
import List from './components/List';

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



  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path='/build' element={<Build/>}/>
        <Route path='/list' element={<List/>}/>
      </Routes>
    </Router>
  );
}

export default App;
