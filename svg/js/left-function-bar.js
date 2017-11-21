/**
 * Created by JPX on 2017/11/9.
 */
$('#showLeftBar').click(function(){
    if($('#leftBarContent').hasClass("closeToOpen")) {
        $('#leftBarContent').removeClass("closeToOpen").addClass("openToClose").css("left","-282px");
        $(this).text("展开");
    } else {
        if($('.left-bar-subItem.active').length == 0) {
            $('.left-tab-content-item').find('.left-tab-content-subItem').removeClass('active').eq(1).addClass('active')
            $('.left-bar-subItem').eq(1).addClass('active')
        }
        $('#leftBarContent').removeClass("openToClose").addClass("closeToOpen").css("left","40px");
        $(this).text("收起");
    }
});

$('.left-bar').on('click', '.left-bar-subItem:not(:first-child)', function(){
    var $this = $(this);

    if($this.hasClass('active') && $('#leftBarContent').css("left") == "40px"){
        $('#leftBarContent').removeClass("closeToOpen").addClass("openToClose").css("left","-282px");
        $this.removeClass('active');
        $('#showLeftBar').text("展开");
    }else{
        $('#leftBarContent').removeClass("openToClose").addClass("closeToOpen").css("left","40px");
        $('#showLeftBar').text("收起");
        var index = $this.index();

        $this.siblings().removeClass('active');
        $this.addClass('active');

        $('.left-tab-content-item').find('.left-tab-content-subItem').removeClass('active').eq(index).addClass('active')
    }
});

//点击新增文件夹按钮
$('#leftBarContent').on('click','.left-tab-content-subItem.active li i.fa-plus',function () {
    newFolder()
})

var leftBar = new Object();
//文件目录右键
leftBar.leftContextMenu = function () {
    // $('.new_folder').contextMenu('destroy');
    var new_folder_menu = [{
        name: '新建分析',
        title: '点击新建分析',
        fun: function (data, event) {
            leftBar.newFile(data.trigger)
        }
    }, {
        name: '删除目录',
        title: '点击删除该目录',
        fun: function(data, event) {
            var $this = data.trigger;

            $this.parent().remove();
        }
    }, {
        name: '命名目录重',
        title: '点击重命名该目录',
        fun: function(data, event) {
            if($('.folder-rename').length !=0) {
                layer.msg('请先修改当前目录名称！');
                $('.folder-rename').focus().select();
                return;
            }
            var oldName = data.trigger.text().trim();
            var html = data.trigger.html();
            var input_html = '<input class="input rename-input folder-rename" type="text" value="' + oldName + '">'
            data.trigger.html(input_html);
            $('.folder-rename').focus().select();
            $('.folder-rename').keypress(function(e) {
                // 回车键事件
                if(e.which == 13) {
                    var newName = $('.folder-rename').val();
                    var new_html = '<i class="fa fa-clipboard list-header-icon"></i>' + newName + '<i class="fa fa-angle-double-up list-header-show"></i>'
                    data.trigger.html(new_html)
                }
            });
            $('.folder-rename').blur(function () {
                var new_html = '<i class="fa fa-clipboard list-header-icon"></i>' + oldName + '<i class="fa fa-angle-double-up list-header-show"></i>'
                data.trigger.html(new_html)
            });
        }
    }, {
        name: '新建目录',
        title: '点击新建目录',
        fun: function () {
            leftBar.newFolder()
        }
    }]
    $('.new_folder').contextMenu(new_folder_menu,{triggerOn:'contextmenu'});
}
leftBar.leftContextMenu();

leftBar.newFile = function (target) {
    console.log(target)
    var file = $('.new-file').html()
    var new_file = layer.open({
        title: '新建文件',
        type: 1,
        closeBtn: 1, //不显示关闭按钮
        shadeClose: false, //开启遮罩关闭
        fixed: true,//固定弹出框
        content: file,
        area: ['600px','250px'],
        resize : false,
        success:function () {
            var file_name = $('.layui-layer-content input.file-name').val('新建文件');
            $('.new-file-modal').on('click', 'button.cancel' ,function () {
                layer.close(new_file);
            })
            $('.new-file-modal').on('click', 'button.submit' ,function () {
                var file_name = $('.layui-layer-content input.file-name').val();
                var file_html = '<li class="list-second-link"> <span class="list-second-header">' + file_name + '</span> </li>'
                target.next('ul[data-operate="slideContent"]').prepend(file_html)
                layer.close(new_file)
                leftBar.leftContextFile();
            })
        }
    })
}

