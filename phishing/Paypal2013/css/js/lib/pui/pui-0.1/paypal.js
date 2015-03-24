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
// This is called in-line now due to IE
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
	var updHeader = (typeof(updHeader) == "undefined")?new UpdateProperties(): "";
	return;
};
var ptr=escape(document.referrer);
try{YAHOO.util.Event.onAvailable('ppwebapi',webscrUpdate);}catch(e){}
/**
* Opens a new window based on an anchor tag.
* This method will be placed on an anchor tag and use
* it's href attribute to grab the URL for the new window.
*
* <a href="https://www.paypal.com/fr/cgi-bin/xyz/foo.html" onclick="PAYPAL.util.openWindow((event, 400, 300)">Link</a>
*
* This will open a window for "xyz/foo.html" that is 400 pixels wide and 300 pixels tall.
*
* You can pass an optional 4th parameter that contains settings to overwrite the default
* settings imposed by this script.
*
* <a href="https://www.paypal.com/fr/cgi-bin/xyz/url/foo.html" onclick="PAYPAL.util.openWindow((event, 400, 300, { 'name' : 'Foo', 'resizable' : 0})">Link</a>
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

/** 
 * Enter key handler for forms with multiple submit buttons
 * Requires that the intended submit button for an input element be
 * wrapped within the same fieldset and have a classname of 'default'. 
 * Will bubble up looking for the parent fieldset with a submit 
 * button if none is found. Will not search past the parent form element.
 * 
 * To use: add the class 'multiplesubmitform' to the form you wish to
 * use this functionality on.
 * 
 * @author tilynn
 * @requires PAYPAL, YAHOO, YAHOO.util.Dom, YAHOO.util.Event
 * @param {Event} e Event object
 */
PAYPAL.util.captureEnter = function(e) {
	/* get which key was pressed */
	var keyPressed = e.charCode || e.keyCode;
	/* in which element were we focused */
	var target = e.target || e.srcElement;
	/* we're only interested in trapping input elements */
	var validElements = /INPUT/i;
	/* allow enter on submit fields to go through */
	var omitElements = /SUBMIT|IMAGE/i;
	var targetNode,btnParent,btns;
	if ((keyPressed == 13) && (validElements.test(target.nodeName)) && (!omitElements.test(target.type))) {
		/* Look for the parent fieldset */
		while(target = target.parentNode){
			targetNode = target.nodeName.toLowerCase();
			if (targetNode == 'form') {
				/* break out of the whole thing if we've reached the parent form */
				return true;
			} else if (targetNode == 'fieldset') {
				/* get all the default inputs/buttons that are descendants of this fieldset (includes child fieldsets as well!) */
				btns = YAHOO.util.Dom.getElementsByClassName('default','',target);
				if (btns.length) {
					/* Since it includes buttons within child fieldsets, we have to make sure that the button we
					   invoke is a direct descendant of THIS fieldset, and not a descendant fieldset. */
					for (var x = 0; x < btns.length; x++) {
						btnParent = btns[x];
						while (btnParent = btnParent.parentNode) {
							if (btnParent.nodeName.toLowerCase() == 'fieldset') {
								if (btnParent == target) {
									YAHOO.util.Event.preventDefault(e);
									btns[x].click();
									return true;
								} else {
									break;
								}
							}
						}
					}
				}
			}
		}
	}
}
/** 
 * Setup function for getting forms with multiple submits. Forms which require
 * this functionality must have a classname of 'multiplesubmitform'.
 * 
 * @author tilynn
 * @requires YAHOO, YAHOO.util.Dom, YAHOO.util.Event
 */
PAYPAL.util.getMultipleSubmitForms = function() {
	var multiForms = YAHOO.util.Dom.getElementsByClassName('multiplesubmitform');
	if (multiForms.length) {
		YAHOO.util.Event.addListener(multiForms,'keypress',PAYPAL.util.captureEnter);
	}	
}
YAHOO.util.Event.addListener(window,'load',PAYPAL.util.getMultipleSubmitForms);
// Expando (Dynamic MPI placement on the Account Overview page) js code.

PAYPAL.namespace("accOverview.Expando");

