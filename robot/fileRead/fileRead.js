app.controller('fileReadController', function ($scope, $http, dataService, dataDictService, dialogService) {
    const baseUrl = dataService.getUrlData();
    layui.use(['layer', 'form', 'table', 'upload'], function () {
        const table = layui.table,
            layer = layui.layer,
            upload = layui.upload,
            element = layui.element,
            $ = layui.jquery;
        dataDictService.getDataDictService("separator","separator");
        let cols = [];
        //创建一个上传组件
        upload.render({
            elem: '#uploadHead'
            , url: baseUrl + 'upload/uploadFileHead'
            , done: function (res) { //上传后的回调
                console.log(res);
                if (res.code !== 0) {
                    layer.msg(res.msg)
                } else {
                    cols = [{type: 'checkbox', fixed: 'left'}
                        , {field: 'id', title: 'ID', width: 250, fixed: 'left', unresize: true, sort: true}
                    ];
                    $.each(res.data, function (index, value) {
                        cols.push({field: value.field, title: value.title, width: 100, edit: "text"});
                    });
                    table.render({
                        elem: '#test'
                        , toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
                        , title: '文件内容列表'
                        , cols: [
                            cols
                        ]
                        , data: []
                        , page: true
                    });
                }
            }
            , accept: 'file' //允许上传的文件类型
        })
        let count = 0;
        //创建一个上传组件
        upload.render({
            elem: '#uploadBody'
            , url: baseUrl + 'upload/uploadFileBody'
            ,data : {username: function(){
                    return $scope.user.username;
                }}
            , choose: function (obj) {
                count = 0;
                obj.preview(function (index, file, result) {
                    count++;
                });
                dialogService.delHttpService('deleteFileBody?username='+$scope.user.username, $scope.user.username);
            }
            , progress: function (n, elem, res, index) {
                var percent = n / count + '%' //获取进度百分比
                element.progress('demo', percent); //可配合 layui 进度条元素使用
                count--;
            }
            , done: function (res) { //上传后的回调
                if (res.code !== 0) {
                    layer.msg(res.msg)
                }
            }
            , allDone: function (res) {
                if ($('#separator').val() == null || $('#separator').val() === "" || $('#separator').val() === undefined) {
                    layer.msg("分隔符不能为空");
                } else {
                    table.reload('test', {
                        url: baseUrl + 'getFileBody?separator=' + $('#separator').val(),
                        method: 'post',
                        contentType: 'application/json',
                        where: {
                            data: cols
                        },

                        page: {
                            curr: 1 //重新从第 1 页开始
                        }
                    }); //只重载数据
                }
            }
            , accept: 'file' //允许上传的文件类型
            , multiple: true
        });
        table.on('edit(test)', function (obj) { //注：edit是固定事件名，test是table原始容器的属性 lay-filter="对应的值"
            const data = {
                'id': obj.data['id'],
                'field': obj.field,
                'value': obj.value,
                'heads': cols
            };
            if ($('#separator').val() == null || $('#separator').val() === "" || $('#separator').val() === undefined) {
                layer.msg("分隔符不能为空");
            } else {
                $http.post(baseUrl+'updateFileBody?separator=' + $('#separator').val(), data).then(function successCallback(response) {
                    if(response.data.code === 0){
                        table.reload('test', {
                            url: baseUrl + 'getFileBodyByCondition?separator=' + $('#separator').val(),
                            method: 'post',
                            contentType: 'application/json',
                            where: {
                                data: {
                                    heads: cols,
                                    queryName: $scope.queryName,
                                    queryValue: $scope.queryValue
                                }
                            }
                        }); //只重载数据
                    }else{
                        layer.msg(response.data.msg, {icon: 5});
                    }

                }, function errorCallback(response) {
                    console.log(response);
                });
            }

        });
        //触发事件
        table.on('toolbar(test)', function (obj) {
            const checkStatus = table.checkStatus(obj.config.id)
                , data = checkStatus.data; //获取选中的数据
            switch (obj.event) {
                case 'add':
                    if ($('#separator').val() == null || $('#separator').val() === "" || $('#separator').val() === undefined) {
                        layer.msg("分隔符不能为空");
                    } else {
                        $http.post(baseUrl+'addFileBody?separator=' + $('#separator').val(), cols).then(function successCallback(response) {
                            if(response.data.code === 0){
                                table.reload('test', {
                                    url: baseUrl + 'getFileBody?separator=' + $('#separator').val(),
                                    method: 'post',
                                    contentType: 'application/json',
                                    where: {
                                        data: cols
                                    }
                                }); //只重载数据
                            }else{
                                layer.msg(response.data.msg, {icon: 5});
                            }

                        }, function errorCallback(response) {
                            console.log(response);
                        });
                    }
                    break;
                case 'delete':
                    if (data.length === 0) {
                        layer.msg('请选择一行');
                    } else {
                        $http.post(baseUrl+'deleteFileBody', data).then(function successCallback(response) {
                            if(response.data.code === 0){
                                table.reload('test', {
                                    url: baseUrl + 'getFileBody?separator=' + $('#separator').val(),
                                    method: 'post',
                                    contentType: 'application/json',
                                    where: {
                                        data: cols
                                    },

                                    page: {
                                        curr: 1 //重新从第 1 页开始
                                    }
                                }); //只重载数据
                            }else{
                                layer.msg(response.data.msg, {icon: 5});
                            }

                        }, function errorCallback(response) {
                            console.log(response);
                        });
                    }

                    break;
                case 'update':
                    break;
            }
        });
        $scope.search = function () {
            table.reload('test', {
                url: baseUrl + 'getFileBodyByCondition?separator=' + $('#separator').val(),
                method: 'post',
                contentType: 'application/json',
                where: {
                    data: {
                        heads: cols,
                        queryName: $scope.queryName,
                        queryValue: $scope.queryValue
                    }
                },
                page: {
                    curr: 1 //重新从第 1 页开始
                }
            }); //只重载数据

        }
        $scope.update = function () {
            const data = {
                heads: cols,
                queryName: $scope.queryName,
                queryValue: $scope.queryValue,
                updateName: $scope.updateName,
                updateValue: $scope.updateValue
            };
            $http.post(baseUrl+'updateBatchFileBody?separator=' + $('#separator').val(), data).then(function successCallback(response) {
                if(response.data.code === 0){
                    layer.msg('更新成功');
                    $scope.updateName = '';
                    $scope.updateValue = '';
                    $scope.search();
                }else{
                    layer.msg(response.data.msg, {icon: 5});
                }

            }, function errorCallback(response) {
                console.log(response);
            });

        }
        $scope.downloadFile = function () {
            $http.get(baseUrl+"fileDownload", {responseType: 'blob'}).then(function successCallback(response) {
                console.log(response.headers("Content-Length"));
                const fileName = response.headers("Content-Disposition").split(";")[1].split("filename=")[1];
                const blob = response.data;
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onload = function (e) {
                    // 创建一个a标签用于下载
                    var a = document.createElement('a');
                    a.download = fileName;
                    a.href = e.target.result;
                    $("body").append(a);
                    a.click();
                    $(a).remove();
                }
            }, function errorCallback(response) {
                console.log(response);
                layer.msg("未知错误");
            });
        }
    });
});