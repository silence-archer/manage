var app = angular.module('myApp', ['ngRoute']);
app .constant('myUrl', 'http://127.0.0.1:8081/');
app.config(function ($httpProvider,$routeProvider){
    $httpProvider.defaults.withCredentials = true;
    $routeProvider.when('/message',{
        templateUrl: 'message/message.html',
        controller: 'messageController'
    }).when('/',{
        templateUrl: 'welcome/welcome.html',
        controller: 'welcomeController'
    }).otherwise({
        redirectTo: '/'
    });
});
app.controller('parentController',function ($scope, $http, $route,myUrl) {
    $scope.getUser = function () {
        $scope.user = {};
        $http.get(myUrl+"getUser").then(function successCallback(response) {
            console.log(response);
            if(response.data.code != 000000){

                location.href="login.html";
            }else{
                $scope.user.username = response.data.data.nickname;
                $scope.menus = [{
                    name:'测试1',
                    list:[{
                        name:'测试11'
                    },{
                        name:'测试12'
                    },{
                        name:'测试13'
                    },{
                        name:'测试14'
                    }]
                },{
                    name:'测试2',
                    list:[{
                        name:'测试21'
                    },{
                        name:'测试22'
                    },{
                        name:'测试23'
                    },{
                        name:'测试24'
                    }]
                }];
            }

        }, function errorCallback(response) {
            console.log(response);
        });
    }
});
app.controller('messageController',function ($scope, $http, $route,myUrl) {
    layui.use(['form','layedit','element'], function(){
        var $ = layui.jquery
            ,element = layui.element, //Tab的切换功能，切换事件监听等，需要依赖element模块
            form = layui.form;

        $('.site-demo-active').on('click', function(){
            var othis = $(this), type = othis.data('type');
            active[type] ? active[type].call(this, othis) : '';
        });


    });
});
app.controller('welcomeController',function ($scope, $http) {

});
