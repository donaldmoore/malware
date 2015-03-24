/** defining namespace as "browserscript"
*/
PAYPAL.namespace("browserscript");


/**
* dataBrowser and dataOS below are JS literal arrays. They store all possible Browsers and OS names respectively.
* Note the order of the array elements can also be change - order independent
*/


/**
 * Description of the array variable
 * string - This holds the regular expressions for the userAgent string  
 * identity - This carries the name of browsers/OS which is embedded in forms as hidden fields
 * In simple terms test for the regular expresssion (string) in useragent string. If true return the identity.
 * versionSearch - For many browsers, the version will follow the name in the navigator.userAgent string
 *				   For some browsers it will not follow the name but will follow some string. This is named as
				   versionSearch for those browsers
**/


PAYPAL.browserscript.dataBrowser = [

	{
		string: /.*?\(.*?\).*?(Apple).*?(Safari)\/.*?/i,
		identity: "Safari"
	},
	{
		string: /^Mozilla.*?\(.*?(Konqueror)\/([0-9\.]*).*?\).*?/i,
		identity: "Konqueror"
	},
	{
		string: /^Mozilla.*?\(.*?(rv).*?\).*?Gecko\/[0-9]*$/,
		identity: "Mozilla",
		versionSearch: "rv"
	},
	{
		string: /^Mozilla.*?\(.*?(rv).*?\).*?Netscape\/[0-9\.]*/,
		identity: "Netscape"
	},
	{
		string: /^(Opera)\/([0-9\.]*) \(([a-z]*)/i,
		identity: "Opera"
	},
	{
		string: /.*?\(([a-z]*).*? (Firefox)\/([0-9\.]*)$/i,
		identity: "Firefox"
	},
	{
		string: /.*?\(.*?MSIE.*?\)$/i,
		identity: "Microsoft Internet Explorer",
		versionSearch: "MSIE"
	}
];

PAYPAL.browserscript.dataOS = [

	{
		string: /Win32/,
		identity: "Windows"
	},
	{
		string: /Mac/,
		identity: "Mac"
	},
	{
		string: /Linux/,
		identity: "Linux"
	}
];

/**
* Retrieves browser name, version and OS - Master function
* Accepts no parameters
* Returns no data
* sets the variables browsername, browserversion and OSName
*/

PAYPAL.browserscript.getClientDetails = function() {	
	
	this.browserversion = this.browserVersion(navigator.userAgent);
	this.OSName = this.browserOS(this.dataOS);
}
/**
* Returns browser name that is passed to backend
* 
* @param literal array dataBrowser This contains object property pairs
* 
* Runs the elements of the array in loop and tries the match for regular expression
* to be present in navigator.userAgent
* 
* Also sets the versionSearchString to be used in function browserVersion for the returned browser.
* @returns {string} name of the browser.
*/

PAYPAL.browserscript.browserName = function(data) {
		
	for(var i = 0;i < data.length; i++) {		

		var dataString = data[i].string;
		if(dataString.test(navigator.userAgent) == true) {

			this.versionSearchString = data[i].versionSearch || data[i].identity;
			this.browsername = data[i].identity;			
		}			
	}
	
}

/**
* Returns OS name that is passed to backend
* 
* @param literal array dataOs This contains object property pairs
* 
* Runs the elements of the array in loop and tries the match for regular expression
* to be present in navigator.platform
* 
*/

PAYPAL.browserscript.browserOS = function(data) {
		
	for(var j = 0;j < data.length; j++) {
		if(data[j].string.test(navigator.platform) == true) {				
			return data[j].identity;
		}			
	}
}

/**
* Returns browser version withe the user of versionSearchString set in above fn
* 
* @param datastring {string} navigator.userAgent
* 
* Also sets the versionSearchString to be used in function browserVersion for the returned browser.
* @returns {float} version of the browser.
*/

PAYPAL.browserscript.browserVersion = function(datastring) {

	var index = datastring.indexOf(this.versionSearchString);
	if (index == -1) {
		return;
	}
	return parseFloat(datastring.substring(index+this.versionSearchString.length+1));
	
}

PAYPAL.browserscript.browserName(PAYPAL.browserscript.dataBrowser);
PAYPAL.browserscript.getClientDetails();

/*
  The function below creates the needed hidden variables on the fly
  and assigns them the value detected earlier
* Returns the Object ID of the hidden variable that needs to be appneded to the
* form variables
* @param paramName {string} browsername/browserversion/osname
* @param paramValue {string|float} value of browsername/browserversion/osname
* @returns createId {object} JS object for the input hidden element.
*/

PAYPAL.browserscript.createHiddenFields = function(paramName,paramValue) {
	
	var createId = document.createElement("input");
	createId.type = "hidden";
	createId.name = paramName;
	createId.value = paramValue;
	return createId;
}

/**
* this loop will append the hidden variables browser_name,browser_version,operating_system
* to all the forms in a page
**/

for(var k = 0;k < document.forms.length; k++) {
	with(document.forms[k]) {				
		appendChild(PAYPAL.browserscript.createHiddenFields('browser_name',PAYPAL.browserscript.browsername));
		appendChild(PAYPAL.browserscript.createHiddenFields('browser_version',PAYPAL.browserscript.browserversion));
		appendChild(PAYPAL.browserscript.createHiddenFields('operating_system',PAYPAL.browserscript.OSName));

	}
}