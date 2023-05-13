app.controller('autoTestDetailController',function ($scope, $http, dataService,dialogService,dataDictService) {
    var baseUrl = dataService.getUrlData();
    layui.use(['layer', 'form','table'], function(){
        var table = layui.table,
            form = layui.form,
            layer = layui.layer,
            $=layui.jquery;

        $http.get(dataService.getUrlData()+"getSceneTranCode").then(function successCallback(response) {
            if(response.data.code === 0){
                const dictList = response.data.data;
                layui.jquery("#tranCode").html('<option value="">请选择</option>')
                layui.jquery("#sceneId").html('<option value="">请选择</option>')
                layui.jquery.each(dictList,function (index, item) {
                    layui.jquery("#tranCode").append("<option value="+item.id+">"+item.title+"</option>");
                    layui.jquery("#sceneId").append("<optgroup label="+item.title+" id=sceneIdOptgroup"+index+">");
                    layui.jquery.each(item.child, function (i, node) {
                        layui.jquery("#sceneIdOptgroup"+index).append("<option value="+node.id+">"+node.title+"</option>");
                    });
                });
                layui.form.render("select");
            }else{
                layer.msg(response.data.msg,{icon:5});
            }
        }, function errorCallback(response) {
            console.log(response);
        });
        form.on('select(sceneId)', function(data){
            $http.get(baseUrl+'getSceneBySceneId?sceneId='+data.value).then(function successCallback(response) {
                if(response.data.code === 0){
                    console.log(response.data.data);
                    form.val('example', {
                        'tranCode': response.data.data.tranCode,
                        'sceneType': response.data.data.sceneType
                    });
                }else{
                    layer.msg(response.data.msg, {icon: 5});
                }

            }, function errorCallback(response) {
                console.log(response);
            });
        });
        dataDictService.getDataDictService("businessType","businessType");
        form.render();
        table.render({
            elem: '#test'
            ,url: baseUrl+'queryAutoTestDetail?testCaseName='+dataService.getData().testCaseName
            // ,crossDomain: true
            // ,xhrFields: { withCredentials: true }
            ,toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
            ,title: '测试案例明细列表'
            ,cols: [[
                {type: 'checkbox', fixed: 'left'}
                ,{field:'testCaseName', title:'测试案例名称', width:250, fixed: 'left', unresize: true, sort: true}
                ,{field:'tranCode', title:'交易码', width:100}
                ,{field:'tranDesc', title:'交易描述', width:100}
                ,{field:'sceneId', title:'接口场景', width:100}
                ,{field:'sceneType', title:'接口场景类型', width:100}
                ,{field:'sceneDesc', title:'接口场景描述', width:100}
                ,{field:'businessType', title:'业务类型', width:100}
                ,{field:'businessTypeDesc', title:'业务类型描述', width:100}
                ,{field:'sort', title:'排序', width:100}
                ,{field:'delayTime', title:'间隔时间', width:100}
                ,{fixed: 'right', title:'操作', toolbar: '#barDemo', width:300}
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
                            form.render();
                        }
                    });

                    //动态向表传递赋值可以参看文章进行修改界面的更新前数据的显示，当然也是异步请求的要数据的修改数据的获取
                    form.on('submit(formAutoTestDetail)', function (data) {
                        form.render();
                        data.field.testCaseName = dataService.getData().testCaseName;
                        dialogService.dialogHttp("addAutoTestDetail",data.field);

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
                                    'testCaseName': dataService.getData().testCaseName,
                                    'sceneId': data[0].sceneId,
                                    'tranCode': data[0].tranCode,
                                    'sceneType': data[0].sceneType,
                                    'businessType': data[0].businessType,
                                    'sort': data[0].sort,
                                    'delayTime': data[0].delayTime
                                });

                            }
                        });
                    }
                    form.on('submit(formAutoTestDetail)', function (info) {
                        data[0].testCaseName = dataService.getData().testCaseName;
                        data[0].sceneId = info.field.sceneId;
                        data[0].sceneType = info.field.sceneType;
                        data[0].businessType = info.field.businessType;
                        data[0].sort = info.field.sort;
                        data[0].delayTime = info.field.delayTime;
                        dialogService.dialogHttp("updateAutoTestDetail",data[0]);

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
                                dialogService.delHttpService('deleteBatchAutoTestDetail?ids='+ids,'删除成功','test');
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
                    dialogService.delHttpService('deleteAutoTestDetail?id='+data.id,'删除成功','test');
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
                            'testCaseName': dataService.getData().testCaseName,
                            'sceneId': data.sceneId,
                            'tranCode': data.tranCode,
                            'sceneType': data.sceneType,
                            'businessType': data.businessType,
                            'sort': data.sort,
                            'delayTime': data.delayTime
                        });
                    }
                });
                form.on('submit(formAutoTestDetail)', function (info) {
                    data.testCaseName = dataService.getData().testCaseName;
                    data.sceneId = info.field.sceneId;
                    data.sceneType = info.field.sceneType;
                    data.businessType = info.field.businessType;
                    data.sort = info.field.sort;
                    data.delayTime = info.field.delayTime;
                    dialogService.dialogHttp("updateAutoTestDetail",data);

                    return false;//false：阻止表单跳转 true：表单跳转
                });
            }
        });





    });
});