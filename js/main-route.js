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
    }).when('/svnCheckout',{
        templateUrl: 'robot/svnCheckout/svnCheckout.html',
        controller: 'svnCheckoutController'
    }).when('/svnLogInfo',{
        templateUrl: 'robot/svnLogInfo/svnLogInfo.html',
        controller: 'svnLogInfoController'
    }).when('/svnLocalInfo',{
        templateUrl: 'robot/svnLocalInfo/svnLocalInfo.html',
        controller: 'svnLocalInfoController'
    }).when('/wechat',{
        templateUrl: 'robot/wechat/wechat.html',
        controller: 'wechatController'
    }).when('/role',{
        templateUrl: 'robot/role/role.html',
        controller: 'roleController'
    }).when('/addRole',{
        templateUrl: 'robot/role/add/addRole.html',
        controller: 'addRoleController'
    }).when('/modifyRole',{
        templateUrl: 'robot/role/modify/modifyRole.html',
        controller: 'modifyRoleController'
    }).when('/',{
        templateUrl: 'robot/welcome/welcome.html',
        controller: 'welcomeController'
    }).otherwise({
        redirectTo: '/'
    });
});