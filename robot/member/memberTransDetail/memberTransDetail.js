app.controller('memberTransDetailController',function ($scope, $http, dataService,dialogService) {
    var baseUrl = dataService.getUrlData();
    layui.use(['layer', 'form','table'], function(){
        var table = layui.table,
            form = layui.form,
            layer = layui.layer,
            $=layui.jquery;

        form.render('select');

        table.render({
            elem: '#test'
            ,url: baseUrl+'getMemberTransDetail'
            // ,crossDomain: true
            // ,xhrFields: { withCredentials: true }
            ,toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
            ,title: '交易明细列表'
            ,cols: [[
                {type: 'checkbox', fixed: 'left'}
                ,{field:'memberName', title:'会员名称', width:100, fixed: 'left', unresize: true, sort: true}
                ,{field:'memberDesc', title:'会员姓名', width:200}
                ,{field:'memberPhone', title:'会员电话', width:200}
                ,{
                    field: 'transType', title: '交易类型', width: 100, templet: function (d) {
                        if (d.transType === 'input') {
                            return '充值';
                        }
                        if (d.transType === 'output') {
                            return '消费';
                        }
                    }
                }
                ,{field:'transAmount', title:'交易金额', width:100}
                ,{field:'remark', title:'备注', width:100}
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
                    url: baseUrl+'getMemberTransDetailByCondition',
                    where: {
                        memberDesc : $scope.queryMemberDesc,
                        memberPhone : $scope.queryMemberPhone,
                    },
                    page: {
                        curr: 1 //重新从第 1 页开始
                    }
                });


        }





    });
});