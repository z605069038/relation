var rightBar = new Object();
rightBar.init = function() {
  rightBar.regEvent.moduleBind();
  rightBar.regEvent.tabBind('.right-tab', 'li');
  rightBar.regEvent.slideBind('[data-operate="slide"]', '.list-header[data-operate="slideLi"]');
  rightBar.regEvent.slideBind('[data-operate="slide"]', '.list-second-header[data-operate="slideLi"]');
};

rightBar.regEvent = {
  tabBind: function(tabUl, contentClass) {
    $(tabUl).on('click', contentClass, function() {
      var $this = $(this);
      var index = $this.index();
      console.log(index)
      $this.siblings().removeClass('active');
      $this.addClass('active');

      $this.parent('.right-tab').siblings('.right-tab-content').children('div')
        .removeClass('active').eq(index).addClass('active');
    })
  },
  slideBind: function(slideUl, slideToggle) {
    $(slideUl).on('click', slideToggle, function(event) {
      event.stopPropagation();

      console.log('冒了')
      var $this = $(this);
      var $show = $this.find('.list-header-show');
      if ($show.hasClass('fa-angle-double-down')) {
        $show.removeClass('fa-angle-double-down')
      } else {
        $show.addClass('fa-angle-double-down')
      }
      $this.siblings('[data-operate="slideContent"]').slideToggle('slow')
    });
  },
  moduleBind: function() {
    $('#showRightBar').click(function() {
      $('.right-ana-tab-content').toggle();
    })

    $('.right-bar-item').on('click', '.right-bar-subItem:not(:first-child)', function() {
      var $this = $(this);
      var $rightBarContent = $('#rightBarContent');
      var showStatus = $rightBarContent.css('display') == 'block';

      if ($this.hasClass('active')) {
        if (!showStatus) {
          $rightBarContent.show();
        } else {
          $rightBarContent.hide();
          $this.removeClass('active');
        }

      } else {

        var index = $this.index();

        $rightBarContent.show();
        $this.siblings().removeClass('active');
        $this.addClass('active');

        $('.right-tab-content-item').find('.right-tab-content-subItem')
          .removeClass('active').eq(index).addClass('active')
      }
    })

    $('#objInfoDetailTOContainer').click(function() {
      var $this = $(this);
      $this.parents('.objInfoDetail').addClass('none');
      $this.parents('.objInfoDetail').siblings('.objInfoContainer').removeClass('none');
    })

    // 统计信息子模块StatisticsModule
    $('#StatisticsModule').on('click', '.isChoose', function() {
      $(this).toggleClass('active');
    })

    // 标签信息子模块TagModule
    $('#TagModule').on('click', '.isChoose', function() {
      $(this).toggleClass('active');
    })

    // 条件筛选子模块CriteriaScreen
    $('#criteriaScreenList').on('click', '[type="checkbox"]', function(event) {
      // 执行一些代码操作

      // 阻止冒泡
      event.stopPropagation()
    })
  }
};

rightBar.init();

// 对象信息查看子模块
$.get("api/rightBar/objectInfo.json", function(data) {
  if (data.code == 0) {
    var html = template('slideRight_tpl', {
      data: data.message,
      type: '0'
    });
    $('#objInfo').html(html);

    // 对象信息查看右键事件
    var rightMenu = [{
      name: '删除节点',
      fun: function(data, event) {
        var $this = data.trigger;

        if ($this.siblings().length < 1) {
          $this.parent().remove();
        }

        $this.remove();

      }
    }, {
      name: '从合并节点中拆出',
      fun: function() {
        console.log(this)
        console.log('正在拆中')
      }
    }]

    $('#objInfo .objInfoList').contextMenu(rightMenu, {
      triggerOn: 'contextmenu'
    });

    var time = null;
    // 对象信息注册单击事件
    $('#objInfo').on('click', '.objInfoList', function() {
        clearTimeout(time);
        var $this = $(this);
        time = setTimeout(function() {
          $this.toggleClass('choose');
        }, 300)
      })
      // 对象信息注册双击事件
    $('#objInfo').on('dblclick', '.objInfoList', function() {
      // 取消上次延时未执行的方法
      clearTimeout(time);
      // 双击执行代码
      var $this = $(this);
      $this.parents('.objInfoContainer').addClass('none');
      $this.parents('.objInfoContainer').siblings('.objInfoDetail').removeClass('none');
    })

  }
});

var dragCircle = document.getElementById('slideLine');

dragCircle.onmousedown = function(ev) {
  var ev = ev || window.event;
  var offsetLeft = this.offsetLeft;
  var relaX = ev.clientX

  var targetDom = document.getElementById('rightBarContent');
  var targetDomWidth = targetDom.offsetWidth;
  console.log("当前宽度为：" + targetDomWidth)

  document.onmousemove = function(ev) {
    var ev = ev || window.event;
    // 偏移量，为正为负
    var moveX = ev.clientX - relaX
    console.log("偏移量的值：" + moveX);
    var isMin = (targetDomWidth == 280) && (moveX > 0)
    var isMax = (targetDomWidth == 330) && (moveX < 0)
    console.log("到达临界了吗：" + (isMin && isMax))
    if (isMin || isMax) {
      moveX = 0;
    } else {
      if (moveX > 0) {
        moveX = moveX > 50 ? 50 : moveX;
      } else {
        moveX = moveX < -50 ? -50 : moveX;
      }
    }

    dragCircle.style.left = (moveX + -1) + 'px'

    document.onmouseup = function(ev) {
      targetDom.style.minWidth = targetDomWidth - moveX + 'px';
      dragCircle.style.left = '-1px'

      console.log('设置后的宽度' + targetDom.style.minWidth)
      console.log("结束绘制")
      document.onmousemove = null;
      document.onmouseup = null
    }
  }
}

// 搜索功能
function searchStr(str) {
/*  if (!str || !str.length) {
    return
  }*/

  var matchStr = '^'+str+'(.*)'
  var matchReg = new RegExp(matchStr, 'g')

  $('.isSearch').each(function(index, value) {
    console.log(value.innerText.trim().replace(matchReg, '1'));
  })
}