var app = angular.module('myApp', ['ngRoute']);
app .constant('myUrl', 'http://127.0.0.1:8081/');
app.controller('parentController',function ($scope, $http, $route,myUrl) {
    $scope.getUser = function () {
        $scope.user = {};
        $http.get(myUrl+"getUser").then(function successCallback(response) {
            layui.use(['layer','element'], function(){
                var layer = layui.layer,
                    element = layui.element;

            });
            if(response.data.code != '000000'){
                layui.use(['layer','element'], function(){
                    var layer = layui.layer,
                        element = layui.element;
                    layer.msg(response.data.message,{
                        time: 500 //（如果不配置，默认是3秒）
                    },function(){
                        location.href="login.html";
                    });
                });
            }else{
                $scope.user.username = response.data.data.nickname;
                $http.get(myUrl+"getNavigationMenu").then(function successCallback(response) {
                    if(response.data.code != '000000'){
                        layer.msg(response.data.message);
                    }else{
                        $scope.menus = response.data.data;
                    }
                }, function errorCallback(response) {
                    console.log(response);
                });
            }
        }, function errorCallback(response) {
            console.log(response);
        });
    }
});

