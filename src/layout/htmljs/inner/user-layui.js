layui.use('dropdown', function(){
    var dropdown = layui.dropdown
    dropdown.render({
        elem: '#app_type' //可绑定在任意元素中，此处以上述按钮为例
        ,data: [{
            title: 'menu item 1'
            ,id: 100
            ,href: '#'
        },{
            title: 'menu item 2'
            ,id: 101
            ,href: 'https://www.layui.com/' //开启超链接
            ,target: '_blank' //新窗口方式打开
        }]
        ,id: 'app_type'
        //菜单被点击的事件
        ,click: function(obj){
            console.log(obj);
            layer.msg('回调返回的参数已显示再控制台');
        }
    });
});