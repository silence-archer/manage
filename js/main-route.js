app.config(function ($httpProvider,$routeProvider){
    //跨域session的唯一性保障
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.interceptors.push('authInterceptor');
    $routeProvider.when('/message',{
        templateUrl: 'robot/message/message.html',
        controller: 'messageController'
    }).when('/menu',{
        templateUrl: 'robot/menu/menu.html',
        controller: 'menuController'
    }).when('/user',{
        templateUrl: 'robot/user/user.html',
        controller: 'userController'
    }).when('/schedule',{
        templateUrl: 'robot/schedule/schedule.html',
        controller: 'scheduleController'
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
    }).when('/mock',{
        templateUrl: 'robot/mock/mock.html',
        controller: 'mockController'
    }).when('/interface',{
        templateUrl: 'robot/interface/interface.html',
        controller: 'interfaceController'
    }).when('/logConfig',{
        templateUrl: 'robot/logConfig/logConfig.html',
        controller: 'logConfigController'
    }).when('/logFile',{
        templateUrl: 'robot/logFile/logFile.html',
        controller: 'logFileController'
    }).when('/dataDict',{
        templateUrl: 'robot/dataDict/dataDict.html',
        controller: 'dataDictController'
    }).when('/loan',{
        templateUrl: 'robot/loan/loan.html',
        controller: 'loanController'
    }).when('/loan/result',{
        templateUrl: 'robot/loan/result/result.html',
        controller: 'resultController'
    }).when('/diff',{
        templateUrl: 'robot/diff/diff.html',
        controller: 'diffController'
    }).when('/diffDetail',{
        templateUrl: 'robot/diff/diffDetail/diffDetail.html',
        controller: 'diffDetailController'
    }).when('/databaseInfo',{
        templateUrl: 'robot/databaseInfo/databaseInfo.html',
        controller: 'databaseInfoController'
    }).when('/fileRead',{
        templateUrl: 'robot/fileRead/fileRead.html',
        controller: 'fileReadController'
    }).when('/autoInterface',{
        templateUrl: 'robot/autoInterface/autoInterface.html',
        controller: 'autoInterfaceController'
    }).when('/interfaceScene',{
        templateUrl: 'robot/interfaceScene/interfaceScene.html',
        controller: 'interfaceSceneController'
    }).when('/subscribeConfig',{
        templateUrl: 'robot/subscribeConfig/subscribeConfig.html',
        controller: 'subscribeConfigController'
    }).when('/dingClock',{
        templateUrl: 'robot/dingClock/dingClock.html',
        controller: 'dingClockController'
    }).when('/',{
        templateUrl: 'robot/welcome/welcome.html',
        controller: 'welcomeController'
    }).otherwise({
        redirectTo: '/'
    });
});