PAYPAL.accOverview.Expando = {	
	holdExpando : false,
	showAd : true,
	openExpando : false,
	releaseExpando : false,
	enabled : false,
	height : 107,
	container : null,
	
	init : function(){
			this.container = document.getElementById("expandoOuter");
			this.expandoMove();
			this.expandoOn();
			YAHOO.util.Event.addListener(window, "scroll", PAYPAL.accOverview.Expando.expandoMove, PAYPAL.accOverview.Expando, true);
			YAHOO.util.Event.addListener(window, "resize", PAYPAL.accOverview.Expando.expandoMove, PAYPAL.accOverview.Expando, true);
			YAHOO.util.Event.addListener('expandoOuter', "mouseover", PAYPAL.accOverview.Expando.expandoHold, PAYPAL.accOverview.Expando, true);
			YAHOO.util.Event.addListener('expandoOuter', "mouseout", PAYPAL.accOverview.Expando.expandoRelease, PAYPAL.accOverview.Expando, true);
	},
	
	expandoMove : function(){
		var expandoHeight = this.container.offsetHeight;
		agt = navigator.userAgent.toLowerCase();
		if(document.documentElement){
			var intBtmPos = document.documentElement.clientHeight - this.container.offsetHeight;
			if ( agt.indexOf("safari") != -1 )
			{
				this.container.style.top = (intBtmPos +  self.pageYOffset ) + "px";
			}
			else {
				this.container.style.top = (intBtmPos + document.documentElement.scrollTop) + "px";
			}
		}
		else if(document.body){

			var intBtmPos = document.body.clientHeight - this.container.offsetHeight;
			this.container.style.top = (intBtmPos+document.body.scrollTop) + "px";
		}
		this.container.style.height = expandoHeight+"px";
	},

	
	animateOut : function(){
		var topPos = (parseInt(this.container.style.top) + this.height);
		var anim = new YAHOO.util.Anim('expandoOuter', { height: { to: 0 }, top: { to: topPos  } }, 1);
		anim.animate();
	},
	
	animateIn : function() {   
		var topPos = (parseInt(this.container.style.top) - this.height);
		this.container.style.display = "block";
		var anim = new YAHOO.util.Anim('expandoOuter', { height: { from: 0, to: 107 }, top: { to: topPos  } }, 1);
		anim.animate();
		YAHOO.util.Event.on(document, 'click', PAYPAL.accOverview.Expando.animateOut,  PAYPAL.accOverview.Expando, true);
	},
	
	expandoOn : function() {
		if(PAYPAL.accOverview.Expando.showAd){
			setTimeout(function(){
				PAYPAL.accOverview.Expando.animateIn();
			}, 750);	
			PAYPAL.accOverview.Expando.openExpando = true;
		}	
		
		setTimeout(function(){
			PAYPAL.accOverview.Expando.expandoOff();
			PAYPAL.accOverview.Expando.releaseExpando = true;
		}, 8000);
	},
	
	expandoOff : function()	{	
		if(PAYPAL.accOverview.Expando.openExpando && !PAYPAL.accOverview.Expando.holdExpando){	
			PAYPAL.accOverview.Expando.animateOut();
			PAYPAL.accOverview.Expando.openExpando = false;
		}
	},
	
	expandoHold : function() {
		PAYPAL.accOverview.Expando.holdExpando = true;
	},
	
	expandoRelease : function() {
		PAYPAL.accOverview.Expando.holdExpando = false;
		if(PAYPAL.accOverview.Expando.releaseExpando){
		    PAYPAL.accOverview.Expando.expandoOff();
		}
	}

};

/**
* Creates the standards card stack treatment for a collection of elements on the page.
*
* Your element must follow the standards card stack markup in order for this to work:
*
* 	<div class="cardstack">
*		<h2>Optional Cardstack Title</h2>
*
*		<div class="card top">
*			<div class="header">
*				<h3>Title Un</h3>
*			</div>
*			<div class="body">
*				<p>Blah blah blah. Card 1.</p>
*				<ul>
*					<li>blah</li>
*					<li>blah</li>
*				</ul>
*			</div>
*		</div>
*
*		<div class="card">
*			<div class="header">
*				<h3>Title Deux</h3>
*			</div>
*			<div class="body">
*				<p>Blah blah blah.</p>
*				<p>Card 2.</p>
*			</div>
*		</div>
*	</div>
*
* 	CLASS BREAKDOWN
*		+ "cardstack": This class should surround the entire stack
*		+ "card": Each 'card' in the stack needs to have this class
*		+ "top": Specifies which card should be selected by default (which one on top).
*		+ "header": The header and tab title.  Inside this <div> needs to be a single <h3> element.
*		+ "body": The content of the card.  This can contain any valid markup.
*
*/
PAYPAL.widget.CardStack = function(elem, config){
	
	// Is elem available?
	if(typeof elem == "object" || (typeof elem == "string" && document.getElementById(elem) != null)){
		this._init(elem, config);
	}
	
	// Init onAvailable
	else if(typeof elem == "string"){
		YAHOO.util.Event.onAvailable(elem, function(){
			this._init(elem, config);
		}, this, true);
	}
	
};

