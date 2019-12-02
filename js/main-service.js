app.service('dialogService', function($http,$location,myUrl,$route,$sce) {
    this.dialogHttp = function (url,data) {
        $http.post(myUrl+url,data).then(function successCallback(response) {
            if(response.data.code === 0){
                // layer.closeAll('loading');
                // layer.load(2);
                layer.msg("操作成功", {icon: 6});
                setTimeout(function () {
                        layer.closeAll();//关闭所有的弹出层
                        $route.reload();//刷新页面
                    },
                    1000
                );
                //加载层-风格
            }else{
                layer.msg(response.data.msg, {icon: 5});
            }

        }, function errorCallback(response) {
            console.log(response);
        });
    };

    this.dialogLocation = function (url,data,locationUrl) {
        $http.post(myUrl+url,data).then(function successCallback(response) {
            if(response.data.code === 0){
                // layer.closeAll('loading');
                // layer.load(2);
                layer.msg("操作成功", {icon: 6});
                setTimeout(function () {
                        layer.closeAll();
                        $route.reload();
                        $location.url(locationUrl);
                    },
                    1000
                );
                //加载层-风格
            }else{
                layer.msg(response.data.msg, {icon: 5});
            }

        }, function errorCallback(response) {
            console.log(response);
        });
    };

    this.delHttpService = function (url,msg){
        $http.get(myUrl+url).then(function successCallback(response) {
            if(response.data.code === 0){
                layer.msg(msg);
            }else{
                layer.msg(response.data.msg, {icon: 5});
            }

        }, function errorCallback(response) {
            console.log(response);
        });
    }

});

