layui.use(['layer', 'form','table','layim'], function(){
    var baseUrl = null;

    var table = layui.table,
        layim = layui.layim,
        layer = layui.layer,
        $=layui.jquery;
    $.getJSON("../../../config.json", function (data){
        console.log(data);
        baseUrl = data.baseUrl;
        table.render({
            elem: '#test'
            ,url: baseUrl+'getUserInfo'
            ,title: '用户数据表'
            ,cols: [[
                {field:'username', title:'用户名', width:100}
                ,{field:'nickname', title:'昵称', width:150}
                ,{field:'sign', title:'签名', width:300}
                ,{field:'avatar', title:'头像地址', width:300}
                ,{fixed: 'right', title:'操作', toolbar: '#barDemo', width:200}
            ]]
            ,page: true
        });
    });



    //监听行工具事件
    table.on('tool(test)', function(obj){
        var data = obj.data;
        console.log(obj);
        if(obj.event === 'add'){
            layim.add({
                type: 'friend' //friend：申请加好友、group：申请加群
                ,username: data.nickname //好友昵称，若申请加群，参数为：groupname
                ,avatar: '../../../'+data.avatar //头像
                ,submit: function(group, remark, index){ //一般在此执行Ajax和WS，以通知对方
                    console.log(group); //获取选择的好友分组ID，若为添加群，则不返回值
                    console.log(remark); //获取附加信息
                    layer.close(index); //关闭改面板
                }
            });
        }
    });





});