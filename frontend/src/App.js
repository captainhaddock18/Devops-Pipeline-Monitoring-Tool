import './App.css';
import axios from 'axios';

function App() {

  let but = () =>{
      axios.get('http://localhost:3010/thar') 
      .then(()=>{
        console.log("GET REQUEST PERFECT");
      })
      .catch((err)=> {
        console.log(err);
      })
  }

  return (
    <div className="App">
      Hi there
      <button onClick={but}>Click me! </button>
    </div>
  );
}


export default App;
