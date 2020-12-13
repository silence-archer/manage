var app = angular.module('myApp', ['ngRoute']);
app.controller('parentController',function ($scope, $http, $route,dataService,dialogService) {
    $scope.getUser = function () {
        $scope.user = {};
        //获取参数配置
        $http.get('config.json').then(function successCallback(response) {
            console.log(response);
            var urlData = response.data;
            dataService.setUrlData(urlData.baseUrl);
            dataService.setOthUrlData(urlData.otherUrl);
            getUserInfo(urlData.baseUrl);
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    $scope.showUserInfo = function () {
        layui.use(['layer', 'form'], function () {
            var layer = layui.layer;
            layer.open({
                title: '基本信息'
                , area: ['30%', '300px']
                , content: '啥也没有'//引用的弹出层的页面层的方式加载修改界面表单
            });

        });
    }

    $scope.quit = function () {
        location.href="login.html";
    }

    $scope.modifyPassword = function () {
        layui.use(['layer','form'], function(){
            var layer = layui.layer,
                form = layui.form,
            $ = layui.$;
            layer.open({
                type: 1
                ,title: '修改密码'
                ,area:['30%','300px']
                ,content: $("#passwdDialog").html()//引用的弹出层的页面层的方式加载修改界面表单
            });
            //动态向表传递赋值可以参看文章进行修改界面的更新前数据的显示，当然也是异步请求的要数据的修改数据的获取
            form.on('submit(formPasswd)', function (data) {
                if(data.field.password === data.field.reqPassword){
                    var passwordInfo = $scope.user;
                    passwordInfo.id = data.field.oldPassword;
                    passwordInfo.password = data.field.password;
                    dialogService.dialogHttp("modifyPassword",passwordInfo);
                }else{
                    layer.msg('两次输入密码不一致',{icon: 5});
                }


                return false;//false：阻止表单跳转 true：表单跳转
            });

        });
    }

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
                        layui.use('layer', function(){
                            var layer = layui.layer;
                            layer.msg(response.data.msg,{
                                time: 500 //（如果不配置，默认是3秒）
                            },function(){
                                location.href="login.html";
                            });
                        });
                    }else{
                        $scope.menus = response.data.data;
                        layui.use(['layer','element'], function(){
                            var $=layui.jquery;
                            $("#touxiang").attr("src", $scope.user.avatar);
                        });
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

