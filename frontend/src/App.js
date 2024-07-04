import './App.css';
import axios from 'axios';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import Home from './components/Home';
import Build from './components/Build';
import List from './components/List';
import Delete from './components/Delete';
import History from './components/History';
import Navbar from './components/Navbar';
import Config from './components/Config';
import Footer from './components/Footer';

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
=
            <Navbar/>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path='/build' element={<Build/>}/>
        <Route path='/list' element={<List/>}/>
        <Route path='/delete' element={<Delete/>}/>
        <Route path='/history' element={<History />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/config' element={<Config />}/>
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
