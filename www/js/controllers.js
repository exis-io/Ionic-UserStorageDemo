angular.module('starter.controllers', [])

.controller('FeedCtrl', function($scope) {
})

.controller('FollowCtrl', function($scope) {
})

.controller('LoginCtrl', function($scope, $state, $riffle, $ionicPopup, $rootScope, $filter, Posts) {

  $scope.user = {};

  $scope.login = function(){
    $riffle.login($scope.user).then(loggedIn, error);
  };

  $scope.register = function(){
    $riffle.registerAccount($scope.user).then($scope.login, error);
  };

  function loggedIn(){
    $scope.user = {};
    $state.go('tab.feed');
    $rootScope.me = $riffle.user;
    $rootScope.postService = Posts;
    Posts.load();
  }

  function error(error) {
    $ionicPopup.alert({
      title: 'Oops!',
      template: error
    });
  };
})

.controller('StatusCtrl', function($scope, $riffle, $ionicModal) {

  $scope.newStatus = {};

  $ionicModal.fromTemplateUrl('templates/statusModal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.editStatus = modal;
  });

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.post = function(){
    $scope.postService.post($scope.newStatus).then(publishUpdate);
    $scope.editStatus.hide();
  };

  function publishUpdate(){
    $riffle.publish('statusUpdate', $riffle.user.email);
  }

  $scope.$on('modal.hidden', function() {
    $scope.newStatus = {};
  });

});
