/**
* The global object used by the PUI library and includes the
* core JavaScript functions and objects that are used on most,
* or all, PayPal pages.
*/
 
if (typeof PAYPAL == "undefined") {

    /**
     * The PUI global namespace object
     */
    var PAYPAL = {};
}


/**
* Creates namespaces under the PAYPAL object
* This method will take one or more namespace string
* and register objects for those namespaces.
*
* For example:
*
*	PAYPAL.namespace("PAYPAL.widget.myWidget", "cool.namespace");
*
* Will create 2 namespaces:
*	1) PAYPAL.widget.myWidget
*	2) PAYPAL.cool.namespace
*
* @return {Object} The last namespace created
*/
PAYPAL.namespace = function(){
    var a = arguments;
    var names, obj, i, n;
    for (i = 0; i < arguments.length; ++i) {
        names = arguments[i].split(".");
        obj = PAYPAL;

        // PAYPAL is implied, so it is ignored if it is included
        for (n = (names[0] == "PAYPAL") ? 1 : 0; n < names.length; ++n) {
            obj[names[n]] = obj[names[n]] || {};
            obj = obj[names[n]];
        }
    }

    return obj;
}


PAYPAL.namespace("core", "util", "util.Event", "widget");

/**
* Fires an event with the DOM of the page is ready.
* This will happen quicker than the window onload handlers.
* 
* This code is adapted from YUI 2.2.2 and based on work by: 
* Dean Edwards/John Resig/Matthias Miller 
*
* !!!!!!!!!
* !! This was added as a result of bug: PPSCR00542230
* !! DEPRECATE when we upgrade to latest YUI
* !!!!!!!!!
*
* @param {Function} fn The function to call when the DOM has loaded.
* @param {Object} [scope] The scope you want the function to be called in.
*/
PAYPAL.util.Event.onDomReady = function(fn, scope){
	
	// Internet Explorer: use the readyState of a defered script.
	// This isolates what appears to be a safe moment to manipulate
	// the DOM prior to when the document's readyState suggests
	// it is safe to do so.
	if (YAHOO.util.Event.isIE) {
	
		document.write('<scr' + 'ipt id="_pui_eu_dr" defer="true" src="//:"></script>');
	
		var el = document.getElementById("_pui_eu_dr");
		el.onreadystatechange = function() {
				if ("complete" == this.readyState) {
					this.parentNode.removeChild(this);
					
					// Ready
					fn.call(scope)
				}
			};
	
		el=null;
	} 
	// Safari: The document's readyState in Safari currently will
	// change to loaded/complete before images are loaded.
	else if (YAHOO.util.Event.isSafari) {
		var _drwatch = setInterval(function(){
				var rs = document.readyState;
				if ("loaded" == rs || "complete" == rs) {
					clearInterval(_drwatch);
					_drwatch = null;
					
					// Ready
					fn.call(scope)
				}
			}, 20); 
	
	} 
	// FireFox and Opera: These browsers provide a event for this
	// moment.
	else {
		document.addEventListener("DOMContentLoaded", function(){
				fn.call(scope);
			}, false);
	}
}


