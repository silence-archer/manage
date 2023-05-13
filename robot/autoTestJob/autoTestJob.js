app.controller('autoTestJobController',function ($scope, $http, dataService,dialogService) {
    var baseUrl = dataService.getUrlData();
    layui.use(['layer', 'form','table'], function(){
        var table = layui.table,
            form = layui.form,
            layer = layui.layer,
            $=layui.jquery;

        form.render('select');

        table.render({
            elem: '#test'
            ,url: baseUrl+'queryAutoTestJob'
            // ,crossDomain: true
            // ,xhrFields: { withCredentials: true }
            ,toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
            ,title: '自动化测试任务列表'
            ,cols: [[
                {type: 'checkbox', fixed: 'left'}
                ,{field:'jobName', title:'自动化测试任务名称', width:250, fixed: 'left', unresize: true, sort: true}
                ,{field:'jobDesc', title:'自动化测试任务描述', width:100}
                ,{
                    field: 'enableAutoFlag', title: '自动运行标志', width: 100, templet: function (d) {
                        if (d.enableAutoFlag === 'Y') {
                            return '是';
                        }
                        if (d.enableAutoFlag === 'N') {
                            return '否';
                        }
                    }
                }
                ,{fixed: 'right', title:'操作', toolbar: '#barDemo', width:300}
            ]]
            ,page: true
        });
        $scope.search = function () {
            if ($scope.queryJobDesc === null || $scope.queryJobDesc === "" || $scope.queryJobDesc === undefined) {
                layer.msg("查询条件不能为空", {icon: 5})
            }else {
                table.reload('test', {
                    url: baseUrl+'queryAutoTestJob',
                    where: {
                        jobDesc : $scope.queryJobDesc
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
                    form.on('submit(formAutoTestJob)', function (data) {
                        form.render('select');
                        dialogService.dialogHttp("addAutoTestJob",data.field);

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
                                    'jobDesc': data[0].jobDesc,
                                    'enableAutoFlag': data[0].enableAutoFlag
                                });

                            }
                        });
                    }
                    form.on('submit(formAutoTestJob)', function (info) {
                        data[0].jobDesc = info.field.jobDesc;
                        data[0].enableAutoFlag = info.field.enableAutoFlag;
                        dialogService.dialogHttp("updateAutoTestJob",data[0]);

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
                                dialogService.delHttpService('deleteBatchAutoTestJob?ids='+ids,'删除成功','test');
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
                    dialogService.delHttpService('deleteAutoTestJob?id='+data.id,'删除成功','test');
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
                            'jobDesc': data.jobDesc,
                            'enableAutoFlag': data.enableAutoFlag
                        });
                    }
                });
                form.on('submit(formAutoTestJob)', function (info) {
                    data.jobDesc = info.field.jobDesc;
                    data.enableAutoFlag = info.field.enableAutoFlag;
                    dialogService.dialogHttp("updateAutoTestJob",data);

                    return false;//false：阻止表单跳转 true：表单跳转
                });
            } else if(obj.event === 'run'){
                layer.confirm('确定运行该任务吗', function(index){
                    dialogService.delHttpService('runAutoTestJob?jobName='+data.jobName,'运行成功','test');
                    layer.close(index);
                });
            }
        });





    });
});