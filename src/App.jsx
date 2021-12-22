import { Button, ButtonGroup, Container } from '@mui/material';
import React, { useState } from 'react';
import './App.css';
import CallAPIWithKey from './helper/api/api';

const App = () => {
  const [hello, setHello] = useState('');
  console.log(CallAPIWithKey)
  const getFortyTwo = e => {
    CallAPIWithKey({
      resource: 'hello'
    })
      .then(res => res.json())
      .then(res => setHello(res.hello))
  }
  return (
    <div>
      <Container>
        <ButtonGroup>
          <Button onClick={getFortyTwo}>
            Get hello
          </Button>
          <div>
            {hello}
          </div>
        </ButtonGroup>
      </Container>
    </div>
  );
};

export default App;