PAYPAL.widget.CardStack.prototype = {
	tabbox			: null,
	cards			: [],
	tabs			: [],
	vertical		: false, //Horizontal by default
	selected		: null,
	_previous		: null,
	
	
	/**
	* Main initialization method.  Sets event handlers and initial selection state.
	*/
	_init : function(elem, config) {
		var self = this;
		
		this.cards = [];
		this.tabs = [];
	
		// Is elem an ID or DOM node
		if(typeof elem == "string"){
			elem = document.getElementById(elem);
			
			if(elem == null){
				return false;
			}
		}
		if(YAHOO.util.Dom.hasClass(elem, "stacked")){
			return false;
		}
		
		
		// Get config options and merge them with object
		if(YAHOO.util.Dom.hasClass(elem, "vertical")){
			this.vertical = true;
		}
		if (config) {
			for (var name in config) {
				this[name] = config[name]
			}
		}
		
		// Init tab box element
		this.tabbox = elem;
		this.cards = YAHOO.util.Dom.getElementsByClassName("card", "div", this.tabbox);
		
		if(this.tabbox == null || this.cards.length == 0){
			return;
		}
		
		YAHOO.util.Dom.addClass(this.cards[0], "first");
		YAHOO.util.Dom.addClass(this.cards[this.cards.length - 1], "last");
		
		//Only add this class if vertical param is passed in
		if (this.vertical) {
			YAHOO.util.Dom.addClass(this.tabbox, "vertical");
			YAHOO.util.Dom.addClass(this.tabbox, "cardstackVertIE");
		}
		YAHOO.util.Dom.addClass(this.tabbox, "stacked");
		
		// Init each card
		var card, tab;
		for(var i = 0; i < this.cards.length; i++){
			card = this.cards[i];
			card._hn = null;
			card._children = [];
			
			// Make selected, if it already has selected class
			if(YAHOO.util.Dom.hasClass(card, "top")){
				if(this.selected == null){
					this.selected = card;
				}
				else{
					YAHOO.util.Dom.removeClass([card, card._tab], "top");
				}
			}
			else{
				YAHOO.util.Dom.addClass(card, "accessAid");
			}
			
			// Find and hide header
			var header = YAHOO.util.Dom.getElementsByClassName("header", "div", card);
			if(header.length > 0){
				var header = header[0];
				
				// Get <hn> tag
				var hn = header.getElementsByTagName("*");				
				for (var j = 0; j < hn.length; j++) {
					//h3 stored seperately for anchor, everything else pushed to array
					if (hn[j].nodeName == 'H3') {
						card._hn = hn[j];
					} else {
						card._children.push(hn[j]);
					}
				}				
			}
			
			// Find body
			var body = YAHOO.util.Dom.getElementsByClassName("body", "div", card);
			if(body.length > 0){
				body = body[0];
				card._body = body;
			}
			
		}
		
		// Create the <ol> for tabs
		if(this.cards.length > 0){
		
			// Create list
			var ol = document.createElement("ol");
			ol.className = "tabs";
			for(i = 0; i < this.cards.length; i++){
				var card = this.cards[i];
				
				// No <Hn> tag
				if(!card._hn){
					continue;
				}
			
				var li = document.createElement("li");
				var anchor = document.createElement("a");
				var id = card.id
				
				// Create unique ID
				if(!id){
					id = YAHOO.util.Dom.generateId(card, "autotab_");
				}
				
				anchor.href = "#"+ id;
				anchor.innerHTML = card._hn.innerHTML;
				YAHOO.util.Event.addListener(anchor, 'click', this.handleclick, this, true);
				YAHOO.util.Event.addListener(anchor, 'focus', this.handleclick, this, true);			
				li.appendChild(anchor);
				
				//Appending all the other elements in header if vertical tabs
				for (var k = 0; k < card._children.length; k++) {
					anchor.appendChild(card._children[k]);
				}				
				
				ol.appendChild(li);
				this.tabs[i] = li;
				this.tabs[i]._card = card;
				
				card._tab = li;
				li._card = card;
				anchor._tab = li;
				anchor._card = card;
			}
			YAHOO.util.Dom.addClass(ol.firstChild, "first");
			YAHOO.util.Dom.addClass(ol.lastChild, "last");
			
			this.cards[0].parentNode.insertBefore(ol, this.cards[0]);
		}
		
		this.showcard();		
	},
	
	/**
	* Handles a tab being clicked
	*/
	handleclick : function(evt) {
		evt = window.event || evt;
		YAHOO.util.Event.preventDefault(evt);
		var anchor = YAHOO.util.Event.getTarget(evt);
		
		// Remove the "focus" dotted border around the anchor
		if(evt.type == "click"){
			anchor.blur();
		}
		
		this.selected = anchor._card;
		this.showcard();
	},
	
	/**
	* Show a card in the stack, and hide the last one.
	*/
	showcard : function() {
	
		// No new selection
		if (!this.selected || this.selected == this._previous) {
			return true;
		}
		
		// Hide previous
		if (this._previous && this._previous != this.selected) {
			YAHOO.util.Dom.addClass(this._previous, "accessAid");
			YAHOO.util.Dom.removeClass([this._previous, this._previous._tab], "top");
			
			YAHOO.util.Dom.removeClass(this.tabs, "previous");
			YAHOO.util.Dom.removeClass(this.tabs, "next");
		}
		
		// Show new
		this._previous = this.selected;
		YAHOO.util.Dom.addClass([this.selected, this.selected._tab], "top");
		YAHOO.util.Dom.removeClass(this.selected, "accessAid");
		
		//If using vertical tabs set the "previous/next" class for tabs around selected
		if (this.vertical) {
			var tab = this.selected._tab;
			if(tab.previousSibling){
				YAHOO.util.Dom.addClass(tab.previousSibling, "previous");
			}
			if(tab.nextSibling){
				YAHOO.util.Dom.addClass(tab.nextSibling, "next");
			}
		}		
	}
};

