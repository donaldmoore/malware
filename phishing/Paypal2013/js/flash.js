
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
	* @return {boolean} true on success.
	*/
	insertFlash : function(flash, width, height, target, replace, minVer){
		
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
		
		
		var objectHtml = "";
		if(navigator.userAgent.match(/msie/i) != null){
			objectHtml += '<object width="'+ width +'" height="'+ height +'" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000">';
		}
		else{
			objectHtml += '<object width="'+ width +'" height="'+ height +'" data="'+ flash +'" type="application/x-shockwave-flash">';
		}
		objectHtml += '<param name="movie" value="'+ flash +'"></param>'+
						'<param name="wmode" value="transparent">'+
						'<param name="quality" value="high" />'+
						'<param name="menu" value="false" />'+
						'<param name="allowScriptAccess" value="always" />'+
					'</object>';
		
		if(replace){
			target.innerHTML = objectHtml;
		}
		else{
			target.innerHTML += objectHtml;
		}
		
		return true;
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
