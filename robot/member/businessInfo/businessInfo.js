app.controller('businessInfoController',function ($scope, $http, dataService,dialogService) {
    var baseUrl = dataService.getUrlData();
    layui.use(['layer', 'form','table'], function(){
        var table = layui.table,
            form = layui.form,
            layer = layui.layer,
            $=layui.jquery;
        //获取参数配置
        $http.get(dataService.getUrlData()+"getUserList").then(function successCallback(response) {
            if(response.data.code === 0){
                layui.jquery("#businessOperator").append("<option value=''>请选择</option>");
                const dictList = response.data.data;
                layui.jquery.each(dictList,function (index, item) {
                    layui.jquery("#businessOperator").append("<option value="+item.username+">"+item.nickname+"</option>");
                });
                layui.form.render("select");
            }else{
                layer.msg(response.data.msg,{icon:5});
            }
        }, function errorCallback(response) {
            console.log(response);
        });
        form.render('select');

        table.render({
            elem: '#test'
            ,url: baseUrl+'getBusinessInfo'
            // ,crossDomain: true
            // ,xhrFields: { withCredentials: true }
            ,toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
            ,title: '经销商列表'
            ,cols: [[
                {type: 'checkbox', fixed: 'left'}
                ,{field:'businessName', title:'经销商名称', width:200, fixed: 'left', unresize: true, sort: true}
                ,{field:'businessDesc', title:'经销商描述', width:200}
                ,{field:'businessOperator', title:'经销商管理员', width:200}
                ,{field:'businessPhone', title:'经销商电话', width:200}
                ,{field:'remark', title:'备注', width:200}
                ,{fixed: 'right', title:'操作', toolbar: '#barDemo', width:200}
            ]]
            ,page: true
        });
        $scope.search = function () {
            if ($scope.queryBusinessDesc == null || $scope.queryBusinessDesc === "" || $scope.queryBusinessDesc === undefined) {
                layer.msg("查询条件不能为空");
            }else {
                table.reload('test', {
                    url: baseUrl+'getBusinessInfoByCondition',
                    where: {
                        businessDesc : $scope.queryBusinessDesc,
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
                    form.on('submit(formBusinessInfo)', function (data) {
                        form.render('select');
                        dialogService.dialogHttp("addBusinessInfo",data.field);

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
                                    'businessDesc': data[0].businessDesc,
                                    'businessOperator': data[0].businessOperator,
                                    'businessPhone': data[0].businessPhone,
                                    'remark': data[0].remark
                                });

                            }
                        });
                    }
                    form.on('submit(formBusinessInfo)', function (info) {
                        data[0].businessDesc = info.field.businessDesc;
                        data[0].businessOperator = info.field.businessOperator;
                        data[0].businessPhone = info.field.businessPhone;
                        data[0].remark = info.field.remark;
                        dialogService.dialogHttp("updateBusinessInfo",data[0]);

                        return false;//false：阻止表单跳转 true：表单跳转
                    });
                    break;
                case 'delete':
                    if(data.length === 0){
                        layer.msg('请选择一行');
                    } else {
                        dialogService.delHttpService('deleteBusinessInfo?businessName='+data[0].businessName,'删除成功','test');

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
                    dialogService.delHttpService('deleteBusinessInfo?businessName='+data.businessName,'删除成功','test');
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
                            'businessDesc': data.businessDesc,
                            'businessOperator': data.businessOperator,
                            'businessPhone': data.businessPhone,
                            'remark': data.remark
                        });
                    }
                });
                form.on('submit(formBusinessInfo)', function (info) {
                    data.businessDesc = info.field.businessDesc;
                    data.businessOperator = info.field.businessOperator;
                    data.businessPhone = info.field.businessPhone;
                    data.remark = info.field.remark;
                    dialogService.dialogHttp("updateBusinessInfo",data);

                    return false;//false：阻止表单跳转 true：表单跳转
                });
            }
        });





    });
});