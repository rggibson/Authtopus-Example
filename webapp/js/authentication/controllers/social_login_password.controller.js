/**
 * SocialLoginPasswordController
 * @namespace authtopusexample.authentication.controllers
 */
( function ( ) {
  'use strict';

  angular
    .module( 'authtopusexample.authentication.controllers' )
    .controller( 'SocialLoginPasswordController',
		 SocialLoginPasswordController );

  SocialLoginPasswordController.$inject = [ '$location', '$scope', '$http',
					    '$routeParams', 'Constants',
					    'Authentication' ];

  /**
   * @namespace SocialLoginPasswordController
   */
  function SocialLoginPasswordController( $location, $scope, $http,
					  $routeParams, Constants,
					  Authentication ) {
    var vm = this;

    vm.login = login;
    
    activate( );

    /**
     * @name active
     * @desc Grab route params and make sure we can be here
     * @memberOf authtopusexample.authentication.controller.SocialLoginPasswordController
     */
    function activate( ) {
      /* If we have no user object, access token, or provider,
       * we should not be here
       */
      vm.user = Authentication.getUser( );
      if( !vm.user || !( $routeParams.access_token )
	  || !( $routeParams.provider ) ) {
	$location.url( '/' );
      }
    }

    /**
     * @name login
     * @desc Completes a social login
     * @memberOf authtopusexample.authentication.controllers.SocialLoginPasswordController
     */
    function login( ) {
      /* Reset errors */
      vm.password_error = '';
      vm.misc_error = '';
      
      if( !vm.password ) {
	vm.password_error = 'Password required!';
	return;
      }
      $http.post( Constants.serverRoot + '/auth/v1.0/social_login', {
	access_token: $routeParams.access_token,
	provider: $routeParams.provider,
	password: vm.password
      } ).then( loginSuccessFn, loginFailFn );

      function loginSuccessFn( response ) {
	Authentication.completeLogin( response );
	$location.url( Constants.editProfilePathPrefix
		       + Authentication.getUser( ).username );
      }

      function loginFailFn( response ) {
	var error = response.data.error;
	
	if( error && error.code == 401 ) {
	  vm.password_error = response.data.error.message;
	} else if( error && error.code < 500 ) {
	  vm.misc_error = response.data.error.message;
	} else {
	  vm.misc_error = ( "Failed to complete login due to an unknown "
			    + "error. Please try again later." );
	}
      }
    }
  }
  
} )( );