// Initialize the cardstacks on the page
YAHOO.util.Event.addListener(window, "load", function(){
	var cardstacks = YAHOO.util.Dom.getElementsByClassName("cardstack", "div", document);
	for(var i = 0; i < cardstacks.length; i++){
		new PAYPAL.widget.CardStack(cardstacks[i]);
	}
});
YAHOO.util.Event.addListener(window,'load',PAYPAL.util.getMultipleSubmitForms);

/**
* Flash based tools
*/

PAYPAL.namespace("util");

/**
* Flash tools
*/
PAYPAL.util.Flash = {
	/**
	* Insert a flash video if supported or an image if not.
	* @param {String} flash The flash movie URL
	* @param {int} width The width of the flash movie
	* @param {int} height The height of the flash movie
	* @param {String|DomNode} target The element (or ID of the element) to place the flash movie in.
	* @param {Boolean} replace Set to TRUE to replace the target content.  If FALSE, it will append to target.
	* @param {int} minVer The minimum flash version supported for this movie
	* @param {String} id The ID to place on the object tag
	* @param {Boolean} useNonStandard Use a non-standard HTML rendering. This is for including the <embed> tag so that Mozilla will correctly reference the flash object. Requires Platform team approval.
	* @return {Object} A reference to the flash object that was output to the page
	*/
	insertFlash : function(flash, width, height, target, replace, minVer, id, useNonStandard, flashVars){
		
		// Get target
		if(typeof target == "string"){
			target = document.getElementById(target);
		}
		if(!target){
			return false;
		}
		
		// Doesn't match version requirement
		var ver = this.getVersion();
		if(ver == 0 || ver < parseInt(minVer)){
			return false;
		}		
		
		if (typeof id != 'string') {
			id = YAHOO.util.Dom.generateId('','flashmovie');
		}

		// Default use of non-standard HTML to false
		if (typeof useNonStandard != 'boolean') {
			useNonStandard = false;
		}
	
		// Create object
		var objectHtml = "";
		if(navigator.userAgent.match(/msie/i) != null || useNonStandard){
			objectHtml += '<object width="'+ width +'" height="'+ height +'" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" id="' + id + '">';
		}
		else {
			objectHtml += '<object width="'+ width +'" height="'+ height +'" data="https://www.paypal.com/fr/cgi-bin/'+%20flash%20+'" type="application/x-shockwave-flash" id="' + id + '">';
		}
		
		// Parameters		
		objectHtml += '<param name="movie" value="'+ flash +'"></param>'+
						'<param name="wmode" value="transparent"></param>'+
						'<param name="quality" value="high"></param>'+
						'<param name="menu" value="false"></param>'+
						'<param name="allowScriptAccess" value="always"></param>';
		if(flashVars){
			objectHtml += '<param name="FlashVars" value="'+ flashVars +'"></param>';
		}
	
		// Embed tag
		if (useNonStandard) {
			objectHtml += '<embed src="https://www.paypal.com/fr/cgi-bin/'+flash+'" quality="high" width="'+width+'" height="'+height+'" name="'+id+'" allowScriptAccess="always" type="application/x-shockwave-flash" pluginspage="http://www.adobe.com/go/getflashplayer"'
			if(flashVars){
				objectHtml += ' flashvars="'+ flashVars +'"';
			}
			objectHtml += '>'
		}
		
		objectHtml += '</object>';
		
		if(replace){
			target.innerHTML = objectHtml;
		}
		else{
			target.innerHTML += objectHtml;
		}
		
		return this.getFlashMovieObject(id);
	},
	/**
	 * Returns an object reference to the Flash movie. This is necessary
	 * for any page that wants to communicate with the movie via script.
	 * @return {Object} Object reference to flash movie in DOM
	 */
	getFlashMovieObject : function(movieName) {
		try {
			if (document.embeds && document.embeds[movieName]) {
				return document.embeds[movieName];
			} else if (window.document[movieName]) {
				return window.document[movieName];
			}
		}
		catch (e) {
			return document.getElementById(movieName);
		}		 
	},
	
	/**
	* Gets the current major version of flash installed.
	* The minimum version this will find is 3.x.
	* @return {Number} Version number or zero if it cannot be detected.
	*/
	getVersion : function(){
		var flash;
		var i = 3;
		var ver = 0;
		
		// From navigator object
		if(navigator.plugins && navigator.mimeTypes.length){
			flash = navigator.plugins["Shockwave Flash"];
			if(flash){
				ver = parseInt(flash.description.replace(/[^0-9.]/g, ""));
			}
		}
		
		// Internet Explorer
		else{
			flash = true;
			while(flash){
				try{
					flash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+ i);
					ver = i;
					i++;
				}catch(e){
					break;
				}
			}
		}
		
		return ver;
	}
	
}

