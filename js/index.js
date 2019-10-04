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
            }

        }, function errorCallback(response) {
            console.log(response);
        });
    }
});
app.controller('messageController',function ($scope, $http, $route,myUrl) {
    $scope.$route = $route;
    layui.use(['form','layedit','element'], function(){
        var $ = layui.jquery
            ,element = layui.element; //Tab的切换功能，切换事件监听等，需要依赖element模块

        $('.site-demo-active').on('click', function(){
            var othis = $(this), type = othis.data('type');
            active[type] ? active[type].call(this, othis) : '';
        });


    });
});
app.controller('welcomeController',function ($scope, $http) {

});
layui.use(['layer', 'form','element'], function(){
    var layer = layui.layer
        ,form = layui.form
        ,element = layui.element;

});