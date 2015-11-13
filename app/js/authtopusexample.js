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

  run.$inject = [ '$http' ];

  /**
   * @name run
   * @desc Do nothing for now
   */
  function run( $http ) {
  }
  
} )( );
