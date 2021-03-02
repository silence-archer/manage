app.controller('interfaceController',function ($scope, $http, dataService,dialogService) {
    var baseUrl = dataService.getUrlData();
    var ohtUrl = dataService.getOthUrlData();
    layui.use(['layer', 'form','table'], function(){
        var table = layui.table,
            form = layui.form,
            layer = layui.layer,
            $=layui.jquery;

        table.render({
            elem: '#test'
            ,url: baseUrl+'getEurekaInfo?eurekaUrl='+ohtUrl
            // ,crossDomain: true
            // ,xhrFields: { withCredentials: true }
            ,toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
            ,title: '挡板列表'
            ,cols: [[
                {type: 'checkbox', fixed: 'left'}
                ,{field:'name', title:'应用名称', width:250, fixed: 'left', unresize: true, sort: true}
                ,{field:'ipAddr', title:'ip地址', width:100}
                ,{field:'instanceId', title:'实例ID', width:150}
                ,{field:'hostName', title:'主机名称', width:200}
                ,{field:'owner', title:'所有者', width:100}
                ,{field:'port', title:'端口', width:50}
                ,{field:'homePageUrl', title:'url', width:200}
                , {
                    field: 'status', title: '状态', width: 100, templet: function (d) {
                        if (d.status === 'UP') {
                            return '生效';
                        }
                        if (d.status === 'DOWN') {
                            return '失效';
                        }
                        return d.status;
                    }
                }
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
                case 'update':
                case 'delete':
                    var params = {
                        "pageSize": 10,
                        "pageIndex": 1
                    };
                    var jsonObj = {};
                    for (var i=0; i<data.length; i++) {
                        jsonObj[data[i].name] = data[i].homePageUrl;
                    }
                    params["services"] = jsonObj;
                    console.log(params);
                    $http.post(baseUrl+"terr/interface/exportAll/excel",params, {responseType: 'arraybuffer'}).then(function successCallback(response) {
                        var blob = new Blob([response.data], {type: "application/vnd.ms-excel"});
                        var objectUrl = URL.createObjectURL(blob);
                        var a = document.createElement('a');
                        document.body.appendChild(a);
                        a.setAttribute('style', 'display:none');
                        a.setAttribute('href', objectUrl);
                        var filename="all.xlsx";
                        a.setAttribute('download', filename);
                        a.click();
                        URL.revokeObjectURL(objectUrl);
                    }, function errorCallback(response) {
                        console.log(response);
                        layer.msg("未知错误");
                    });
                    break;
            };
        });

    });
});