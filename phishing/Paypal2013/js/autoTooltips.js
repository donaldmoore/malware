/**
* @fileoverview
* When you include this file on your page it will automatically
* convert all anchor tags with a title attribute and the class 'auto-tooltip'
* to using our custom tooltips UI.
*
* @requires YAHOO.widget.Tooltip, YAHOO.util.Dom, YAHOO.util.Event
*/


/**
 * Automatically go through the anchors on the page to add a
 * stylized look to the tooltips
 */
var balloonCallout = function(){

	// Make static
	return {

		/**
		* Initializes object and anchors on the page
		*/
		init : function(){

			// Tooltips
			var tt = [];
			var elems = YAHOO.util.Dom.getElementsByClassName("autoTooltip", null, document);
			for(var i = 0; i < elems.length; i++){
				tt[i] = new YAHOO.widget.Tooltip("autoTooltip"+ i, { context: elems[i], 
																		 preventoverlap: true,
                                                                         showdelay: 0,
																		 autodismissdelay: 10 * 1000,
																		 effect:{effect:YAHOO.widget.ContainerEffect.FADE,duration:0.25} });
				tt[i].align(YAHOO.widget.Overlay.BOTTOM_LEFT, YAHOO.widget.Overlay.TOP_LEFT);

				tt[i].beforeShowEvent.subscribe(balloonCallout.adjustPosition, { context: elems[i], tooltip: tt[i] });
			}
			
			// Balloon Callouts
			var id, dl;
			var callout = [];			
			elems = YAHOO.util.Dom.getElementsByClassName("balloonCallout", "a", document);
			for(var i = 0; i < elems.length; i++){
				id = elems[i].href;
				if(id.indexOf("#") > -1){
					id = id.split("#")[1];
					dl = document.getElementById(id);
					if(dl){
						callout[i] = new YAHOO.widget.Tooltip("balloonCallout"+ i, { context: elems[i] } );
						callout[i].align(YAHOO.widget.Overlay.BOTTOM_LEFT, YAHOO.widget.Overlay.TOP_LEFT);
						callout[i].setBody("<dl class="+ dl.className +">"+ dl.innerHTML +"</dl>");
						callout[i].render(document.body);
						YAHOO.util.Dom.addClass(callout[i].element, "ttBalloonCallout");

						callout[i].beforeShowEvent.subscribe(balloonCallout.adjustPosition, { context: elems[i], tooltip: callout[i] });
					}
				}
			}

		},

		/**
         * Sets the position static to the context element and
         * adds the ttPosOver/ttPosUnder class to the tooltip
         * @param {String} type The custom event type 'onShow'
         * @param {Array} args Custom event fire args
         * @param {Object} elems An object containing the tooltip and
         *        context (anchor, span, etc) objects
		 */
		adjustPosition : function(type, args, elems){
			var tt = elems.tooltip.element;
			var context = elems.context;
			
			// Tooltip is above the context element
			if(YAHOO.util.Dom.getY(tt) < YAHOO.util.Dom.getY(context)){
				YAHOO.util.Dom.addClass(tt, "ttPosOver");
				YAHOO.util.Dom.removeClass(tt, "ttPosUnder");
				 
				YAHOO.util.Dom.setY(tt, YAHOO.util.Dom.getY(context) - tt.offsetHeight);
			}

			// Tooltip is under the context element
			else{
				YAHOO.util.Dom.addClass(tt, "ttPosUnder");
				YAHOO.util.Dom.removeClass(tt, "ttPosOver");
				
				YAHOO.util.Dom.setY(tt, YAHOO.util.Dom.getY(context) + context.offsetHeight + 5);
			}
			 
			// Set static position relative to context
			YAHOO.util.Dom.setX(tt, YAHOO.util.Dom.getX(context) - 10);
		},

		/**
         * Hide balloon callout <dl> boxes.
         * This is done here to support JS and non-JS browsers
         */
		jsEnabled : function(){
			 var css = document.styleSheets; 
			 for(var i = 0; i < css.length; i++){
				 if(css[i].href.indexOf("balloonCallouts.css") > -1){
					 if(css[i].addRule){
						 css[i].addRule(".footnotes dl.balloonCallout", "display: none;");
						 css[i].addRule(".footnotes h2", "display: none;");
					 }
					 else if(css[i].insertRule){
						 css[i].insertRule(".footnotes dl.balloonCallout { display: none; }", 0);
						 css[i].insertRule(".footnotes h2 { display: none; }", 0);
					 }
				 }
			 }

		}

	};
}();

balloonCallout.jsEnabled();
YAHOO.util.Event.addListener(window, "load", balloonCallout.init);