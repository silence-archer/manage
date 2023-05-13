app.controller('autoTestController',function ($scope, $http, dataService,dialogService) {
    var baseUrl = dataService.getUrlData();
    layui.use(['layer', 'form','table'], function(){
        var table = layui.table,
            form = layui.form,
            layer = layui.layer,
            $=layui.jquery;
        $http.get(dataService.getUrlData()+"getAllAutoTestJob").then(function successCallback(response) {
            if(response.data.code === 0){
                const dictList = response.data.data;
                layui.jquery("#jobName").html('<option value="">请选择</option>')
                layui.jquery.each(dictList,function (index, item) {
                    layui.jquery("#jobName").append("<option value="+item.jobName+">"+item.jobDesc+"</option>");
                });
                layui.form.render("select");
                table.render({
                    elem: '#test'
                    ,url: baseUrl+'queryAutoTest'
                    // ,crossDomain: true
                    // ,xhrFields: { withCredentials: true }
                    ,toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
                    ,title: '测试案例列表'
                    ,cols: [[
                        {type: 'checkbox', fixed: 'left'}
                        ,{field:'testCaseName', title:'测试案例名称', width:250, fixed: 'left', unresize: true, sort: true}
                        ,{
                            field:'jobName', title:'自动化测试任务名称', width:250, templet: function (d) {
                                for (let i = 0; i < dictList.length; i++) {
                                    if (dictList[i].jobName === d.jobName) {
                                        return dictList[i].jobDesc;
                                    }
                                }
                            }
                        }
                        ,{field:'testCaseDesc', title:'测试案例描述', width:100}
                        ,{field:'sort', title:'排序', width:100}
                        ,{field:'loopNum', title:'循环测试', width:100}

                        ,{fixed: 'right', title:'操作', toolbar: '#barDemo', width:300}
                    ]]
                    ,page: true
                });
            }else{
                layer.msg(response.data.msg,{icon:5});
            }
        }, function errorCallback(response) {
            console.log(response);
        });
        form.render('select');


        $scope.search = function () {
            if ($scope.queryTestCaseDesc === null || $scope.queryTestCaseDesc === "" || $scope.queryTestCaseDesc === undefined) {
                layer.msg("查询条件不能为空", {icon: 5})
            }else {
                table.reload('test', {
                    url: baseUrl+'queryAutoTest',
                    where: {
                        testCaseDesc : $scope.queryTestCaseDesc
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
                    form.on('submit(formAutoTest)', function (data) {
                        form.render('select');
                        dialogService.dialogHttp("addAutoTest",data.field);

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
                                    'testCaseDesc': data[0].testCaseDesc,
                                    'sort': data[0].sort,
                                    'loopNum': data[0].loopNum,
                                    'jobName': data[0].jobName
                                });

                            }
                        });
                    }
                    form.on('submit(formAutoTest)', function (info) {
                        data[0].testCaseDesc = info.field.testCaseDesc;
                        data[0].sort = info.field.sort;
                        data[0].loopNum = info.field.loopNum;
                        data[0].jobName = info.field.jobName;
                        dialogService.dialogHttp("updateAutoTest",data[0]);

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
                                dialogService.delHttpService('deleteBatchAutoTest?ids='+ids,'删除成功','test');
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
                    dialogService.delHttpService('deleteAutoTest?id='+data.id,'删除成功','test');
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
                            'testCaseDesc': data.testCaseDesc,
                            'sort': data.sort,
                            'loopNum': data.loopNum,
                            'jobName': data.jobName
                        });
                    }
                });
                form.on('submit(formAutoTest)', function (info) {
                    data.testCaseDesc = info.field.testCaseDesc;
                    data.sort = info.field.sort;
                    data.loopNum = info.field.loopNum;
                    data.jobName = info.field.jobName;
                    dialogService.dialogHttp("updateAutoTest",data);

                    return false;//false：阻止表单跳转 true：表单跳转
                });
            } else if(obj.event === 'run'){
                layer.confirm('确定运行该任务吗', function(index){
                    dialogService.delHttpService('runAutoTest?testCaseName='+data.testCaseName,'运行成功','test');
                    layer.close(index);
                });
            } else if(obj.event === 'detail'){
                dataService.setData(data);
                location.replace(location.href.split("#")[0]+"#!/autoTestDetail");
            }
        });





    });
});