var app = angular.module('loginApp', []);
app.controller('loginController', function ($scope, $http) {
    var myUrl = '';
    var config = {
        withCredentials: true
    };
    var verify = function(){
        $http.get(myUrl+"verifyCode",config).then(function successCallback(response) {
            console.log(response);
            $scope.verifyCode = response.data.imageCode;

        }, function errorCallback(response) {
            console.log(response);
        });
    };

    $scope.getImage = function(){
        //获取参数配置
        $http.get('config.json').then(function successCallback(response) {
            console.log(response);
            myUrl = response.data.baseUrl;
            verify();
        }, function errorCallback(response) {
            console.log(response);
        });

    };

    $scope.changeCode = function () {
        verify();
    };

    var login = function () {
        console.log($scope.user);
        $http.post(myUrl+"login",$scope.user,config).then(function successCallback(response) {
            console.log(response);
            if(response.data.code !== 0){
                layer.msg(response.data.msg, {icon: 5});
            }else{
                layui.sessionData('token', {
                    key: 'token',
                    value: response.data.token
                });
                layui.sessionData('user', {
                    key: 'user',
                    value: response.data.data
                });
                location.href="index.html";
            }

        }, function errorCallback(response) {
            console.log(response);
        });
    };

    layui.use(['layer', 'form'], function(){
        var layer = layui.layer
            ,form = layui.form;
        //监听提交
        form.on('submit(formDemo)', function(data){
            login();

            return false;

        });
    });


});