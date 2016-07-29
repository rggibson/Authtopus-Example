/**
 * ProfileController
 * @namespace authtopusexample.authentication.controllers
 */
( function( ) {
  'use strict';

  angular
    .module( 'authtopusexample.authentication.controllers' )
    .controller( 'ProfileController', ProfileController );

  ProfileController.$inject = [ '$scope',
				'$routeParams',
				'$location',
				'Constants',
				'Authentication' ];

  /**
   * @namespace ProfileController
   */
  function ProfileController( $scope, $routeParams, $location,
			      Constants, Authentication ) {
    var vm = this;

    vm.user = null;
    vm.verified_email = true;
    vm.oldPassword = '';
    vm.newPassword = '';
    vm.verifyPassword = '';
    vm.verifyEmailSentMsg = '';
    vm.saveProfile = saveProfile;
    vm.sendVerificationEmail = sendVerificationEmail;

    activate( );

    /**
     * @name activate
     * @desc Initialize user local variable
     * @memberOf authtopusexample.authentication.controllers.ProfileController
     */
    function activate( ) {
				      
      Authentication.authenticatedRequest( 'GET', '/auth/v1.0/get_user', {
	username: $routeParams.username
      } ).then( getUserSuccessFn, getUserFailFn );

      function getUserSuccessFn( response ) {
	console.log( 'Get user success function hit' );
	vm.user = response.data;
	vm.verified_email
	  = ( !vm.user.email_pending
	      || ( vm.user.email_verified
		   && ( vm.user.email_pending.toLowerCase( )
			== vm.user.email_verified.toLowerCase( ) ) ) );
      }

      function getUserFailFn( error ) {
	console.log( 'Get user fail function hit: ' + error.message );
	$location.url( '/' );
      }
    }

    /**
     * @name saveProfile
     * @desc Saves changes made to a user's profile
     * @memberOf authtopusexample.authentication.controllers.ProfileController
     */
    function saveProfile( ) {
      /* First, clear all error messages */
      vm.email_error = '';
      vm.username_error = '';
      vm.old_password_error = '';
      vm.new_password_error = '';
      vm.verify_password_error = '';
      vm.misc_error = '';
      
      /* Start by making sure that new password matches verify password */
      if( vm.new_password !== vm.verify_password ) {
	vm.verify_password_error = "New passwords don't match!";
	vm.new_password = '';
	vm.verify_password = '';
	return;
      }
      
      Authentication.authenticatedRequest( 'POST', '/auth/v1.0/update_user', {
	old_username: $routeParams.username,
	email: vm.user.email_pending,
	username: vm.user.username,
	old_password: vm.old_password,
	password: vm.new_password,
	verification_url: ( $location.protocol( ) + '://' + $location.host( )
			    + Constants.verificationPath )
	} ).then( saveProfileSuccessFn, saveProfileFailFn );

      function saveProfileSuccessFn( response ) {
	console.log( 'Save profile success hit. Response:' );
	console.log( response );
	/* If we made changes to the authenticated user, update it */
	var auth_user = Authentication.getUser( );
	if( auth_user && ( auth_user.username.toLowerCase( )
			   == $routeParams.username.toLowerCase( ) ) ) {
	  Authentication.setUser( response.data );
	}
	$location.url( '/' );
      }

      function saveProfileFailFn( error ) {
	var error_found = false;

	if( error.code == 401 ) {
	  vm.misc_error = error.message;
	  error_found = true;
	} else if( error.code == 400 || error.code == 409 ) {
	  var parts = error.message.split( '|' );
	  for( var i = 0; i < parts.length; ++i ) {
	    var err = parts[ i ].split( ':' );
	    if( err.length == 2 ) {
	      if( err[ 0 ] == 'email' ) {
		vm.email_error = err[ 1 ];
		error_found = true;
	      } else if( err[ 0 ] == 'username' ) {
		vm.username_error = err[ 1 ];
		error_found = true;
	      } else if( err[ 0 ] == 'old_password' ) {
		vm.old_password_error = err[ 1 ];
		vm.old_password = '';
		error_found = true;
	      } else if( err[ 0 ] == 'new_password' ) {
		vm.new_password_error = err[ 1 ];
		vm.new_password = '';
		vm.verify_password = '';
		error_found = true;
	      }
	    }
	  }
	}

	if( !error_found ) {
	  vm.misc_error = ( 'An unknown error occurred when attempting to '
			    + 'save profile. Please try again later.' );
	}
      }
    }

    /**
     * @name sendVerificationEmail
     * @desc Sends an email to the user requesting email verification
     * @memberOf authtopusexample.authentication.controllers.ProfileController
     */
    function sendVerificationEmail( ) {
      Authentication.authenticatedRequest(
	'POST', '/auth/v1.0/send_email_verification', {
	  username: $routeParams.username,
	  verification_url: ( $location.protocol( ) + '://' + $location.host( )
			      + Constants.verificationPath )
	} ).then( sendVerificationEmailSuccessFn, sendVerificationEmailFailFn );

      function sendVerificationEmailSuccessFn( response ) {
	console.log( 'Send verification success response:' );
	console.log( response );
	vm.verifyEmailSentMsg = ( 'Verification email sent to '
				  + response.data.email );
      }

      function sendVerificationEmailFailFn( error ) {
	console.error( 'Send verification email failed: ' + error.message );
	vm.verifyEmailSentMsg = ( 'An error occurred while sending '
				  + 'verification '
				  + 'email. Please try again later.' );
      }
    }
  }
} )( );
