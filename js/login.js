var app = angular.module('loginApp', []);
app.controller('loginController', function ($scope, $http) {
    var config = {
        withCredentials: true
    };
    var verify = function(){
        $http.get("http://127.0.0.1:8081/verifyCode",config).then(function successCallback(response) {
            console.log(response);
            $scope.verifyCode = response.data.imageCode;

        }, function errorCallback(response) {
            console.log(response);
        });
    }

    $scope.getImage = function(){
        verify();
    }

    $scope.changeCode = function () {
        verify();
    }

    var login = function () {
        console.log($scope.user);
        $http.post("http://127.0.0.1:8081/login",$scope.user,config).then(function successCallback(response) {
            console.log(response);
            if(response.data.code != 000000){
                layer.msg(response.data.message);
            }else{
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