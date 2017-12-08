/**
 * Created by zy on 2017/11/13.
 */
var Drag = new Object();
var dx = '';
var dy = '';
$(function(){
    //区域选择框
    $('.graph-event').on('mousedown',function(e){
        if($('.selectnode').parent().hasClass('enabled')){
            Drag.type=1;
            mousedown(e);
        }
    });

    //放大缩小工具栏
    $('.zoomhadle').on('mousedown',function(e){
        Drag.type = 3;
        mousedown(e);
    });

    //节点拖动
       document.getElementsByClassName('graph-canvas')[0].addEventListener('mousedown',function(e){
        if(e.target.className.baseVal == 'node-circle-normal'){
            Drag.type = 4;
            Drag.target = $(e.target);
            mousedown(e);
        }else if(e.target.className.baseVal == 'node-circle-select'){
            Drag.type = 5;
            mousedown(e);
        }
        $('.iw-contextMenu').hide();
    });
});

function mousedown(e){
    if(e&&e.button != 0){
        return;
    }
    Drag.hasMove=0;
    Drag.hasDown=1;
    Drag.num = 1;
    if(Drag.type==1){
        dx=event.clientX-$('.graph-canvas').offset().left;
        dy=event.clientY-$('.graph-canvas').offset().top;
    }else if(Drag.type==2){
        dx=event.clientX;
        dy=event.clientY;
        $('.cursor-dragstart').attr('class','cursor-dragmove');
    }else if(Drag.type==3){
        dy=event.clientY;
    }else if(Drag.type ==4 || Drag.type ==5){
        dx=event.clientX;
        dy=event.clientY;
    }
    $(document).on("mousemove",mousemove);
    $(document).on("mouseup",mouseup);
}
function mousemove(){
    Drag.hasMove=1;
    if(Drag.hasDown==1){
        if(Drag.type==1){
            Drag.cx=event.clientX-$('.graph-canvas').offset().left;
            Drag.cy=event.clientY-$('.graph-canvas').offset().top;
            var height = $('.graph-canvas').attr('height');
            var svg ='<svg class="graph-modcover" width="100%" height="'+height+'" style="position: absolute;left:0;top:0;display: block;"></svg>';
            var rect = '<path d="M'+dx+' '+dy+'H'+Drag.cx+'V'+Drag.cy+'M'+Drag.cx+' '+Drag.cy+'H'+dx+'V'+dy+'" style="stroke-dasharray:5,5;fill:transparent;stroke-width:1;stroke:#000;"></path>';
            if(Drag.num){
                $('.graph-container').append(svg);
                Drag.num = 0;
            }
            $('.graph-modcover').html(rect);
        }else if(Drag.type==2){
            Drag.cx = event.clientX-dx;
            Drag.cy = event.clientY-dy;
            dx = event.clientX;
            dy = event.clientY;
            var translate = $('.graph-main').attr('transform').replace(/translate\((.*)\) scale\((.*)\)/,'$1,$2');
            var tx = parseFloat(translate.split(',')[0])+parseFloat(Drag.cx);
            var ty = parseFloat(translate.split(',')[1])+parseFloat(Drag.cy);
            var scale = translate.split(',')[2];
            $('.graph-main').attr('transform','translate('+tx+','+ty+') scale('+scale+')');
        }else if(Drag.type ==3){
            Drag.cy = event.clientY-dy;
            dy = event.clientY;
            resizeFullscreen();
        }else if(Drag.type==4){
            Drag.cx = event.clientX-dx;
            Drag.cy = event.clientY-dy;
            dx = event.clientX;
            dy = event.clientY;
            dragNode(dx,dy,Drag.target);
        }else if(Drag.type == 5){
            Drag.cx = event.clientX-dx;
            Drag.cy = event.clientY-dy;
            dx = event.clientX;
            dy = event.clientY;
            $('.node-circle-select').each(function(){
                dragNode(dx,dy,this);
            });
        }
    }else{
        $(document).off("mousemove",mousemove);
    }

}

