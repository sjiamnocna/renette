import { Button, ButtonGroup, Container } from '@mui/material'
import React from 'react'
import './App.css'
import API from './helper/api/api'

/**
 * API class
 * - Request Authentication
 * - Authorization with service name and key
 * - GET/POST... requests
 */
const App = class extends React.PureComponent {
  state = {
    hello: null,
    apiReady: false,
    apiAuthorized: false
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

    const APIAuth = e => {
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

    const getHello = e => {
      if (this.state.apiAuthorized){
        API.get({
          resource: 'hello'
        }).then(res => res.json())
        .then(res => {
          this.setState({hello: res.hello})
        })
      }
    }

    return (
      <div>
        <Container className='mt-3'>
          <ButtonGroup>
            <Button onClick={APIinit} disabled={this.state.apiReady}>
              Init
            </Button>
            <Button onClick={APIAuth} disabled={!this.state.apiReady && !this.state.apiAuthorized}>
              Authorize
            </Button>
            <Button
              onClick={getHello}
              disabled={!this.state.apiAuthorized}>
              Get hello
            </Button>
            <div className=''>
              {this.state.hello}
            </div>
          </ButtonGroup>
        </Container>
      </div>
    )
  }
}

export default App