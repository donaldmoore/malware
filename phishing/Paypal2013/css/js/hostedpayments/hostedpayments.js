/* ------------------------------------------------------------------------------- 
   Window naming function to establish unique names.
   Replace dashes with underscores.
------------------------------------------------------------------------------- */
function windowNamer(thisURL) { 
   var name = 'popupWin_';
   var hash=0;
   for( i=0 ; i<thisURL.length ; i++){ hash+=thisURL.charCodeAt(i);}
   name += hash;
   return(name);
}

function openWindowWH(thisURL,thisW,thisH) {
   internalArgs = 'scrollbars,resizable,toolbar,status,left=50,top=50,width=' + thisW + ',height=' + thisH;       
   openWindow(thisURL,'popupWinWH',internalArgs);                                                                 
} 

function openWindow(internalURL,internalName,internalArgs) {
	if (internalURL == null || internalURL == '') {
		exit;
	}
	if (internalName == null || internalName == '') {
		internalName = 'popupWin';
	}
	if (internalArgs == null || internalArgs == '') {
		internalArgs = 'scrollbars,resizable,toolbar,status,width=640,height=480,left=50,top=50';
	}
	popupWin = window.open(internalURL,internalName,internalArgs);
 	popupWin.focus();
}

 function openWindowATC(thisURL,thisType,thisWidth,thisHeight,thisArgs,thisName) {
   if (thisType != '') {
      switch (thisType) {
         case 'demo':
            openWindowDemo(thisURL);
            break;
         case 'demosmall':
            openWindowDemo(thisURL);
            break;
         case '640':
            openWindow640(thisURL);
            break;
      }
   } else {
      if ((thisWidth != '') && (thisHeight != '')) {
         openWindowWH(thisURL,thisWidth,thisHeight);
      } else {
         openWindow(thisURL,thisName,thisArgs);
      }
   }                                                                                                              
} 

function openWindow640(thisURL) {
   openWindow(thisURL,'popupWin640','');
}

/*          
 * China Address: Select City based on State change
 */   
function putState()     {
  if (YAHOO.util.Dom.get("trigger_putState_CN_only")){
        var city = document.getElementById('shipping_city');
        var state = document.getElementById('shipping_state');
        var addr1 = document.getElementById('shipping_address1');

        if( !( city && state && addr1 )) return;

        txt = state.options[state.selectedIndex].text;

        if( state.selectedIndex == 1 ||
                 state.selectedIndex == 2 ||
                 state.selectedIndex == 3 ||
                 state.selectedIndex == 4 ||
                 state.selectedIndex == 33 ||
                 state.selectedIndex == 34 ) {
                        city.value = txt;
                        city.readOnly = true;
                        addr1.focus();
        } else {
                city.readOnly = false;
                city.value = "";
                city.focus();
        }
  }
}
   
function submitFormContainingField( formElementName, newValue ){
	var formIndex = FORM_INDEX_UNKNOWN = -1;
     
    for( var i = 0; i < document.forms.length; ++i ){
    	if( formIndex != FORM_INDEX_UNKNOWN ){ break; }
        for( var j = 0; j < document.forms[i].elements.length; ++j ){
        	if( document.forms[i].elements[j].name == formElementName ){
                     formIndex = i;
                     break;
            }
         }
	}
    if( formIndex != FORM_INDEX_UNKNOWN ){
    	//eval( 'document.forms[' + formIndex + '].' + formElementName ).value = newValue;
        //document.forms[formIndex].submit();
     
        return formIndex;
    }
}

/**
 * Quick fix for PPSCR00523682
 * dfltButton is needed when JS is disabled. 
 *
YAHOO.util.Event.addListener(window, 'load', function() {
	if (document.getElementById('dfltButton')) {
		var btn = document.getElementById('dfltButton');
		btn.parentNode.removeChild(btn);
	}
});*/
/* 18021 - display rewards tiers and update tracking var */
var trackView = function() {
	try {
		document.getElementById('rewards_tiers_views').value = 1;
	} catch(e) {};
}
YAHOO.util.Event.addListener(window,'load',function() {
		if (document.getElementById('currentfunding') && document.getElementById('switchnow')) {
			var switchRadio = document.getElementById('switchnow');
			var currentRadio = document.getElementById('currentfunding');
			currentRadio.previouslyChecked = currentRadio.checked;
			switchRadio.previouslyChecked = switchRadio.checked;
			YAHOO.util.Event.addListener([currentRadio,switchRadio],'click',switchNow);
		}
		if (document.getElementById('rewardsCallout')) {
			try {
				document.getElementById('rewardsCallout')._balloon.showEvent.subscribe(trackView);
			} catch(e) {}
		}
	});
var switchNow = function() {
	if (this.previouslyChecked != this.checked) {
		this.form.submit();
	}
}

/**
    * Hide shipping section for non-referenced credit
    */
    PAYPAL.namespace("merchant.initiateCapture");
	
    PAYPAL.merchant.initiateCapture.hideShow = function(event){
	YAHOO.util.Event.preventDefault(event);
	YAHOO.util.Dom.replaceClass("initiateCapture", "toggleOpen", "toggleClose");
}
YAHOO.util.Event.addListener("initiateCaptureControl", "click", PAYPAL.merchant.initiateCapture.hideShow);

YAHOO.util.Event.addListener(window,'load',function() {
	if(YAHOO.util.Dom.get('leftSideBox') && YAHOO.util.Dom.get('control')) {
		var leftContainer = YAHOO.util.Dom.get('leftSideBox');
		leftContainerHeight = leftContainer.offsetHeight - 10;
		YAHOO.util.Dom.get('control').style.height=leftContainerHeight + "px";
	}
});
