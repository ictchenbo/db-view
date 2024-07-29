let Tagger = {}

Tagger.isWordLetter = function (s){
    var regex = /[a-zA-Z\-_0-9]{1}/g;
    return regex.test(s);
    //var c = s.charCodeAt(0);
    if(s>="A" && s<="Z") return true;
    if(s>="a" && s<="z") return true;
    if(s=="-" || s=="_") return true;
    return false;
}

Tagger.isEnglish = function (s){
    for(var i=0; i<s.length; ++i){
        if(s.charCodeAt(i)>255) return false;
    }
    return true;
}

Tagger.isBorder = function(i,j, s){
    if(i<=0 && j>=s.length) return true;
    var s1 = s.substr(i-1, 1);
    var s2 = s.substr(j, 1);
    if(!Tagger.isWordLetter(s1) && !Tagger.isWordLetter(s2)) return true;
    return false;
}

Tagger.getTexts = function (node, arr){
	if(node.nodeType==3) {
		arr.push({p:node.parentNode, node:node, text:node.nodeValue});
	}
	else if(node.nodeType==1) {
	   for(var child = node.firstChild; !!child; child = child.nextSibling){
		Tagger.getTexts(child, arr);
	   }
	}
}

Tagger.getTextsEsc =  function (node, arr){
//console.log(node.nodeName);
	if(node.nodeType==3 && node.parentNode.nodeName!="ENT") {
		arr.push({p:node.parentNode, node:node, text:node.nodeValue});
	}
	else if(node.nodeType==1) {
	   for(var child = node.firstChild; !!child; child = child.nextSibling){
		Tagger.getTextsEsc(child, arr);
	   }
	}
}


Tagger.hilightTexts = function(src, text, hiclass){
    if(!text || text.length==0) return src;
    var arr = [];
    var i = 0;
    hiclass = hiclass || 'red';
    while(i<src.length){
      var pos = src.indexOf(text, i);
      if(pos<i) {
        arr.push(src.substring(i));
		break;
      }
      if(pos>i){
        arr.push(src.substring(i,pos));
      }
      arr.push('<span class="'+ hiclass+'">');
      arr.push(text);
      arr.push('</span>');
      i = pos + text.length;
    }
    return arr.join('');
};


/**
  find text and select it in DOM
 **/
Tagger.findSelect = function(win, search, view, restart){
	if(restart){
		win.getSelection().removeAllRanges();
	}
	if(!win.find(search,false,true,true) && search.length > 10){
	    search = search.substr(0,10);
	    if(!win.find(search,false,true,true)){
		return null;
	    }
	}
	var node = win.getSelection().anchorNode;
	if(node) {
		var select = node.parentElement;
		if(view) select.scrollIntoViewIfNeeded();
		return select;
	}
	return null;
}


function flatEnts(ents){
   var arr = [];
 ents.forEach(function(ent){
 var label = ent.label;
 if($.isArray(label)){
       label.forEach(function(label){
    arr.push({label: label, name: ent.name, mode: ent.mode});
 });
}else arr.push(ent);
});
return arr;
}


function tagEntsSeg(seg, ents, pos){
  if(seg=="" || pos>=ents.length) return [{t:seg}];
 //if(pos>1) return seg;
 var ent = ents[pos];
 var tag = ent.label;
 var i = seg.indexOf(tag);
 if(ent.lang_en && !Tagger.isBorder(i, i+tag.length, seg)) i = -1;
 if(i<0) return tagEntsSeg(seg, ents, pos+1);
 //var left = seg.substring(0, i);
 //var right = seg.substring(i+tag.length);
  var arr = [];
  if(i>0) arr = arr.concat(tagEntsSeg(seg.substring(0,i), ents, pos+1));
  var cur = {n:tag};
  if(ent.name) cur.id = ent.name;
  arr.push(cur);
  if(i+tag.length<seg.length) arr = arr.concat(tagEntsSeg(seg.substring(i+tag.length), ents, pos+1));
  return arr;
}

function replaceText(p, node, segs, clz){
  var cNode = document.createElement("ents");
  p.appendChild(cNode);
  p.replaceChild(cNode, node);
  segs.forEach(function(item, i){
    //console.log(item);
    if(item.t) {
      var tn = document.createTextNode(item.t);
      cNode.appendChild(tn);
    }
    else if(item.n){
      var en = document.createElement("ent");
      en.appendChild(document.createTextNode(item.n));
      cNode.appendChild(en);
      var j = $(en);
      j.addClass(clz);
      if(item.id) j.attr('entid', item.id);
    }
  });
}

function doTag(view, ents){
  ents.sort(function(a, b){
    return b.label.length - a.label.length;
  });

  var arr = [];
  //Tagger.getTexts(view.get(0), arr);
  arr.forEach(function(seg){
    var t = $.trim(seg.text);//.replace(/\s+/g,'');
    if(t=='') return;
    var segs = tagEntsSeg(t, ents, 0);
    if(segs.length==1 && segs[0].t) return;//no need
    replaceText(seg.p, seg.node, segs, 'conf');
  });
}


Tagger.tagBody = function(ents, view){
  if(!ents || ents.length==0) return;
     
  doTag(view, ents);

  view.find('ent.conf').click(function(e){
    e.preventDefault();
    e.stopPropagation();
    var name = $(this).attr('entid');
    var ent = map[name];
    if(ent) infobox.show(e, function(h){ showEntityInfo(h, ent, {handler: infobox});}, tagWin);
  });
}

Tagger.tagBody2 = function(ents, view){
  if(!ents || ents.length==0) return;
  ents.sort(function(a, b){
    return b.label.length - a.label.length;
  });//sort by length desc
    
  var map = {};
  ents.forEach(function(ent){
    map[ent.label] = ent;
  });
  var arr = [];
  Tagger.getTextsEsc(view.get(0), arr);
  arr.forEach(function(seg){
    var t = $.trim(seg.text);//.replace(/\s+/g,'');
    if(t=='') return;
    var segs = tagEntsSeg(t, ents, 0);
    if(segs.length==1 && segs[0].t) return;//no need
    replaceText(seg.p, seg.node, segs, 'auto');
  });

  view.find('ent.auto').click(function(e){
     var v = $(this).text();
     var ent = map[v];
     if(!ent) return;
     that.confirmEnt(e, ent);
  });
}

Tagger.tagBody3 = function(ents, view, clz){
  if(!ents || ents.length==0) return;
  ents.sort(function(a, b){
      return b.label.length - a.label.length;
  });//sort by length desc
  var arr = [];
  Tagger.getTextsEsc(view.get(0), arr);
  arr.forEach(function(seg){
      var t = $.trim(seg.text);//.replace(/\s+/g,'');
      if(t=='') return;
      var segs = tagEntsSeg(t, ents, 0);
      if(segs.length==1 && segs[0].t) return;//no need
      replaceText(seg.p, seg.node, segs, clz || '');
  });
}


export default Tagger