//拖动节点
function dragNode(dx,dy,obj){
    var translate =$(obj).parent().attr('transform').replace(/translate\((.*)\) scale\((.*)\)/,'$1,$2');
    var tx = parseFloat(translate.split(',')[0])+parseFloat(Drag.cx);
    var ty = parseFloat(translate.split(',')[1])+parseFloat(Drag.cy);
    var scale = translate.split(',')[2];
    var id = $(obj).parent().attr('id');
    $(obj).parent().attr('transform','translate('+tx+','+ty+') scale('+scale+')');
    for(var i in dynamicGraph.links){
        var item = dynamicGraph.links[i];
        var linkid = item.id;
        if(id == item.target){
            var points = calcPoints(parseFloat(tx)+20,parseFloat(ty)+20,parseFloat(item.px)+20,parseFloat(item.py)+20)
            $('#'+linkid).attr('d','M'+points[0]+' '+points[1]+'L'+points[2]+' '+points[3]);
            $('#'+linkid).parent().find('.link_normal_text').attr('transform',points[4]);
            item.x = tx;
            item.y = ty;
            for(var j in dynamicGraph.nodes){
                var nodeitem = dynamicGraph.nodes[j];
                if(nodeitem.id == id){
                    nodeitem.x = tx;
                    nodeitem.y = ty;
                }
            }
        }else if(id==item.source){
            var points = calcPoints(parseFloat(item.x)+20,parseFloat(item.y)+20,parseFloat(tx)+20,parseFloat(ty)+20)
            $('#'+linkid).attr('d','M'+points[0]+' '+points[1]+'L'+points[2]+' '+points[3]);
            $('#'+linkid).parent().find('.link_normal_text').attr('transform',points[4]);
            item.px = tx;
            item.py = ty;
            for(var j in dynamicGraph.nodes){
                var nodeitem = dynamicGraph.nodes[j];
                if(nodeitem.id == id){
                    nodeitem.x = tx;
                    nodeitem.y = ty;
                }
            }
        }
    }

}
function mouseup(){
    $('.graph-modcover').remove();
    $('.cursor-dragmove').attr('class','cursor-dragstart');
    $(document).off("mousemove",mousemove);
    $(document).off("mouseup",mouseup);
    if(Drag.hasMove&&Drag.type == 1){
        var arr = new Array();
        if(Drag.cx == dx || Drag.cy == dy){
            return ;
        }else if(Drag.cx>dx){
            if(Drag.cy>dy){
                arr = [dx,dy,Drag.cx,Drag.cy];//右下
            }else{
                arr = [dx,Drag.cy,Drag.cx,dy];//右上
            }
        }else if(Drag.cx<dx) {
            if (Drag.cy > dy) {
                arr = [Drag.cx, dy,dx, Drag.cy];//左下
            } else {
                arr = [Drag.cx, Drag.cy,dx,dy];//左上
            }
        }
         /*for(var i in dynamicGraph.nodes){
             var item = dynamicGraph.nodes[i];
             if(item.x>arr[0]&&item.x<(arr[2]-20)&&item.y>arr[1]&&item.y<(arr[3]-20)){
                 $('#'+item.id).find('circle').attr('class','node-circle-select');
                 $('#'+item.id).find('.node-circle-text-normal').attr('class','node-circle-text-select');
                 $('#'+item.id).find('.ding-marker-normal').attr('class','ding-marker-select');
             }
         }*/
        var translate =$('.graph-main').attr('transform').replace(/translate\((.*)\) scale\((.*)\)/,'$1,$2');
        var scale = translate.split(',')[2];
        var nodearr = new Array();
         $('.nodegroup').each(function(){
             var top = parseFloat($(this).find('circle').offset().top)+parseFloat(20*scale)-$('.graph-canvas').offset().top;
             var left = parseFloat($(this).find('circle').offset().left)+parseFloat(20*scale)-$('.graph-canvas').offset().left;
             if(left>arr[0]&&left<arr[2]&&top>arr[1]&&top<arr[3]){
                 nodearr.push($(this));
             }
         });
         if(nodearr.length>0){
             $('.node-circle-select').attr('class','node-circle-normal');
             $('.node-circle-text-select').attr('class','node-circle-text-normal');
             $('.ding-marker-select').attr('class','ding-marker-normal');
             for(var i in nodearr){
                 $(nodearr[i]).find('circle').attr('class','node-circle-select');
                 $(nodearr[i]).find('.node-circle-text-normal').attr('class','node-circle-text-select');
                 $(nodearr[i]).find('.ding-marker-normal').attr('class','ding-marker-select');
             }
         }
    }else if(!Drag.hasMove&&Drag.type==4){
        if($(Drag.target).attr('class') == 'node-circle-normal'){
            $('.node-circle-select').attr('class','node-circle-normal');
            $('.node-circle-text-select').attr('class','node-circle-text-normal');
            $('.ding-marker-select').attr('class','ding-marker-normal');
            $(Drag.target).attr('class','node-circle-select');
            $(Drag.target).parent().find('.node-circle-text-normal').attr('class','node-circle-text-select');
            $(Drag.target).parent().find('.ding-marker-normal').attr('class','ding-marker-select');
        }
    }
    Index.canvasInit();
}

function resizeFullscreen(){
    var top = parseFloat($('.zoomhadle').css('top'));
    var translate = $('.graph-main').attr('transform').replace(/translate\((.*)\) scale\((.*)\)/,'$1,$2');
    var tx = parseFloat(translate.split(',')[0]);
    var ty = parseFloat(translate.split(',')[1]);
    var scale = parseFloat(translate.split(',')[2]);
    var scaleChange = scale;
    top +=parseFloat(Drag.cy);
    if(top>=106){
        top = 106;
        scale = 0.25;
    }else if(top>53){
        scale -=parseFloat(Drag.cy)/53*0.75;
    }else if(top==53){
        scale = 1;
    }else if(top>0){
        scale -=parseFloat(Drag.cy/53*1);
    }else{
        top = 0;
        scale = 2;
    }
    scaleChange = Math.abs(scale-scaleChange);
    var width = $('.graph-canvas').width();
    var height = $('.graph-canvas').height();
    if(Drag.cy<0){
        tx -= width*scaleChange/2;
        ty -= height*scaleChange/2;
    }else if(Drag.cy>0){
        tx += width*scaleChange/2;
        ty += height*scaleChange/2;
    }
    $('.zoomhadle').css('top',top);
    $('.graph-main').attr('transform','translate('+tx+','+ty+') scale('+scale+')');
    Index.canvasInit();
}