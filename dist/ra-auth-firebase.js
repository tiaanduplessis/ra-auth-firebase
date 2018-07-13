function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var reactAdmin = require('react-admin');
var firebase = _interopDefault(require('firebase'));
var deepAssign = _interopDefault(require('deep-assign'));

var baseConfig = {
    admin: {
        path: '/users/',
        validate: function () { return true; }
    },
    keys: {
        permissions: 'user',
        token: 'firebase'
    },
    handleAuthStateChange: function (auth, config) { return new Promise(function ($return, $error) {
        if (auth) {
            var path, snapshot, profile;
            path = config.admin.path + auth.uid;
            return firebase.database().ref(path).once('value').then((function ($await_8) {
                try {
                    snapshot = $await_8;
                    profile = snapshot.val();
                    if (profile !== undefined && profile !== null && config.admin.validate(profile)) {
                        var firebaseToken;
                        firebaseToken = auth.getIdToken();
                        var user = {
                            profile: profile,
                            firebaseToken: firebaseToken
                        };
                        localStorage.setItem(config.keys.token, firebaseToken);
                        localStorage.setItem(config.keys.permissions, JSON.stringify(profile));
                        return $return(user);
                    } else {
                        firebase.auth().signOut();
                        localStorage.removeItem(config.keys.token);
                        return $return(Promise.reject(new Error('Oops! You don\'t seem to be a authorized user')));
                    }
                    return $If_2.call(this);
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }).bind(this), $error);
        } else {
            localStorage.removeItem(config.keys.token);
            return $If_2.call(this);
        }
        function $If_2() {
            return $return();
        }
        
    }); }
};
function authProvider (config) {
    if ( config === void 0 ) config = {};

    config = deepAssign({}, baseConfig, config);
    var firebaseLoaded = function () { return new Promise(function (resolve) {
        firebase.auth().onAuthStateChanged(resolve);
    }); };
    return function (type, params) { return new Promise(function ($return, $error) {
        if (type === reactAdmin.AUTH_LOGOUT) {
            return config.handleAuthStateChange(null, config).then(function ($await_9) {
                try {
                    return $return(firebase.auth().signOut());
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }, $error);
        }
        if (firebase.auth().currentUser) {
            return firebase.auth().currentUser.reload().then((function ($await_10) {
                try {
                    return $If_4.call(this);
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }).bind(this), $error);
        }
        function $If_4() {
            var assign;

            if (type === reactAdmin.AUTH_CHECK) {
                return firebaseLoaded().then(function ($await_11) {
                    try {
                        if (!firebase.auth().currentUser) {
                            return $return(Promise.reject(new Error('Oops! You don\'t seem to be signed in.')));
                        }
                        return $return(true);
                    } catch ($boundEx) {
                        return $error($boundEx);
                    }
                }, $error);
            }
            if (type === reactAdmin.AUTH_LOGIN) {
                var username, password, auth;
                ((assign = params, username = assign.username, password = assign.password));
                auth = firebase.auth().currentUser;
                if (!auth) {
                    var $Try_1_Post = (function () {
                        try {
                            return $If_7.call(this);
                        } catch ($boundEx) {
                            return $error($boundEx);
                        }
                    }).bind(this);
                    var $Try_1_Catch = function (error) {
                        try {
                            return $return(Promise.reject(error));
                        } catch ($boundEx) {
                            return $error($boundEx);
                        }
                    };
                    try {
                        return firebase.auth().signInWithEmailAndPassword(username, password).then(function ($await_12) {
                            try {
                                auth = $await_12;
                                return $Try_1_Post();
                            } catch ($boundEx) {
                                return $Try_1_Catch($boundEx);
                            }
                        }, $Try_1_Catch);
                    } catch (error) {
                        $Try_1_Catch(error);
                    }
                }
                function $If_7() {
                    return $return(config.handleAuthStateChange(auth, config));
                }
                
                return $If_7.call(this);
            }
            
            if (type === reactAdmin.AUTH_GET_PERMISSIONS) {
                var data;
                data = localStorage.getItem(config.keys.permissions);
                return $return(data ? Promise.resolve(JSON.parse(data)) : Promise.reject(new Error('Could not get permissions')));
            }
            return $return(false);
        }
        
        return $If_4.call(this);
    }); };
}

exports.FirebaseAuthProvider = authProvider;
//# sourceMappingURL=ra-auth-firebase.js.map
