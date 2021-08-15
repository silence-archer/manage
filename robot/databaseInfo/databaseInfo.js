app.controller('databaseInfoController',function ($scope, $http, dataService,dialogService,dataDictService) {
    var baseUrl = dataService.getUrlData();
    layui.use(['layer', 'form','table'], function(){
        var table = layui.table,
            form = layui.form,
            layer = layui.layer,
            $=layui.jquery;
        dataDictService.getDataDictService("businessType", "queryBusinessType");
        dataDictService.getDataDictService("businessType", "businessType");
        dataDictService.getDataDictService("databaseType", "type");
        form.render('select');

        table.render({
            elem: '#test'
            ,url: baseUrl+'getDatabaseInfo'
            // ,crossDomain: true
            // ,xhrFields: { withCredentials: true }
            ,toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
            ,title: '日志文件配置列表'
            ,cols: [[
                {type: 'checkbox', fixed: 'left'}
                ,{field:'businessType', title:'业务类型', width:100, fixed: 'left', unresize: true, sort: true}
                ,{field:'type', title:'数据库类型', width:100}
                ,{field:'url', title:'数据库地址', width:100}
                ,{field:'user', title:'用户名', width:100}
                ,{field:'password', title:'密码', width:100}
                ,{fixed: 'right', title:'操作', toolbar: '#barDemo', width:200}
            ]]
            ,page: true
        });
        $scope.search = function () {

            table.reload('test', {
                url: baseUrl+'getDatabaseInfoByCondition',
                where: {
                    businessType : $('#queryBusinessType').val()
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
                    form.on('submit(formDatabaseInfo)', function (data) {
                        form.render('select');
                        dialogService.dialogHttp("addDatabaseInfo",data.field);

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
                                                'type': data[0].type,
                                                'url': data[0].url,
                                                'user': data[0].user,
                                                'password': data[0].password
                                            });

                            }
                        });
                    }
                    form.on('submit(formDatabaseInfo)', function (info) {
                        data[0].businessType = info.field.businessType;
                        data[0].type = info.field.type;
                        data[0].url = info.field.url;
                        data[0].user = info.field.user;
                        data[0].password = info.field.password;
                        dialogService.dialogHttp("updateDatabaseInfo",data[0]);

                        return false;//false：阻止表单跳转 true：表单跳转
                    });
                    break;
                case 'delete':
                    if(data.length === 0){
                        layer.msg('请选择一行');
                    } else {
                        dialogService.delHttpService('deleteDatabaseInfo?id='+data[0].id,'删除成功');

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
                    dialogService.delHttpService('deleteDatabaseInfo?id='+data.id,'删除成功');
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
                            'type': data.type,
                            'url': data.url,
                            'user': data.user,
                            'password': data.password
                        });
                    }
                });
                form.on('submit(formDatabaseInfo)', function (info) {
                    data.businessType = info.field.businessType;
                    data.type = info.field.type;
                    data.url = info.field.url;
                    data.user = info.field.user;
                    data.password = info.field.password;
                    dialogService.dialogHttp("updateDatabaseInfo",data);

                    return false;//false：阻止表单跳转 true：表单跳转
                });
            }
        });





    });
});