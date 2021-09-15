app.controller('logConfigController',function ($scope, $http, dataService,dialogService) {
    var baseUrl = dataService.getUrlData();
    layui.use(['layer', 'form','table'], function(){
        var table = layui.table,
            form = layui.form,
            layer = layui.layer,
            $=layui.jquery;

        form.render('select');

        table.render({
            elem: '#test'
            ,url: baseUrl+'getLogConfigInfo'
            // ,crossDomain: true
            // ,xhrFields: { withCredentials: true }
            ,toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
            ,title: '日志文件配置列表'
            ,cols: [[
                {type: 'checkbox', fixed: 'left'}
                ,{field:'businessType', title:'业务类型', width:100, fixed: 'left', unresize: true, sort: true}
                ,{field:'transferType', title:'传输类型', width:100}
                ,{field:'filename', title:'文件名', width:100}
                ,{field:'fileDesc', title:'文件描述', width:100}
                ,{field:'remoteFilepath', title:'远程文件路径', width:100}
                ,{field:'localFilepath', title:'本地文件路径', width:100}
                ,{field:'remoteIp', title:'远程服务器ip', width:100}
                ,{field:'remotePort', title:'远程服务器端口', width:100}
                ,{field:'remoteUsername', title:'远程服务器用户名', width:100}
                ,{field:'remotePassword', title:'远程服务器密码', width:100}
                ,{fixed: 'right', title:'操作', toolbar: '#barDemo', width:200}
            ]]
            ,page: true
        });
        $scope.search = function () {

            table.reload('test', {
                url: baseUrl+'getLogConfigInfoByCondition',
                where: {
                    businessType : $scope.businessType
                },
                page: {
                    curr: 1 //重新从第 1 页开始
                }
            });
        }

        //监听头工具栏事件
        table.on('toolbar(test)', function(obj){
            var checkStatus = table.checkStatus(obj.config.id)
                ,data = checkStatus.data; //获取选中的数据
            switch(obj.event){
                case 'add':
                    layer.open({
                        type: 1
                        ,title: '添加数据'
                        ,area:['50%','500px']
                        ,content: $("#dialog").html()//引用的弹出层的页面层的方式加载修改界面表单
                        ,success: function(layero, index){
                            form.render('select');
                        }
                    });
                    //动态向表传递赋值可以参看文章进行修改界面的更新前数据的显示，当然也是异步请求的要数据的修改数据的获取
                    form.on('submit(formLogConfig)', function (data) {
                        form.render('select');
                        dialogService.dialogHttp("addLogConfig",data.field);

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
                            ,area:['50%','500px']
                            ,content: $('#dialog').html()//引用的弹出层的页面层的方式加载修改界面表单
                            ,success: function(layero, index){
                                form.val('example',{
                                                'businessType': data[0].businessType,
                                                'transferType': data[0].transferType,
                                                'filename': data[0].filename,
                                                'fileDesc': data[0].fileDesc,
                                                'remoteFilepath': data[0].remoteFilepath,
                                                'localFilepath': data[0].localFilepath,
                                                'remoteIp': data[0].remoteIp,
                                                'remotePort': data[0].remotePort,
                                                'remoteUsername': data[0].remoteUsername,
                                                'remotePassword': data[0].remotePassword
                                            });

                            }
                        });
                    }
                    form.on('submit(formLogConfig)', function (info) {
                        data[0].businessType = info.field.businessType;
                        data[0].transferType = info.field.transferType;
                        data[0].filename = info.field.filename;
                        data[0].fileDesc = info.field.fileDesc;
                        data[0].remoteFilepath = info.field.remoteFilepath;
                        data[0].localFilepath = info.field.localFilepath;
                        data[0].remoteIp = info.field.remoteIp;
                        data[0].remotePort = info.field.remotePort;
                        data[0].remoteUsername = info.field.remoteUsername;
                        data[0].remotePassword = info.field.remotePassword;
                        dialogService.dialogHttp("updateLogConfig",data[0]);

                        return false;//false：阻止表单跳转 true：表单跳转
                    });
                    break;
                case 'delete':
                    if(data.length === 0){
                        layer.msg('请选择一行');
                    } else {
                        dialogService.delHttpService('deleteLogConfig?id='+data[0].id,'删除成功','test');

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
                    dialogService.delHttpService('deleteLogConfig?id='+data.id,'删除成功','test');
                    layer.close(index);
                });
            } else if(obj.event === 'edit'){
                layer.open({
                    type: 1
                    ,title: '修改数据'
                    ,area:['50%','500px']
                    ,content: $('#dialog').html()//引用的弹出层的页面层的方式加载修改界面表单
                    ,success: function(layero, index){
                        form.val('example',{
                            'businessType': data.businessType,
                            'transferType': data.transferType,
                            'filename': data.filename,
                            'fileDesc': data.fileDesc,
                            'remoteFilepath': data.remoteFilepath,
                            'localFilepath': data.localFilepath,
                            'remoteIp': data.remoteIp,
                            'remotePort': data.remotePort,
                            'remoteUsername': data.remoteUsername,
                            'remotePassword': data.remotePassword
                        });
                    }
                });
                form.on('submit(formLogConfig)', function (info) {
                    data.businessType = info.field.businessType;
                    data.transferType = info.field.transferType;
                    data.filename = info.field.filename;
                    data.fileDesc = info.field.fileDesc;
                    data.remoteFilepath = info.field.remoteFilepath;
                    data.localFilepath = info.field.localFilepath;
                    data.remoteIp = info.field.remoteIp;
                    data.remotePort = info.field.remotePort;
                    data.remoteUsername = info.field.remoteUsername;
                    data.remotePassword = info.field.remotePassword;
                    dialogService.dialogHttp("updateLogConfig",data);

                    return false;//false：阻止表单跳转 true：表单跳转
                });
            }
        });





    });
});