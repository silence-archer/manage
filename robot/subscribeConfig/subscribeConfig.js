app.controller('subscribeConfigController',function ($scope, $http, dataService,dialogService) {
    const baseUrl = dataService.getUrlData();
    layui.use(['layer', 'form','table'], function(){
        const table = layui.table,
            form = layui.form,
            layer = layui.layer,
            $ = layui.jquery;

        form.render('select');

        table.render({
            elem: '#test'
            ,url: baseUrl+'getSubscribeConfig'
            // ,crossDomain: true
            // ,xhrFields: { withCredentials: true }
            ,toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
            ,title: '接口场景列表'
            ,cols: [[
                {type: 'checkbox', fixed: 'left'}
                ,{field:'id', title:'ID', width:250, fixed: 'left', unresize: true, sort: true}
                ,{field:'configName', title:'配置名称', width:100}
                ,{field:'configDesc', title:'配置描述', width:150}
                ,{field:'configValue', title:'配置值', width:200}
                ,{field:'createUser', title:'创建人', width:200}
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
                        ,area:['50%','500px']
                        ,content: $("#dialog").html()//引用的弹出层的页面层的方式加载修改界面表单
                        ,success: function(layero, index){
                            form.render('select');
                        }
                    });
                    //动态向表传递赋值可以参看文章进行修改界面的更新前数据的显示，当然也是异步请求的要数据的修改数据的获取
                    form.on('submit(formSubscribeConfig)', function (data) {
                        form.render('select');
                        dialogService.dialogHttp("addSubscribeConfig",data.field);

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
                                    'configName': data[0].configName,
                                    'configValue': data[0].configValue,
                                    'configDesc': data[0].configDesc
                                });

                            }
                        });
                    }
                    form.on('submit(formSubscribeConfig)', function (info) {
                        data[0].configName = info.field.configName;
                        data[0].configValue = info.field.configValue;
                        data[0].configDesc = info.field.configDesc;
                        dialogService.dialogHttp("updateSubscribeConfig",data[0]);

                        return false;//false：阻止表单跳转 true：表单跳转
                    });
                    break;
                case 'delete':
                    if(data.length === 0){
                        layer.msg('请选择一行');
                    } else {
                        const ids = [];
                        $.each(data,function (index, item) {
                            ids.push(item.id);
                            if (index === data.length-1) {
                                dialogService.delHttpService('deleteBatchSubscribeConfig?ids='+ids,'删除成功');
                            }
                        });
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
                    dialogService.delHttpService('deleteSubscribeConfig?id='+data.id,'删除成功');
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
                            'configName': data.configName,
                            'configValue': data.configValue,
                            'configDesc': data.configDesc
                        });
                    }
                });
                form.on('submit(formSubscribeConfig)', function (info) {
                    data.configName = info.field.configName;
                    data.configValue = info.field.configValue;
                    data.configDesc = info.field.configDesc;
                    dialogService.dialogHttp("updateSubscribeConfig",data);

                    return false;//false：阻止表单跳转 true：表单跳转
                });
            }
        });





    });
});