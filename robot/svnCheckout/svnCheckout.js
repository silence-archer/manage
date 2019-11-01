app.controller('svnCheckoutController',function ($scope, $http, $route,myUrl,dialogService) {
    $scope.url = "";
    var svnName = "";
    $scope.search = function () {
        $http.get(myUrl+'repoBrowser?url='+$scope.url).then(function successCallback(response) {
            if(response.data.code == '000000'){
                $scope.infos = response.data.data;
                svnName = $scope.infos[0].svnName;
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
            if($scope.url == ""){
                layer.msg('url不能为空', {icon: 5});
            }else{
                layer.open({
                    type: 1
                    ,title: '检出授权'
                    ,area:['30%','300px']
                    ,content: $("#dialog").html()//引用的弹出层的页面层的方式加载修改界面表单
                    ,success: function(layero, index){
                        form.val('example',{
                            'svnName': svnName,
                        });
                    }
                });
            }



        };

        form.on('submit(formSvnUser)', function (data) {
            var svnInfo = {
                username : data.field.username,
                password : data.field.password,
                svnName : data.field.svnName,
                url : $scope.url
            }
            dialogService.dialogLocation("checkout",svnInfo,"/svnLogInfo");

            return false;//false：阻止表单跳转 true：表单跳转
        });

    });

});