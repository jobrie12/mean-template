// public/js/controllers/AuthCtrl.js
angular.module('AuthCtrl', []).controller('AuthController', [
    '$scope',
    '$state',
    '$window',
    '$stateParams',
    'auth',
    function($scope, $state, $window, $stateParams, auth){
        $scope.user = {
            email: '',
            password: '',
            confirm_pass: '',
            access_code: $stateParams.accessCode || ''
        };

        $scope.signUp = function(){
            if ($scope.user.password !== $scope.user.confirm_pass){
                M.toast({html:"Passwords don't match.", classes: "rounded red"});
            } else if ($scope.user.access_code.length < 1){
                M.toast({html:"You need an access code to sign up.", classes: "rounded red"});
            } else if (auth.validateEmail($scope.user.email)){
                auth.signup($scope.user).then(function(success){
                    if (success){
                        $state.go('aireport');
                        //$window.location.reload(false);
                    } else {

                    }

                });
            }
        };

        $scope.logIn = function(){
            if (auth.validateEmail($scope.user.email)){
                auth.logIn($scope.user).then(function(data){
                    $state.go('aireport');
                    //$window.location.reload(false);
                });
            }
        };
    }]);