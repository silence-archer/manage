app.controller('userController',function ($scope, $http, dataService,dialogService) {
    var baseUrl = dataService.getUrlData();
    layui.use(['layer', 'form','table'], function(){
        var table = layui.table,
            form = layui.form,
            layer = layui.layer,
            $=layui.jquery;
        var roleDataInfo;
        $http.get(baseUrl+"queryRoleSelectInfo").then(function successCallback(response) {
            if(response.data.code === 0){
                roleDataInfo = response.data.data;
                $.each(roleDataInfo,function (index, item) {
                    $("#roleNo").append("<option value="+item.roleNo+">"+item.roleName+"</option>");
                });
            }else{
                layer.msg(response.data.msg,{icon:5});
            }

        }, function errorCallback(response) {
            console.log(response);
        });

        table.render({
            elem: '#test'
            ,url: baseUrl+'getUserInfo'
            // ,crossDomain: true
            // ,xhrFields: { withCredentials: true }
            ,toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
            ,title: '用户数据表'
            ,cols: [[
                {type: 'checkbox', fixed: 'left'}
                ,{field:'id', title:'ID', width:250, fixed: 'left', unresize: true, sort: true}
                ,{field:'username', title:'用户名', width:100}
                ,{field:'nickname', title:'昵称', width:150}
                ,{field:'createTime', title:'创建时间', width:200}
                ,{field:'sign', title:'签名', width:300}
                ,{field:'avatar', title:'头像地址', width:200}
                ,{field:'roleName', title:'角色名称', width:200}
                ,{field:'ipAddr', title:'ip地址', width:200}
                ,{fixed: 'right', title:'操作', toolbar: '#barDemo', width:200}
            ]]
            ,page: true
        });


        //监听头工具栏事件
        table.on('toolbar(test)', function(obj){
            var checkStatus = table.checkStatus(obj.config.id)
                ,data = checkStatus.data; //获取选中的数据
            switch(obj.event){
                case 'add':
                    layer.open({
                        type: 1
                        ,title: '添加数据'
                        ,area:['30%','400px']
                        ,content: $("#dialog").html()//引用的弹出层的页面层的方式加载修改界面表单
                        ,success: function(layero, index){
                            form.render('select');
                        }
                    });
                    //动态向表传递赋值可以参看文章进行修改界面的更新前数据的显示，当然也是异步请求的要数据的修改数据的获取
                    form.on('submit(formUser)', function (data) {
                        dialogService.dialogHttp("addUser",data.field);

                        return false;//false：阻止表单跳转 true：表单跳转
                    });
                    break;
                case 'update':
                    if(data.length === 0){
                        layer.msg('请选择一行');
                    } else if(data.length > 1){
                        layer.msg('只能同时编辑一个');
                    } else {

                        layer.open({
                            type: 1
                            ,title: '修改数据'
                            ,area:['30%','400px']
                            ,content: $('#dialog').html()//引用的弹出层的页面层的方式加载修改界面表单
                            ,success: function(layero, index){
                                form.val('example',{
                                                'username': data[0].username,
                                                'nickname': data[0].nickname,
                                                'sign': data[0].sign,
                                                'roleNo': data[0].roleNo,
                                                'ipAddr': data[0].ipAddr,
                                                'avatar': data[0].avatar
                                            });
                                $("#roleNo").find("option[value='"+data[0].roleNo+"']").attr('selected','selected');

                                console.log($("#roleNo").html());
                                form.render('select');

                            }
                        });
                    }
                    form.on('submit(formUser)', function (info) {
                        data[0].username = info.field.username;
                        data[0].nickname = info.field.nickname;
                        data[0].sign = info.field.sign;
                        data[0].avatar = info.field.avatar;
                        data[0].roleNo = info.field.roleNo;
                        data[0].ipAddr = info.field.ipAddr;
                        dialogService.dialogHttp("updateUser",data[0]);

                        return false;//false：阻止表单跳转 true：表单跳转
                    });
                    break;
                case 'delete':
                    if(data.length === 0){
                        layer.msg('请选择一行');
                    } else {
                        dialogService.delHttpService('deleteUser?id='+data[0].id,'删除成功');

                    }
                    break;
            };
        });

        //监听行工具事件
        table.on('tool(test)', function(obj){
            var data = obj.data;
            //console.log(obj)
            if(obj.event === 'del'){
                layer.confirm('真的删除行么', function(index){
                    obj.del();
                    dialogService.delHttpService('deleteUser?id='+data.id,'删除成功');
                    layer.close(index);
                });
            } else if(obj.event === 'edit'){
                layer.open({
                    type: 1
                    ,title: '修改数据'
                    ,area:['30%','400px']
                    ,content: $('#dialog').html()//引用的弹出层的页面层的方式加载修改界面表单
                    ,success: function(layero, index){
                        form.val('example',{
                            'username': data.username,
                            'nickname': data.nickname,
                            'sign': data.sign,
                            'roleNo': data.roleNo,
                            'ipAddr': data.ipAddr,
                            'avatar': data.avatar
                        });
                    }
                });
                form.on('submit(formUser)', function (info) {
                    data.username = info.field.username;
                    data.nickname = info.field.nickname;
                    data.sign = info.field.sign;
                    data.roleNo = info.field.roleNo;
                    data.avatar = info.field.avatar;
                    data.ipAddr = info.field.ipAddr;
                    dialogService.dialogHttp("updateUser",data);

                    return false;//false：阻止表单跳转 true：表单跳转
                });
            }
        });





    });
});