angular.module('starter.controllers', [])

.controller('FeedCtrl', function($scope) {
})

.controller('FollowCtrl', function($scope) {
})

.controller('LoginCtrl', function($scope, $state, $riffle, $ionicPopup, $rootScope, Posts) {

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
    $rootScope.me = $riffle.User;
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

.controller('StatusCtrl', function($scope, $ionicModal) {

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
    $scope.postService.post($scope.newStatus);
    $scope.editStatus.hide();
  };

  $scope.$on('modal.hidden', function() {
    $scope.newStatus = {};
  });

});
