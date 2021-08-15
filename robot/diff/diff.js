app.controller('diffController',function ($scope, $http, dataService,dialogService, dataDictService) {
    const baseUrl = dataService.getUrlData();
    layui.use(['layer', 'form','table'], function(){
        var table = layui.table,
            form = layui.form,
            layer = layui.layer,
            $ = layui.jquery;
        dataDictService.getDataDictService("businessType", "origBusinessType");
        dataDictService.getDataDictService("businessType", "destBusinessType");
        dataDictService.getDataDictService("dataName", "dataName");
        form.render();


        table.render({
            elem: '#test'
            ,data: []
            ,title: '差异列表'
            ,page: true
            ,cols: [[
               {field:'enumDesc', title:'数据名称', width:150}
                ,{field:'runScript', title:'执行脚本', width:160}
                ,{field:'origValue', title:'原值', width:180}
                ,{field:'destValue', title:'目标值', width:180}
                ,{field: 'right', title:'操作', toolbar: '#barDemo', width:80}
            ]]
        });

        $scope.search = function () {

            table.reload('test', {
                url: baseUrl+'getDiff',
                where: {
                    origBusinessType : $('#origBusinessType').val(),
                    destBusinessType : $('#destBusinessType').val(),
                    dataName : $('#dataName').val(),
                }
            });
        }



        //监听行工具事件
        table.on('tool(test)', function(obj){
            const paramter = obj.data;
            dataService.setData(paramter);
            location.replace(location.href.split("#")[0]+"#!/diffDetail");
        });
    });
});