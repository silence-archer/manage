var app = angular.module('loginApp', []);
// app .constant('myUrl', 'http://192.168.84.131:8081/');
// app .constant('myUrl', 'http://127.0.0.1:8081/');
app .constant('myUrl', 'http://140.143.128.92:8081/');
app.controller('loginController', function ($scope, $http,myUrl) {
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
    }

    $scope.getImage = function(){
        verify();
    }

    $scope.changeCode = function () {
        verify();
    }

    var login = function () {
        console.log($scope.user);
        $http.post(myUrl+"login",$scope.user,config).then(function successCallback(response) {
            console.log(response);
            if(response.data.code !== 0){
                layer.msg(response.data.msg);
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