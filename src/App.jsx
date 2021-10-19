import React, { useState } from 'react';
import { createLogicalOr } from 'typescript';
import './App.css';
import APICall from './helper/api/api';

const App = () => {
  const [userLogged, setUserLogged] = useState(false);
  const [user, setUser] = useState({});

  
  
  const login = e => {
    APICall({
      resource: 'user',
      action: 'login',
      id: 42,
      data: {
        'username': 'ahoj',
        'password': '12345'
      }
    })
    .then(res => res.json())
    .then(res => console.log(res))
  }
  
  return (
    <div className="App">
      <p>{userLogged ? 'Přihlášen' : 'Ne'}</p>
      <button className="call-api" onClick={login}>Přihlásit se</button>
    </div>
  );
};

export default App;