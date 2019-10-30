app.controller('svnCheckoutController',function ($scope, $http, $route,myUrl,dialogService) {
    $scope.search = function () {
        $http.get(myUrl+'repoBrowser?url='+$scope.url).then(function successCallback(response) {
            if(response.data.code == '000000'){
                $scope.infos = response.data.data;
            }else{
                layer.msg(response.data.message, {icon: 5});
            }

        }, function errorCallback(response) {
            console.log(response);
        });
    };

    $scope.browser = function (url) {
        $scope.url = url;
        $scope.search();
    };



    layui.use(['layer', 'form'], function(){
        var $ = layui.jquery, layer = layui.layer, form = layui.form;
        $scope.checkout = function(){
            layer.open({
                type: 1
                ,title: '检出授权'
                ,area:['30%','300px']
                ,content: $("#dialog").html()//引用的弹出层的页面层的方式加载修改界面表单
            });

        };

        form.on('submit(formSvnUser)', function (data) {
            var svnInfo = {
                username : data.field.username,
                password : data.field.password,
                url : $scope.url
            }
            dialogService.dialogLocation("checkout",svnInfo,"/svnLogInfo");

            return false;//false：阻止表单跳转 true：表单跳转
        });

    });

});