import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_CHECK, AUTH_GET_PERMISSIONS } from 'react-admin'
import firebase from 'firebase'
import deepAssign from 'deep-assign'

const baseConfig = {
  admin: {
    path: '/users/',
    validate: () => true
  },
  keys: {
    permissions: 'user',
    token: 'firebase'
  },
  handleAuthStateChange: async (auth, config) => {
    if (auth) {
      const path = config.admin.path + auth.uid
      const snapshot = await firebase.database().ref(path).once('value')
      const profile = snapshot.val()

      if (profile !== undefined && profile !== null && config.admin.validate(profile)) {
        const firebaseToken = auth.getIdToken()
        let user = { profile, firebaseToken }
        localStorage.setItem(config.keys.token, firebaseToken)
        localStorage.setItem(config.keys.permissions, JSON.stringify(profile))
        return user
      } else {
        firebase.auth().signOut()
        localStorage.removeItem(config.keys.token)
        return Promise.reject(new Error('Oops! You don\'t seem to be a authorized user'))
      }
    } else {
      localStorage.removeItem(config.keys.token)
    }
  }
}

export default (config = {}) => {
  config = deepAssign({}, baseConfig, config)

  const firebaseLoaded = () => new Promise(resolve => {
    firebase.auth().onAuthStateChanged(resolve)
  })

  return async (type, params) => {
    if (type === AUTH_LOGOUT) {
      await config.handleAuthStateChange(null, config)
      return firebase.auth().signOut()
    }

    if (firebase.auth().currentUser) {
      await firebase.auth().currentUser.reload()
    }

    if (type === AUTH_CHECK) {
      await firebaseLoaded()

      if (!firebase.auth().currentUser) {
        return Promise.reject(new Error('Oops! You don\'t seem to be signed in.'))
      }

      return true
    }

    if (type === AUTH_LOGIN) {
      const { username, password } = params
      let auth = firebase.auth().currentUser

      if (!auth) {
        try {
          auth = await firebase.auth().signInWithEmailAndPassword(username, password)
        } catch (error) {
          return Promise.reject(error)
        }
      }

      return config.handleAuthStateChange(auth, config)
    }

    if (type === AUTH_GET_PERMISSIONS) {
      const data = localStorage.getItem(config.keys.permissions)
      return data ? Promise.resolve(JSON.parse(data)) : Promise.reject(new Error('Could not get permissions'))
    }

    return false
  }
}
