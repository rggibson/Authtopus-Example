( function( ) {
  'use strict';

  angular.module('authtopusexample.constants', [ ] )
    .constant('Constants', {
      serverRoot: '_ah/api',
      editProfilePathPrefix: '/user/edit/',
      verificationPath: '/user/verify',
      passwordResetPath: '/password-reset',
      setPasswordPath: '/set-password',
      socialLoginPasswordPath: '/social-login-password'
    } );
  
} )( );
