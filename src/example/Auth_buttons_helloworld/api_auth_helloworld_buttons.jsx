import { Button, ButtonGroup, Container } from '@mui/material'
import React from 'react'
import API from '../helper/api/api'

import '../App.css'
import "@material-tailwind/react/tailwind.css"

/**
 * API class
 * - Request Authentication
 * - Authorization with service name and key
 * - GET/POST... requests
 */
const AuthenticationExample = class extends React.PureComponent {
  state = {
    hello: null,
    apiReady: false,
    apiAuthorized: false
  }

  APIinit = e => {
    this.setState({ hello: 'Authenticating request...' })

    API.authenticateWithName('testing')
    .then(res => {
      console.log(res);
      if (res) {
        this.setState({
          apiReady: true,
          hello: 'Authenticated'
        })
      } else {
        this.setState({
          error: true
        })
      }
    })
  }

  APIAuth = e => {
    this.setState({hello: 'Authorizing service'})

    API.authorizeWithKey('abcdef')
    .then(res => {
      console.log('authorize', res)

      this.setState({
        hello: 'Authorized! Congrats',
        apiAuthorized: true
      })
    })
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
    const APIinit = e => {
      this.setState({ hello: 'Authenticating request...' })

      API.authenticateWithName('testing')
      .then(res => {
        console.log(res);
        if (res) {
          this.setState({
            apiReady: true,
            hello: 'Authenticated'
          })
        } else {
          this.setState({
            error: true
          })
        }
      })
    }

    return (
      <div>
        <Container className='mt-3'>
          <ButtonGroup>
            <Button onClick={this.APIinit} disabled={this.state.apiReady}>
              Init
            </Button>
            <Button onClick={this.APIAuth} disabled={!this.state.apiReady || this.state.apiAuthorized}>
              Authorize
            </Button>
            <Button
              onClick={this.getHello}
              disabled={!this.state.apiReady}>
              Get hello
            </Button>
            <Button
              onClick={this.wrongCall}
            >
              Wrong call
            </Button>
            <Button onClick={e => API.connectionClose()} disabled={!this.state.apiReady}>
              Close API
            </Button>
          </ButtonGroup>
          <div className='result-text'>
            {this.state.hello}
          </div>
        </Container>
      </div>
    )
  }
}

export default AuthenticationExample