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
    console.log( "FB not initialized" );

    /* Basic FB auth setup:
     * https://developers.facebook.com/docs/javascript/quickstart
     */
    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    $window.fbAsyncInit = function( ) {
      FB.init( {
	appId      : '891867817566349',
	xfbml      : true,
	version    : 'v2.5'
      } );

      console.log( "FB initialized" );
      $rootScope.$apply( function( ) {
	$rootScope.fbInit = true;
      } );
    }
  }
  
} )( );
