<template>
    <div class="popup" v-show="visible" :style="{left: left, top: top}">
        <component :options="this.$data" :is="content"></component>
    </div>
</template>
<script>

import PopupMenu from '@/email/PopupMenu'

function calculateOffset(win, e, rect) {
  var visualPadding = 5;

  var offset = {left: e.pageX, top: e.pageY};
  if (rect) {
    offset.left += rect.x;
    offset.top +=  rect.y;
  }

  offset.left += visualPadding;
  offset.top += visualPadding;

  let scrollTop = $(win.document).scrollTop();
  offset.top -= scrollTop

  return offset;
}

export default {
    components: {
        PopupMenu
    },
    props: ['content'],
    mounted(){

    },
    data(){
        return{
            win: null,
            visible: false,
            left: 0, 
            top: 0
        }
    },
    methods:{
        show(){
            this.$emit("show");
            this.visible = true;
        },
        close(){
            this.$emit("close");
            this.visible = false;
        },
        bindTextSelect(h, iframe){
          if(iframe){
            this.rect = iframe.getBoundingClientRect();
          }

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
        },
        trigger(e, text){
            this.close()
            var offset = calculateOffset(this.win, e, this.rect);
            console.log(offset)
            this.left = offset.left + 75
            this.top  = offset.top  + 160
            this.show()
        }
    }
}
</script>
<style scoped>
.popup{
    position: absolute;
    z-index: 350;
    left: 0;
    top: 0;
    width: 150px;
    border: 1px solid #999;
    background: #efefef;
}

.popup > .item{
    padding: 8px 16px;
    padding-left: 8px;
    cursor: pointer;
}

.popup > .sep{
    height: 1px;
}

.popup > .item > .glyphicon{
    margin: 0 4px;
}

.popup > .sep{
    background: #999;
}

.popup > .item:hover{
    background: #3399ff;
    color: white;
}

.popup > .item > .glyphicon, .popup > .item > .icon{
    color: #08c;
    fill: #08c;
}

.popup > .item:hover > .glyphicon, .popup > .item:hover > .icon{
    color: white;
    fill: white;
}

</style>
