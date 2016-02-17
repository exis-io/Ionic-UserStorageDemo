angular.module('starter.services', [])

.factory('Posts', function($riffle, $rootScope) {

  var api = {};

  //listen live for status updates
  $rootScope.$on('$riffle.open', function(){
    $riffle.subscribe("statusUpdate", update);
  });

  function update(email){
    var following = $riffle.user.privateStorage.following || [];
    if(following.includes(email)){
      api.load();
    }
  }

  //API Methods and vars
  api.users = [];
  api.myFeed = [];

  api.load = function(){
    var following = $riffle.user.privateStorage.following || [];

    var usersQuery = {email: { $nin: following.concat([$riffle.user.email]) } };
    $riffle.user.getPublicData(usersQuery).then(loadUsers);

    var feedQuery = {email: { $in: following } };
    $riffle.user.getPublicData(feedQuery).then(loadFeed);

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
    $riffle.user.privateStorage.following = $riffle.user.privateStorage.following || [];
    $riffle.user.privateStorage.following.push(email);
    $riffle.user.save().then(api.load);
  };

  api.post = function(status){
    $riffle.User.publicStorage.email = $riffle.User.email;
    $riffle.User.publicStorage.name = $riffle.User.name;
    $riffle.User.publicStorage.status = status.body;
    $riffle.User.publicStorage.statusPhotoUrl = status.photoUrl || null;
    $riffle.User.publicStorage.timeStamp = new Date().toLocaleTimeString();
    return $riffle.User.save();
  };

  api.unfollow = function(email){
    var index = $riffle.user.privateStorage.following.indexOf(email);
    if(index > -1){
      $riffle.user.privateStorage.following.splice(index, 1);
      $riffle.user.save().then(api.load);
    }
  };

  return api;
});
