import React from 'react'
import { Authenticator, AmplifyTheme } from 'aws-amplify-react'
import useAmplifyAuth from './components/UseAmplifyAuth'
import './App.css'

function App() {
  const {
    state: { user },
    handleSignOut,
  } = useAmplifyAuth()

  console.log('user =>', user)
  console.dir(AmplifyTheme)

  return !user ? <Authenticator theme={theme} /> : <div>App</div>
}

const theme = {
  ...AmplifyTheme,
  navBar: {
    ...AmplifyTheme.navBar,
    backgroundColor: '#7700b4',
    color: 'white',
  },
  button: {
    ...AmplifyTheme.button,
    backgroundColor: '#177bff',
    color: 'white',
  },
  sectionBody: {
    ...AmplifyTheme.sectionBody,
    padding: '5px',
  },
  sectionHeader: {
    ...AmplifyTheme.sectionHeader,
    backgroundColor: '#7700b4',
  },
}

export default App

// export default withAuthenticator(App, true, [], null, theme)
