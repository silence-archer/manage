# manage
后台管理系统-前端界面
## ng-repeat实现未知层数嵌套
`<ul>`  
    `<li ng-repeat="item in items" ng-include="'item.html'"></li>`  
`</ul>`

`<script type="text/ng-template" id="item.html">`  
    `{{item.title}}`  
    `<ul>`  
        `<li ng-repeat="item in item.sub" ng-include="'item.html'"></li>`  
    `</ul>`  
`</script>`
