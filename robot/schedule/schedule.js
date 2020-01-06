app.controller('scheduleController',function ($scope, $http, dataService,dialogService) {
    var baseUrl = dataService.getUrlData();
    layui.use(['layer', 'form','table'], function(){
        var table = layui.table,
            form = layui.form,
            layer = layui.layer,
            $=layui.jquery;

        table.render({
            elem: '#test'
            ,url: baseUrl+'queryCronTask'
            ,toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
            ,title: '用户数据表'
            ,cols: [[
                {type: 'checkbox', fixed: 'left'}
                ,{field:'id', title:'ID', width:250, fixed: 'left', unresize: true, sort: true}
                ,{field:'jobName', title:'任务名称', width:100}
                ,{field:'jobDesc', title:'任务描述', width:150}
                ,{field:'jobClass', title:'任务实现类', width:200}
                ,{field:'cronExpr', title:'cron表达式', width:300}
                ,{field:'effectFlag', title:'生效标志', width:200, templet: function(d){
                        if(d.effectFlag === 'Y'){
                            return '是';
                        }else{
                            return '否';
                        }

                    }}
                ,{field:'createTime', title:'创建时间', width:200}
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
                        ,content: $("#dialogSchedule").html()//引用的弹出层的页面层的方式加载修改界面表单
                        ,success: function(layero, index){
                            form.render('select');
                        }
                    });
                    //动态向表传递赋值可以参看文章进行修改界面的更新前数据的显示，当然也是异步请求的要数据的修改数据的获取
                    form.on('submit(formSchedule)', function (data) {
                        dialogService.dialogHttp("addCronTask",data.field);

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
                            ,content: $('#dialogSchedule').html()//引用的弹出层的页面层的方式加载修改界面表单
                            ,success: function(layero, index){
                                form.val('example',{
                                    'jobName': data[0].jobName,
                                    'jobDesc': data[0].jobDesc,
                                    'jobClass': data[0].jobClass,
                                    'cronExpr': data[0].cronExpr,
                                    'effectFlag': data[0].effectFlag
                                });

                            }
                        });
                    }
                    form.on('submit(formSchedule)', function (info) {
                        data[0].jobName = info.field.jobName;
                        data[0].jobDesc = info.field.jobDesc;
                        data[0].jobClass = info.field.jobClass;
                        data[0].cronExpr = info.field.cronExpr;
                        data[0].effectFlag = info.field.effectFlag;
                        dialogService.dialogHttp("updateCronTask",data[0]);

                        return false;//false：阻止表单跳转 true：表单跳转
                    });
                    break;
                case 'delete':
                    if(data.length === 0){
                        layer.msg('请选择一行');
                    } else {
                        dialogService.delHttpService('deleteCronTask?jobName='+data[0].jobName,'删除成功');

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
                    dialogService.delHttpService('deleteCronTask?jobName='+data.jobName,'删除成功');
                    layer.close(index);
                });
            } else if(obj.event === 'edit'){
                layer.open({
                    type: 1
                    ,title: '修改数据'
                    ,area:['30%','400px']
                    ,content: $('#dialogSchedule').html()//引用的弹出层的页面层的方式加载修改界面表单
                    ,success: function(layero, index){
                        form.val('example',{
                            'jobName': data.jobName,
                            'jobDesc': data.jobDesc,
                            'jobClass': data.jobClass,
                            'cronExpr': data.cronExpr,
                            'effectFlag': data.effectFlag
                        });
                    }
                });
                form.on('submit(formSchedule)', function (info) {
                    data.jobName = info.field.jobName;
                    data.jobDesc = info.field.jobDesc;
                    data.jobClass = info.field.jobClass;
                    data.cronExpr = info.field.cronExpr;
                    data.effectFlag = info.field.effectFlag;
                    dialogService.dialogHttp("updateCronTask",data);

                    return false;//false：阻止表单跳转 true：表单跳转
                });
            }
        });





    });
});