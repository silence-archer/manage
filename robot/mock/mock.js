app.controller('mockController',function ($scope, $http, dataService,dialogService) {
    var baseUrl = dataService.getUrlData();
    layui.use(['layer', 'form','table'], function(){
        var table = layui.table,
            form = layui.form,
            layer = layui.layer,
            $=layui.jquery;

        table.render({
            elem: '#test'
            ,url: baseUrl+'getMockInfo'
            // ,crossDomain: true
            // ,xhrFields: { withCredentials: true }
            ,toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
            ,title: '挡板列表'
            ,cols: [[
                {type: 'checkbox', fixed: 'left'}
                ,{field:'mockUrl', title:'挡板URL', width:250, fixed: 'left', unresize: true, sort: true}
                ,{field:'mockModule', title:'挡板模块', width:100}
                ,{field:'mockName', title:'挡板名称', width:100}
                ,{field:'mockInput', title:'挡板入参', width:150}
                ,{field:'mockOutput', title:'挡板出参', width:200}
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
                    });
                    //动态向表传递赋值可以参看文章进行修改界面的更新前数据的显示，当然也是异步请求的要数据的修改数据的获取
                    form.on('submit(formMock)', function (data) {
                        dialogService.dialogHttp("addMock",data.field);

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
                                                'mockUrl': data[0].mockUrl,
                                                'mockName': data[0].mockName,
                                                'mockModule': data[0].mockModule,
                                                'mockInput': data[0].mockInput,
                                                'mockOutput': data[0].mockOutput
                                            });

                            }
                        });
                    }
                    form.on('submit(formMock)', function (info) {
                        data[0].mockUrl = info.field.mockUrl;
                        data[0].mockName = info.field.mockName;
                        data[0].mockModule = info.field.mockModule;
                        data[0].mockInput = info.field.mockInput;
                        data[0].mockOutput = info.field.mockOutput;
                        dialogService.dialogHttp("updateMock",data[0]);

                        return false;//false：阻止表单跳转 true：表单跳转
                    });
                    break;
                case 'delete':
                    if(data.length === 0){
                        layer.msg('请选择一行');
                    } else {
                        dialogService.delHttpService('deleteMock?id='+data[0].id,'删除成功');

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
                    dialogService.delHttpService('deleteMock?id='+data.id,'删除成功');
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
                            'mockUrl': data.mockUrl,
                            'mockName': data.mockName,
                            'mockModule': data.mockModule,
                            'mockInput': data.mockInput,
                            'mockOutput': data.mockOutput
                        });
                    }
                });
                form.on('submit(formMock)', function (info) {
                    data.mockUrl = info.field.mockUrl;
                    data.mockModule = info.field.mockModule;
                    data.mockName = info.field.mockName;
                    data.mockInput = info.field.mockInput;
                    data.mockOutput = info.field.mockOutput;
                    dialogService.dialogHttp("updateMock",data);

                    return false;//false：阻止表单跳转 true：表单跳转
                });
            }
        });





    });
});