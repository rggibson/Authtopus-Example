/**
 * SetPasswordController
 * @namespace authtopusexample.authentication.controllers
 */
( function( ) {
  'use strict';

  angular
    .module( 'authtopusexample.authentication.controllers' )
    .controller( 'SetPasswordController', SetPasswordController );

  SetPasswordController.$inject = [ '$scope', '$http', '$routeParams',
				    'Constants' ];

  /**
   * @namespace SetPasswordController
   */
  function SetPasswordController( $scope, $http, $routeParams, Constants ) {
    var vm = this;

    vm.setPassword = setPassword;
    vm.setPasswordDone = false;

    /**
     * @name setPassword
     * @desc Sets the password for the user
     * @memberOf authtopusexample.authentication.controllers.SetPasswordController
     */
    function setPassword( ) {
      /* Reset errors */
      vm.new_password_error = '';
      vm.verify_password_error = '';
      vm.misc_error = '';
      
      /* Start by making sure that new password matches verify password */
      if( vm.new_password !== vm.verify_password ) {
	vm.verify_password_error = "New passwords did not match";
	vm.new_password = '';
	vm.verify_password = '';
	return;
      }

      $http.post( Constants.serverRoot + '/auth/v1.0/set_password', {
	new_password: vm.new_password,
	user_id: $routeParams.user_id,
	token: $routeParams.token
      } ).then( setPasswordSuccessFn, setPasswordFailFn );

      function setPasswordSuccessFn( response ) {
	vm.setPasswordDone = true;
      }

      function setPasswordFailFn( response ) {
	var error = response.data.error;
	
	if( error && error.code == 400 ) {
	  vm.new_password_error = response.data.error.message;
	} else if( error && error.code == 401 ) {
	  vm.misc_error = response.data.error.message;
	} else {
	  vm.misc_error = ( "Faield to set new password due to an unknown "
			    + "error. Please try again later." );
	}
      }
    }

  }
} )( );
