app.controller('memberInfoController',function ($scope, $http, dataService,dialogService) {
    var baseUrl = dataService.getUrlData();
    layui.use(['layer', 'form','table'], function(){
        var table = layui.table,
            form = layui.form,
            layer = layui.layer,
            $=layui.jquery;
        //获取参数配置
        $http.get(dataService.getUrlData()+"getMerchantInfo").then(function successCallback(response) {
            if(response.data.code === 0){

                const dictList = response.data.data;
                layui.jquery.each(dictList,function (index, item) {
                    layui.jquery("#merchantName").append("<option value="+item.merchantName+">"+item.merchantDesc+"</option>");
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
            ,url: baseUrl+'getMemberInfo'
            // ,crossDomain: true
            // ,xhrFields: { withCredentials: true }
            ,toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
            ,title: '会员列表'
            ,cols: [[
                {type: 'checkbox', fixed: 'left'}
                ,{field:'memberName', title:'会员名称', width:150, fixed: 'left', unresize: true, sort: true}
                ,{field:'memberDesc', title:'会员姓名', width:200}
                ,{field:'merchantName', title:'商户名称', width:150}
                ,{field:'memberPhone', title:'会员电话', width:150}
                ,{field:'memberAddress', title:'会员地址', width:100}
                ,{field:'memberBalance', title:'会员余额', width:100}
                ,{field:'remark', title:'备注', width:90}
                ,{fixed: 'right', title:'操作', toolbar: '#barDemo', width:250}
            ]]
            ,page: true
        });
        $scope.search = function () {
            if ($scope.queryMemberDesc === undefined) {
                $scope.queryMemberDesc = null;
            }
            if ($scope.queryMemberPhone === undefined) {
                $scope.queryMemberPhone = null;
            }
            table.reload('test', {
                url: baseUrl+'getMemberInfoByCondition',
                where: {
                    memberDesc : $scope.queryMemberDesc,
                    memberPhone : $scope.queryMemberPhone,
                },
                page: {
                    curr: 1 //重新从第 1 页开始
                }
            });
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
                    form.on('submit(formMemberInfo)', function (data) {
                        form.render('select');
                        dialogService.dialogHttp("addMemberInfo",data.field);

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
                                    'memberDesc': data[0].memberDesc,
                                    'merchantName': data[0].merchantName,
                                    'memberPhone': data[0].memberPhone,
                                    'memberAddress': data[0].memberAddress,
                                    'remark': data[0].remark
                                });

                            }
                        });
                    }
                    form.on('submit(formMemberInfo)', function (info) {
                        data[0].memberDesc = info.field.memberDesc;
                        data[0].merchantName = info.field.merchantName;
                        data[0].memberPhone = info.field.memberPhone;
                        data[0].memberAddress = info.field.memberAddress;
                        data[0].remark = info.field.remark;
                        dialogService.dialogHttp("updateMemberInfo",data[0]);

                        return false;//false：阻止表单跳转 true：表单跳转
                    });
                    break;
                case 'delete':
                    if(data.length === 0){
                        layer.msg('请选择一行');
                    } else {
                        dialogService.delHttpService('deleteMemberInfo?memberName='+data[0].memberName,'删除成功','test');

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
                    dialogService.delHttpService('deleteMemberInfo?memberName='+data.memberName,'删除成功','test');
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
                            'memberDesc': data.memberDesc,
                            'merchantName': data.merchantName,
                            'memberPhone': data.memberPhone,
                            'memberAddress': data.memberAddress,
                            'remark': data.remark
                        });
                    }
                });
                form.on('submit(formMemberInfo)', function (info) {
                    data.memberDesc = info.field.memberDesc;
                    data.merchantName = info.field.merchantName;
                    data.memberPhone = info.field.memberPhone;
                    data.memberAddress = info.field.memberAddress;
                    data.remark = info.field.remark;
                    dialogService.dialogHttp("updateMemberInfo",data);

                    return false;//false：阻止表单跳转 true：表单跳转
                });
            } else if(obj.event === 'input'){
                layer.open({
                    type: 1
                    ,title: '充值'
                    ,area:['50%','500px']
                    ,content: $('#transDialog').html()//引用的弹出层的页面层的方式加载修改界面表单
                    ,success: function(layero, index){
                        form.val('example',{
                            'transMemberName': data.memberName,
                            'transMemberDesc': data.memberDesc,
                            'transMemberPhone': data.memberPhone
                        });
                    }
                });
                form.on('submit(formTransMemberInfo)', function (info) {
                    data.transAmount = info.field.transAmount;
                    data.remark = info.field.transRemark;
                    data.memberName = info.field.transMemberName;
                    data.transType = 'input';
                    dialogService.dialogHttp("updateBalance",data);

                    return false;//false：阻止表单跳转 true：表单跳转
                });
            } else if(obj.event === 'output'){
                layer.open({
                    type: 1
                    ,title: '消费'
                    ,area:['50%','500px']
                    ,content: $('#transDialog').html()//引用的弹出层的页面层的方式加载修改界面表单
                    ,success: function(layero, index){
                        form.val('example',{
                            'transMemberName': data.memberName,
                            'transMemberDesc': data.memberDesc,
                            'transMemberPhone': data.memberPhone
                        });
                    }
                });
                form.on('submit(formTransMemberInfo)', function (info) {
                    data.transAmount = info.field.transAmount;
                    data.remark = info.field.transRemark;
                    data.memberName = info.field.transMemberName;
                    data.transType = 'output';
                    dialogService.dialogHttp("updateBalance",data);

                    return false;//false：阻止表单跳转 true：表单跳转
                });
            }
        });





    });
});