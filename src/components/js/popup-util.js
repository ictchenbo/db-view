function calculateOffset(win, e, getOffset) {
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

  return offset;
}


function Popup(config){
  this.win = config.win
  this.layer = config.layer
  this.vue = config.vue
  this.context = config.context
  this.offset = config.offset
  this.component = config.component
}

Popup.prototype.bindTextSelect = function(h){
  let that = this

  h.mousedown(function () {
    that.close();
    that.win.getSelection().removeAllRanges();
  }).mouseup(function (e) {
    var s = that.win.getSelection();
    if (s) s = $.trim(s.toString());
    if (s != '') {
      that.trigger(e, s);
    }
  });

  h.dblclick(function (e) {
    var s = that.win.getSelection();
    if (s) s = $.trim(s.toString());
    that.trigger(e, s || '');
  });
}

Popup.prototype.trigger = function(e, text){
  let that = this

  that.close()

  var offset = calculateOffset(this.win, e, this.offset);

  this.layerID = this.layer.iframe({
    showTitle: false,
    //title: '请选择操作',
    shade: false,
    offset: [offset.left, offset.top],
    anim: 'up',
    content: {
      content: that.component, //传递的组件对象
      parent: that.vue,//当前的vue对象
      data: {
        data:text,
        context: JSON.stringify(that.context)
      },//props
    }
  });
}

Popup.prototype.close = function(){
  if(this.layerID){
    this.layer.close(this.layerID);
    this.layerID = null
  }
}

export default Popup
