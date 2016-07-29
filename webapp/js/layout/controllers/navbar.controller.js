/**
 * NavbarController
 * @namespace authtopusexample.layout.controllers
 */
( function ( ) {
  'use strict';

  angular
    .module( 'authtopusexample.layout.controllers' )
    .controller( 'NavbarController', NavbarController );

  NavbarController.$inject = [ '$scope', 'Authentication', 'Constants' ];

  /**
   * @namespace NavbarController
   */
  function NavbarController( $scope, Authentication, Constants ) {
    var vm = this;

    vm.logout = Authentication.logout;
    vm.getUser = Authentication.getUser;
    vm.editProfilePathPrefix = Constants.editProfilePathPrefix;

    activate( );

    function activate( ) {
      Authentication.updateUser( );
    }
  }
  
} )( );
