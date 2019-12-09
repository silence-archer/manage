app.controller('addRoleController',function ($scope, $http, dataService,dialogService,$location) {
    var baseUrl = dataService.getUrlData();
    layui.use(['layer','tree', 'form'], function() {
        var tree = layui.tree
            , layer = layui.layer
            , form = layui.form;
        //获取菜单列表
        var menuData = [];
        $http.get(baseUrl+"getMenuData").then(function successCallback(response) {
            if(response.data.code === 0){
                menuData = response.data.data;
                //开启节点操作图标
                //基本演示

                tree.render({
                    elem: '#roleTree'
                    ,data: menuData
                    ,showCheckbox: true  //是否显示复选框
                    ,id: 'demoId'
                });
            }else{
                layer.msg(response.data.msg);
            }

        }, function errorCallback(response) {
            console.log(response);
        });

        //监听提交
        form.on('submit(formRole)', function(data){
            var checkData = tree.getChecked('demoId');
            if(checkData.length === 0){
                layer.msg("请至少选择一个菜单",{icon:5});
            }else{
                var param = {
                    type :  data.field.roleName,
                    data : checkData
                };
                $http.post(baseUrl+"addRole",param).then(function successCallback(response) {
                    if(response.data.code === 0){
                        layer.msg("添加成功",{icon:6});
                        $location.url("/role");
                    }else{
                        layer.msg(response.data.msg,{icon:5});
                    }

                }, function errorCallback(response) {
                    console.log(response);
                });
            }


            return false;

        });
    });

});