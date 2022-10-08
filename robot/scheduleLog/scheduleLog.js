app.controller('scheduleLogController',function ($scope, $http, dataService,dialogService) {
    var baseUrl = dataService.getUrlData();
    layui.use(['layer', 'form','table'], function(){
        var table = layui.table,
            layer = layui.layer;

        table.render({
            elem: '#test'
            ,url: baseUrl+'queryCronTaskProcLog'
            ,toolbar: true //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
            ,title: '定时任务执行日志表'
            ,cols: [[
                {field:'id', title:'ID', width:250, fixed: 'left', unresize: true, sort: true}
                ,{field:'jobName', title:'任务名称', width:200}
                ,{field:'jobDesc', title:'任务描述', width:250}
                ,{field:'procStatus', title:'执行状态', width:150, templet: function(d){
                        if(d.procStatus === 'SUCCESS'){
                            return '成功';
                        }else{
                            return '失败';
                        }

                    }}
                ,{field:'errorMsg', title:'错误信息', width:300}
                ,{field:'updateTime', title:'更新时间', width:250}
                ,{fixed: 'right', title:'操作', toolbar: '#barDemo', width:100}
            ]]
            ,page: true
        });


        //监听行工具事件
        table.on('tool(test)', function(obj){
            var data = obj.data;
            if(obj.event === 'detail'){
                layer.confirm('确定重试该任务么', function(index){
                    obj.del();
                    dialogService.delHttpService('retryCronTask?id='+data.id,'重试成功','test');
                    layer.close(index);
                });
            }
        });

    });
});