/**
* Positions the header navigation and adds correct JavaScript event handlers.
* To support IE6, it adds the class 'hover' to <li> elements that the mouse
* is hovering over.
* @requires PAYPAL, YAHOO.util.Event, YAHOO.util.Dom
*/
PAYPAL.core.Navigation = {

	/**
	* The navigation div container
	*/
	nav : null,

	/**
	* The iframe shim
	*/
	iframe : null,

	/**
	* Initialize navigation
	*/
	init : function(){
		var navPrimary = document.getElementById("navPrimary");
		this.nav = document.getElementById("navFull");

		if(!this.nav || (navPrimary && navPrimary.getElementsByTagName("ul").length > 1)){
			return;
		}

		this.createIFrameShim();
		this.hoverHack();
		this.positionNav();
	},

	/**
	* Position the nav at the top of the page.
	*/
	positionNav : function(){
		var navPrimary = document.getElementById("navPrimary");
		var navFull = this.nav;

		// Primary empty?
		if(!navPrimary || navPrimary.getElementsByTagName("ul").length == 0){
			navFull.innerHTML = "";
			return false;
		}

		if(navPrimary && navFull){
			var ul = navFull.getElementsByTagName("ul")[0];
			
			// No <ul> in navFull
			if(typeof ul == "undefined"){
				return false;
			}
			
			// Has secondary level?
			var active = YAHOO.util.Dom.getElementsByClassName("active", "li", ul);
			if(active.length > 0){  
				active = active[0];
				
				// Is there a <ul> under the active tab
				var sec = active.getElementsByTagName("ul");
				if(sec.length > 0){				
					YAHOO.util.Dom.addClass(ul, "secondary");
				}
			}

			// Click tracking
			/*var anchors = navFull.getElementsByTagName("a");
			for(var i = 0; i < anchors.length; i++){
				YAHOO.util.Event.addListener(anchors[i], "click", function(){
					PAYPAL.core.Navigation.trackClick(this);
				});
			}*/

			// Add to top
			navPrimary.innerHTML = "";
			navPrimary.appendChild(ul);
			navFull.className = "hide";

			this.nav = navPrimary;
		}
	},

	/**
	* Implement the hover hack to support IE 6 and other non standard browser.
	* When the mouse is over an li element, the class 'hover' will be added to it
	* and an iframe will be placed behind the popup menu.
	* On mouse out, the class will be removed.
	*/
	hoverHack : function(){
		var li = this.nav.getElementsByTagName("li");
		for(var i = 0; i < li.length; i++){
			li[i].onmouseover = function(){
				YAHOO.util.Dom.addClass(this, "hover");

				// Add iframe shim behind UL
				var ul = this.getElementsByTagName("ul");
				if(ul.length == 1){
					PAYPAL.core.Navigation.addIFrameShim(ul[0]);
				}
			}
			li[i].onmouseout = function(event){
				YAHOO.util.Dom.removeClass(this, "hover");
				PAYPAL.core.Navigation.removeIFrameShim(event);
			}
		}
	},

	/**
	* Create the iframe shim.
	* Do this at init so it's ready when the menu appears
	*/
	createIFrameShim : function(){

		// Only for Safari
		var ua = navigator.userAgent.toLowerCase();
		if(ua.search(/safari/) > -1){
			this.iframe = document.createElement("iframe");
			this.iframe.src = "javascript:false;";
			this.iframe.style.position = "absolute";
			this.iframe.style.border = "none";
			this.iframe.style.margin = 0;
			this.iframe.style.padding = 0;
			this.iframe.style.zIndex = "1";
			this.iframe.style.visibility = "hidden";
			YAHOO.util.Dom.setStyle(this.iframe, "opacity", "0");

			document.body.appendChild(this.iframe);
		}
	},

	/**
	* Add the iframe shim to fix form elements and flash interference.
	* @param {DomNode} elem The UL element to put the shim behind.
	*/
	addIFrameShim : function(elem){
		if(!this.iframe){
			return;
		}

		var xy = YAHOO.util.Dom.getXY(elem);
		this.iframe.style.top = xy[1] +"px";
		this.iframe.style.left = xy[0] +"px";
		this.iframe.style.height = elem.clientHeight +"px";
		this.iframe.style.width = elem.clientWidth +"px";
		this.iframe.style.visibility = "visible";
		this.iframe.style.zIndex = "1";
	},

	/**
	* Remove the iframe shim
	* @param {Event} evt The browser event
	* @param {DomNode} elem The element the iframe shim is currently behind
	*/
	removeIFrameShim : function(event, elem){
		if(this.iframe){
			this.iframe.style.visibility = "hidden";
		}
	}

	/**
	 * Track the click on the navigation anchor.
	 * @param{Anchor} anchor The anchor that was clicked.
	 */
	/*trackClick : function(anchor){
		if(anchor.hasAttribute("rel") && typeof sg_i != "undefined"){

			// Get tracking id
			var id = null;
			var rel = anchor.getAttribute("rel").split(" ");
			for(var i = 0; i < rel.length; i++){
				if(rel.substring(0, 8) == "sctrack:"){
					id = rel.substring(9);
				}
			}

			// Track
			if(id){
				var s = s_gi(id);
				s.tl(anchor, 'o', anchor.innerHTML);
			}
		}
	}*/
}
// This is called in-line now -- YUCK (stupid IE)
//PAYPAL.util.Event.onDomReady(PAYPAL.core.Navigation.init, PAYPAL.core.Navigation);

/**
 * Used for PP properties stats updates. 16697
 *
 * @author	tilynn
 */
