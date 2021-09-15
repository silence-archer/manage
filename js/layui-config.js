layui.$.ajaxSetup({
    beforeSend: function(xhr) {
        xhr.setRequestHeader('token', layui.sessionData('token').token)

    },

    success:function(result,status,xhr){
        let token = xhr.getResponseHeader('token');
        if (token !== undefined && token !== null && token !== '') {
            layui.sessionData('token', {
                key: 'token',
                value: token
            });
        }

    },

    error:function(xhr,status,error){
    },

    complete:function(xhr,status){

    }

});