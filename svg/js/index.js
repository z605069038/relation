/**
 * Created by zy on 2017/11/6.
 */
var Index = new Object();
var staticGraph = '';
var dynamicGraph = '';
var dragging = null;
$(function(){
    //设置body高度
    $('body').height(window.innerHeight);
    $('.bodyContainer').height(window.innerHeight-46);
    $('body').removeClass();

    Index.regEvent();
    $('.default-dialog-add-button').click();
    Index.toolClick();
    Index.indexEntrance();
});

Index.regEvent = function(){
    $('#userMenu').click(function(){
        $(this).siblings('.header-menu').slideToggle();
    })

    $('#settingMenu').click(function(){
        $(this).siblings('.header-menu').slideToggle();
    })

    //新建分析大按钮
    $('body').on('click','.default-dialog-add-button',function(){
        $('.default-dialog-workspace').addClass('none');
        $('.mainBody').removeClass('none');
        /*$('.workspace').width(window.innerWidth-80);*/
        /*$('.workspace').width(window.innerWidth-80);*/
        $('.graph-container .graph-canvas').attr('width','100%');
        $('.graph-container .graph-canvas').attr('height',$('.workspace').height()-76);
        $('.graph-container .graph-canvas rect').attr('width','100%');
        $('.graph-container .graph-canvas rect').attr('height',$('.workspace').height()-76);
        $('.new-workspace-tab img').click();
    });

    //新建分析小按钮
    $('body').on('click','.new-workspace-tab img',function(){
        var width = getLiWidth();
        if(width == 0) return;
        var time = new Date().getTime();
        $(this).parents('ul').find('li').removeClass('workspace-tab-clicked')
            .eq(0).before('<li style="width: '+width+'px" class="workspace-tab workspace-tab-clicked">' +
            '<span style="width: '+width+'px" class="workapce-tab-label" title="*临时分析_'+time+'">*临时分析_'+time+'</span><span class="icon-i">×</span></li>')
    });

    //分析文件切换
    $('body').on('click','.workspace-tab',function(){
        var $this =$(this);
        if(!$this.hasClass('workspace-tab-clicked')){
            $this.addClass('workspace-tab-clicked').siblings().removeClass('workspace-tab-clicked');
        }
    });

    //删除分析文件
    $('body').on('click','.workspace-tab .icon-i',function(){
        var $this =$(this);
        $this.parents('li').remove();
        getLiWidth();
        if($('.workspace-tab').length>0){
            var $li = $('.workspace-tab').eq(0);
            if(!$li.hasClass('workspace-tab-clicked'))
                $li.addClass('workspace-tab-clicked');
        }else{
            $('.default-dialog-workspace').removeClass('none');
            $('.mainBody').addClass('none');
        }
    });

    //分析文件功能栏
    $('body').on('click','.toolbar-btn-container-select img',function(){
        if(!$(this).parent().hasClass('enabled')){
            if(!$(this).hasClass('dingpath')){
                $(this).parent().addClass('enabled').siblings().removeClass('enabled');
            }
            var width = $('.graph-canvas').attr('width');
            var height = $('.graph-canvas').attr('height');
            if($(this).hasClass('addnode')){
                $('.graph-container').append('<svg class="cursor-addnode" width="'+width+'" height="'+height+'" style="position: absolute;left:0;top:0;"></svg>')
                $('.graph-container .cursor-dragstart').remove();
            }else if($(this).hasClass('movecanvas')){
                $('.graph-container').append('<svg class="cursor-dragstart" width="'+width+'" height="'+height+'" style="cursor: -webkit-grab;position: absolute;left:0;top:0;"></svg>')
                //画布拖动
                $('.cursor-dragstart').on('mousedown',function(e){
                    Drag.type=2;
                    mousedown();
                })
                $('.graph-container .cursor-addnode').remove();
            }else{
                $('.graph-container .cursor-addnode').remove();
                $('.graph-container .cursor-dragstart').remove();
            }
        }
    })

    //添加节点弹窗
    $(document).on('click',function(e){
        if($(e.target).attr('class')=='cursor-addnode'){
            $('.modal-addNode').show();
        }
    });

    //确定添加节点
    $('body').on('click','.btn-addNode',function(){
        $(this).parents('.modal').hide();
        $('.toolbar-btn-container-select .selectnode').click();
        $.getJSON('api/data.json',function(info){
            staticGraph = info;
            dynamicGraph = info;
        var html = '';/*'<g class="nodegroup" transform="translate(300,300) scale(1)" id="ceshi1_node">' +
            '<circle r="20" cx="20" cy="20" class="node-circle-normal"></circle>' +
            '<g><image xlink:href="images/u266.png" width="25" height="25" x="7.6" y="7.6" pointer-events="none"></image></g>' +
            '<text class="node-circle-text-normal" x="20" y="40" pointer-events="none">' +
            '<tspan x="20" dy="14" opacity="0.9">测试1</tspan>' +
            '</text></g>';
        html += '<g class="nodegroup" transform="translate(500,260) scale(1)" id="ceshi2_node">' +
            '<circle r="20" cx="20" cy="20" class="node-circle-normal"></circle>' +
            '<g><image xlink:href="images/u266.png" width="25" height="25" x="7.6" y="7.6" pointer-events="none"></image></g>' +
            '<text class="node-circle-text-normal" x="20" y="40" pointer-events="none">' +
            '<tspan x="20" dy="14" opacity="0.9">测试1</tspan>' +
            '</text></g>';*/
        if(info.nodes.length>0){
            for(var i in info.nodes){
                var item = info.nodes[i];
                html += '<g class="nodegroup" transform="translate('+item.x+','+item.y+') scale(1)" id="'+item.id+'">' +
                    '<circle r="20" cx="20" cy="20" class="node-circle-normal"></circle>' +
                    '<g><image xlink:href="images/u266.png" width="25" height="25" x="7.6" y="7.6" pointer-events="none"></image></g>' +
                    '<text class="node-circle-text-normal" x="20" y="40" pointer-events="none">' +
                    '<tspan x="20" dy="14" opacity="0.9">测试1</tspan>' +
                    '</text></g>';
            }
        }
        if(info.links.length>0){
            for(var i in info.links){
                var item = info.links[i];
                var points = calcPoints(parseFloat(item.x)+20,parseFloat(item.y)+20,parseFloat(item.px)+20,parseFloat(item.py)+20);
                html +='<g class="edgegroup">' +
                    '<path class="link_normal" id="'+item.id+'" d="M'+points[0]+' '+points[1]+'L'+points[2]+' '+points[3]+'"></path>' +
                    '<text dy="-5" class="link_normal_text" transform="'+points[4]+'"><textPath xlink:href="#'+item.id+'" startOffset="50%" class="link_normal_text">'+item.text+'</textPath></text></g>'
            }
        }
        $('.graph-canvas .graph-main').html(html);
            Index.canvasInit();
        })
    });


    //节点锁定
    $('.dingpath').on('click',function(){
        var d = 'M145.109 873.435l334.744-265.387 133.539 142.032c0 0 55.744 15.19 59.175-26.999l-3.432-143.776 197.831-228.207 86.174-5.006c0 0 67.611-13.614 18.618-72.729l-241.763-243.395c0 0-65.868-8.439-60.861 52.369v65.926l-224.776 191.137-138.6 8.381c0 0-50.736 16.875-32.176 60.864l130.218 128.476-258.694 336.319z';
        var path = '<path d="'+d+'"class="ding-marker-select" transform="translate(25,0) scale(0.020,0.020)"></path>'
        $('.node-circle-select').parent().html($('.node-circle-select').parent().html()+path);
    });

    //全屏
    $('.graph-fullscreen img').click(function(){
        var $head = $('.header-container');
        if($head.css('display')=='flex'){
            $('.header-container').slideUp();
            $('.bodyContainer').height(window.innerHeight);
        }else{
            $('.header-container').slideDown(function(){
                $('.bodyContainer').height(window.innerHeight-46);
            });
        }
    });

    //缩小
    $('.zoomout').click(function(){
        Drag.cy = 5.3;
        var top = parseFloat($('.zoomhadle').css('top'));
        resizeFullscreen();
    });

    //放大
    $('.zoomin').click(function(){
        Drag.cy = -5.3;
        var top = parseFloat($('.zoomhadle').css('top'));
        resizeFullscreen();
    });

    //删除所选
    $('.delete').click(function(){
        var id = $('.node-circle-select').parent().attr('id');
        for(var i in staticGraph.nodes){
            var item = staticGraph.nodes[i];
            if(item.id == id){
                $('#'+item.id).remove();
                staticGraph.nodes.splice(i,1);
            }
        }
        for(var i in staticGraph.links){
            var item = staticGraph.links[i];
            if(item.target == id || item.source == id){
                $('#'+item.id).remove();
                staticGraph.links.splice(i,1);
            }
        }
    })
}


