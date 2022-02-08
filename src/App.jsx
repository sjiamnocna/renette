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
  }

  componentWillUnmount(){
    API.connectionClose()
  }

  getHello = e => {
    API.get({
      resource: 'hello'
    }).then(res => res.json())
      .then(res => {
        this.setState({ hello: res.hello })
      })
  }

  wrongCall = e => {
    API.post({
      resource: 'hello',
      action: 'blablabla'
    })
    .then(res => {
      console.log(res);
    })
  }

  render() {
    return (
      <SignIn />
    )
  }
}

export default App