/**
 * LoginController
 * @namespace authtopusexample.authentication.controllers
 */
( function( ) {
  'use strict';

  angular
    .module( 'authtopusexample.authentication.controllers' )
    .controller( 'LoginController', LoginController );

  LoginController.$inject = [ '$location', '$scope', '$routeParams',
			      '$rootScope', 'Constants', 'Authentication' ];

  /**
   * @namespace LoginController
   */
  function LoginController( $location, $scope, $routeParams, $rootScope,
			    Constants, Authentication ) {
    var vm = this;

    vm.login = login;
    vm.socialLogin = socialLogin;
    vm.passwordResetPath = Constants.passwordResetPath;
    vm.fbInit = function( ) { return $rootScope.fbInit; }

    activate( );

    /**
     * @name active
     * @desc Actions to be performed when this controller is instantiated
     * @memberOf authtopusexample.authentication.controllers.LoginController
     */
    function activate( ) {
      /* If the user is authenticated, they should not be here. */
      Authentication.updateUser( ).then( function( user ) {
	$location.url( '/' );
      } );
    }

    /**
     * @name login
     * @desc Login the user
     * @memberOf authtopusexample.authentication.controllers.LoginController
     */
    function login( ) {
      Authentication.login( vm.username_or_email, vm.password )
	.then( loginSuccessFn, loginFailFn );

      function loginSuccessFn( response ) {
	/* Store login credentials */
	Authentication.completeLogin( response );
	/* Redirect, defaulting to edit profile page */
	var to = ( typeof $routeParams.to !== 'undefined' ? $routeParams.to
		   : ( Constants.editProfilePathPrefix
		       + Authentication.getUser( ).username ) );
	$location.url( to );
      }

      function loginFailFn( response ) {
	/* Set error message and clear password field */
	vm.error = response.data.error.message;
	vm.password = '';
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
