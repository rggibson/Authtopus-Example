( function( ) {
  'use strict'

  angular
    .module( 'authtopusexample.authentication', [
      'authtopusexample.authentication.controllers',
      'authtopusexample.authentication.services'
    ] );

  angular
    .module( 'authtopusexample.authentication.controllers',
	     [ 'authtopusexample.constants' ] );

  angular
    .module( 'authtopusexample.authentication.services',
	     [ 'authtopusexample.constants' ] );
} )( );
