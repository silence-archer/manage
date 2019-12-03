var app = angular.module('myApp', ['ngRoute']);
app.controller('parentController',function ($scope, $http, $route,dataService) {
    $scope.getUser = function () {
        $scope.user = {};
        //获取参数配置
        $http.get('config.json').then(function successCallback(response) {
            console.log(response);
            var myUrl = response.data.baseUrl;
            dataService.setUrlData(myUrl);
            getUserInfo(myUrl);
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    var getUserInfo = function (myUrl) {
        $http.get(myUrl+"getUser").then(function successCallback(response) {
            if(response.data.code !== 0){
                layui.use(['layer','element'], function(){
                    var layer = layui.layer,
                        element = layui.element;
                    layer.msg(response.data.msg,{
                        time: 500 //（如果不配置，默认是3秒）
                    },function(){
                        location.href="login.html";
                    });
                });
            }else{
                $scope.user = response.data.data;
                $http.get(myUrl+"getNavigationMenu").then(function successCallback(response) {
                    if(response.data.code !== 0){
                        layer.msg(response.data.msg);
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

