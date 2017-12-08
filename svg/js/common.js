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

//通过计算得到svg缩略图的width和height值
function getSvgImage(a,b,c,d){
    var obj = new Object();
    if(d>b || c>a){
       if(d/b>c/a){
           obj.height = d;
           obj.width = d/b*a;
       }else{
           obj.height = c/a*b;
           obj.width = c;
       }
    }else{
        obj.width = a;
        obj.height = b;
    }

    if(obj.height>obj.width){
        obj.width = obj.height;
    }else{
        obj.height = obj.width;
    }
    return obj;
}

//计算得出缩略图拖动框范围
function checkDragbox(x,y,width,height){
    var obj = new Object();
    if(x<=0){
        obj.x = 0;
    }else if(x>=150-width){
        obj.x = 150-width
    }else{
        obj.x = x;
    }

    if(y<=0){
        obj.y = 0;
    }else if(y>=150-height){
        obj.y = 150-height
    }else{
        obj.y = y;
    }

    return obj;
}

//转换日期格式
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}