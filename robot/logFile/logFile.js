app.controller('logFileController',function ($scope, $http, dataService,dialogService, dataDictService) {
    const baseUrl = dataService.getUrlData();
    layui.use(['layer', 'form','table', 'laydate'], function(){
        var table = layui.table,
            form = layui.form,
            layer = layui.layer,
            laydate = layui.laydate,
            $ = layui.jquery;
        laydate.render({
            elem: '#startDate'
            ,type: 'datetime'
            ,trigger:'click'//增加这个，解决闪屏
            ,done: function(value){
                $scope.startDate = value;
            }
        });
        laydate.render({
            elem: '#endDate'
            ,type: 'datetime'
            ,trigger:'click'//增加这个，解决闪屏
            ,done: function(value){
                $scope.endDate = value;
            }
        });

        dataDictService.getDataDictService("businessType", "businessType");
        form.render();


        table.render({
            elem: '#test'
            ,url: baseUrl+'getLogFileInfo'
            ,title: '日志列表'
            ,cols: [[
               {field:'dateTime', title:'日期', width:150}
                ,{field:'serviceName', title:'服务名称', width:160}
                ,{field:'level', title:'级别', width:90}
                ,{field:'tranCode', title:'交易码', width:180}
                ,{field:'traceId', title:'流水号', width:200}
                ,{field:'subTraceId', title:'子流水号', width:200}
                ,{field:'threadName', title:'线程名', width:100}
                ,{field:'className', title:'类名', width:200}
                ,{field:'lineNum', title:'行号', width:60}
                ,{field: 'content', title:'内容', width:250}
                ,{field: 'right', title:'操作', toolbar: '#barDemo', width:80}
            ]]
            ,page: true
        });
        form.on('submit(formLogFile)', function (info) {
            table.reload('test', {
                url: baseUrl+'getLogFileByCondition',
                method: 'post',
                contentType: 'application/json',
                where: info.field,
                page: {
                    curr: 1 //重新从第 1 页开始
                }
            });

            return false;//false：阻止表单跳转 true：表单跳转
        });

        $scope.search = function () {

            table.reload('test', {
                url: baseUrl+'getLogFileByCondition',
                method: 'post',
                contentType: 'application/json',
                where: {
                    startDate : $scope.startDate,
                    endDate : $scope.endDate,
                    serviceName : $scope.serviceName,
                    level : $('#level').val(),
                    traceId : $scope.traceId,
                    tranCode : $scope.tranCode,
                    content : $scope.content,
                    businessType : $scope.businessType,
                },
                page: {
                    curr: 1 //重新从第 1 页开始
                }
            });
        }

        $scope.delete = function () {
            const data = {
                startDate: $scope.startDate,
                endDate: $scope.endDate,
                serviceName: $scope.serviceName,
                level: $('#level').val(),
                traceId: $scope.traceId,
                tranCode: $scope.tranCode,
                content: $scope.content,
                businessType: $scope.businessType,
            };
            layer.confirm('是否删除当前条件下的所有日志', function(index){
                dialogService.dialogHttp('deleteLogFileByCondition', data);
                layer.close(index);
            });



        }

        //监听行工具事件
        table.on('tool(test)', function(obj){
            const data = obj.data;
            layer.open({
                title: '日志内容'
                ,content: data.content.replace(/\n/g,"<br>")

            });

        });


    });
});