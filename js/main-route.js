app.config(function ($httpProvider,$routeProvider){
    //跨域session的唯一性保障
    $httpProvider.defaults.withCredentials = true;
    $routeProvider.when('/message',{
        templateUrl: 'robot/message/message.html',
        controller: 'messageController'
    }).when('/menu',{
        templateUrl: 'robot/menu/menu.html',
        controller: 'menuController'
    }).when('/user',{
        templateUrl: 'robot/user/user.html',
        controller: 'userController'
    }).when('/',{
        templateUrl: 'robot/welcome/welcome.html',
        controller: 'welcomeController'
    }).otherwise({
        redirectTo: '/'
    });
});