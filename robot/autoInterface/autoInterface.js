app.controller('autoInterfaceController', function ($scope, $http, $location, dataService, dialogService) {
    layui.use(['layer', 'form', 'table'], function () {
        const form = layui.form;
        form.on('submit(formAutoInterface)', function (info) {
            dialogService.postHttpService('autoInterface', info.field, '生成完毕，请更新该角色权限');
        });
    });
});