Index.toolClick = function () {

    //工具栏点击图标弹出下拉菜单
    $('.toolbar-btn-container img').click(function () {
        var that = $(this);
        if(that.next('.toolbar-slider').attr('data-status') == "open") {
            that.next('.toolbar-slider').slideUp().removeAttr('data-status');
        }else {
            $('.toolbar-slider').hide().removeAttr('data-status');
            that.next('.toolbar-slider').slideToggle().attr('data-status','open');
        }
    })


    //点击下拉菜单项 共同邻居
    $('.toolbar-slider-box[data-type^="gtlj"]').click(function () {
        $('.toolbar-slider').hide();
        $('.toolbar-slider').slideUp().removeAttr('data-status');
        var tag = $(this).attr("data-class");
        var layer_content = $('.layer-step').html();
        console.log(tag)
        var title = $(this).find('a').text()
        var gxcx = layer.open({
            title: title,
            type: 1,
            closeBtn: 1, //不显示关闭按钮
            shadeClose: false, //开启遮罩关闭
            fixed: true,//固定弹出框
            content: layer_content,
            area: ['700px','510px'],
            success:function () {
                $('.tool-modal').on('click' , 'button.cancel' , function () {
                    layer.close(gxcx)
                });
                $('.tool-modal').on('click' , 'button.next' , function () {
                    $('.first-step').addClass('none');
                    $('.second-step').removeClass('none')
                    $('.next').addClass('none')
                    $('.prev').removeClass('none')
                    $('.analysis').removeClass('none')
                });
                $('.tool-modal').on('click' , 'button.prev' , function () {
                    $('.first-step').removeClass('none');
                    $('.second-step').addClass('none')
                    $('.next').removeClass('none')
                    $('.prev').addClass('none')
                    $('.analysis').addClass('none')
                });
                getTree();
                changInput()
            }
        });
    })


    //ztree 群体分析第二步
    function getTree() {
        var setting = {
            check: {
                enable: true
            },
            data: {
                simpleData: {
                    enable: true
                }
            }
        };

        var zNodes =[
            { id:1, pId:0, name:"亲密度", open:true},
            { id:11, pId:1, name:"亲密度1"},
            { id:111, pId:11, name:"亲密度1-1"},
            { id:112, pId:11, name:"亲密度2"},
            { id:12, pId:1, name:"亲密度1-2"},
            { id:121, pId:12, name:"亲密度2-1"},
            { id:122, pId:12, name:"亲密度2-2"},
            { id:2, pId:0, name:"人人关系 2", open:true},
            { id:21, pId:2, name:"人人关系 2-1"},
            { id:22, pId:2, name:"人人关系 2-2"},
            { id:221, pId:22, name:"人人关系 2-2-1"},
            { id:222, pId:22, name:"人人关系 2-2-2"},
            { id:23, pId:2, name:"人人关系 2-3"}
        ];

        var code;

        function setCheck() {
            var zTree = $.fn.zTree.getZTreeObj("gxTree"),
                py = $("#py").attr("checked")? "p":"",
                sy = $("#sy").attr("checked")? "s":"",
                pn = $("#pn").attr("checked")? "p":"",
                sn = $("#sn").attr("checked")? "s":"",
                type = { "Y":py + sy, "N":pn + sn};
            zTree.setting.check.chkboxType = type;
            showCode('setting.check.chkboxType = { "Y" : "' + type.Y + '", "N" : "' + type.N + '" };');
        }
        function showCode(str) {
            if (!code) code = $("#code");
            code.empty();
            code.append("<li>"+str+"</li>");
        }


        $.fn.zTree.init($("div[id^='layui-layer'] #gxTree"), setting, zNodes);
        setCheck();
        $("div[id^='layui-layer'] #py").bind("change", setCheck);
        $("div[id^='layui-layer'] #sy").bind("change", setCheck);
        $("div[id^='layui-layer'] #pn").bind("change", setCheck);
        $("div[id^='layui-layer'] #sn").bind("change", setCheck);
    }


    //群体分析（共同邻居）select选择切换input
    function changInput() {
        $('.obj-select-box .select select').click(function () {
            var $this = $(this);
            if($this.find('option:selected').attr('data-id') == 3) {
                $this.closest('.obj-select-box').find('.field-body span').addClass('none');
                $this.closest('.obj-select-box').find('.field-body span').eq(-1).removeClass('none');
            }else {
                $this.closest('.obj-select-box').find('.field-body span').removeClass('none');
                $this.closest('.obj-select-box').find('.field-body span').eq(-1).addClass('none');
            }
        })
    }


    //单步骤弹框
    $('.toolbar-slider-box[data-type^="xyfx"]').click(function () {
        $('.toolbar-slider').hide();
        $('.toolbar-slider').slideUp().removeAttr('data-status');
        var tag = $(this).attr("data-class");
        var layer_content = $('.layer-alone').html();
        console.log(tag)
        var title = $(this).find('a').text()
        var xxfx = layer.open({
            title: title,
            type: 1,
            closeBtn: 1, //不显示关闭按钮
            shadeClose: false, //开启遮罩关闭
            fixed: true,//固定弹出框
            content: layer_content,
            area: ['700px','250px'],
            success:function () {
                $('.tool-modal').on('click' , 'button.cancel' , function () {
                    layer.close(xxfx)
                });
                $('.tool-modal').on('click' , 'button.submit' , function () {

                });
            }
        });
    })


    //点击下拉菜单项 保存分析
    $('.toolbar-btn-container img.save').click(function () {
        var layer_content = $('.layer-save').html();
        var title = $(this).attr('alt');
        var save = layer.open({
            title: title,
            type: 1,
            closeBtn: 1, //不显示关闭按钮
            shadeClose: false, //开启遮罩关闭
            fixed: true,//固定弹出框
            content: layer_content,
            area: ['700px','320px'],
            success:function () {

                //获取文件目录下的文件夹名并放入文件夹选择select中
                var folder_list = $('.left-tab-content-subItem').eq(1).find('.list-block li:not(".list-second-link")')
                var folder_length = folder_list.length;
                var folder_name  = new Array();
                var select_folder = $('.save-location');
                for(var i = 0 ; i < folder_length ; i++ ) {
                    folder_name.push(folder_list.eq(i).find('.list-header').text().trim());
                    var html = '<option data-id="' + i + '">' + folder_list.eq(i).find('.list-header').text().trim() + '</option>'
                    select_folder.append(html)
                }
                console.log(folder_name)

                $('.new-folder-icon').click(function () {
                    $('.save-new-folder').removeClass('none');
                    $('.save-folder-name').addClass('none')
                })

                $('.close-new-folder-icon').click(function () {
                    $('.save-new-folder').addClass('none');
                    $('.save-folder-name').removeClass('none')
                })

                $('.tool-modal').on('click' , 'button.cancel' , function () {
                    layer.close(save)
                    select_folder.html('')
                });
                $('.tool-modal').on('click' , 'button.submit' , function () {

                });
            }
        });
    })

}


