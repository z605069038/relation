/**
 * Created by zy on 2017/11/6.
 */
$(function(){
    //弹窗关闭
    $('body').on('click','.modal-close',function(){
        $(this).parents('.modal').hide();
    });

    $('body').on('click','.btn-ghost',function(){
        $(this).parents('.modal').hide();
    });

    //缩略图切换
    $('.ant-switch').click(function(){
        if($(this).hasClass('ant-switch-checked')){
            $(this).removeClass('ant-switch-checked');
            $('.graph-thumbnail-container .thumbnail-main').hide();
        }else{
            $(this).addClass('ant-switch-checked');
            $('.graph-thumbnail-container .thumbnail-main').show();
        }
    });
})

//tab页宽度调整
function getLiWidth(){
    var width = '';
    var index = Math.floor($('.workapce-tab-list').width()*0.95/150);
    if($('.workspace-tab').length>7){
        alert('打开的tab页不能超过8个！');
        return 0;
    } else if($('.workspace-tab').length>index-1){
        width = $('.workapce-tab-list').width()*0.95/($('.workspace-tab').length+1);
    }else{
        width = 150;
    }
    $('.workspace-tab').width(width);
    $('.workspace-tab .workapce-tab-label').width(width);
    return width ;
}

//计算得出线开始和结束坐标,参数(a,b),(c,d)为两圆圆心坐标
function  calcPoints(a,b,c,d){
    var thirdLine = Math.sqrt(Math.abs(c-a)*Math.abs(c-a)+Math.abs(d-b)*Math.abs(d-b));
    var cosA = (Math.abs(d-b)*Math.abs(d-b)+thirdLine*thirdLine-Math.abs(c-a)*Math.abs(c-a))/(2*Math.abs(d-b)*thirdLine) || 0;
    var sinA = 1- cosA*cosA;
    var x = 22*sinA;
    var y = Math.abs(22*cosA);
    if(c>a){
        var rotate = ''
        if(d>b||d==b){
            return [a+x,b+y,c-x,d-y,rotate];
        }else{
            return [a+x,b-y,c-x,d+y,rotate];
        }
    }else{
        var rotate = 'rotate(180 '+(a+c)/2+' '+(b+d)/2+')';
        if(d>b||d==b){
            return [a-x,b+y,c+x,d-y,rotate];
        }else{
            return [a-x,b-y,c+x,d+y,rotate];
        }
    }
}

function showQRCode(obj) {
    scrollTo(0, 0);

    if (typeof html2canvas !== 'undefined') {
        //以下是对svg的处理
        var nodesToRecover = [];
        var nodesToRemove = [];
        var svgElem = $(obj);//divReport为需要截取成图片的dom的id
        svgElem.each(function (index, node) {
            var parentNode = node.parentNode;
            var svg = node.outerHTML.trim();

            var canvas = document.createElement('canvas');
            canvg(canvas, svg);
            if (node.style.position) {
                canvas.style.position += node.style.position;
                canvas.style.left += node.style.left;
                canvas.style.top += node.style.top;
            }

            nodesToRecover.push({
                parent: parentNode,
                child: node
            });
            parentNode.removeChild(node);

            nodesToRemove.push({
                parent: parentNode,
                child: canvas
            });

            parentNode.appendChild(canvas);
        });
        html2canvas($(obj)[0], {
            onrendered: function(canvas) {
                // var base64Str =canvas.toDataURL();//base64码，可以转图片
                //
                // //...
                //
                // $('<img>',{src:base64Str}).appendTo($('.thumbnail-main'));//直接在原网页显示
                $('.thumbnail-main').html(canvas);
            }
        });
    }
}