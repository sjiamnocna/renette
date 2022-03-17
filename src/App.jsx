import { Button, ButtonGroup, Container } from '@mui/material'
import React from 'react'
import './App.css'
import API from './helper/api/api'

import SignIn from './example/SignIn/SignIn'

/**
 * API class
 * - Request Authentication
 * - Authorization with service name and key
 * - GET/POST... requests
 */
const App = class extends React.PureComponent {
  state = {
    apiReady: false,
    apiAuthorized: false
  }

  componentDidMount() {
    API.authenticateWithName('testing')
      .then(res => {
        console.log(res);
        if (res) {
          this.setState({
            apiReady: true
          })
        } else {
          this.setState({
            error: true
          })
        }
      })
      .then(() => {
        return API.authorizeWithKey('abcdef')
      })
      .then(res => {
        console.log('authorize', res)

        this.setState({
          hello: 'Authorized! Congrats',
          apiAuthorized: true
        })
      })
      .then(() => {
        API.get({
          resource: 'getUser',
          action: 'isLogged'
        })
          .then(res => console.log(res))
      })
  }

  componentWillUnmount(){
    API.connectionClose()
  }
  
  handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target)

    await API.post({
      resource: 'getUser',
      action: 'login',
      data: {
        email: formData.get('email'),
        password: formData.get('password'),
      }
    })
  };

  render() {
    return (
      <SignIn
        onSubmit={this.handleSubmit}
      />
    )
  }
}

export default App