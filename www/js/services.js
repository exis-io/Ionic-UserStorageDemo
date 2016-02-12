angular.module('starter.services', [])

.factory('Posts', function($riffle, $rootScope) {

  var api = {};

  //private vars and functions

  //API Methods and vars
  api.users = [];
  api.myFeed = [];

  api.load = function(){
    var following = $riffle.User.privateStorage.following || [];

    var usersQuery = {email: { $nin: following.concat([$riffle.User.email]) } };
    $riffle.User.getPublicData(usersQuery).then(loadUsers);

    var feedQuery = {email: { $in: following } };
    $riffle.User.getPublicData(feedQuery).then(loadFeed);

    function loadUsers(users){
      api.users = users;
      $rootScope.$broadcast('scroll.refreshComplete');
    }

    function loadFeed(feedData){
      api.myFeed = feedData;
      $rootScope.$broadcast('scroll.refreshComplete');
    }
  };

  api.follow = function(email){
    $riffle.User.privateStorage.following = $riffle.User.privateStorage.following || []
    $riffle.User.privateStorage.following.push(email);
    $riffle.User.save().then(api.load);
  };

  api.post = function(status){
    $riffle.User.publicStorage.email = $riffle.User.email;
    $riffle.User.publicStorage.name = $riffle.User.name;
    $riffle.User.publicStorage.status = status.body;
    $riffle.User.publicStorage.statusPhotoUrl = status.photoUrl || null;
    return $riffle.User.save();
  };

  api.unfollow = function(email){
    var index = $riffle.User.privateStorage.following.indexOf(email);
    if(index > -1){
      $riffle.User.privateStorage.following.splice(index, 1);
      $riffle.User.save().then(api.load);
    }
  };

  return api;
});
