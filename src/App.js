import React, { createContext } from 'react'
import { Authenticator, AmplifyTheme } from 'aws-amplify-react'
import { Router, Route } from 'react-router-dom'
import useAmplifyAuth from './components/UseAmplifyAuth'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import StorePage from './pages/StorePage'
import NavBar from './components/Navbar'
import createBrowserHistory from 'history/createBrowserHistory'
import '@aws-amplify/ui/dist/style.css'
import './App.css'

export const { Provider, Consumer } = createContext()
export const history = createBrowserHistory()

function App() {
  const {
    state: { user },
    handleSignout,
  } = useAmplifyAuth()

  // console.dir(AmplifyTheme)

  return !user ? (
    <Authenticator theme={theme} />
  ) : (
    <Provider value={{ user }}>
      <Router history={history}>
        <>
          <NavBar user={user} handleSignout={handleSignout} />

          <div className='app-container'>
            <Route exact path='/' component={HomePage} />
            <Route
              path='/profile'
              component={() => <ProfilePage user={user} />}
            />
            <Route
              path='/stores/:storeId'
              component={({ match }) => (
                <StorePage user={user} storeId={match.params.storeId} />
              )}
            />
          </div>
        </>
      </Router>
    </Provider>
  )
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
