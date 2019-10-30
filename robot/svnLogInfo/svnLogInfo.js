app.controller('svnLogInfoController',function ($scope, $http, $interval,$route,myUrl) {

    $scope.content = "";
    layui.use(['layer'], function(){
        var $ = layui.jquery, layer = layui.layer;
        $scope.stopTask = function () {
            $http.get(myUrl+"checkoutStop").then(function successCallback(response) {
                if(response.data.code == '000000'){
                    layer.msg("操作成功", {icon: 6});
                    $("#button").attr("class","layui-btn layui-btn-disabled");
                }else{
                    layer.msg(response.data.message, {icon: 5});
                }
            }, function errorCallback(response) {
                console.log(response);
            });
        };
        var pos = 0;
        var timer = $interval(function () {
            $http.get(myUrl+"getSvnLogInfo?pos="+pos).then(function successCallback(response) {
                if(response.data.code == '000000'){
                    $scope.content = $scope.content + response.data.data.content;
                    var type = response.data.data.type;
                    if(type == 'error'){
                        $("#content").css("color","red");
                    }

                    pos = response.data.data.pos;
                    var overFlag = false;
                    overFlag = response.data.data.overFlag;
                    if(overFlag){
                        $interval.cancel(timer);
                    }
                }else{
                    layer.msg(response.data.message, {icon: 5});
                }
            }, function errorCallback(response) {
                console.log(response);
            });
        },3000);
    });


});