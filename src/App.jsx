import { Button, ButtonGroup, Container } from '@mui/material'
import React from 'react'
import './App.css'
import CallAPI from './helper/api/api'

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
      CallAPI.api_init(res => {
        if (res) {
          this.setState({ apiReady: true })
        } else {
          this.setState({ error: true })
        }
      }).then(res => {
        console.log(res)
        if (typeof res === 'string' && res.length === 32) {
          this.setState({
            apiReady: true,
            hello: 'Done'
          })
        }
      })
    }

    const APIAuth = e => {
      this.setState({hello: 'Authorizing service'})
      CallAPI.api_authorize().then(res => {
        this.setState({hello: 'Authorized! Congrats'})
        console.log(res)
      })
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
            <Button onClick={() => this.setState({ hello: 'Hello world!' })}>
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