angular.module('starter.services', [])

.factory('Posts', function($riffle, $rootScope) {

  var api = {};

  //private vars and functions
  function loadData(posts){
    api.users = [];
    api.myFeed = [];
    posts.forEach(filter);
    $rootScope.$broadcast('scroll.refreshComplete');
  }

  function filter(post){
    var following = $riffle.User.privateStorage.following || [];
    if(post.email === $riffle.User.email){
      return;
    }else if(following.includes(post.email)){
      api.myFeed.push(post);
    }else{
      api.users.push(post);
    }
  }

  //listen live for status updates
  $riffle.subscribe("statusUpdate", update);

  function update(email){
    var following = $riffle.User.privateStorage.following;
    for(var entry in following){
      if(email === following[entry]){
        api.load();
        return;
      }
    }
  }

  //API Methods and vars
  api.users = [];
  api.myFeed = [];

  api.load = function(){
    $riffle.User.getPublicData().then(loadData);
  };

  api.follow = function(email){
    $riffle.User.privateStorage.following.push(email);;
    $riffle.User.save().then(api.load);
  };

  api.post = function(status){
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
