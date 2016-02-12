angular.module('starter.services', [])

.factory('Posts', function($riffle, $rootScope) {

  var api = {};

  //API Methods and vars
  api.users = [];
  api.myFeed = [];

  api.load = function(){
    $riffle.user.getPublicData().then(loadData);

    function loadData(posts){
      api.users = [];
      api.myFeed = [];
      posts.forEach(filter);
      $rootScope.$broadcast('scroll.refreshComplete');
    }

    function filter(post){
      var following = $riffle.user.privateStorage.following || [];
      if(post.email === $riffle.user.email){
        return;
      }else if(following.includes(post.email)){
        api.myFeed.push(post);
      }else{
        api.users.push(post);
      }
    }
  };

  api.follow = function(email){
    $riffle.user.privateStorage.following = $riffle.user.privateStorage.following || [];
    $riffle.user.privateStorage.following.push(email);
    $riffle.user.save().then(api.load);
  };

  api.post = function(status){
    $riffle.user.publicStorage.email = $riffle.user.email;
    $riffle.user.publicStorage.name = $riffle.user.name;
    $riffle.user.publicStorage.status = status.body;
    $riffle.user.publicStorage.statusPhotoUrl = status.photoUrl || null;
    return $riffle.user.save();
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
