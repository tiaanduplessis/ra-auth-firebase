(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react-admin'), require('firebase'), require('deep-assign')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react-admin', 'firebase', 'deep-assign'], factory) :
  (factory((global.raAuthFirebase = {}),null,global.firebase,null));
}(this, (function (exports,reactAdmin,firebase,deepAssign) {
  firebase = firebase && firebase.hasOwnProperty('default') ? firebase['default'] : firebase;
  deepAssign = deepAssign && deepAssign.hasOwnProperty('default') ? deepAssign['default'] : deepAssign;

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


  //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF1dGgtcHJvdmlkZXIuanMob3JpZ2luYWwpIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFFBQVMsWUFBWSxhQUFhLFlBQVksMkJBQTRCO0FBQzFFLE9BQU8sY0FBYztBQUNyQixPQUFPLGdCQUFnQjtBQUV2QixLQUFBLENBQU0sYUFBYTtJQUNqQixPQUFPO1FBQ0wsTUFBTSxTQURELENBQUE7UUFFTCxhQUFVLEdBQU07S0FIRCxDQUFBO0lBS2pCLE1BQU07UUFDSixhQUFhLE1BRFQsQ0FBQTtRQUVKLE9BQU87S0FQUSxDQUFBO0lBU2pCLHdCQUE4QixJQUFNLEVBQUEsUUFBYjtRQUNyQixJQUFJLE1BQU07O1lBQ0YsT0FBTyxNQUFBLENBQU8sS0FBUCxDQUFhLElBQWIsQ0FBQSxDQUFBLENBQW9CLElBQUEsQ0FBSztZQUNyQixPQUFNLFFBQUEsQ0FBUyxRQUFULEVBQUEsQ0FBb0IsR0FBcEIsQ0FBd0IsS0FBeEIsQ0FBOEIsSUFBOUIsQ0FBbUMsU0FBekM7O29CQUFYLFdBQVc7b0JBQ1gsVUFBVSxRQUFBLENBQVMsR0FBVDtvQkFFaEIsSUFBSSxPQUFBLENBQUEsR0FBQSxDQUFZLFNBQVosQ0FBQSxFQUFBLENBQXlCLE9BQUEsQ0FBQSxHQUFBLENBQVksSUFBckMsQ0FBQSxFQUFBLENBQTZDLE1BQUEsQ0FBTyxLQUFQLENBQWEsUUFBYixDQUFzQixVQUFVOzt3QkFDekUsZ0JBQWdCLElBQUEsQ0FBSyxVQUFMO3dCQUN0QixHQUFBLENBQUksT0FBTzs0QkFBRSxPQUFGLENBQUE7NEJBQVc7O3dCQUN0QixZQUFBLENBQWEsT0FBYixDQUFxQixNQUFBLENBQU8sSUFBUCxDQUFZLE9BQU87d0JBQ3hDLFlBQUEsQ0FBYSxPQUFiLENBQXFCLE1BQUEsQ0FBTyxJQUFQLENBQVksYUFBYSxJQUFBLENBQUssU0FBTCxDQUFlO3dCQUM3RCxlQUFPO29CQUNmLE9BQWE7d0JBQ0wsUUFBQSxDQUFTLElBQVQsRUFBQSxDQUFnQixPQUFoQjt3QkFDQSxZQUFBLENBQWEsVUFBYixDQUF3QixNQUFBLENBQU8sSUFBUCxDQUFZO3dCQUNwQyxlQUFPLE9BQUEsQ0FBUSxNQUFSLENBQWUsSUFBSSxLQUFKLENBQVU7b0JBQ3hDOzs7Ozs7UUFDQSxPQUFXO1lBQ0wsWUFBQSxDQUFhLFVBQWIsQ0FBd0IsTUFBQSxDQUFPLElBQVAsQ0FBWTs7UUFDMUM7Ozs7Ozs7QUFJQSxnQkFBZ0IsTUFBQSxHQUFTLElBQVYsR0FBaUI7SUFDOUIsTUFBQSxDQUFBLENBQUEsQ0FBUyxVQUFBLENBQVcsSUFBSSxZQUFZO0lBRXBDLEtBQUEsQ0FBTSxvQkFBaUIsR0FBTSxJQUFJLE9BQUosQ0FBWSxPQUFBLElBQVc7UUFDbEQsUUFBQSxDQUFTLElBQVQsRUFBQSxDQUFnQixrQkFBaEIsQ0FBbUM7SUFDdkM7SUFFRSxRQUFjLElBQU0sRUFBQSxRQUFiO1FBQ0wsSUFBSSxJQUFBLENBQUEsR0FBQSxDQUFTLGFBQWE7WUFDeEIsT0FBTSxNQUFBLENBQU8scUJBQVAsQ0FBNkIsTUFBTSxRQUF6Qzs7b0JBQ0EsZUFBTyxRQUFBLENBQVMsSUFBVCxFQUFBLENBQWdCLE9BQWhCOzs7OztRQUNiO1FBRUksSUFBSSxRQUFBLENBQVMsSUFBVCxFQUFBLENBQWdCLGFBQWE7WUFDL0IsT0FBTSxRQUFBLENBQVMsSUFBVCxFQUFBLENBQWdCLFdBQWhCLENBQTRCLE1BQTVCLEdBQU47Ozs7Ozs7UUFDTjs7WUFFSSxJQUFJLElBQUEsQ0FBQSxHQUFBLENBQVMsWUFBWTtnQkFDdkIsT0FBTSxjQUFBLEdBQU47O3dCQUVBLElBQUksQ0FBQyxRQUFBLENBQVMsSUFBVCxFQUFBLENBQWdCLGFBQWE7NEJBQ2hDLGVBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBZSxJQUFJLEtBQUosQ0FBVTt3QkFDeEM7d0JBRU0sZUFBTzs7Ozs7WUFDYjtZQUVJLElBQUksSUFBQSxDQUFBLEdBQUEsQ0FBUyxZQUFZOztpQkFDakIsQ0FBRSxVQUFVLFlBQWE7Z0JBQzNCLE9BQU8sUUFBQSxDQUFTLElBQVQsRUFBQSxDQUFnQjtnQkFFM0IsSUFBSSxDQUFDLE1BQU07Ozs7Ozs7O2lEQUdBLE9BQU87OzRCQUNkLGVBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBZTs7OztvQkFDaEM7b0JBSlEsSUFBSTt3QkFDSyxPQUFNLFFBQUEsQ0FBUyxJQUFULEVBQUEsQ0FBZ0IsMEJBQWhCLENBQTJDLFVBQVUsVUFBM0Q7O2dDQUFQLElBQUEsQ0FBQSxDQUFBLENBQU87Ozs7OztvQkFDakIsQ0FBVSxRQUFPLE9BQU87cUNBQVA7b0JBRWpCO2dCQUNBOztvQkFFTSxlQUFPLE1BQUEsQ0FBTyxxQkFBUCxDQUE2QixNQUFNOzs7O1lBQ2hEOztnQkFFSSxJQUFJLElBQUEsQ0FBQSxHQUFBLENBQVMsc0JBQXNCOztvQkFDM0IsT0FBTyxZQUFBLENBQWEsT0FBYixDQUFxQixNQUFBLENBQU8sSUFBUCxDQUFZO29CQUM5QyxlQUFPLElBQUEsR0FBTyxPQUFBLENBQVEsT0FBUixDQUFnQixJQUFBLENBQUssS0FBTCxDQUFXLFNBQVMsT0FBQSxDQUFRLE1BQVIsQ0FBZSxJQUFJLEtBQUosQ0FBVTtnQkFDakY7Z0JBRUksZUFBTzs7O1lBTFAsSUFBSSxJQUFBLENBQUEsR0FBQSxDQUFTLHNCQUFzQjs7Z0JBQzNCLE9BQU8sWUFBQSxDQUFhLE9BQWIsQ0FBcUIsTUFBQSxDQUFPLElBQVAsQ0FBWTtnQkFDOUMsZUFBTyxJQUFBLEdBQU8sT0FBQSxDQUFRLE9BQVIsQ0FBZ0IsSUFBQSxDQUFLLEtBQUwsQ0FBVyxTQUFTLE9BQUEsQ0FBUSxNQUFSLENBQWUsSUFBSSxLQUFKLENBQVU7WUFDakY7WUFFSSxlQUFPOzs7OztBQUVYO0FBckZBIiwiZmlsZSI6ImF1dGgtcHJvdmlkZXIuanMob3JpZ2luYWwpIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQVVUSF9MT0dJTiwgQVVUSF9MT0dPVVQsIEFVVEhfQ0hFQ0ssIEFVVEhfR0VUX1BFUk1JU1NJT05TIH0gZnJvbSAncmVhY3QtYWRtaW4nXG5pbXBvcnQgZmlyZWJhc2UgZnJvbSAnZmlyZWJhc2UnXG5pbXBvcnQgZGVlcEFzc2lnbiBmcm9tICdkZWVwLWFzc2lnbidcblxuY29uc3QgYmFzZUNvbmZpZyA9IHtcbiAgYWRtaW46IHtcbiAgICBwYXRoOiAnL3VzZXJzLycsXG4gICAgdmFsaWRhdGU6ICgpID0+IHRydWVcbiAgfSxcbiAga2V5czoge1xuICAgIHBlcm1pc3Npb25zOiAndXNlcicsXG4gICAgdG9rZW46ICdmaXJlYmFzZSdcbiAgfSxcbiAgaGFuZGxlQXV0aFN0YXRlQ2hhbmdlOiBhc3luYyAoYXV0aCwgY29uZmlnKSA9PiB7XG4gICAgaWYgKGF1dGgpIHtcbiAgICAgIGNvbnN0IHBhdGggPSBjb25maWcuYWRtaW4ucGF0aCArIGF1dGgudWlkXG4gICAgICBjb25zdCBzbmFwc2hvdCA9IGF3YWl0IGZpcmViYXNlLmRhdGFiYXNlKCkucmVmKHBhdGgpLm9uY2UoJ3ZhbHVlJylcbiAgICAgIGNvbnN0IHByb2ZpbGUgPSBzbmFwc2hvdC52YWwoKVxuXG4gICAgICBpZiAocHJvZmlsZSAhPT0gdW5kZWZpbmVkICYmIHByb2ZpbGUgIT09IG51bGwgJiYgY29uZmlnLmFkbWluLnZhbGlkYXRlKHByb2ZpbGUpKSB7XG4gICAgICAgIGNvbnN0IGZpcmViYXNlVG9rZW4gPSBhdXRoLmdldElkVG9rZW4oKVxuICAgICAgICBsZXQgdXNlciA9IHsgcHJvZmlsZSwgZmlyZWJhc2VUb2tlbiB9XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGNvbmZpZy5rZXlzLnRva2VuLCBmaXJlYmFzZVRva2VuKVxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShjb25maWcua2V5cy5wZXJtaXNzaW9ucywgSlNPTi5zdHJpbmdpZnkocHJvZmlsZSkpXG4gICAgICAgIHJldHVybiB1c2VyXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaXJlYmFzZS5hdXRoKCkuc2lnbk91dCgpXG4gICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGNvbmZpZy5rZXlzLnRva2VuKVxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdPb3BzISBZb3UgZG9uXFwndCBzZWVtIHRvIGJlIGEgYXV0aG9yaXplZCB1c2VyJykpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGNvbmZpZy5rZXlzLnRva2VuKVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCAoY29uZmlnID0ge30pID0+IHtcbiAgY29uZmlnID0gZGVlcEFzc2lnbih7fSwgYmFzZUNvbmZpZywgY29uZmlnKVxuXG4gIGNvbnN0IGZpcmViYXNlTG9hZGVkID0gKCkgPT4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgZmlyZWJhc2UuYXV0aCgpLm9uQXV0aFN0YXRlQ2hhbmdlZChyZXNvbHZlKVxuICB9KVxuXG4gIHJldHVybiBhc3luYyAodHlwZSwgcGFyYW1zKSA9PiB7XG4gICAgaWYgKHR5cGUgPT09IEFVVEhfTE9HT1VUKSB7XG4gICAgICBhd2FpdCBjb25maWcuaGFuZGxlQXV0aFN0YXRlQ2hhbmdlKG51bGwsIGNvbmZpZylcbiAgICAgIHJldHVybiBmaXJlYmFzZS5hdXRoKCkuc2lnbk91dCgpXG4gICAgfVxuXG4gICAgaWYgKGZpcmViYXNlLmF1dGgoKS5jdXJyZW50VXNlcikge1xuICAgICAgYXdhaXQgZmlyZWJhc2UuYXV0aCgpLmN1cnJlbnRVc2VyLnJlbG9hZCgpXG4gICAgfVxuXG4gICAgaWYgKHR5cGUgPT09IEFVVEhfQ0hFQ0spIHtcbiAgICAgIGF3YWl0IGZpcmViYXNlTG9hZGVkKClcblxuICAgICAgaWYgKCFmaXJlYmFzZS5hdXRoKCkuY3VycmVudFVzZXIpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignT29wcyEgWW91IGRvblxcJ3Qgc2VlbSB0byBiZSBzaWduZWQgaW4uJykpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaWYgKHR5cGUgPT09IEFVVEhfTE9HSU4pIHtcbiAgICAgIGNvbnN0IHsgdXNlcm5hbWUsIHBhc3N3b3JkIH0gPSBwYXJhbXNcbiAgICAgIGxldCBhdXRoID0gZmlyZWJhc2UuYXV0aCgpLmN1cnJlbnRVc2VyXG5cbiAgICAgIGlmICghYXV0aCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGF1dGggPSBhd2FpdCBmaXJlYmFzZS5hdXRoKCkuc2lnbkluV2l0aEVtYWlsQW5kUGFzc3dvcmQodXNlcm5hbWUsIHBhc3N3b3JkKVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcilcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gY29uZmlnLmhhbmRsZUF1dGhTdGF0ZUNoYW5nZShhdXRoLCBjb25maWcpXG4gICAgfVxuXG4gICAgaWYgKHR5cGUgPT09IEFVVEhfR0VUX1BFUk1JU1NJT05TKSB7XG4gICAgICBjb25zdCBkYXRhID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oY29uZmlnLmtleXMucGVybWlzc2lvbnMpXG4gICAgICByZXR1cm4gZGF0YSA/IFByb21pc2UucmVzb2x2ZShKU09OLnBhcnNlKGRhdGEpKSA6IFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignQ291bGQgbm90IGdldCBwZXJtaXNzaW9ucycpKVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG4iXX0=

  //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzKG9yaWdpbmFsKSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLDBCQUEwQjtBQUVqQyxPQUFBLENBQVM7QUFGVCIsImZpbGUiOiJpbmRleC5qcyhvcmlnaW5hbCkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRmlyZWJhc2VBdXRoUHJvdmlkZXIgZnJvbSAnLi9hdXRoLXByb3ZpZGVyJ1xuXG5leHBvcnQgeyBGaXJlYmFzZUF1dGhQcm92aWRlciB9XG4iXX0=

  exports.FirebaseAuthProvider = authProvider;

})));
//# sourceMappingURL=ra-auth-firebase.umd.js.map
