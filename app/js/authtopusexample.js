( function( ) {
  'use strict'

  angular
    .module( 'authtopusexample', [
      'authtopusexample.config',
      'authtopusexample.routes',
      'authtopusexample.constants',
      'authtopusexample.authentication',
      'authtopusexample.layout'
    ] );

  angular
    .module( 'authtopusexample.config', [ ] );

  angular
    .module( 'authtopusexample.routes',
	     [ 'ngRoute', 'authtopusexample.constants' ] );

  angular
    .module( 'authtopusexample' )
    .run( run );

  run.$inject = [ '$rootScope', '$window' ];

  /**
   * @name run
   * @desc Set flag when FB auth SDK loads so that we know when our FB login
   * button will work.
   */
  function run( $rootScope, $window ) {
    $rootScope.fbInit = false;
    
    $window.fbAsyncInit = function( ) {
      FB.init( {
	appId      : '891867817566349',
	xfbml      : true,
	version    : 'v2.5'
      } );

      $rootScope.$apply( function( ) {
	$rootScope.fbInit = true;
      } );
    }
  }
  
} )( );
