/**
 *  popup with binding menus, to replace contextmenu
 */
function PopupBox(config) {
  var _widgets_ = [];  //move to function by hcb

  var that = this;
  var root = $(config.selector);
  root.remove();
  root.appendTo(document.body);//remove to body, so that show correctly
  this.data = null;
  this.callbacks = {};
  this.isOver = false;//is mouse over
  this.win = window;
  this.allfunc = null;
  if (config.autoRemove) _widgets_.push(root);

  var visualPadding = 10;

  this.close = function () {
    that.data = null;
    root.hide();
    that.isOver = false;
    root.children('div.temp').remove();
  }

  this.callback = function (target, cb) {
    if (cb) {
      if (target == '*') {
        that.allfunc = cb;
        return that;
      }
      that.callbacks[target] = cb;
      return that;
    } else {
      return that.callbacks[target];
    }
  }

  this.bindTextSelect0 = function (theWin, h, h2, componentData) {

    h.mousedown(function () {

      that.close();
      theWin.getSelection().removeAllRanges();
    }).mouseup(function (e) {
      var s = theWin.getSelection();
      if (s) s = $.trim(s.toString());
      if (s != '') {

        that.trigger0(theWin, e, s, componentData);
      }

    });

    (h2 || h).dblclick(function (e) {

      var s = theWin.getSelection();
      if (s) s = $.trim(s.toString());
      that.trigger0(theWin, e, s || '');
    });
  };

  this.bindTextSelect = function (h, h2) {

    this.bindTextSelect0(that.win, h, h2);
  }

  this.trigger = function (e, data) {
    this.trigger0(window, e, data);
  }

  this.trigger0 = function (theWin, e, data, componentData) {
    if (this.callbacks['__init__']) {
      var b = this.callbacks['__init__'](root, e, data);
      if (b == false) return;
    }
    that.data = data;
    var offset = calculateOffset(theWin, null, root, e, this.offset);
    //componentData.emailDetail 是EmailDetail 这个vue对象

    //暴力关闭所有窗口，避免多次划选
    componentData.emailDetail.$layer.closeAll('iframe');

    var layerIndex = {index: '', parent: null} //传入一个index, 用于子窗口关闭该父窗口，因为子窗口和父窗口不在一个组件里，所以以参数的方式传递过去
    let index = componentData.emailDetail.$layer.iframe({
      type: 0,
      //title: '请选择操作',
      content: {
        title: false,
        content: componentData.SelectPopUp, //传递的组件对象
        parent: componentData.emailDetail,//当前的vue对象
        data: {
          layerData: {
            text: data, 
            email: componentData.emailDetail.email, 
            offset, 
            layerIndex
          }
        },//props
      },
      shade: 0,
      offset: [offset.left + 75, offset.top - 80],
      //area: ['60px', '278px'],
    });
    layerIndex.index = index;

    //root.show().css(offset);
    that.startTimer(3000);
  }

  this.startTimer = function (ts) {
    that.isOver = false;
    that.timeout = setTimeout(function () {
      if (that.isOver == false) {
        that.close();
      }
    }, ts || 2000);
  }
  this.stopTimer = function () {
    that.isOver = true;
    if (that.timeout) clearTimeout(that.timeout);
  }

  root.find('.item').click(function (e) {//menu item click
    var item = $(this);
    var d = that.data;
    that.close();
    var target = item.attr('target');
    var req = item.attr('required');
    if (that.allfunc) {
      that.allfunc(e, d, target);
    }
    if (req && !d) return;
    if (target && that.callbacks[target]) {//callback
      that.callbacks[target](e, d, item);
    }
  });

  root.mouseenter(function () {
    that.stopTimer();
  }).mouseleave(function () {
    that.startTimer();
  })

  return this;
}


function calculateOffset(win, container, root, e, getOffset) {
  var visualPadding = 5;

  var offset = {left: e.pageX, top: e.pageY};
  if (getOffset) {
    var off1 = getOffset(e);
    offset.left += off1.left;
    offset.top += off1.top;
  }

  offset.left += visualPadding;
  offset.top += visualPadding;

  let scrollTop = $(win.document).scrollTop();
  offset.top -= scrollTop

  //if(container==null) container = $(win.document.body);
  /*var thiswidth = root.outerWidth();
      var thisheight = root.outerHeight();
  var appendOffset = container.offset();
  var winWidth = container.width();*/

  return offset;
}


export default PopupBox
