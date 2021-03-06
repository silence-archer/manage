app.controller('menuController',function ($scope, $http, dataService) {
    var myUrl = dataService.getUrlData();
    layui.use(['layer','tree', 'util'], function() {
        var tree = layui.tree
            , layer = layui.layer
            , util = layui.util;

        var menuData = [];
        $http.get(myUrl+"getMenuData").then(function successCallback(response) {
            if(response.data.code === 0){
                menuData = response.data.data;
                //开启节点操作图标
                tree.render({
                    elem: '#test9'
                    ,data: menuData
                    ,edit: ['add', 'update', 'del'] //操作节点的图标
                    ,operate: function(obj){
                        var type = obj.type; //得到操作类型：add、edit、del
                        var data = obj.data; //得到当前节点的数据
                        var elem = obj.elem; //得到当前节点元素

                        //Ajax 操作
                        if(type === 'update'){ //修改节点
                            if(data.children.length == 0){
                                layer.prompt({
                                    formType: 0,
                                    value:data.field,
                                    title: '请输入url'
                                }, function(value, index, elem){
                                    data.field = value;
                                    http("updateMenuData",data);
                                    layer.close(index);
                                });
                            }else{
                                http("updateMenuData",data);
                            }
                        } else if(type === 'del'){ //删除节点
                            http("deleteMenuData",data);
                        } else if(type === 'add'){ //添加节点
                            http("addMenuData",data);
                        };
                    }

                });
            }else{
                layer.msg(response.data.msg);
            }

        }, function errorCallback(response) {
            console.log(response);
        });


    });


    function http(url, data) {
        $http.post(myUrl+url,data).then(function successCallback(response) {
            if(response.data.code === 0){
                location.reload(true);
            }else{
                layer.msg(response.data.msg,{
                    time: 500 //（如果不配置，默认是3秒）
                },function(){
                    location.reload(true);
                });
            }

        }, function errorCallback(response) {
            console.log(response);
        });
    }


});