/* Touch Clarity 
 * Copyright (c) Touch Clarity Ltd 2001-2007. All rights reserved. Patent Pending.
 * Privacy Policy at http://www.touchclarity.com/privacy/
 */

window.undefined=window.undefined;window.TOUCHCLARITY=window.TOUCHCLARITY||{Version:"4.2.1#324#325#326#327#363#391#393#389",Vendor:"Touch Clarity",Filename:"tc_logging.js"};TOUCHCLARITY.Logger=TOUCHCLARITY.Logger||{loaded:true,init:function(){this.tc_loader();},tc_configured:function(){tc_tag_version="4.2";tc_dtimeout=5000;tc_d_loc=window.location;tc_sent=0;if(typeof tc_server_url==tc_ud||typeof tc_site_id==tc_ud){return false;}
if(typeof tc_log_page==tc_ud||tc_log_page==""){tc_log_page="logging.html";}
tc_layer=(document.layers?1:0);tc_frame=(document.getElementById||document.all?1:0);tc_timeout=(typeof tc_timeout==tc_ud?tc_dtimeout:tc_timeout*1000);tc_encfn=(typeof encodeURIComponent!=tc_ud?encodeURIComponent:escape);tc_http="http"+(tc_d_loc.href.substring(0,6)=="https:"?"s":"")+"://";tc_server_url=tc_http+tc_server_url;tc_url=((typeof tc_page_alias!=tc_ud)?tc_page_alias:tc_d_loc.href);if(typeof tc_extra_info!=tc_ud){tc_url+=(tc_url.indexOf("?")>0?"&":"?")+tc_extra_info;}
tc_extra_info="";tc_products=(typeof tc_products==tc_ud?"":tc_products);tc_ccs=new Array();tc_referrer=(typeof tc_referrer!=tc_ud&&tc_referrer!=""&&tc_referrer!=null?tc_referrer:(typeof document.referrer==tc_ud?tc_ud:(document.referrer==null?"null":(document.referrer==""?"empty":document.referrer))));tc_time=new Date().getTime();return true;},tc_log:function(_1,_2,_3){if(!tc_logging_active){return;}
_1=TOUCHCLARITY.Logger.tc_fixURL(_1);tc_image=new Image();tc_image.src=TOUCHCLARITY.Logger.tc_get_log_URL("i",_1,tc_products,new Date().getTime(),_3);},tc_redirect:function(_4,_5,_6,_7,_8,_9){if(typeof _5==tc_ud||_5==""){return;}
if(typeof _9==tc_ud||_9==""){_9="tc_d_loc.href='"+_5+"'";}
_5=TOUCHCLARITY.Logger.tc_fixURL(_5);if(typeof _6==tc_ud){_6=_5;}
_6=TOUCHCLARITY.Logger.tc_fixURL(_6);if(typeof _4==tc_ud||_4==""||_4=="_self"){if(tc_logging_active){tc_timer=new Image();tc_timer.onload=function(){eval(_9);clearTimeout(tc_timeout_id);};tc_timer.onerror=function(){eval(_9);clearTimeout(tc_timeout_id);};tc_timer.src=TOUCHCLARITY.Logger.tc_get_log_URL("i",_6,_8,new Date().getTime());tc_timeout_id=setTimeout(_9,tc_timeout);}else{eval(_9);}}else{if(typeof _4=="object"&&_4.document){if(tc_logging_active){tc_timer=new Image();tc_timer.src=TOUCHCLARITY.Logger.tc_get_log_URL("i",_6,_8);}
_4.location.href=_5;}else{TOUCHCLARITY.Logger.tc_open_window(_4,_5,_6,_7,_8);}}},tc_open_window:function(_a,_b,_c,_d,_e){if(typeof _b==tc_ud||_b==""){return false;}
if(tc_logging_active){tc_timer=new Image();tc_timer.src=TOUCHCLARITY.Logger.tc_get_log_URL("i",_c,_e,new Date().getTime());}
if(typeof _d==tc_ud){return window.open(_b,_a);}else{return window.open(_b,_a,_d);}},tc_get_log_URL:function(_f,_10,_11,_12,_13){if(typeof _f==tc_ud){_f="i";}
var url=tc_server_url+"/"+_f+"?siteID="+tc_site_id;if(_f!="d"){url+="&ts="+(typeof _12!=tc_ud?_12:tc_time);var al=TOUCHCLARITY.Logger.tc_isAlias(_10);if(typeof tc_containers!=tc_ud){for(var cc=0;cc<tc_containers.length;cc++){url+="&ccID="+tc_containers[cc];}}
if(_f=="c"){url+="&log=no";}
if(al){url+="&alias=true";}
if((typeof _11!=tc_ud)&&_11.length){url+="&prod="+tc_encfn(_11);}
if(typeof _13!=tc_ud){url+=_13;}
if(_10==tc_ud){_10=tc_d_loc;}
_10=tc_encfn(_10);while(_10.length>1999-url.length){_10=_10.substring(0,_10.lastIndexOf(tc_encfn("&")));}
url+="&location="+_10;var dg=new Object();dg.tagv=tc_tag_version;dg.tz=0-(new Date().getTimezoneOffset());dg.r=tc_encfn(tc_referrer);dg.title=""+tc_encfn(document.title);if(al){dg.aliased=tc_encfn(tc_d_loc.href);}
if(screen){dg.cd=screen.colorDepth;dg.ah=screen.availHeight;dg.aw=screen.availWidth;dg.sh=screen.height;dg.sw=screen.width;dg.pd=screen.pixelDepth;}
for(var key in dg){if((typeof(dg[key])!=("function"))&&(typeof(dg[key])!=("array"))&&(typeof(dg[key])!=("object"))){var _19="&"+key+"="+dg[key];if(url.length+_19.length<2000){url+=_19;}else{break;}}}}else{url+="&dlts="+tc_time+"&dl="+(new Date().getTime()-tc_time);}
return url;},tc_fixURL:function(url){if(url==""){return tc_d_loc.href;}
if((url.substring(0,4)!="http")&&(url.substring(0,1)!="/")){url=tc_d_loc.pathname.substring(0,tc_d_loc.pathname.lastIndexOf("/")+1)+url;}
if(url.substring(0,1)=="/"){url=tc_http+tc_d_loc.host+url;}
return url;},tc_isAlias:function(_1b){_1b=(typeof _1b!=tc_ud?_1b:(typeof tc_page_alias==tc_ud?"":tc_page_alias));_1b=TOUCHCLARITY.Logger.tc_fixURL(_1b);if(_1b.indexOf("?")>0){_1b=_1b.substring(0,_1b.indexOf("?"));}
return(_1b!=tc_http+tc_d_loc.host+tc_d_loc.pathname);},tc_loader:function(){var _1c=new Image();tc_ud="undefined";if((typeof tc_containers!="undefined")&&(tc_containers.length>0)){return;}else{if((typeof tc_logging_active!="undefined"&&tc_logging_active)&&TOUCHCLARITY.Logger.tc_configured()&&(typeof tc_done==tc_ud||tc_done===false)){url=TOUCHCLARITY.Logger.tc_fixURL(tc_url);_1c.onload=function(){tc_sent=true;};_1c.src=TOUCHCLARITY.Logger.tc_get_log_URL("i",url,tc_products,tc_time);}
tc_done=true;return _1c;}},tc_optimise:function(id,_1e){return false;}};var tc_log=TOUCHCLARITY.Logger.tc_log;var tc_redirect=TOUCHCLARITY.Logger.tc_redirect;var tc_open_window=TOUCHCLARITY.Logger.tc_open_window;var tc_optimise=window.tc_optimise||TOUCHCLARITY.Logger.tc_optimise;TOUCHCLARITY.Util=TOUCHCLARITY.Util||{};TOUCHCLARITY.Util.Cookie=TOUCHCLARITY.Util.Cookie||function(_1f,_20){this._name=_1f;var _21=(typeof decodeURIComponent!="undefined"?decodeURIComponent:unescape);var _22=document.cookie;if(_22===""){return;}
var _23=_1f+"=";var _24=_22.split(";");var _25=null;for(var i=0;i<_24.length;++i){var c=_24[i];while(c.charAt(0)==" "){c=c.substring(1,c.length);}
if(c.indexOf(_23)===0){_25=c.substring(_23.length,c.length);break;}}
if(_25===null){return false;}
this["_value"]=_21(_25);if(!_20){return true;}
var _28=_25.substring(_1f.length+1);var a=_28.split("&");for(var j=0;j<a.length;++j){a[j]=a[j].split(":");}
for(var k=0;k<a.length;++k){this[a[k][0]]=_21(a[k][1]);}};TOUCHCLARITY.Util.Cookie.prototype.store=function(_2c,_2d,_2e,_2f){var _30=(typeof encodeURIComponent!="undefined"?encodeURIComponent:escape);var _31="";for(var _32 in this){if((_32.charAt(0)=="_")||((typeof this[_32])=="function")){continue;}
if(_31!==""){_31+="&";}
_31+=_32+":"+_30(this[_32]);}
var _33=this._name+"="+_31;if(_2c||_2c===0){_33+="; max-age="+(_2c*24*60*60);}
if(_2d){_33+="; path="+_2d;}
if(_2e){_33+="; domain="+_2e;}
if(_2f){_33+="; secure";}
document.cookie=_33;};TOUCHCLARITY.Util.Cookie.prototype.remove=function(_34,_35,_36){for(var _37 in this){if(_37.charAt(0)!="_"&&typeof this[_37]!="function"){delete this[_37];}}
this.store(0,_34,_35,_36);};TOUCHCLARITY.Util.Cookie.enabled=function(){if(navigator.cookieEnabled!==undefined){return navigator.cookieEnabled;}
if(TOUCHCLARITY.Util.Cookie.enabled.cache!==undefined){return TOUCHCLARITY.Util.Cookie.enabled.cache;}
document.cookie="_testcookie=test; max-age=10000";var _38=document.cookie;if(_38.indexOf("_testcookie=test")==-1){TOUCHCLARITY.Util.Cookie.enabled.cache=false;return TOUCHCLARITY.Util.Cookie.enabled.cache;}else{document.cookie="_testcookie=test; max-age=0";TOUCHCLARITY.Util.Cookie.enabled.cache=true;return TOUCHCLARITY.Util.Cookie.enabled.cache;}};TOUCHCLARITY.Util=TOUCHCLARITY.Util||{};TOUCHCLARITY.Util.Query=TOUCHCLARITY.Util.Query||function(_39){var q;if(typeof _39=="boolean"||typeof _39=="number"||typeof _39=="undefined"){q=_39?document.referrer.replace(/^[^\?]+\??/,""):document.location.search.replace(/^\?/,"");}else{if(typeof _39=="string"){q=_39;}else{return false;}}
q=q.replace(/#[^#]*$/,"");if(q){this.queryString=q;this.params=this.parseQuery();}};TOUCHCLARITY.Util.Query.prototype.parseQuery=function(){var _3b={};if(!this.queryString){return _3b;}
var _3c=this.queryString.split(/[&;]/);for(var i=0;i<_3c.length;++i){var _3e=_3c[i].split("=");if(!_3e.length==2){continue;}
if(!(_3e[0]||_3e[1])){continue;}
var key=unescape(_3e[0]);var val=unescape(_3e[1]);val=val.replace(/\+/g," ");_3b[key]=val;}
return _3b;};TOUCHCLARITY.Util=TOUCHCLARITY.Util||{};TOUCHCLARITY.Util.Throttle=TOUCHCLARITY.Util.Throttle||function(_41){if(window["TOUCHCLARITY"]&&TOUCHCLARITY["Targeter"]&&TOUCHCLARITY["Targeter"]["loaded"]==true){TOUCHCLARITY.Targeter.init();return true;}else{if(window["TOUCHCLARITY"]&&TOUCHCLARITY["Logger"]&&TOUCHCLARITY["Logger"]["loaded"]==true){TOUCHCLARITY.Logger.init();return true;}}
return false;};TOUCHCLARITY.Plugin=TOUCHCLARITY.Plugin||{};TOUCHCLARITY.Plugin.tc_extra_info_from_cookies=TOUCHCLARITY.Plugin.tc_extra_info_from_cookies||function(_42){if(!_42||!(typeof _42=="object"&&typeof _42[0]=="object")){return false;}
var _43="";for(var _44=0;_44<_42.length;++_44){var _45=_42[_44];var _46=new TOUCHCLARITY.Util.Cookie(_45.name,_45.trusted);if(typeof _46["_value"]!="undefined"&&_45.useValue){_43+="&"+_46["_name"]+"="+_46["_value"];}else{if(typeof _46["_value"]!="undefined"){_43+="&"+_46["_name"]+((_46["_value"]==_45.testValue)?"=true":"=false");}else{_43+="&"+_46["_name"]+"=false";}}}
_43=_43.substring(1);return _43;};TOUCHCLARITY.Plugin=TOUCHCLARITY.Plugin||{};TOUCHCLARITY.Plugin.tc_page_alias_from_params=TOUCHCLARITY.Plugin.tc_page_alias_from_params||function(_47){var _48=new TOUCHCLARITY.Util.Query();var _49="";for(var i=0;i<_47.length;++i){if(_48["params"]&&typeof _48["params"][_47[i]]!="undefined"){_49+="/"+_47[i]+"/"+_48["params"][_47[i]];}}
if(_49!==""){_49=_49.substring(1);_49=_49+"?"+_48["queryString"];return _49;}else{return window.undefined;}};
/* Checksum: $SHA1 */

/* Customisations */
var tc_site_id = window.tc_site_id || "429";
var tc_log_path = window.tc_log_path || "/www/global/js";
// #351
var tc_timeout = window.tc_timeout || 3;
// #328
if (window.location.href.indexOf("www-")!= -1 || window.location.href.indexOf("bankofamerica.clents.imp") || window.location.href.indexOf("liamc-osx")!= -1) {
  //Test Environment
  tc_server_url = window.tc_server_url || "tc.bankofamerica.com";
  } else {
  //Production Environment
  tc_server_url = window.tc_server_url || "tc.bankofamerica.com";
}

// there can be only one tc_page_alias
var tc_page_alias = window.tc_page_alias || TOUCHCLARITY.Plugin.tc_page_alias_from_params(['pageID','product','calcid','category_id','context_id','context','template']);

// there can be many tc_extra_info additions
var tc_extra_info = window.tc_extra_info || '';
tc_extra_info += TOUCHCLARITY.Plugin.tc_extra_info_from_cookies([
    { 
      name:     "BOA_0020", // name of the cookie
      useValue: true // Boolean as to whether we should return the raw value of the cookie
    },
    { 
      name:     "state",
      useValue: true
    },
    { 
      name:     "BA_0021",
      testValue: "OLB" // value to test against the cookie value
    }
  ]);

// #343
if(document.getElementsByName && document.getElementsByName('question_box') && document.getElementsByName('question_box')[0] && document.getElementsByName('question_box')[0].value){
  tc_extra_info += '&se='+document.getElementsByName('question_box')[0].value;
}

// #363
(function () {
  var TOUCHCLARITY = { 
    Version: '4.2.1#324#325#326#327#363#391#393#389',
    Vendor: 'Touch Clarity',
    Filename: "tc_logging || tc_targeting.js" 
  };
  TOUCHCLARITY.Loader = function () {
    var that = this;
    var d = new Date();
    var timestamp = "" + d.getFullYear() + d.getMonth() + d.getDate() + d.getHours() + d.getMinutes() + d.getSeconds() + d.getMilliseconds(); 
    var config = {
      server: "",
      path: "/www/global/js/tc_throttle",
      args: "timestamp="+timestamp      
    };  
    this.init = function () {
      return _buildScriptTag();
    };
    function _buildScriptTag() {
      var protocol = "";
      var url = "";
      if (config.server) {
        protocol = "http"+(window.location.href.substring(0,6)=="https:"?"s":"")+"://";
      }
      url = ""+protocol+config.server+config.path+".js?"+config.args;
      document.write('<scr'+'ipt type="text/javascript" src="'+url+'"></scr'+'ipt>');
      return true;
    }
  };
  var tc_load = new TOUCHCLARITY.Loader();
  tc_load.init();
})();



