function showHide(obj,action){
	var obj = arguments[0];
	var action = arguments[1];
	obj = document.getElementById(obj);
	if(arguments.length == 1){
		if(document.layers)
			var display = obj.style.visibility ? 'show' : 'hide';
		else
			var display = obj.style.display ? '' : 'none';
		obj.style.display = display;	
	} else {
		if(obj)
		{
		if(document.layers){		
			if (action == 'show')
				obj.style.visibility='show';
			else		
				obj.style.visibility='hide';
		}else{			
			if (action == 'show')
				obj.style.display='';
			else		
				obj.style.display='none';
		}		
		}		
	}
}
	
function checkLPImage(timesChecked){	
	if(document.getElementById('TR_LP_BTTN') != null){
		t = timesChecked + 1;
		var imgLoadTimeout = 30; // seconds
		var imgCheck = 1; 		 // seconds
		// if the reponline image is not loaded hide chat module.
		// only execute on first call to function.
		if(timesChecked == 0 && document.getElementById('hcDynamicIcon').src.indexOf('reponline') == -1){
			showHide('TR_LP_BTTN','hide');
		}
	
		if(document.getElementById('hcDynamicIcon').src.indexOf('transparent') > -1){
			if(t <= imgLoadTimeout){
				// if the transparent image is returned and within timeout range check again for final image in x seconds.
				setTimeout('checkLPImage(t)',imgCheck*1000);
			}
		}else{
			if(document.getElementById('hcDynamicIcon').src.indexOf('reponline') > -1){
				// if the reponline image is returned display the module otherwise do nothing and leave chat module hidden.
				showHide('TR_LP_BTTN','show');
			}
		}
	} else {
		return void(0);
	}
}