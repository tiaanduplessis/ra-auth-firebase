
# ra-auth-firebase
[![package version](https://img.shields.io/npm/v/ra-auth-firebase.svg?style=flat-square)](https://npmjs.org/package/ra-auth-firebase)
[![package downloads](https://img.shields.io/npm/dm/ra-auth-firebase.svg?style=flat-square)](https://npmjs.org/package/ra-auth-firebase)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![package license](https://img.shields.io/npm/l/ra-auth-firebase.svg?style=flat-square)](https://npmjs.org/package/ra-auth-firebase)
[![make a pull request](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

> Firebase auth provider for React Admin

## Table of Contents

- [About](#about)
- [Install](#install)
- [Usage](#usage)
- [Contribute](#contribute)
- [License](#License)

## About

A Firebase auth provider for [react-admin](https://www.npmjs.com/package/react-admin). Based on [aor-firebase-client](https://github.com/sidferreira/aor-firebase-client), modified and maintained to own preferences.

## Install

This project uses [node](https://nodejs.org) and [npm](https://www.npmjs.com). Ensure that [firebase](https://www.npmjs.com/package/firebase) and [react-admin](https://www.npmjs.com/package/react-admin) is installed.

```sh
$ npm install ra-auth-firebase
$ # OR
$ yarn add ra-auth-firebase
```

## Usage

```js
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

```

See 

## Contribute

1. Fork it and create your feature branch: git checkout -b my-new-feature
2. Commit your changes: git commit -am 'Add some feature'
3. Push to the branch: git push origin my-new-feature 
4. Submit a pull request

## License

MIT
    