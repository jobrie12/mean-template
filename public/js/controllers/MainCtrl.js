// public/js/controllers/MainCtrl.js
angular.module('MainCtrl', []).controller('MainController', ['$scope', 'auth', function($scope, auth) {

    var elem = document.querySelector('.sidenav');
    var instance = M.Sidenav.init(elem);

    $scope.tagline = 'To the moon and back!';

    $scope.closeSideNav = function(){
        instance.close();
    };

    $scope.logOut = auth.logOut;
    $scope.isLoggedIn = auth.isLoggedIn;
    if ($scope.isLoggedIn()){
        auth.isMaster().then(function(master){
            $scope.isMaster = master;
        });
    }
    $scope.currentUser = auth.currentUser;
}]);