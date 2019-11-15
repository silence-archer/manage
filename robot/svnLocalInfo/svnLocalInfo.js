app.controller('svnLocalInfoController', function ($scope, $http, $route, myUrl,$location,$timeout) {
    $scope.infos = [];
    $http.get(myUrl + "getUrls").then(function successCallback(response) {
        if (response.data.code === 0) {
            $scope.items = response.data.data;
            layui.use('form', function () {
                var form = layui.form;
                form.on('select(test)', function(data){
                    $http.get(myUrl + "getLocalSvnInfo?url="+data.value).then(function successCallback(response) {
                        if (response.data.code === 0) {
                            $scope.infos = response.data.data;
                        } else {
                            layer.msg(response.data.msg, {icon: 5});
                        }

                    }, function errorCallback(response) {
                        console.log(response);
                    });
                });
            });
        } else {
            layer.msg(response.data.msg, {icon: 5});
        }

    }, function errorCallback(response) {
        console.log(response);
    });

    $scope.loadSvn = function () {
        $http.post(myUrl+"postLocalSvnInfo",$scope.infos).then(function successCallback(response) {
            if (response.data.code === 0) {
                $scope.infos = response.data.data;
            } else {
                layer.msg(response.data.msg, {icon: 5});
            }

        }, function errorCallback(response) {
            console.log(response);
        });
    };

    $scope.updateSvn = function () {
        layui.use('form', function () {
            var $ = layui.jquery;
            var data = $("#url").val();
            $http.get(myUrl+"updateSvnInfo?url="+data).then(function successCallback(response) {
                if (response.data.code === 0) {
                    layer.msg("操作成功", {icon: 6});
                    $timeout(function () {
                            $location.url("/svnLogInfo");
                        },
                        1000
                    );
                } else {
                    layer.msg(response.data.msg, {icon: 5});
                }

            }, function errorCallback(response) {
                console.log(response);
            });
        });

    };



});