/**
 * History manager to allow back and forward navigation for Javascript interactions. 
 *
 * Usage: 
 *		PAYPAL.util.HistoryManager.init();
 *		PAYPAL.util.HistoryManager.add('name', function() {}, this);
 *
 * @author Jeff Harrell
 */

PAYPAL.util.HistoryManager = {

	historyStack: [],
	current: null,
	interval: null,
	iframeObj: null,
	iframeName: '_historyManager',
	
	
	/**
	 * Initializes the history manager and starts watching for changes
	 */
	init: function() {
		// IE won't populate/recognize history from fragments so use an iframe
		if (window.attachEvent && !window.opera) {
			if (!(this.iframeObj = document.getElementById(this.iframeName))) {
				this.iframeObj = document.createElement('iframe');
				this.iframeObj.setAttribute('id', this.iframeName);
				this.iframeObj.style.display = 'none';
			
				document.body.appendChild(this.iframeObj);

				// since we just created this iframe have it create it's inital history entry
				this.updateFragment('#');
				
				// force the callback if this is a bookmarked state
				if (window.location.hash) {
					this.updateState(window.location.hash.substr(1));
				}
			}
		}
		
		this.watch();
	},
	

	/**
	 * Polling function which runs the callback if the fragment has changed
	 *
	 * @private
	 */
	watch: function() {
		var fragment;
		var self = this;
		
		this.interval = window.setInterval(function() {
			if (self.iframeObj) {
				fragment = self.iframeObj.contentWindow.document.location.hash.substr(1);
			} else {
				fragment = window.location.hash.substr(1);
			}
			
			if (fragment != self.current) {
				self.updateState(fragment);
			} 
		}, 100);
	},



	/**
	 * A wrapper for code to be added as a new history state. If the namespace passed is
	 * "test" it will be the first state and the following will be "test-2", "test-3", etc.
	 *
	 * @param namespace {String}	The name of the history to add to 
	 * @param fn {Funtion}		A callback function for this state
	 * @param obj {Object}		An object which will be passed along as 'this' in the callback
	 */
	add: function(namespace, fn, obj) {
		// history added with no namespace is run when there is no fragment (usually the default state)
		namespace = namespace || this.iframeName;

		if (!this.historyStack[namespace]) this.historyStack[namespace] = [];
		
		var loc = this.historyStack[namespace].push({ 'obj' : obj, 'fn' : fn });
		var fragment = (loc > 1) ? namespace + '-' + loc : namespace;

		return fragment;
	},
	

	/**
	 * Similar to add(), but will also run the code as it parses it
	 *
	 * @param namespace {String}	The name of the history to add to 
	 * @param fn {Funtion}		A callback function for this state
	 * @param obj {Object}		An object which will be passed along as 'this' in the callback
	 */	
	addAndRun: function(namespace, fn, obj) {
		var fragment = this.add(namespace, fn, obj);
		this.updateFragment(fragment);
	},


	/**
	 * Updates the current fragment in the browser
	 *
	 * @param fragment {String}	The value of the URL fragment
	 * @private
	 */
	updateFragment: function(fragment) {
		if (!fragment) return;
		
		if (this.iframeObj) {
			this.iframeObj.contentWindow.document.open();
			this.iframeObj.contentWindow.document.close();
			this.iframeObj.contentWindow.document.location.hash = fragment;
			
			// IE causes an empty history state if the fragment is updated with the 
			// id of an object on the page; don't update the frament in this case.
			if (fragment != '#' && !document.getElementById(fragment)) {
				window.location.hash = fragment;
			}
		} else {
			window.location.hash = fragment;
		}
	},
	

	/**
	 * Parses the fragment and runs the callback
	 *
	 * @param fragment {String}	The value of the URL fragment
	 * @private
	 */
	updateState: function(fragment) {
		this.current = fragment;
		
		// pieces[0] is the namespace, pieces[1] is the index
		var pieces = fragment.split('-');
		// normalize the index number
		pieces[1] = (isNaN(pieces[1])) ? 0 : pieces[1] - 1;
		
		this.callback(pieces[0], pieces[1]);
		
	},


	/**
	 * Runs the function associated with the provided history location.
	 * If no namespace is passed then all default actions will be run.
	 *
	 * @param namespace {String}	The name of the history state
	 * @param loc {Integer}		The index in the parent namespace
	 * @private
	 */
	callback: function(namespace, loc) {			
		var states = [];
		
		// if the namespace is blank then call all of the blank history states
		if (namespace == '') {
			states = this.historyStack[this.iframeName];
		// otherwise call all of the history states for this namespace
		} else if (this.historyStack[namespace] && this.historyStack[namespace][loc]) {
			states.push(this.historyStack[namespace][loc]);
		}
		
		for (var x in states) {
			if (typeof states[x].fn == 'function') {
				states[x].fn.call(states[x].obj);
			}
		}
	}

}



