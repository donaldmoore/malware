function loadRosettaMenu(){
	var form = this;
		
	// Hide button
	var btn = YAHOO.util.Dom.getElementsBy(function(elem){ 
		return (elem.type == "submit")
	}, "button", form); 
			
	if(btn.length > 0){
		YAHOO.util.Dom.addClass(btn[0], "accessAid");
	}
			
	// Only handle onchange if the menu was clicked -- this keeps it accessible
	YAHOO.util.Event.addListener(form.rosetta_dropdown, "mousedown", function(){ this.clicked = true });
	YAHOO.util.Event.addListener(form.rosetta_dropdown, "change", function(){ 
		if(this.clicked){
			this.form.submit();
		}
	});
		
	// Submit when the "Enter" key is pressed
	YAHOO.util.Event.addListener(form.rosetta_dropdown, "keypress", function(evt){ 
		if(YAHOO.util.Event.getCharCode(evt) == 13){
			this.form.submit();
		}
	});
}
		
YAHOO.util.Event.onContentReady("rosetta", loadRosettaMenu);


PAYPAL.namespace("rosettaRetrofit");

PAYPAL.rosettaRetrofit.Flash = {

flashcallDynamicHeight: function(widgetStatus) {
	
	var flashReference = document.getElementById("rosettaFlashId");
	if(widgetStatus == 'open') {
		flashReference.height = 200;
	}
	if(widgetStatus == 'close') {
		flashReference.height = 70;
	}
},
flashcallToSubmit: function(jsArg)  {	
    document.getElementById("rosetta").appendChild(PAYPAL.rosettaRetrofit.Flash.createRosettaFields(PAYPAL.rosettaRetrofit.Flash.formreference.name,jsArg));
    document.getElementById("rosetta").appendChild(PAYPAL.rosettaRetrofit.Flash.createRosettaFields('change_locale.x','1'));
	if(PAYPAL.rosettaRetrofit.Flash.formContextHidden) {
		document.getElementById("rosetta").appendChild(PAYPAL.rosettaRetrofit.Flash.createRosettaFields(PAYPAL.rosettaRetrofit.Flash.formContextHidden.name,PAYPAL.rosettaRetrofit.Flash.formContextHidden.value));
    }
	document.getElementById("rosetta").submit();
},
closeWidget: function(e) {
	var flashReference = document.getElementById("rosettaFlashId");
	if(flashReference){
		if(e.target){
			if(e.target.id != "rosettaFlashId") {			
				flashReference.clearPD();
			}
		}
		else {	
			flashReference.clearPD();
		}
	}
},
stringFromRosettaDropDown: function() {	
	var formid = document.getElementById("rosetta");
	if (formid) {
		var strToFlash = "lang_Array=";	
		if(formid["locale.x"]) {
			this.formreference = formid["locale.x"];
		}
		else {
			this.formreference = formid["user_locale.x"];
		}
		var frmOptions = this.formreference.options;
		for (j = 0; j < frmOptions.length; j++) {
			strToFlash += frmOptions[j].text+","+frmOptions[j].value;
			if(j < frmOptions.length-1){
				strToFlash += "|";
			}
		}		
		var hostPageUrl = window.location.href;		
		var domainExp = /^https?:\/\/(.*?)\.paypal\.(com|co\.uk|de|au|fr|ch|com\.hk|com\.mx)(.*?)/i;
		var checkDomain = domainExp.test(hostPageUrl);
		strToFlash += "&selIndex="+this.formreference.selectedIndex;
		if(checkDomain) {
			strToFlash += "&allowAccess=yes";
		}
		if(formid["CONTEXT"]) {
			this.formContextHidden = formid["CONTEXT"];
        }
		return strToFlash;
	}	
},
createRosettaFields: function(htmlElementName,htmlElementValue) {
    var createId = document.createElement("input");
    createId.type = "hidden";
    createId.name = htmlElementName;
    createId.value = htmlElementValue;
    return createId;
}
}
YAHOO.util.Event.addListener(document,'click',PAYPAL.rosettaRetrofit.Flash.closeWidget);
YAHOO.util.Event.onContentReady("rosettaFlashId", function() {document.getElementById("rosettaFlashId").style.outline = 0;});
