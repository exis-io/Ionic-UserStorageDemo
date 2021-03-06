// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngRiffle'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })
  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.feed', {
    url: '/feed',
    views: {
      'tab-feed': {
        templateUrl: 'templates/tab-feed.html',
        controller: 'FeedCtrl'
      }
    }
  })
  .state('tab.follow', {
    url: '/follow',
    views: {
      'tab-follow': {
        templateUrl: 'templates/tab-follow.html',
        controller: 'FollowCtrl'
      }
    }
  })
  .state('tab.status', {
    url: '/status',
    views: {
      'tab-status': {
        templateUrl: 'templates/tab-status.html',
        controller: 'StatusCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

})
.config(function($riffleProvider){
  $riffleProvider.setDomain("xs.demo.USERNAME.userstorage");
})
.run(function($riffle, $rootScope, $state){
  $rootScope.$on('$ionicView.enter', function() {
    if(!$riffle.connected){
      $state.go('login');
      return;
    }
  });

  function loggedOut(){
    $state.go('login');
  }

  $rootScope.$on('$riffle.leave', loggedOut);
})
//this block seeds the User DB with some fake users the first time this app is run.
//feel free to delete it
.run(function($riffle, $ionicLoading){
  $ionicLoading.show({
    template: '<ion-spinner></ion-spinner></br>Seeding Users...'
  });
  // Some fake data
  var seed = [{
    username: "nick",
    password: "ExisRocks!",
    name: 'Nick Hyatt',
    status: 'Writing JS like it is going out of style!',
    email: 'nick@exis.io',
  }, {
    username: "chase",
    password: "ExisRocks!",
    name: 'Chase Roossin',
    status: 'Launching Exis into outer space!',
    email: 'chase@exis.io',
  }, {
    username: "mike",
    password: "ExisRocks!",
    name: 'Mike Bauer',
    status: 'Doing all the stuff no one else wants to do.',
    email: 'mike@exis.io',
  }, {
    username: "mickey",
    password: "ExisRocks!",
    name: 'Mickey Barboi',
    status: 'Swift-ly going where no man has gone before.',
    email: 'mickey@exis.io',
  },{
    username: "lance",
    password: "ExisRocks!",
    name: 'Lance Hartung',
    status: 'Keeping Exis running like a well oiled machine.',
    email: 'lance@exis.io',
  }, {
    username: "dale",
    password: "ExisRocks!",
    name: 'Dale Willis',
    status: 'Making app development simpler!',
    email: 'dale@exis.io'
  } ];

  function seedDB(){
    if(seed.length === 0){
      $ionicLoading.hide();
      return;
    }
    var user = seed.pop();
    $riffle.registerAccount(user).then(login, error);
    function login(){
      $riffle.login(user).then(save, error);
    }
    function save(session){
      session.publicStorage.status = user.status;
      session.publicStorage.statusPhotoUrl = "http://www.gravatar.com/avatar/" + session.gravatar + "?s=1024";
      session.publicStorage.email = user.email;
      session.publicStorage.name = user.name;
      session.publicStorage.gravatar = session.gravatar;
      session.publicStorage.timeStamp = new Date().toLocaleTimeString();
      session.save().then(logout, error);
    }
    function logout(){
      $riffle.user.leave().then(seedDB, error);
    }
    function error(){
      $ionicLoading.hide();
      return;
    }
  }
  seedDB();


});
