app.controller('interfaceSceneController',function ($scope, $http, dataService,dialogService) {
    var baseUrl = dataService.getUrlData();
    layui.use(['layer', 'form','table'], function(){
        var table = layui.table,
            form = layui.form,
            layer = layui.layer,
            $=layui.jquery;

        form.render('select');

        table.render({
            elem: '#test'
            ,url: baseUrl+'getInterfaceScene'
            // ,crossDomain: true
            // ,xhrFields: { withCredentials: true }
            ,toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
            ,title: '接口场景列表'
            ,cols: [[
                {type: 'checkbox', fixed: 'left'}
                ,{field:'id', title:'ID', width:250, fixed: 'left', unresize: true, sort: true}
                ,{field:'tranCode', title:'交易码', width:100}
                ,{field:'sceneId', title:'场景ID', width:150}
                ,{field:'sceneDesc', title:'场景描述', width:200}
                ,{field:'sceneValue', title:'请求报文', width:200}
                ,{fixed: 'right', title:'操作', toolbar: '#barDemo', width:200}
            ]]
            ,page: true
        });
        $scope.search = function () {
            if ($scope.tranCode === null || $scope.tranCode === "" || $scope.tranCode === undefined) {
                layer.msg("查询条件交易码不能为空", {icon: 5})
            }else {
                table.reload('test', {
                    url: baseUrl+'getSceneByTranCode',
                    where: {
                        tranCode : $scope.tranCode
                    },
                    page: {
                        curr: 1 //重新从第 1 页开始
                    }
                });
            }

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
                    form.on('submit(formInterfaceScene)', function (data) {
                        form.render('select');
                        dialogService.dialogHttp("addInterfaceScene",data.field);

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
                                    'tranCode': data[0].tranCode,
                                    'sceneDesc': data[0].sceneDesc,
                                    'sceneValue': data[0].sceneValue
                                });

                            }
                        });
                    }
                    form.on('submit(formInterfaceScene)', function (info) {
                        data[0].tranCode = info.field.tranCode;
                        data[0].sceneDesc = info.field.sceneDesc;
                        data[0].sceneValue = info.field.sceneValue;
                        dialogService.dialogHttp("updateInterfaceScene",data[0]);

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
                                dialogService.delHttpService('deleteBatchInterfaceScene?ids='+ids,'删除成功');
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
                    dialogService.delHttpService('deleteInterfaceScene?id='+data.id,'删除成功');
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
                            'tranCode': data.tranCode,
                            'sceneDesc': data.sceneDesc,
                            'sceneValue': data.sceneValue
                        });
                    }
                });
                form.on('submit(formInterfaceScene)', function (info) {
                    data.tranCode = info.field.tranCode;
                    data.sceneDesc = info.field.sceneDesc;
                    data.sceneValue = info.field.sceneValue;
                    dialogService.dialogHttp("updateInterfaceScene",data);

                    return false;//false：阻止表单跳转 true：表单跳转
                });
            }
        });





    });
});