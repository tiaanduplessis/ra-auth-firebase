
import React, { Component } from 'react'
import { Admin, Resource } from 'react-admin'
import firebase from 'firebase'

import Login from './login'
import Dashboard from './dashboard'

import Store from '@material-ui/icons/Store'
import { AssetsCreate, AssetsEdit, AssetsList } from './assets'

import { FirebaseAuthProvider } from 'ra-auth-firebase'

const firebaseConfig =
    {
      // Firebase config used to create additional app to create users (HACK)
      apiKey: '########################################',
      authDomain: '########################################',
      databaseURL: '########################################',
      projectId: '########################################',
      storageBucket: '########################################'
    }

const providerConfig = {
  admin: {
    path: '/people/',
    validate: (user) => user.isAdmin && user.isEmployee // Validate that user may sign in (default () => true)
  },
  keys: {
    // Keys for local storage
    permissions: 'user',
    token: 'firebase'
  }
}

// Ensure firebase is initialized first
firebase.initializeApp(firebaseConfig)

class App extends Component {
  render () {
    return <Admin
      title='Demo'
      loginPage={Login}
      dashboard={Dashboard}
      authProvider={FirebaseAuthProvider(providerConfig)}
    >
      <Resource
        icon={Store}
        options={{ label: 'Assets' }}
        name='assets'
        list={AssetsList}
        edit={AssetsEdit}
        create={AssetsCreate}
      />
    </Admin>
  }
}

export default App
