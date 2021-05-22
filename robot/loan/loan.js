app.controller('loanController', function ($scope, $http, dataService, dialogService) {
    var baseUrl = dataService.getUrlData();
    layui.use(['layer', 'form', 'table'], function () {
        var table = layui.table,
            form = layui.form,
            layer = layui.layer,
            $ = layui.jquery;

        form.render('select');

        table.render({
            elem: '#test'
            , title: '子借据列表'
            , toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
            , cols: [[
                {field: 'subSchedMode', title: '子计划还款方式', width: 250}
                , {field: 'totalAmt', title: '总金额', width: 100}
                , {field: 'startDate', title: '起始日期', width: 150}
                , {field: 'endDate', title: '终止日期', width: 200}
                , {fixed: 'right', title: '操作', toolbar: '#barDemo', width: 200}
            ]],
            data: []
        });

        //监听头工具栏事件
        table.on('toolbar(test)', function (obj) {
            switch (obj.event) {
                case 'add':
                    layer.open({
                        type: 1
                        , title: '添加数据'
                        , area: ['50%', '500px']
                        , content: $("#dialog").html()//引用的弹出层的页面层的方式加载修改界面表单
                        , success: function (layero, index) {
                            form.render('select');
                        }
                    });
                    //动态向表传递赋值可以参看文章进行修改界面的更新前数据的显示，当然也是异步请求的要数据的修改数据的获取
                    form.on('submit(formScheduleArray)', function (data) {
                        console.log(obj);
                        console.log(data);
                        obj.config.data.push(data.field);
                        form.render('select');
                        table.reload('test', {
                            data: obj.config.data
                        });
                        layer.closeAll();//关闭所有的弹出层
                        return false;//false：阻止表单跳转 true：表单跳转
                    });
                    break;
                case 'update':
                    break;
                case 'delete':
                    break;
            }
        });

        //监听行工具事件
        table.on('tool(test)', function (obj) {
            var data = obj.data;
            //console.log(obj)
            if (obj.event === 'del') {
                layer.confirm('真的删除行么', function (index) {
                    obj.del();
                    layer.close(index);
                });
            } else if (obj.event === 'edit') {
                layer.open({
                    type: 1
                    , title: '修改数据'
                    , area: ['50%', '500px']
                    , content: $('#dialog').html()//引用的弹出层的页面层的方式加载修改界面表单
                    , success: function (layero, index) {
                        form.val('example', {
                            'subSchedMode': data.subSchedMode,
                            'totalAmt': data.totalAmt,
                            'startDate': data.startDate,
                            'endDate': data.endDate
                        });
                    }
                });
                form.on('submit(formScheduleArray)', function (info) {
                    obj.update({
                        subSchedMode: info.field.subSchedMode
                        , totalAmt: info.field.totalAmt
                        , startDate: info.field.startDate
                        , endDate: info.field.endDate
                    });
                    layer.closeAll();//关闭所有的弹出层
                    return false;//false：阻止表单跳转 true：表单跳转
                });
            }
        });
        form.on('submit(formLoan)', function (info) {
            console.log(info.field);
            console.log(table.getData("test"));

        });
    });
});