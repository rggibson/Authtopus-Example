/**
 * RegisterController
 * @namespace authtopusexample.authentication.controllers
 */
( function ( ) {
  'use strict';

  angular
    .module( 'authtopusexample.authentication.controllers' )
    .controller( 'RegisterController', RegisterController );

  RegisterController.$inject = [ '$location', '$scope', '$rootScope',
				 'Constants', 'Authentication' ];

  /**
   * @namespace RegisterController
   */
  function RegisterController( $location, $scope, $rootScope,
			       Constants, Authentication ) {
    var vm = this;

    vm.register = register;
    vm.socialLogin = socialLogin;
    vm.passwordResetPath = Constants.passwordResetPath;
    vm.fbInit = function( ) { return $rootScope.fbInit; }
    
    activate( );

    /**
     * @name active
     * @desc Actions to be performed when this controller is instantiated
     * @memberOf authtopusexample.authentication.controllers.RegisterController
     */
    function activate( ) {
      /* If the user is authenticated, they should not be here. */
      Authentication.updateUser( ).then( function( user ) {
	$location.url( '/' );
      } );
    }

    /**
     * @name register
     * @desc Register a new user
     * @memberOf authtopusexample.authentication.controllers.RegisterController
     */
    function register( ) {
      /* Reset all of the error messages */
      vm.email_error = '';
      vm.username_error = '';
      vm.password_error = '';
      vm.verify_password_error = '';
      vm.display_forgotten_password = false;
      
      if( vm.password == vm.verify_password ) {
	Authentication.register( vm.email, vm.password, vm.username )
	  .then( registerSuccessFn, registerFailFn );
      } else {
	vm.verify_password_error = 'Passwords do not match!';
	vm.password = '';
	vm.verify_password = '';
      }

      function registerSuccessFn( response ) {
	Authentication.login( response.data.username, response.data.password )
	  .then( loginSuccessFn, loginFailFn );

	function loginSuccessFn( response ) {
	  /* Store login credentials */
	  Authentication.completeLogin( response );
	  /* Redirect to edit profile page */
	  $location.url( Constants.editProfilePathPrefix
			 + Authentication.getUser( ).username );
	}

	function loginFailFn( response ) {
	  vm.email_error = ( 'Registration completed successfully, but we can'
			     + ' not log you in for unknown reasons. Please '
			     + 'try to login later.' );
	}
      }

      function registerFailFn( response ) {
	if( response.status == 400 ) {
	  /* Bad request.  Update errors */
	  var errors = response.data.error.message.split( '|' );
	  var error_found = false;
	  for( var i = 0; i < errors.length; ++i ) {
	    var error = errors[ i ].split( ':' );
	    if( error.length == 2 ) {
	      if( error[ 0 ] == 'email' ) {
		vm.email_error = error[ 1 ];
		error_found = true;
	      } else if( error[ 0 ] == 'username' ) {
		vm.username_error = error[ 1 ];
		error_found = true;
	      } else if( error[ 0 ] == 'password' ) {
		vm.password_error = error[ 1 ];
		error_found = true;
		vm.password = '';
		vm.verify_password = '';
	      }
	    }
	  }
	  if( !error_found ) {
	    vm.email_error = ( 'Failed to register for unknown reason. Please '
			       + 'try again later.' );
	  }
	  
	} else if( response.status == 409 ) {
	  /* Conflict.  Update errors */
	  var errors = response.data.error.message.split( ':' );
	  var error_found = false;
	  for( var i = 0; i < errors.length; ++i ) {
	    if( errors[ i ] == 'email' ) {
	      vm.email_error = 'This email is already in use.';
	      vm.display_forgotten_password = true;
	      error_found = true;
	    } else if( errors[ i ] == 'username' ) {
	      vm.username_error = 'This username is already in use.';
	      error_found = true;
	    }
	  }
	  if( !error_found ) {
	    vm.email_error = ( 'There was an unknown conflict when attempting '
			       + 'to register. Please try again later.' );
	  }
	  
	} else {
	  vm.email_error = ( 'An unknown error occurred when attempting to '
			     + 'register. Please try again later.' );
	}
      }      
    }

    /**
     * @name socialLogin
     * @desc Login a user through a social provider
     * @memberOf authtopusexample.authentication.controllers.LoginController
     */
    function socialLogin( provider ) {
      Authentication.socialLogin( provider )
	.then( Authentication.socialLoginSuccessFn, socialLoginFailFn );

      function socialLoginFailFn( response ) {
	vm.social_error = response.data.error.message;
      }
    }
  }
  
} )( );
