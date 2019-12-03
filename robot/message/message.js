app.controller('messageController',function ($scope, $http, $route) {
    layui.use(['form','layedit','element'], function(){
        var $ = layui.jquery
            ,element = layui.element, //Tab的切换功能，切换事件监听等，需要依赖element模块
            form = layui.form;

        $('.site-demo-active').on('click', function(){
            var othis = $(this), type = othis.data('type');
            active[type] ? active[type].call(this, othis) : '';
        });


    });
});