app.controller('resultController', function ($scope, $http, $location, dataService, dataDictService) {
    const data = dataService.getData();
    console.log(data);
    layui.use(['layer', 'form', 'table'], function () {
        const table = layui.table,
            form = layui.form
        let amtTypeList = [];
        dataDictService.getDataDictService("cycleFreq", "cycleFreq");
        dataDictService.getDataDictService("amtType", null, function (dataList) {
            amtTypeList = dataList;
        });
        setTimeout(function () {
                form.render();
                table.render({
                    elem: '#test'
                    , title: '还款明细列表'
                    ,toolbar: true
                    , cols: [[
                        {field: 'seqNo', title: '序号', width: 250}
                        , {field: 'priOutstanding', title: '本金余额', width: 100}
                        , {field: 'stageNo', title: '期次', width: 150}
                        , {field: 'days', title: '天数', width: 200}
                        , {
                            field: 'amtType', title: '金额类型', width: 200, templet: function (d) {
                                if (d.amtType === '' || d.amtType === null) {
                                    return d.amtType;
                                }
                                return d.amtType + '-' + amtTypeList[d.amtType];
                            }
                        }
                        , {field: 'nextDealDate', title: '下次还款日', width: 200}
                        , {field: 'schedAmt', title: '还款金额', width: 200}
                        , {field: 'startDate', title: '起始日期', width: 200}
                        , {field: 'endDate', title: '终止日期', width: 200}
                        , {field: 'paidAmt', title: '已还金额', width: 200}
                    ]],
                    data: data.receiptArray
                });
            },
            500
        );


        form.val('test1', data);
        $scope.exit = function () {
            $location.url('/loan')
        }


    });

});