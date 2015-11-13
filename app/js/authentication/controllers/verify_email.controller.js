/**
 * VerifyEmailController
 * @namespace authtopusexample.authentication.controllers
 */
( function( ) {
  'use strict';

  angular
    .module( 'authtopusexample.authentication.controllers' )
    .controller( 'VerifyEmailController', VerifyEmailController );

  VerifyEmailController.$inject = [ '$scope',
				    '$routeParams',
				    '$location',
				    'Authentication',
				    'Constants' ];

  /**
   * @namespace VerifyEmailController
   */
  function VerifyEmailController( $scope, $routeParams, $location,
				  Authentication, Constants ) {
    var vm = this;

    vm.verified = false;
    vm.error = false;

    activate( );

    /**
     * @name activate
     * @desc Try to verify email address
     * @memberOf authtopusexample.authentication.controllers.VerifyEmailController
     */
    function activate( ) {
      Authentication.authenticatedRequest( 'POST', '/auth/v1.0/verify_email', {
	token: $routeParams.token
      } ).then( verifyEmailSuccessFn, verifyEmailFailFn );

      function verifyEmailSuccessFn( response ) {
	vm.verified = true;
      }

      function verifyEmailFailFn( error ) {
	console.error( error );
	if( error.code == 401 ) {
	  /* Reroute to login page */
	  $location.url( '/login?to=' + $location.path( ) + '?token='
			 + $routeParams.token );
	} else {
	  vm.error = true;
	}
      }
    }
  }
} )( );