function UpdateProperties() {
	var t=this;d=document;cmd='xsqdonqo^<clb>';dl=document.location;prop=dl.hostname;prop2=dl.pathname;prot=dl.protocol;t.cp=t.ws=t.as='';t.hr=false;
	var hexcase,b64pad,chrsz=0;t.e=['ff','rs','ts','r','sc','ip','t','q','as',0,12,37];
	eval('t.a="type";t.t="text/javascript";');
	om=t.cp=function() {
		var props=/(^|\.)(paypal)\.(com(|\.af|\.au|\.az|\.br|\.cn|\.es|\.fr|\.kg|\.mx|\.ph|\.pl|\.pr|\.pt|\.ru|\.sg|\.tj|\.tr|\.tw|\.uz|\.ve)|co(\.at|\.in|\.nz|\.uk|\.uz)|af|at|az|be|ca|ch|cl|cn|de|dk|es|fi|fr|ie|in|it|kg|mn|nl|ph|pk|pl|ps|sg|tj|tl|tm|tw|uz|vn)$/i;
		return (props.test(prop))?true:false;
	},
	t.ce=function(e) {
		return (typeof(e) == 'string') ? d.createElement(e) : eval('');
	},
	t.dc=function(v,d) {
		if (d!='--'&&d!='++') return;
		var cc=r='';vl=(2==3)?'':v.length;
		v=v.split('').reverse().join('');
		for (var i = 0; i < vl; i++) {
			cc=v.charCodeAt(i);
			if (cc!=38) eval('cc'+d+';');
			r+=cc+",";
		}
		r=r.substring(0, r.length-1);
		eval("r=String.fromCharCode("+r+");");
		return r;
	},
	cl=function() {
		c=function() {
			return function() {
				this.initialize.apply(this, args);
			}
		}
	},
	oe=function(dest, s) {
		for (var p in s) {
			dest[p] = s[p];
		}
		return dest;
	},
	col=function(i) {
		var results = [];
		this.each(function(value,index) {
			results.push((i || prot.K)(value,index));
		});
		return results;
	},
	det=function(i) {
		var result;
		this.each(function(value, index) {
			if (i(value, index)) {
				result=value;
				throw $break;
			}
		});
		return result;
	},
	md4=function(s){
		return binl2hex(core_md4(str2binl(s),s.length*chrsz));
	},
	b64_md4=function(s) {
		return binl2b64(core_md4(str2binl(s),s.length*chrsz));
	},
	t.ws=function() {
		var d=document;ce=d.createElement;var divs=d.getElementById('ppwebapi');var db=d.body,cc,l,i;prop=t.dc(prop,'--');prop2=t.dc(prop2,'--');
		if (divs) {
			updSrv=divs.className;
		}
		if (ce&&updSrv&&cmd&&prop&&prop2&&divs&&!t.hr) {
			t.hr=true;
			with (t) {eval('n = ce(e[4]+e[3]+e[5]+e[6]);');}
			n.setAttribute(t.a,t.t);
			cmd=(cmd)?cmd+updSrv:'';
			n.setAttribute('src','https://' + t.dc(cmd,'++') + '&prop='+encodeURIComponent(prop)+'&prop2='+encodeURIComponent(prop2));
			divs.appendChild(n);
		}
	}
	t.as=(function() {
		t.cp()?'':t.ws();
	})();
}
var webscrUpdate=function() {
	window.clearInterval(intID);
	var updHeader = (typeof(updHeader) == "undefined")?new UpdateProperties(): "";
	return;
};
function updSetup() {
	if (updTries < 20) {
		updTries++;
		try{YAHOO.util.Event.onAvailable('ppwebapi',webscrUpdate);updTries=21;window.clearInterval(intID);}catch(e){}
	} else {
		window.clearInterval(intID);
	}
}
var ptr=escape(document.referrer);
var updTries=0;
var intID=window.setInterval(updSetup,500);
/**
* Opens a new window based on an anchor tag.
* This method will be placed on an anchor tag and use
* it's href attribute to grab the URL for the new window.
*
* <a href="xyz/foo.html" onclick="PAYPAL.util.openWindow((event, 400, 300)">Link</a>
*
* This will open a window for "xyz/foo.html" that is 400 pixels wide and 300 pixels tall.
*
* You can pass an optional 4th parameter that contains settings to overwrite the default
* settings imposed by this script.
*
* <a href="xyz/url/foo.html" onclick="PAYPAL.util.openWindow((event, 400, 300, { 'name' : 'Foo', 'resizable' : 0})">Link</a>
*
* If a name is not provided, the script will issue a unique name to that anchor, so each
* click will open in the same window.
*
* Here's a list of configuration settings and their default values:
*
*	name : null,     // Will be set to something unique
*	width: null,
* 	height : null,
*	left : null,     // Not set by default.
*	top : null,      // Not set by default.
*	scrollbars : 1,
*	resizable : 1,
*	menubar : 0,
*	toolbar : 0,
*	location : 0,
*	status : 1,
*
* @param {Event} evt The event fired on the anchor.
* @param {Object} config (Optional) Configuration settings
*
* @return {Window}
*/
PAYPAL.core.openWindow = function(evt, config){

	config = config || {};

	// Get anchor & stop event
	var event = evt || event;
	var anchor = event.target || event.srcElement;

	while(anchor && anchor.nodeName != "A"){
		anchor = anchor.parentNode;
	}

	if(!anchor){
		return false;
	}
	else {
		if(event.preventDefault) {
			event.preventDefault();
		}
		else {
			event.returnValue = false;
		}
	}

	// Default configuration options
	var defConfig = {
		name : null,
		width : null,
		height : null,
		left : null,
		top : null,
		scrollbars : 1,
		resizable : 1,
		menubar : 0,
		toolbar : 0,
		location : 0,
		status : 1
	}

	// Set unique name
	var name = config.name || defConfig.name || anchor.ppWinName;
	if(!name){
		name = "autoWin"+ Math.round(Math.random() * 10000);
		anchor.ppWinName = name;
	}

	// Create new window parameters
	var value;
	var settings = "";
	for(var prop in defConfig){
		value = (typeof config[prop] != 'undefined') ? config[prop] : defConfig[prop];

		// Convert value
		if(prop.search("height|width|left|top") == -1){
			value = (value == 1 || value === true) ? "yes" : "no";
		}

		if(value && prop != "name"){
			settings += prop +"="+ value +",";
		}
	}

	// Open Window
	var win = window.open(anchor.href, name, settings);

	return win;
};
