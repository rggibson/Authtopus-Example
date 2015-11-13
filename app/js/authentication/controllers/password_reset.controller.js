/**
 * PasswordResetController
 * @namespace authtopusexample.authentication.controllers
 */
( function( ) {
  'use strict';

  angular
    .module( 'authtopusexample.authentication.controllers' )
    .controller( 'PasswordResetController', PasswordResetController );

  PasswordResetController.$inject = [ '$location', '$scope', '$http',
				      'Constants' ];

  /**
   * @namespace PasswordResetController
   */
  function PasswordResetController( $location, $scope, $http, Constants ) {
    var vm = this;

    vm.resetPassword = resetPassword;
    vm.passwordResetSentMsg = '';

    /**
     * @name resetPassword
     * @desc Sends a password reset email to the given address
     * @memberOf authtopusexample.authentication.controllers.PasswordResetController
     */
    function resetPassword( ) {
      /* Reset errors */
      vm.email_error = '';
      vm.misc_error = '';
      
      $http.post( Constants.serverRoot + '/auth/v1.0/password_reset', {
	email: vm.email,
	set_password_url: ( $location.protocol( ) + "://" + $location.host( )
			    + Constants.setPasswordPath )
      } ).then( resetPasswordSuccessFn, resetPasswordFailFn );

      function resetPasswordSuccessFn( response ) {
	vm.passwordResetSentMsg = ( 'Reset password link sent to '
				    + response.data.email );
      }

      function resetPasswordFailFn( response ) {
	var error = response.data.error;
	
	if( error && error.code == 400 ) {
	  vm.email_error = error.message;
	} else if( error && error.message ) {
	  vm.misc_error = error.message;
	} else {
	  vm.misc_error = ( "Failed to send reset password email due to an "
			    + "unknown error. Please try again later." );
	}
      }
    }

  }
} )( );
