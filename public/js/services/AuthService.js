angular.module('AuthService', []).factory('auth', ['$http', '$window', '$state', function($http, $window, $state){
    var auth = {};

    auth.saveToken = function (token){
        $window.localStorage['aireport-token'] = token;
    };

    auth.getToken = function (){
        return $window.localStorage['aireport-token'];
    };

    auth.isLoggedIn = function(){
        var token = auth.getToken();

        if(token){
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    };

    auth.isMaster = function(){
        return $http.get('/permission',{
            headers: {Authorization: 'Bearer '+auth.getToken()}
        }).then(function(data){
            if (data.data.role == "none"){
                M.toast({html:"Your account no longer exists, logging out...", classes: "rounded red"});
                $window.localStorage.removeItem('aireport-token');
                $state.go('home');
            }
            return (data.data.role === "master");
        })
    };

    auth.currentUser = function(){
        if(auth.isLoggedIn()){
            var token = auth.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return payload.email;
        }
    };

    auth.signup = function(user){
        return $http.post('/signup', user).then(function(data){
            M.toast({html:data.data.html, classes: data.data.classes});
            if (data.data.token){
                auth.saveToken(data.data.token);
                return true;
            } else {
                return false;
            }

        }, function(data){
            console.log(data);
            M.toast({html:data.data.html, classes: data.data.classes});
            return false;
        });
    };

    auth.logIn = function(user){
        return $http.post('/login', user).then(function(data){
            auth.saveToken(data.data.token);
        }, function(data){
            console.log(data);
        });
    };

    auth.logOut = function(){
        $window.localStorage.removeItem('aireport-token');
        $state.go('home');
        M.toast({html:"You have successfully logged out", classes: "rounded green"});
        //setTimeout(function()())
    };

    auth.validateEmail = function(mail)
    {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
        {
            return (true)
        }
        M.toast({html:"You have entered an invalid email address!", classes: "rounded red"});
        return (false)
    };

    return auth;
}]);