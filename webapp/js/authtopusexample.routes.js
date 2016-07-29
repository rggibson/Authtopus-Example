( function( ) {
  'use strict'

  angular
    .module( 'authtopusexample.routes' )
    .config( config )

  config.$inject = [ '$routeProvider', 'Constants' ];

  /**
   * @name config
   * @desc Define valid application routes
   */
  function config( $routeProvider, Constants ) {
    $routeProvider.when( '/register', {
      controller: 'RegisterController',
      controllerAs: 'vm',
      templateUrl: 'templates/authentication/register.html'
      
    } ).when( '/login', {
      controller: 'LoginController',
      controllerAs: 'vm',
      templateUrl: 'templates/authentication/login.html'

    } ).when( Constants.editProfilePathPrefix + ':username', {
      controller: 'ProfileController',
      controllerAs: 'vm',
      templateUrl: 'templates/authentication/edit_profile.html'

    } ).when( '/user/verify', {
      controller: 'VerifyEmailController',
      controllerAs: 'vm',
      templateUrl: 'templates/authentication/verify_email.html'

    } ).when( Constants.passwordResetPath, {
      controller: 'PasswordResetController',
      controllerAs: 'vm',
      templateUrl: 'templates/authentication/password_reset.html'

    } ).when( Constants.setPasswordPath, {
      controller: 'SetPasswordController',
      controllerAs: 'vm',
      templateUrl: 'templates/authentication/set_password.html'

    } ).when( Constants.socialLoginPasswordPath, {
      controller: 'SocialLoginPasswordController',
      controllerAs: 'vm',
      templateUrl: 'templates/authentication/social_login_password.html'
      
    } ).otherwise( '/' );
  }
} )( );
