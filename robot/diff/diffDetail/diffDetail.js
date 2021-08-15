app.controller('diffDetailController',function ($scope, $http, dataService) {
    const baseUrl = dataService.getUrlData();
    layui.use(['layer', 'form','table'], function(){
        var table = layui.table;

        table.render({
            elem: '#test'
            ,url: baseUrl+'getDiffDetail'
            ,method: 'post'
            ,contentType: 'application/json'
            ,where: dataService.getData()
            ,title: '差异明细列表'
            ,page: true
            ,cols: [[
                {field:'primalKey', title:'主键'}
                ,{field:'origDetailValue', title:'原差值'}
                ,{field:'destDetailValue', title:'目标差值'}
            ]]
        });

    });
});