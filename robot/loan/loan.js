app.controller('loanController', function ($scope, $http, $location, dataService, dataDictService) {
    var baseUrl = dataService.getUrlData();
    layui.use(['layer', 'form', 'table'], function () {
        var table = layui.table,
            form = layui.form,
            layer = layui.layer,
            $ = layui.jquery;
        dataDictService.getUserListService("ipOwner");
        dataDictService.getSceneService("scene","test");
        dataDictService.getDataDictService("optionKw","optionKw");
        dataDictService.getDataDictService("monthBasis","monthBasis");
        dataDictService.getDataDictService("yearBasis","yearBasis");
        dataDictService.getDataDictService("schedMode","schedMode");
        dataDictService.getDataDictService("cycleFreq","cycleFreq");
        dataDictService.getDataDictService("subSchedMode","subSchedMode");
        dataDictService.getDataDictService("type","type");
        form.render();

        form.on('select(select1)', function(data){
            $http.get(baseUrl+'getSceneBySceneId?sceneId='+data.value).then(function successCallback(response) {
                if(response.data.code === 0){
                    form.val('test1', response.data.data.body);
                    form.val('testSys', response.data.data.sysHead);
                    table.reload('test', {
                        data: response.data.data.body.scheduleArray
                    });
                }else{
                    layer.msg(response.data.msg, {icon: 5});
                }

            }, function errorCallback(response) {
                console.log(response);
            });
        });
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
                        form.render('select');
                        let tableData = table.getData('test');
                        tableData.push(data.field);
                        table.reload('test', {
                            data: tableData
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
            const data = obj.data;
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
            const body = info.field;
            body["scheduleArray"] = table.getData("test");
            $http.post(baseUrl+"loan",{
                apiCd: $('#ipOwner').val()+":"+$('#port').val()+"/cl/inq/trial/schedule",
                data: {'body':body,'sysHead':{
                    'sourceType': $('#sourceType').val(),
                    'branchId': $('#branchId').val()
                    }}
            }).then(function successCallback(response) {
                if(response.data.code === 0){
                    dataService.setData(response.data.data);
                    $location.url("/loan/result");
                }else{
                    layer.msg(response.data.msg, {icon: 5});
                }

            }, function errorCallback(response) {
                console.log(response);
            });
        });
    });
});