Index.indexEntrance = function () {
    //分析入口tab切换
    $('.entrance-left-tab').on('click','.entrance-left-bar-subItem',function () {
        var $this = $(this);

        if($this.hasClass('active')){
            return false;
        }else{
            var index = $this.index();

            $this.siblings().removeClass('active');
            $this.addClass('active');

            $('.entrance-right-content-item').find('.entrance-right-content-subItem').addClass('none').eq(index).removeClass('none')
        }
    })
    
    
    //关闭分析入口窗口
    $('.close-entrance-btn').click(function () {
        $('.main-entrance-box').fadeOut(200);
    })

    
    //我的反馈/所有反馈切换tab
    $('.feed-source').on('click','li',function () {
        var $this = $(this);

        if($this.hasClass('active')){
            return false;
        }else{
            var index = $this.index();

            $this.siblings().removeClass('active');
            $this.addClass('active');

            $('.feed-source-content').find('.feed-source-item-list').addClass('none').removeClass('active').eq(index).removeClass('none').addClass('active')
        }
    })
    
    
    //点击回复和取消显隐input
    $('.feed-feed').click(function () {
        var $this = $(this);

        $this.closest('.feed-source-item').find('.feed-footer').removeClass('none').fadeIn(300)
    })


    $('.feed-footer').on('click','button.cancel',function () {
        $(this).closest('.feed-footer').addClass('none').fadeOut(300)
    })


    //点击删除
    $('.feed-delete').click(function () {
        var $this = $(this);

        $this.closest('.feed-source-item').remove();
    })

    $('.feed-submit').click(function () {
        var feed_username = '张涛儿';
        var feed_content = $('.feed-back-textarea').val();
        var feed_type = $('.feed-type-radio:checked').parent('.type-radio').text().trim()
        var feed_date = new Date().format("yyyy-MM-dd hh:mm:ss");
        var html = '<li class="feed-source-item"> <div class="feed-header ma-b10 clearfix"> <span class="feed-user ma-r10">' + feed_username + '</span> ' +
            '<span class="feed-time ma-r10">' + feed_date + '</span> <span class="feed-type">' + feed_type + '</span> <span class="feed-tool pull-right"> ' +
            '<span class="feed-feed ma-r5">回复</span> <span class="feed-delete ma-l5">删除</span> </span> </div> <div class="feed-body ma-b15"> ' +
            '<p class="feed-content" title="' + feed_content + '">' + feed_content + '</p> </div> <div class="feed-footer ma-b10 none"> ' +
            '<div class="field is-horizontal ma-r0"> <div class="field-body ma-r10 feed-input-box"> <input class="input feed-input is-small" type="text">' +
            ' </div> <div class="field-btn"> <button class="btn is-danger is-small pa-x15 cancel">取消</button> <button class="btn is-primary is-small pa-x15 submit">回复</button>' +
            ' </div> </div> </div> </li>';
        var html_to = $('ul.feed-source-item-list');
        html_to.prepend(html)
    })

}
//缩略图初始化
Index.canvasInit = function(){
    var canvas = $('.graph-container').find('.graph-canvas')[0];
    //svg的宽高
    var svgWidth = parseInt($('.graph-canvas').width());
    var svgHeight = parseInt($('.graph-canvas').height());
    var heightrich = 150/$('.graph-canvas').height();

    var translate = $('.graph-main').attr('transform').replace(/translate\((.*)\) scale\((.*)\)/,'$1,$2');
    var tx = parseFloat(translate.split(',')[0]);
    var ty = parseFloat(translate.split(',')[1]);
    var scale = parseFloat(translate.split(',')[2]);

    var gWight = $('.graph-main')[0].getBBox().width -tx;
    var gHeight = $('.graph-main')[0].getBBox().height -ty;
    //确定画布偏移位置
    var top = $('.graph-main')[0].getBBox().y+ty;
    top = top>0?0:top;
    var left = $('.graph-main')[0].getBBox().x+tx;
    left = left>0?0:left;

    var svgImage = getSvgImage(svgWidth,svgHeight,gWight*scale,gHeight*scale);
    try {
        svgAsPngUri(canvas, {top:top*scale,left:left*scale,width:svgImage.width,height:svgImage.height,scale:scale}, function(uri) {
            $('#controlDiv').css('background-image','url('+uri+')');
            $('#controlDiv').css('background-size','cover');
        });
    } catch(err) {
        alert(err.message);
    }

    //缩略图比例
    var canvasScale = svgImage.width/150;
    var dragboxWidth = svgWidth/canvasScale;
    var dragboxHeight = svgHeight/canvasScale;
    $('#dragbox').width(dragboxWidth);
    $('#dragbox').height(dragboxHeight);
    var tx = parseFloat($('#dragbox').attr('data-transfrom').split(',')[0]);
    var ty = parseFloat($('#dragbox').attr('data-transfrom').split(',')[1]);
    var gt = $('.graph-main').attr('transform').replace(/translate\((.*)\) scale\((.*)\)/,'$1,$2');
    var gx = parseFloat(gt.split(',')[0]);
    var gy = parseFloat(gt.split(',')[1]);
    if($('#dragbox').attr('data-init')=='false'){
        var dragTop = ty - gy/canvasScale;
        var dragLeft = tx - gx/canvasScale;
        var dragtranslate = checkDragbox(dragLeft,dragTop,dragboxWidth,dragboxHeight);
        $('#dragbox').css('transform','translate('+dragtranslate.x+'px,'+dragtranslate.y+'px)');
    }else{
        var dragTop = Math.abs(top/canvasScale) - gy/canvasScale;
        var dragLeft = Math.abs(left/canvasScale) - gx/canvasScale;
        var dragtranslate = checkDragbox(dragLeft,dragTop,dragboxWidth,dragboxHeight);
        $('#dragbox').css('transform','translate('+dragtranslate.x+'px,'+dragtranslate.y+'px)');
        $('#dragbox').attr('data-transfrom',Math.abs(left/canvasScale)+','+Math.abs(top/canvasScale));
        $('#dragbox').attr('data-init','false');
    }
    $('#dragbox').css('cursor','-webkit-grabbing');

    var hasDown = 0;
    var hasMove = 0;
    var x = 0,y=0;//初始坐标
    $('#dragbox').on('mousedown',function(e){
        hasDown = 1;
        x = event.clientX;
        y = event.clientY;
        tx = parseFloat($('#dragbox').attr('data-transfrom').split(',')[0]);
        ty = parseFloat($('#dragbox').attr('data-transfrom').split(',')[1]);
        var gt = $('.graph-main').attr('transform').replace(/translate\((.*)\) scale\((.*)\)/,'$1,$2');
        var gx = parseFloat(gt.split(',')[0]);
        var gy = parseFloat(gt.split(',')[1]);
        if(Drag.type==2){
            var martin = $('#dragbox').css('transform').split(',');
            tx = parseFloat(martin[4]);
            ty = parseFloat(martin[5]);
        }
        //当鼠标按下时绑定鼠标移动和松开事件
        $('.thumbnail-main').on('mousemove',function(e){
            if(hasDown){
                hasMove = 1;
                var cx = event.clientX + tx - x;
                var cy = event.clientY + ty - y;
                var dragtranslate = checkDragbox(cx,cy,dragboxWidth,dragboxHeight);
                $('#dragbox').css('transform','translate('+dragtranslate.x+'px,'+dragtranslate.y+'px)');
                $('#dragbox').attr('data-transfrom',dragtranslate.x+','+dragtranslate.y);
                $('.graph-main').attr('transform','translate('+(gx-(dragtranslate.x-tx)*canvasScale)+','+(gy-(dragtranslate.y-ty)*canvasScale)+') scale('+scale+')')
            }else{
                $('.thumbnail-main').off('mousemove');
            }
        });

        $('.thumbnail-main').on('mouseup',function(e){
            hasDown = 0;
            hasMove = 0;
            $('.thumbnail-main').off("mousemove",mousemove);
            $('.thumbnail-main').off("mouseup",mouseup);
        });
    });
}
