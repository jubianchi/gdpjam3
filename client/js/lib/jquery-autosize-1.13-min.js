// Autosize 1.13 - jQuery plugin for textareas
// (c) 2012 Jack Moore - jacklmoore.com
// license: www.opensource.org/licenses/mit-license.php
(function(d){var c={className:"autosizejs",append:"",callback:false},f="hidden",b="border-box",j="lineHeight",a='<textarea tabindex="-1" style="position:absolute; top:-9999px; left:-9999px; right:auto; bottom:auto; -moz-box-sizing:content-box; -webkit-box-sizing:content-box; box-sizing:content-box; word-wrap:break-word; height:0 !important; min-height:0 !important; overflow:hidden;"/>',g=["fontFamily","fontSize","fontWeight","fontStyle","letterSpacing","textTransform","wordSpacing","textIndent"],i="oninput",e="onpropertychange",h=d(a)[0];h.setAttribute(i,"return");if(d.isFunction(h[i])||e in h){d(h).css(j,"99px");if(d(h).css(j)==="99px"){g.push(j)}d.fn.autosize=function(k){k=d.extend({},c,k||{});return this.each(function(){var q=this,n=d(q),r,w=n.height(),u=parseInt(n.css("maxHeight"),10),o,p=g.length,m,l=0,t=q.value,v=d.isFunction(k.callback);if(n.css("box-sizing")===b||n.css("-moz-box-sizing")===b||n.css("-webkit-box-sizing")===b){l=n.outerHeight()-n.height()}if(n.data("mirror")||n.data("ismirror")){return}else{r=d(a).data("ismirror",true).addClass(k.className)[0];m=n.css("resize")==="none"?"none":"horizontal";n.data("mirror",d(r)).css({overflow:f,overflowY:f,wordWrap:"break-word",resize:m})}u=u&&u>0?u:90000;function s(){var x,z,y;if(!o){o=true;r.value=q.value+k.append;r.style.overflowY=q.style.overflowY;y=parseInt(q.style.height,10);r.style.width=n.css("width");r.scrollTop=0;r.scrollTop=90000;x=r.scrollTop;z=f;if(x>u){x=u;z="scroll"}else{if(x<w){x=w}}x+=l;q.style.overflowY=z;if(y!==x){q.style.height=x+"px";if(v){k.callback.call(q)}}setTimeout(function(){o=false},1)}}while(p--){r.style[g[p]]=n.css(g[p])}d("body").append(r);if(e in q){if(i in q){q[i]=q.onkeyup=s}else{q[e]=s}}else{q[i]=s;q.value="";q.value=t}d(window).resize(s);n.bind("autosize",s);s()})}}else{d.fn.autosize=function(k){return this}}}(window.jQuery||window.Zepto));