/**
 * Authentication
 * @namespace authtopusexample.authentication.services
 */

( function( ) {
  'use strict';

  angular
    .module( 'authtopusexample.authentication.services' )
    .factory( 'Authentication', Authentication );

  Authentication.$inject = [ '$window', '$http', '$location', '$routeParams',
			     '$q', 'Constants' ];

  /**
   * @namespace Authentication
   * @returns {Factory}
   */
  function Authentication( $window, $http, $location, $routeParams, $q,
			   Constants ) {
    /**
     * @namespace Authentication
     * @desc The Factory to be returned
     */
    var Authentication = {
      authenticatedRequest: authenticatedRequest,
      login: login,
      logout: logout,
      register: register,
      completeLogin: completeLogin,
      socialLogin: socialLogin,
      socialLoginSuccessFn: socialLoginSuccessFn,
      updateUser: updateUser,
      getUser: getUser,
      setUser: setUser
    };

    var user = null;

    return Authentication;

    /**
     * @name authticatedRequest
     * @desc Makes a request to the server with user authentication
     * @param {string} method HTTP method to use, one of {'GET', 'POST'}
     * @param {string} path Relative path for the request
     * @param {Object} data The request data to send to the server
     * @returns {Promise}
     * @memberOf authtopusexample.authentication.services.Authentication
     */
    function authenticatedRequest( method, path, data ) {
      var deferred = $q.defer( );
      var userIdAuthToken = $window.localStorage.getItem( "userIdAuthToken" );
      if( userIdAuthToken ) {
	$http.defaults.headers.common['Authorization'] = userIdAuthToken;
	if( method == 'GET' ) {
	  var params = '';
	  var first_param = true;
	  for( var key in data ) {
	    if( data.hasOwnProperty( key ) ) {
	      if( first_param ) {
		params += '?';
	      } else {
		params += '&';
	      }
	      params += key + '=' + data[ key ];
	      first_param = false;
	    }
	  }
	  $http.get( Constants.serverRoot + path + params )
	    .then( authenticatedRequestSuccessFn, authenticatedRequestFailFn );
	} else if( method == 'POST' ) {
	  $http.post( Constants.serverRoot + path, data )
	    .then( authenticatedRequestSuccessFn, authenticatedRequestFailFn );
	} else {
	  console.error( "Bad authenticated request method: " + method );
	  deferred.reject( {
	    code: 400,
	    message: "Bad authenticated request method: " + method
	  } );
	}
      } else {
	deferred.reject( {
	  code: 401,
	  message: "User not authenticated"
	} );
	user = null;
      }
      
      return deferred.promise;

      
      function authenticatedRequestSuccessFn( response ) {
	deferred.resolve( response );
      }

      function authenticatedRequestFailFn( response ) {
	deferred.reject( response.data.error );
      }
    }

    /**
     * @name register
     * @desc Try to register a new user
     * @param {string} username The username entered by the user
     * @param {string} password The password entered by the user
     * @param {string} email The email entered by the user
     * @returns {Promise}
     * @memberOf authtopusexample.authentication.services.Authentication
     */
    function register( email, password, username ) {
      return $http.post( Constants.serverRoot + '/auth/v1.0/register', {
	username: username,
	password: password,
	email: email,
	verification_url: ( $location.protocol( ) + "://" + $location.host( )
			    + Constants.verificationPath )
      } );
    }

    /**
     * @name completeLogin
     * @desc Sets authenticated user after successful login
     * @param {object} response The http response from the server after login
     * @returns {undefined}
     * @memberOf authtopusexample.authentication.services.Authentication
     */
    function completeLogin( response ) {
      $window.localStorage.setItem( "userIdAuthToken",
				    response.data.user_id_auth_token );
      user = response.data.user;
    }

    /**
     * @name login
     * @desc Try to log in with email 'email' and password 'password'
     * @param {string} email The email entered by the user
     * @param {string} password The password entered by the user
     * @returns {Promise}
     * @memberOf authtopusexample.authentication.services.Authentication
     */
    function login( username_or_email, password ) {
      return $http.post( Constants.serverRoot + '/auth/v1.0/login', {
	username_or_email: username_or_email,
	password: password
      } );
    }

    /**
     * @name logout
     * @desc Try to log the user out
     * @returns {Promise}
     * @memberOf authtopusexample.authentication.services.Authentication
     */
    function logout( ) {
      return authenticatedRequest( 'POST', '/auth/v1.0/logout', null )
	.then( logoutSuccessFn, logoutErrorFn );

      /**
       * @name logoutSuccessFn
       * @desc Unauthenticate and redirect to index with page reload
       */
      function logoutSuccessFn( response ) {
	$window.localStorage.removeItem( "userIdAuthToken" );
	user = null;
	$location.url( '/' );
      }

      /**
       * @name logoutErrorFn
       * @desc Log the logout failure to the console
       */
      function logoutErrorFn( error ) {
	console.error( 'Failed to logout!' );
      }
    }
    
    /**
     * @name fblogin
     * @desc Call the Facebook/Google API to do a login to retrieve an Auth
     * token
     * @param provider The name of the provider (only Facebook and Google
     * currently supported)
     * @param to (optional) Path to redirect to after successful login
     * @returns {Promise}
     * @memberOf authtopusexample.authentication.services.Authentication
     */
    function socialLogin( provider ) {
      var deferred = $q.defer( );
      
      if( provider.toLowerCase( ) === 'facebook' ) {
	FB.login( fbLoginButtonFinishFn, { scope: 'public_profile,email' } );
      } else if( provider.toLowerCase( ) === 'google' ) {
	gapi.auth.authorize(
	  { 'client_id': '412896030843-s57fn5q6b931fq8ljckcvukah376qv9b.apps.googleusercontent.com',
	    'scope': 'email',
	    'immediate': false }, googleLoginButtonFinishFn );
      } else {
	deferred.reject( {
	  status: 400,
	  data: {
	    error: {
	      message: 'Unexpected provider [' + provider + ']'
	    }
	  }
	} );
      }

      return deferred.promise;

      /**
       * @name fbLoginButtonFinishFn
       * @desc Handle the response of the Facebook login attempt, logging the
       * user into our app if successful.
       * @returns {Promise}
       */
      function fbLoginButtonFinishFn( response ) {
	console.log( 'FB Login button finished, response:' );
	console.log( response );

	if( response.status === 'connected' ) {
	  return $http.post( Constants.serverRoot
			     + '/auth/v1.0/social_login', {
	    access_token: response.authResponse.accessToken,
	    provider: 'Facebook'
	  } ).then( function( response ) { deferred.resolve( response ) },
		    function( response ) { deferred.reject( response ) } );
	} else {
	  deferred.reject( {
	    data: {
	      error: {
		message: 'Failed to connect to Facebook.'
	      }
	    }
	  } );
	}
      }

      /**
       * @name googleLoginButtonFinishFn
       * @desc Handle the response of the Facebook login attempt, logging the
       * user into our app if successful.
       * @returns {Promise}
       */
      function googleLoginButtonFinishFn( authResult ) {
	console.log( 'Google Login button finished! authResult:' );
	console.log( authResult );

	if( authResult ) {
	  return $http.post( Constants.serverRoot
			     + '/auth/v1.0/social_login/', {
	    access_token: authResult.access_token,
	    provider: 'Google'
	  } ).then( function( response ) { deferred.resolve( response ) },
		    function( response ) { deferred.reject( response ) } );
	} else {
	  console.error( "Invalid authResult!" );
	}
      }
    }

    /**
     * @name socialLoginSuccessFn
     * @desc Check if we needs to supply password and redirect appropriately
     */
    function socialLoginSuccessFn( response ) {
      console.log( "Login success function hit. Response:" );
      console.log( response );
      /* Store login credentials */
      completeLogin( response );
      /* Redirect as appropriate */
      if( response.data.password_required ) {
	$location.url( Constants.socialLoginPasswordPath + '?provider='
		       + response.data.provider + '&access_token='
		       + response.data.access_token );
      } else {
	var to = ( typeof $routeParams.to !== 'undefined' ? $routeParams.to
		   : Constants.editProfilePathPrefix + user.username );
	$location.url( to );
      }
    }

    /**
     * @name updateUser
     * @desc Updates and retrieves the currently logged in user
     * @returns {Promise}
     * @memberOf authtopusexample.authentication.services.Authentication
     */
    function updateUser( ) {
      var deferred = $q.defer( );
      if( user !== null ) {
	deferred.resolve( user );
      } else {
	authenticatedRequest( 'GET', '/auth/v1.0/current_user', null )
	  .then( updateAuthenticatedUserSuccessFn,
		 updateAuthenticatedUserFailFn );
      }

      return deferred.promise;

      function updateAuthenticatedUserSuccessFn( response ) {
	console.log( 'Update authenticated user successful. response.data:' );
	console.log( response.data );
	user = response.data;
	deferred.resolve( user );
      }

      function updateAuthenticatedUserFailFn( error ) {
	console.error( 'Failed to update authenticated user!  error:' );
	console.log( error );
	user = null;
	deferred.reject( user );
      }
    }

    /**
     * @name getUser
     * @desc Gets the currently logged in user
     * @returns {User object}
     * @memberOf authtopusexample.authentication.services.Authentication
     */
    function getUser( ) {
      return user;
    }

    /**
     * @name setUser
     * @desc Sets the currently logged in user
     * @returns {undefined}
     * @memberOf authtopusexample.authentication.services.Authentication
     */
    function setUser( _user ) {
      user = _user;
    }
  }
  
} )( );
