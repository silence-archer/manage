app.controller('roleController',function ($scope, $http, dataService,dialogService,$location) {
    var baseUrl = dataService.getUrlData();


    layui.use(['layer', 'form','table','tree'], function(){
        var table = layui.table,
            form = layui.form,
            layer = layui.layer,
            $=layui.jquery;

        //初始化表格记录
        table.render({
            elem: '#roleTest'
            ,url: baseUrl+'getRoleInfo'
            ,id: 'roleTest'
            ,toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
            ,title: '角色信息表'
            ,cols: [[
                {type: 'checkbox', fixed: 'left'}
                ,{field:'id', title:'ID', width:200, fixed: 'left', unresize: true, sort: true}
                ,{field:'roleNo', title:'角色编号', width:150}
                ,{field:'roleName', title:'角色名称', width:150}
                ,{field:'createTime', title:'创建时间', width:300}
                ,{fixed: 'right', title:'操作', toolbar: '#barDemo', width:200}
            ]]
            ,page: true
        });

        //监听头工具栏事件
        table.on('toolbar(roleTest)', function(obj){
            var checkStatus = table.checkStatus(obj.config.id)
                ,data = checkStatus.data; //获取选中的数据
            switch(obj.event){
                case 'add':
                    location.replace(location.href.split("#")[0]+"#!/addRole");
                    break;
                case 'update':
                    if(data.length === 0){
                        layer.msg('请选择一行');
                    } else if(data.length > 1){
                        layer.msg('只能同时编辑一个');
                    } else {
                        console.log(data[0]);
                        var param = {
                            menuData: data[0].menuNos,
                            roleNo: data[0].roleNo,
                            roleName: data[0].roleName
                        };
                        dataService.setData(param);
                        location.replace(location.href.split("#")[0]+"#!/modifyRole");
                    }
                    break;
                case 'delete':
                    if(data.length === 0){
                        layer.msg('请选择一行');
                    } else {
                        dialogService.delHttpService('deleteRole?roleNo='+data[0].roleNo,'删除成功','roleTest');
                    }
                    break;
            };
        });

        //监听行工具事件
        table.on('tool(roleTest)', function(obj){
            var data = obj.data;
            //console.log(obj)
            if(obj.event === 'del'){
                layer.confirm('真的删除行么', function(index){
                    obj.del();
                    dialogService.delHttpService('deleteRole?roleNo='+data.roleNo,'删除成功','roleTest');
                    layer.close(index);
                });
            } else if(obj.event === 'edit'){
                var param = {
                    menuData: data.menuNos,
                    roleNo: data.roleNo,
                    roleName: data.roleName
                };
                dataService.setData(param);
                location.replace(location.href.split("#")[0]+"#!/modifyRole");
            }
        });





    });
});

