'use strict'

var app = angular.module("app", ["ui.bootstrap", "ui.router"]);

app.run(['$rootScope', '$state', '$stateParams', function (rootScope, state, stateParams) {

    // It's very handy to add references to $state and $stateParams to the $rootScope
    // so that you can access them from any scope within your applications.For example,
    // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
    // to active whenever 'contacts.list' or one of its decendents is active.
    rootScope.state = state;
    rootScope.stateParams = stateParams;

    rootScope.company={
      name:"<span class='s1'>Sharada</span> <span class='s2'>Software</span> <span class='s3'>Solutions</span>",
      alias:"SSS",
      domain:"sharadasoft.com",
      slogon:"",
      logo:"logo.png",
      branches:[
            {branchId:"1001", location:{address:"6th Floor, Quadrant No: 3, Cyber Towers, Hitec City", city:"Hyderabad", state:"Telengana", pin:"", country:"India"}, mobile:"091-9885514982", phone:"040-24601181", email:"hr@sharadasoft.com" },
            {branchId:"1002", location:{address:"38725 Lexington Street", city:"Fremont", state:"California", pin:"94538", country:"US"}, mobile:"605-218-5163", phone:"605-218-5163", email:"hr@sharadasoft.com" },
            {branchId:"1003", location:{address:"", city:"Seattle", state:"Washington", pin:"", country:"US"}, mobile:"425-270-5178", phone:"425-270-5178", email:"hr@sharadasoft.com" }
            ]
    };

    }]);

app.config(['$stateProvider', '$urlRouterProvider', function (stateProvider, urlRouterProvider) {

      /////////////////////////////
      // Redirects and Otherwise //
      /////////////////////////////

      // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
      urlRouterProvider

        // The `when` method says if the url is ever the 1st param, then redirect to the 2nd param
        // Here we are just setting up some convenience urls.
        /*.when('/c?id', '/contacts/:id')
        .when('/user/:id', '/contacts/:id')
*/

     //   .when('/home', '/home');

        // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
        .otherwise('/playstation');

      //////////////////////////
      // State Configurations //
      //////////////////////////

      // Use $stateProvider to configure your states.
      stateProvider
        .state('playstation', {
          url: '/playstation',
          templateUrl: 'views/playStation/playStation.html'
        })

}]);
