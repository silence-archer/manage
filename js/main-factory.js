app.factory('authInterceptor', function(){
    return {
        request: function(config){
            config.headers.token = layui.sessionData('token').token;
            return config;
        },
        requestError: function(config){
            return config;
        },
        responseError: function(response){
            return response;
        },
        response : function(response) {
            let token = response.headers('token');
            
            if (token === undefined || token === null || token === '') {
                return response;
            }
            layui.sessionData('token', {
                key: 'token',
                value: response.config.headers.token
            });
            return response ;
        },
    };
})