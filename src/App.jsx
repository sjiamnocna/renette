import React from 'react';
import './App.css';
import callApi from './helper/api/api';

const click = e => {
  callApi('user', 'login', {
    username: "ahoj",
    password: "12345"
  })
  .then(res => res.json())
  .then(res => console.log(res));
}

const App = () => {
  return (
    <div className="App">
      <button className="call-api" onClick={click}>Zavolej</button>
    </div>
  );
};

export default App;