leftBar.newFolder = function () {
    var folder = $('.new-folder').html()
    var new_folder = layer.open({
        title: '新建文件夹',
        type: 1,
        closeBtn: 1, //不显示关闭按钮
        shadeClose: false, //开启遮罩关闭
        fixed: true,//固定弹出框
        content: folder,
        area: ['600px','250px'],
        resize : false,
        success:function () {
            $('.layui-layer-content input.folder-name').val('新建文件夹');
            $('.new-folder-modal').on('click', 'button.cancel' ,function () {
                layer.close(new_folder);
                $('.layui-layer-content input.folder-name').val('');
            })
            $('.new-folder-modal').on('click', 'button.submit' ,function () {
                var folder_name = $('.layui-layer-content input.folder-name').val();
                var folder_html = '<li><span data-operate="slideLi" class="list-header new_folder"><i class="fa fa-clipboard list-header-icon" ></i>' + folder_name +
                    '<i class="fa fa-angle-double-up list-header-show"></i> </span><ul data-operate="slideContent" class="list-second-block"></ul></li>'
                $('#leftBarContent').find('.left-tab-content-subItem.active').find('.list-block  ul[data-operate="slide"]').prepend(folder_html)
                layer.close(new_folder)
                leftBar.leftContextMenu();
            })
        }
    })
}


//分析文件右键
leftBar.leftContextFile = function () {
    // $('.new_folder').contextMenu('destroy');
    var new_file_menu = [{
        name: '删除分析',
        title: '点击删除分析文件',
        fun: function(data, event) {
            var $this = data.trigger;

            if($this.siblings().length < 1){
                $this.parent().remove();
            }
            $this.remove();
        }
    }, {
        name: '重命名分析',
        title: '点击重命名分析文件',
        fun: function(data, event) {
            if($('.file-rename').length !==0) {
                layer.msg('请先修改当前分析文件名称！');
                $('.folder-rename').focus().select();
                return;
            }
            var oldName = data.trigger.text().trim();
            var input_html = '<input class="input rename-input file-rename" type="text" value="' + oldName + '">'
            data.trigger.html(input_html);
            $('.file-rename').focus().select();
            $('.file-rename').keypress(function(e) {
                // 回车键事件
                if(e.which == 13) {
                    var newName = $('.rename-input').val();
                    data.trigger.text(newName)
                }
            });
            $('.file-rename').blur(function () {
                data.trigger.text(oldName)
            });
        }
    }]
    $('.new_folder').siblings('ul').find('.list-second-header').contextMenu(new_file_menu,{triggerOn:'contextmenu'});
}
leftBar.leftContextFile()


//协同共享子目录右键 只能删除“我分享的文件”目录下的文件
leftBar.leftShareMenu = function () {
    var new_share = [{
        name: '删除目录',
        title: '点击删除协同共享目录',
        fun: function(data, event) {
            var $this = data.trigger;

            if($this.siblings().length < 1){
                $this.parent().remove();
            }
            $this.remove();
        }
    }]
    $('.share li').contextMenu(new_share,{triggerOn:'contextmenu'});
}
leftBar.leftShareMenu();


//下载模版目录右键 上传数据模版子目录只能下载
leftBar.leftDownloadMenu = function () {
    var new_share = [{
        name: '下载模版',
        title: '点击下载模版',
        fun: function(data, event) {

        }
    }]
    $('.download li').contextMenu(new_share,{triggerOn:'contextmenu'});
}
leftBar.leftDownloadMenu();


//下载模版目录右键 以上传数据子目录能下载和删除
leftBar.leftDownloadDeleteMenu = function () {
    var new_share = [{
        name: '下载数据',
        title: '点击下载数据',
        fun: function(data, event) {

        }
    },{
        name: '删除数据',
        title: '点击删除该条数据',
        fun: function(data, event) {
            var $this = data.trigger;

            if ($this.siblings().length < 1) {
                $this.parent().remove();
            }
            $this.remove();
        }
    }];
    $('.download-delete li').contextMenu(new_share,{triggerOn:'contextmenu'});
}
leftBar.leftDownloadDeleteMenu();