/*
* Author: Bryan Spears <bspears@paypal.com>
* 
* Three things are needed to make this function work

* 1 - The div(s) you would like to hide need to have the class name 'hideShow' and a unique ID
* 2 - The links (anchor tags) to hide them need to have a href that is '#<ID of div to hide>'
* 		e.g. If the div has an ID of 'sillyDiv' then the href of the anchor to hide/show the div needs to be '#sillyDiv'
* 3 - If you want something other than the original link(s) to hide the div, 
*		lets say a cancel button or link, then give the canceling element(s) the class 'hideShow.' 
*  		This works as long as the element(s) is/are inside the div
* 
* Optional:
* 
* + If you'd like for the div to be open by default on page load, add the class "opened" to the divs class attribute. 
* 	e.g. class="hideShow opened"
* + If you'd like for the controlling anchor to be hidden while the div is open, add the class "opened" and 
*	some CSS like the following:
* 
* 		#myForm a.opened { position: absolute; top: 0; left: -999em; } 
* 
* 	The classname needs to be "opened" or else the JS can't hide/show it when the container is opened/closed
* 
* 
* 	EXAMPLE
* 	
* 	<a href="#test" class="opened">Control Link</a>
* 	<div id="test" class="hideShow opened">
* 		Blah blah blah, test box.
* 		<button type="submit">Button Submit</button>
* 		<a href="#" class="hideShow:closer">Cancel Link</a>
* 	</div>
* 
* 
* Depends on YAHOO.Dom, Yahoo.Event, and PAYPAL objects/namespaces
* 
*/

