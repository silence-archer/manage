app.controller('dataDictController',function ($scope, $http, dataService,dialogService) {
    var baseUrl = dataService.getUrlData();
    layui.use(['layer', 'form','table','upload'], function(){
        var table = layui.table,
            form = layui.form,
            layer = layui.layer,
            upload = layui.upload,
            $=layui.jquery;

        table.render({
            elem: '#test'
            ,url: baseUrl+'getDataDictList'
            // ,crossDomain: true
            // ,xhrFields: { withCredentials: true }
            ,toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
            ,title: '数据字典列表'
            ,cols: [[
                {type: 'checkbox', fixed: 'left'}
                ,{field:'id', title:'ID', width:250, fixed: 'left', unresize: true, sort: true}
                ,{field:'name', title:'数据字典名称', width:100}
                ,{field:'desc', title:'数据字典描述', width:100}
                ,{field:'enumName', title:'数据字典枚举值', width:150}
                ,{field:'enumDesc', title:'数据字典枚举值描述', width:200}
                ,{field:'remark', title:'备注', width:200}
                ,{fixed: 'right', title:'操作', toolbar: '#barDemo', width:200}
            ]]
            ,page: true
        });
        $scope.search = function () {
            if ($scope.name == null || $scope.name === "" || $scope.name === undefined) {
                layer.msg("查询条件不能为空");
            }else {
                table.reload('test', {
                    url: baseUrl+'getDataDictByName',
                    where: {
                        name : $scope.name,
                    },
                    page: {
                        curr: 1 //重新从第 1 页开始
                    }
                });
            }

        }
        //创建一个上传组件
        upload.render({
            elem: '#upload'
            ,url: baseUrl+'upload/uploadDataDict'
            ,done: function(res) { //上传后的回调
                console.log(res);
                if (res.code !== 0) {
                    layer.msg(res.msg)
                }else {
                    table.reload('test', {
                        where: {
                        },
                        page: {
                            curr: 1 //重新从第 1 页开始
                        }
                    }); //只重载数据
                }
            }
            ,accept: 'file' //允许上传的文件类型
        })

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
                    });
                    //动态向表传递赋值可以参看文章进行修改界面的更新前数据的显示，当然也是异步请求的要数据的修改数据的获取
                    form.on('submit(formDataDict)', function (data) {
                        dialogService.dialogHttp("addDataDict",data.field);

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
                                    'name': data[0].name,
                                    'desc': data[0].desc,
                                    'enumName': data[0].enumName,
                                    'enumDesc': data[0].enumDesc,
                                    'remark': data[0].remark
                                });

                            }
                        });
                    }
                    form.on('submit(formDataDict)', function (info) {
                        data[0].name = info.field.name;
                        data[0].desc = info.field.desc;
                        data[0].enumName = info.field.enumName;
                        data[0].enumDesc = info.field.enumDesc;
                        data[0].remark = info.field.remark;
                        dialogService.dialogHttp("updateDataDict",data[0]);

                        return false;//false：阻止表单跳转 true：表单跳转
                    });
                    break;
                case 'delete':
                    if(data.length === 0){
                        layer.msg('请选择一行');
                    } else {
                        dialogService.delHttpService('deleteDataDict?id='+data[0].id,'删除成功');

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
                    dialogService.delHttpService('deleteDataDict?id='+data.id,'删除成功');
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
                            'name': data.name,
                            'desc': data.desc,
                            'enumName': data.enumName,
                            'enumDesc': data.enumDesc,
                            'remark': data.remark
                        });
                    }
                });
                form.on('submit(formDataDict)', function (info) {
                    data.name = info.field.name;
                    data.desc = info.field.desc;
                    data.enumName = info.field.enumName;
                    data.enumDesc = info.field.enumDesc;
                    data.remark = info.field.remark;
                    dialogService.dialogHttp("updateDataDict",data);

                    return false;//false：阻止表单跳转 true：表单跳转
                });
            }
        });





    });
});