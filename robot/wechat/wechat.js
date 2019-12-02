app.controller('wechatController',function ($scope, $http, $route,myUrl) {
    var baseUrl = myUrl.replace("http","ws");
    layui.use('layim', function(layim){
        console.log($scope.user);
        var socket = new WebSocket(baseUrl+"websocket/"+$scope.user.username);
        //监听LayIM初始化就绪
        layim.on('ready', function(options){
            console.log(options);
            socket.onopen = function(){
                console.log('连接成功');
            }
        });
        //基础配置
        layim.config({

            init: {
                url: myUrl+'getInitData/'+$scope.user.username //接口地址（返回的数据格式见下文）
                ,type: 'get' //默认get，一般可不填
                ,data: {} //额外参数
            } //获取主面板列表信息，下文会做进一步介绍

            //获取群员接口（返回的数据格式见下文）
            ,members: {
                url: myUrl+'getMembers/'+$scope.user.username //接口地址（返回的数据格式见下文）
                ,type: 'get' //默认get，一般可不填
                ,data: {} //额外参数
            }

            //上传图片接口（返回的数据格式见下文），若不开启图片上传，剔除该项即可
            ,uploadImage: {
                url: myUrl+'uploadImage' //接口地址
                ,type: 'post' //默认post
            }

            //上传文件接口（返回的数据格式见下文），若不开启文件上传，剔除该项即可
            ,uploadFile: {
                url: myUrl+'uploadFile' //接口地址
                ,type: 'post' //默认post
            }
            //扩展工具栏，下文会做进一步介绍（如果无需扩展，剔除该项即可）
            ,tool: [{
                alias: 'code' //工具别名
                ,title: '代码' //工具名称
                ,icon: '&#xe64e;' //工具图标，参考图标文档
            }]
            ,find: 'find.html' //发现页面地址，若不开启，剔除该项即可

        });
        //监听在线状态切换
        layim.on('online', function(status){
            console.log(status); //获得online或者hide

            //此时，你就可以通过Ajax将这个状态值记录到数据库中了。
            //服务端接口需自写。
        });
        //监听修改签名
        layim.on('sign', function(value){
            console.log(value); //获得新的签名

            //此时，你就可以通过Ajax将新的签名同步到数据库中了。
        });
        //监听更换背景皮肤
        layim.on('setSkin', function(filename, src){
            console.log(filename); //获得文件名，如：1.jpg
            console.log(src); //获得背景路径，如：http://res.layui.com/layui/src/css/modules/layim/skin/1.jpg
        });
        //监听发送的消息
        layim.on('sendMessage', function(res){
            var mine = res.mine; //包含我发送的消息及我的信息
            var to = res.to; //对方的信息
            //监听到上述消息后，就可以轻松地发送socket了，如：
            socket.send(JSON.stringify({
                type: 'chatMessage' //随便定义，用于在服务端区分消息类型
                ,data: res
            }));
        });

        //监听自定义工具栏点击，以添加代码为例
        layim.on('tool(code)', function(insert, send, obj){ //事件中的tool为固定字符，而code则为过滤器，对应的是工具别名（alias）
            layer.prompt({
                title: '插入代码'
                ,formType: 2
                ,shade: 0
            }, function(text, index){
                layer.close(index);
                insert('[pre class=layui-code]' + text + '[/pre]'); //将内容插入到编辑器，主要由insert完成
                //send(); //自动发送
            });
            console.log(this); //获取当前工具的DOM对象
            console.log(obj); //获得当前会话窗口的DOM对象、基础信息
        });

        //监听收到的聊天消息，假设你服务端emit的事件名为：chatMessage
        socket.onmessage = function(res){
            res = JSON.parse(res.data);
            if(res.type === 'chatMessage'){
                layim.getMessage(res.data); //res.data即你发送消息传递的数据（阅读：监听发送的消息）
            }
        };
        //关闭事件
        socket.onclose = function() {
            console.log("Socket已关闭");
        };
        //发生了错误事件
        socket.onerror = function() {
            layer.msg("Socket发生错误")
            //此时可以尝试刷新页面
        };
    });
});