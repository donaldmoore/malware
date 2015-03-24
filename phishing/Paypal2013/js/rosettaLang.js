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
		YAHOO.util.Event.addListener(form.rosetta_dropdown, "click", function(){ this.clicked = true });
		YAHOO.util.Event.addListener(form.rosetta_dropdown, "change", function(){ 
		if(this.clicked){
			this.form.submit();
			}
		});
			
		/* Submit when the "Enter" key is pressed */
		
		YAHOO.util.Event.addListener(form.rosetta_dropdown, "keypress", function(evt){ 
			if(YAHOO.util.Event.getCharCode(evt) == 13){
			this.form.submit();
			}
		});
	}
		
	YAHOO.util.Event.onContentReady("rosetta", loadRosettaMenu);