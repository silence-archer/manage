app.controller('modifyRoleController',function ($scope, $http, dataService,dialogService,$location) {
    var baseUrl = dataService.getUrlData();
    layui.use(['layer','tree', 'form'], function() {
        var tree = layui.tree
            , layer = layui.layer
            , form = layui.form;
        //获取菜单列表
        var dataInfo = dataService.getData();
        if(dataInfo == null){
            dataInfo = {
                menuData:[]
            }
        }
        tree.render({
            elem: '#roleTree'
            ,data: dataInfo.menuData
            ,showCheckbox: true  //是否显示复选框
            ,id: 'demoId'
        });
        //表单赋值
        form.val('roleExample',{
            "roleName": dataInfo.roleName
        });
        //监听提交
        form.on('submit(formRole)', function(data){
            var checkData = tree.getChecked('demoId');
            if(checkData.length === 0){
                layer.msg("请至少选择一个菜单",{icon:5});
            }else{
                var param = {
                    type :  data.field.roleName,
                    apiCd : dataInfo.roleNo,
                    data : checkData
                };
                $http.post(baseUrl+"modifyRole",param).then(function successCallback(response) {
                    if(response.data.code === 0){
                        layer.msg("修改成功",{icon:6});
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