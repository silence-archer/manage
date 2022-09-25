app.controller('dingClockController',function ($scope, $http, dataService,dialogService) {
    var baseUrl = dataService.getUrlData();
    layui.use(['layer', 'form','table'], function(){
        var table = layui.table,
            form = layui.form,
            layer = layui.layer,
            $=layui.jquery;

        form.render('select');

        table.render({
            elem: '#test'
            ,url: baseUrl+'getDingClockList'
            // ,crossDomain: true
            // ,xhrFields: { withCredentials: true }
            ,toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
            ,title: '打卡配置列表'
            ,cols: [[
                {type: 'checkbox', fixed: 'left'}
                ,{field:'username', title:'用户名', width:250, fixed: 'left', unresize: true, sort: true}
                ,{field:'userId', title:'userId', width:100}
                ,{field:'projectId', title:'projectId', width:100}
                ,{field:'ruleId', title:'ruleId', width:100}
                ,{field:'addrId', title:'addrId', width:100}
                ,{field:'apprUserId', title:'apprUserId', width:100}
                ,{field:'deptId', title:'deptId', width:100}
                ,{field:'workReportType', title:'workReportType', width:100}
                ,{field:'longitude', title:'longitude', width:100}
                ,{field:'latitude', title:'latitude', width:100}
                ,{field:'address', title:'address', width:100}
                ,{field:'imagePath', title:'imagePath', width:100}
                ,{field:'atcity', title:'atcity', width:100}
                ,{field:'pbflag', title:'pbflag', width:100}
                ,{field:'beforeup', title:'beforeup', width:100}
                ,{field:'itcode', title:'itcode', width:100}
                ,{field:'sbuId', title:'sbuId', width:100}
                ,{field:'openId', title:'openId', width:100}
                ,{field:'mailAddress', title:'mailAddress', width:100}
                , {
                    field: 'status', title: '状态', width: 100, templet: function (d) {
                        if (d.status === 'Y') {
                            return '生效';
                        }
                        if (d.status === 'N') {
                            return '失效';
                        }
                    }
                }
                ,{fixed: 'right', title:'操作', toolbar: '#barDemo', width:200}
            ]]
            ,page: true
        });
        $scope.search = function () {

            table.reload('test', {
                url: baseUrl+'getDingClockByCondition',
                where: {
                    username : $scope.username
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
                    form.on('submit(formDingClock)', function (data) {
                        form.render('select');
                        dialogService.dialogHttp("addDingClock",data.field);

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
                                                'username': data[0].username,
                                                'userId': data[0].userId,
                                                'projectId': data[0].projectId,
                                                'ruleId': data[0].ruleId,
                                                'addrId': data[0].addrId,
                                                'apprUserId': data[0].apprUserId,
                                                'deptId': data[0].deptId,
                                                'workReportType': data[0].workReportType,
                                                'longitude': data[0].longitude,
                                                'latitude': data[0].latitude,
                                                'address': data[0].address,
                                                'imagePath': data[0].imagePath,
                                                'atcity': data[0].atcity,
                                                'pbflag': data[0].pbflag,
                                                'beforeup': data[0].beforeup,
                                                'itcode': data[0].itcode,
                                                'sbuId': data[0].sbuId,
                                                'openId': data[0].openId,
                                                'mailAddress': data[0].mailAddress,
                                                'status': data[0].status
                                            });

                            }
                        });
                    }
                    form.on('submit(formDingClock)', function (info) {
                        data[0].username = info.field.username;
                        data[0].userId = info.field.userId;
                        data[0].projectId = info.field.projectId;
                        data[0].ruleId = info.field.ruleId;
                        data[0].addrId = info.field.addrId;
                        data[0].apprUserId = info.field.apprUserId;
                        data[0].deptId = info.field.deptId;
                        data[0].workReportType = info.field.workReportType;
                        data[0].longitude = info.field.longitude;
                        data[0].latitude = info.field.latitude;
                        data[0].address = info.field.address;
                        data[0].imagePath = info.field.imagePath;
                        data[0].atcity = info.field.atcity;
                        data[0].pbflag = info.field.pbflag;
                        data[0].beforeup = info.field.beforeup;
                        data[0].itcode = info.field.itcode;
                        data[0].sbuId = info.field.sbuId;
                        data[0].openId = info.field.openId;
                        data[0].mailAddress = info.field.mailAddress;
                        data[0].status = info.field.status;
                        dialogService.dialogHttp("updateDingClock",data[0]);

                        return false;//false：阻止表单跳转 true：表单跳转
                    });
                    break;
                case 'delete':
                    if(data.length === 0){
                        layer.msg('请选择一行');
                    } else {
                        dialogService.delHttpService('deleteDingClock?id='+data[0].id,'删除成功','test');

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
                    dialogService.delHttpService('deleteDingClock?id='+data.id,'删除成功','test');
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
                            'username': data.username,
                            'userId': data.userId,
                            'projectId': data.projectId,
                            'ruleId': data.ruleId,
                            'addrId': data.addrId,
                            'apprUserId': data.apprUserId,
                            'deptId': data.deptId,
                            'workReportType': data.workReportType,
                            'longitude': data.longitude,
                            'latitude': data.latitude,
                            'address': data.address,
                            'imagePath': data.imagePath,
                            'atcity': data.atcity,
                            'pbflag': data.pbflag,
                            'beforeup': data.beforeup,
                            'itcode': data.itcode,
                            'sbuId': data.sbuId,
                            'openId': data.openId,
                            'mailAddress': data.mailAddress,
                            'status': data.status
                        });
                    }
                });
                form.on('submit(formDingClock)', function (info) {
                    data.username = info.field.username;
                    data.userId = info.field.userId;
                    data.projectId = info.field.projectId;
                    data.ruleId = info.field.ruleId;
                    data.addrId = info.field.addrId;
                    data.apprUserId = info.field.apprUserId;
                    data.deptId = info.field.deptId;
                    data.workReportType = info.field.workReportType;
                    data.longitude = info.field.longitude;
                    data.latitude = info.field.latitude;
                    data.address = info.field.address;
                    data.imagePath = info.field.imagePath;
                    data.atcity = info.field.atcity;
                    data.pbflag = info.field.pbflag;
                    data.beforeup = info.field.beforeup;
                    data.itcode = info.field.itcode;
                    data.sbuId = info.field.sbuId;
                    data.openId = info.field.openId;
                    data.mailAddress = info.field.mailAddress;
                    data.status = info.field.status;
                    dialogService.dialogHttp("updateDingClock",data);

                    return false;//false：阻止表单跳转 true：表单跳转
                });
            }else if(obj.event === 'detail'){
                layer.confirm('确定运行该任务吗', function(index){
                    dialogService.delHttpService('dingClick?id='+data.id,'运行成功','test');
                    layer.close(index);
                });
            }
        });





    });
});