/**
 * Created by zy on 2017/11/9.
 */
$(function(){
    var menu = [{
        name: '添加节点'
        },
        {
            name: '全选节点',
        },
        {
        name: '全选关系',
    },{
            name: '粘贴',
            disable:true
        }];
    /*//禁用全局鼠标右键点击事件
    $(document).contextmenu(function(){
        return false;
    });
    $(".graph-canvas").mousedown(function(e) {
        console.log(e.which);
        //右键为3
        if (3 == e.which) {
            $(this).contextMenu(menu);
        } else if (1 == e.which) {
            //左键为1
        }
    })*/
    $('.graph-event').contextMenu(menu,{triggerOn:'contextmenu'});
})