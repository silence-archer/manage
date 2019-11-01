app.controller('svnLocalInfoController', function ($scope, $http, $route, myUrl) {
    $http.get(myUrl + "getUrls").then(function successCallback(response) {
        if (response.data.code == '000000') {
            $scope.items = response.data.data;
            layui.use('form', function () {
                var form = layui.form;
                form.on('select(test)', function(data){
                    $http.get(myUrl + "getLocalSvnInfo?url="+data.value).then(function successCallback(response) {
                        if (response.data.code == '000000') {
                            $scope.infos = response.data.data;
                        } else {
                            layer.msg(response.data.message, {icon: 5});
                        }

                    }, function errorCallback(response) {
                        console.log(response);
                    });
                });
            });
        } else {
            layer.msg(response.data.message, {icon: 5});
        }

    }, function errorCallback(response) {
        console.log(response);
    });

    $scope.loadSvn = function () {
        var params = JSON.parse(JSON.stringify($scope.infos))
        $http.post(myUrl+"postLocalSvnInfo",params).then(function successCallback(response) {
            if (response.data.code == '000000') {
                $scope.infos = response.data.data;
            } else {
                layer.msg(response.data.message, {icon: 5});
            }

        }, function errorCallback(response) {
            console.log(response);
        });
    };



});