PAYPAL.widget.HideShow = {

	init: function() {
		var containers = YAHOO.util.Dom.getElementsByClassName("hideShow", "div");
		var links = new Array();
		var cancelButtons = new Array();
		
		// For each div with a class of "hideShow" we have some work to do
		for ( var i = 0; i < containers.length; i++ ) {
			var div = containers[i];
			
			// Hide the container first
			if ( !(YAHOO.util.Dom.hasClass(div, "opened")) ) {
				YAHOO.util.Dom.addClass(div, "accessAid");
			}
			
			// Get all links where the href is '#<ID of the div>'
			links = YAHOO.util.Dom.getElementsBy(function(elem){
				return (elem.getAttribute("href") == "#"+ div.id)
			}, "a");
			div.hideShowLinks = links;
			
			// We need to get all the objects to be used as "cancel buttons"
			cancelButtons = YAHOO.util.Dom.getElementsByClassName( "hideShow:closer", "*", div );
			
			// Setup links and closers
			for ( var j = 0; j < links.length; j++ ) {
				links[j].hideShowContainer = div;
				YAHOO.util.Event.addListener(links[j], 'click', this.toggleHideShow);
				
				// Is container opened
				if (YAHOO.util.Dom.hasClass(div, "opened")) {
					YAHOO.util.Dom.addClass(links[j], "opened");
				}
			}
			for ( var k = 0; k < cancelButtons.length; k++ ) {
				cancelButtons[k].hideShowContainer = div;
				YAHOO.util.Event.addListener(cancelButtons[k], 'click', this.toggleHideShow);
			}
		}
	},
	
	toggleHideShow : function(e) {
		YAHOO.util.Event.preventDefault(e);
		var anchor = this;
		var div = anchor.hideShowContainer;
		
		// Hide
		if ( YAHOO.util.Dom.hasClass(div, "opened") ) {
			YAHOO.util.Dom.addClass(div, "accessAid");
			YAHOO.util.Dom.removeClass(div, "opened");
			
			// Update links
			for ( var i = 0; i < div.hideShowLinks.length; i++ ) {
				YAHOO.util.Dom.removeClass(div.hideShowLinks[i], "opened");
			}
			
			// Change "submit" types to harmless disabled inputs and set element.wasSubmit=true
			var buttons = YAHOO.util.Dom.getElementsBy( function(elem) { 
				if(elem.type == "submit") {
					elem.disabled = true;
					elem.wasSubmit = true;
				}
				return false;
			}, "*", div);
		}
		// Show
		else {
			YAHOO.util.Dom.removeClass(div, "accessAid");
			YAHOO.util.Dom.addClass(div, "opened")
			
			// Update links
			for ( var i = 0; i < div.hideShowLinks.length; i++ ) {
				YAHOO.util.Dom.addClass(div.hideShowLinks[i], "opened");
			}
			
			// Change them buttons back to submits
			var buttons = YAHOO.util.Dom.getElementsBy( function(elem) { 
				if(elem.wasSubmit){
					buttons[i].disabled = false;
					buttons[i].wasSubmit = false;
				}
			}, "*", div);
		}
		return false;
	}
}

YAHOO.util.Event.addListener(window, "load", PAYPAL.widget.HideShow.init, PAYPAL.widget.HideShow, true)
