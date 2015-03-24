<!--
/* cmdatatagutils.js
 *
 * $Id: cmdatatagutils.js 49539 2007-03-29 18:17:12Z etowb $
 * $Revision: 49539 $
 *
 * Coremetrics Tag v4.0, 8/11/2006
 * COPYRIGHT 1999-2002 COREMETRICS, INC. 
 * ALL RIGHTS RESERVED. U.S.PATENT PENDING
 *
 * The following functions aid in the creation of Coremetrics data tags.
 * Date				Name			Desc
 * 5/17/06			Hutch White		Add Manual Link Click and Impression tags
 * 6/19/06			Eliot Towb		Changes to registration and pageviews tags for capturing custom data and appID
 * 8/11/06			Eliot Towb		Added custom error tag function
 * 10/17/2006       Eliot Towb		Updated manuallinkclicktag function to allow pageID to be set
 * 11/28/2006		Eliot Towb		Updated code to send custom form field tags for pw and select type elements
 * 1/4/2007			Nathan Glass	Added cmCreateProductDetailsTag function, updated cmCreateApplicationTag by adding pageCount parameter
 * 1/22/2007		Nathan Glass	Added cmCreateProductviewTag, and cmCreateConversionEventTag functions
 * 2/13/2007		Nathan Glass	Updated cmCreateProductviewTag by adding pageCount parameter
 * 2/13/2007		Nathan Glass	Updated cmCreateConversionEventTag by adding pageId, productID, appID, referralPageID
 * 3/2/2007			Eliot Towb		Added Touch Clarity Integration Code
 * 3/29/2007		Eliot Towb		Fixed issue with form event setup causing stack overflow error
 */
 
// TAG GENERATING FUNCTIONS ---------------------------------------------------

var cm_ClientID="90010394";
document.hitImage = new Array();
var cm_hitImageIndex = 0;
var cm_AlternateFormName = "";

function cmSetProduction() {
	cm_HOST="data.coremetrics.com/eluminate?";
}

function cmSetStaging() {
	cmSetProduction();
	cm_ClientID="90026697";
}

function cmCreateProductDetailsTag(pageID, productID, appID, origin, pid, gc, pat, sc, mc) {
	var cm = new _cm("tid","7","vn2","4.0");
	cm.li = 300;
	cm.ps1 = pageID;
	cm.ps2 = productID;
	cm.ps3 = appID;
	cm.ps4 = origin;
	cm.ps5 = pid;
	cm.ps6 = gc;
	cm.ps7 = pat;
	cm.ps8 = sc;
	cm.ps9 = mc;
	cm.writeImg();
}

function cmCreateImpressionTag(pageID, trackSP, trackRE) {
		var cm = new _cm("tid","9","vn2","4.0");
		cm.pi = pageID;
		if (trackSP){
			cm.cm_sp = trackSP;
		}
		if (trackRE){
			cm.cm_re = trackRE;
		}
		cm.st = cm_ClientTS;
        cm.writeImg();
}

function cmCreateManualLinkClickTag(href,name,pageID) {	
	if (cmCreateLinkTag == null && cM != null) {
		var cmCreateLinkTag = cM;
	}
	if (cmCreateLinkTag != null) {		
		var dt = new Date();
		cmLnkT3 = dt.getTime();
		cmCreateLinkTag(cm_ClientTS, cmLnkT3, name, href, false, pageID);
	}
}

function cmCreateCustomError(pageID, appName, appStepNumber, appStepName, errorCodes) {
	var cm = new _cm("tid", "7", "vn2", "e4.0");
	cm.li = 206;
	cm.ps1 = pageID;
	cm.ps2 = appName;
	cm.ps3 = appStepNumber;
	cm.ps4 = appStepName;
	cm.ps5 = errorCodes;
	cm.writeImg();
}

function cmRemoveWhiteSpace(str){
	while (str.substring(0,1) == ' ') str = str.substring(1);
    while (str.substring(str.length-1,str.length) == ' ') str = str.substring(0,str.length-1);
	var check = true;
	while (check) {
		var pos = str.indexOf('  ');
		if (pos>-1){
			str = str.substring(0,pos) + str.substring(pos+1,str.length);
    	} else {
			check = false;
		}
	}
    return(str);
}

/*
 * Creates a Conversion Event tag
 *
 * eventID			: required. Conversion event ID
 * actionType		: required. 1=conversion initiation, 2=conversion completion
 * categoryID		: optional. Category for the event
 * points			: optional. Point value to assign to conversion.
 * pageID			: optional. Page ID for the page the Conversion Event is called from.
 * productID		: optional. Product ID related to the Conversion Event.
 * appID			: optional.	Application ID related to the Conversion Event.
 * referralPageID	: optional. Page ID for the page which the application was referred from.
 */
function cmCreateConversionEventTag(eventID, actionType, categoryID, points, pageID, productID, appID, referralPageID) {
	var cm = new _cm("tid", "14", "vn2", "e4.0");
	cm.cid = eventID;
	cm.cat = actionType;
	cm.ccid = categoryID;
	cm.cpt = points;
	
	//begin custom code
	cm.cx1 = pageID;
	cm.cx2 = productID;
	cm.cx3 = appID;
	cm.cx4 = referralPageID;
	//end custom code
	
	cm.writeImg();
}

/*
 * Creates a Productview Tag
 * Also creates a Pageview Tag by setting pc="Y"
 * Format of Page ID is "PRODUCT: <Product Name> (<Product ID>)"
 *
 * productID	: required. Product ID to set on this Productview tag
 * productName	: required. Product Name to set on this Productview tag
 * categoryID	: optional. Category ID to set on this Productview tag 
 *
 * returns nothing, causes a document.write of an image request for this tag.
 */
function cmCreateProductviewTag(productID, productName, categoryID, searchString, help, error, errormsg, tool, adlink, adlob, pageCount) {
	var cm = new _cm("tid", "5", "vn2", "e4.0");

	if (productName == null) {
		productName = "";
	}

	// if available, override the referrer with the frameset referrer
	if (parent.cm_ref != null) {
		cm.rf = parent.cm_ref;
		parent.cm_ref = document.URL;
	}

	// if parent had mmc variables and this is the first pageview, add mmc to this url
	if(parent.cm_set_mmc) {
		cm.ul = document.location.href + 
				((document.location.href.indexOf("?") < 0) ? "?" : "&") + 
				parent.cm_mmc_params; 
		parent.cm_ref = cm.ul;
		parent.cm_set_mmc = false;
	}

	cm.pr = productID;
	cm.pm = productName;
	cm.cg = categoryID;

	if (!pageCount && pageCount !== null && pageCount !== undefined) {
			cm.pc="N";
	}else cm.pc="Y";
	
	cm.pi = "PRODUCT: " + productName + " (" + productID + ")";

	//begin custom code
	cm.se = searchString;
	if (help) {
		cm.pv4 = "HELP";
	}
	if (tool) {
		cm.pv4 = "TOOL";
	}
	if (error) {
		cm.pv4 = "ERROR";
	}
	cm.pv5 = errormsg;
	cm.pv6 = adlink;
	cm.pv8 = adlob;

	cmFillAdStrings(cm);
	//end custom code
	
	cm.writeImg();
}

/*
 * Creates a Shop tag with Action 5 (Shopping Cart)
 *
 * productID		: required. Product ID to set on this Shop tag
 * productName		: required. Product Name to set on this Shop tag
 * quantity		: required. Quantity to set on this Shop tag
 * productPrice		: required. Price of one unit of this product
 * manufacturerID	: optional. Manufacturer ID to set on this Shop tag
 * categoryID		: optional. Category to set on this Shop tag
 *
 * returns nothing, causes a document.write of an image request for this tag.
 */
function cmCreateShopAction5Tag(productID, productName, categoryID, state, productType, singleProductFlag){

	var cm = new _cm("tid", "4", "vn2", "e3.1");
	cm.at = "5";
	cm.pr = productID;
	cm.pm = productName;
	cm.qt = "1";
	cm.bp = "1";
	if (categoryID) {
		cm.cg = categoryID;
	}
	if (productType) {
		cm.cg += ": " + productType;
	}
	if (singleProductFlag) {
		cm.sx15 = singleProductFlag;
	}
	cm.sx14 = productType;

	cm.writeImg();
}

function cmCreateShopAction5TagInMemory(productID, productName, categoryID, state, productType, singleProductFlag){

	var cm = new _cm("tid", "4", "vn2", "e3.1");
	cm.at = "5";
	cm.pr = productID;
	cm.pm = productName;
	cm.qt = "1";
	cm.bp = "1";
	if (categoryID) {
		cm.cg = categoryID;
	}
	if (productType) {
		cm.cg += ": " + productType;
	}
	if (singleProductFlag) {
		cm.sx15 = singleProductFlag;
	}
	cm.sx14 = productType;
	cm.sx3 = state;
	cm.loadImg();
}

/*
 * Creates a Shop tag with Action 9 (Order Receipt / Confirmed)
 *
 * productID		: required. Product ID to set on this Shop tag
 * productName		: required. Product Name to set on this Shop tag
 * cust_id		: required. ID of customer making the purchase
 * orderID		: required. ID of order this lineitem belongs to
 * categoryID		: optional. Category to set on this Shop tag
 *
 * returns nothing, causes a document.write of an image request for this tag.
 */
function cmCreateShopAction9Tag(productID, productName, cust_id, orderID, categoryID, cm_overdraft, cm_funding, cm_state, productType, singleProductFlag) {
	var cm = new _cm("tid", "4", "vn2", "e3.1");
	cm.at = "9";
	cm.pr = productID;
	cm.pm = productName;
	cm.qt = "1";
	cm.bp = "1";
	cm.cd = cust_id;
	cm.on = orderID;
	cm.tr = "1";
	if (categoryID) {
		cm.cg = categoryID;
	}

	cm.sx1 = cm_overdraft;
	cm.sx2 = cm_funding;
	cm.sx3 = cm_state;
	if (productType) {
		cm.cg += ": " + productType;
	}
	if (singleProductFlag) {
		cm.sx15 = singleProductFlag;
	}
	cm.sx14 = productType;
	cm.writeImg();
}

function cmCreateShopAction9TagInMemory(productID, productName, cust_id, orderID, categoryID, cm_overdraft, cm_funding, cm_state, productType, singleProductFlag) {
	var cm = new _cm("tid", "4", "vn2", "e3.1");
	cm.at = "9";
	cm.pr = productID;
	cm.pm = productName;
	cm.qt = "1";
	cm.bp = "1";
	cm.cd = cust_id;
	cm.on = orderID;
	cm.tr = "1";
	if (categoryID) {
		cm.cg = categoryID;
	}

	cm.sx1 = cm_overdraft;
	cm.sx2 = cm_funding;
	cm.sx3 = cm_state;
	if (productType) {
		cm.cg += ": " + productType;
	}
	if (singleProductFlag) {
		cm.sx15 = singleProductFlag;
	}
	cm.sx14 = productType;

	cm.loadImg();
}

/*
 * Creates an Order tag
 *
 * orderID		: required. Order ID of this order
 * orderTotal		: required. Total price/quantity (they are equal) of this order
 * orderSKUData		: required. String representation of all lineitems
 * customerID		: required. Customer ID that placed this order
 * customerState	: optional. State of Customer that placed this order
 *
 * returns nothing, causes a document.write of an image request for this tag.
 */
function cmCreateOrderTag(orderID, orderTotal, orderSKUData, cust_id, state) {
	var cm = new _cm("tid", "3", "vn2", "e3.1");
	cm.on = orderID;
	cm.tr = orderTotal;
	cm.osk = orderSKUData;
	cm.sg = "0";
	cm.cd = cust_id;
	cm.sa = state;

	cm.writeImg();
}

function cmCreateOrderTagInMemory(orderID, orderTotal, orderSKUData, cust_id, state) {
	var cm = new _cm("tid", "3", "vn2", "e3.1");
	cm.on = orderID;
	cm.tr = orderTotal;
	cm.osk = orderSKUData;
	cm.sg = "0";
	cm.cd = cust_id;
	cm.sa = state;

	cm.loadImg();
}

/*
 * Creates a Pageview tag with the given Page ID
 *
 * pageID		: required. Page ID to set on this Pageview tag
 * searchString	: optional. Internal search string enterred by user to reach
 *				  this page.
 * categoryID	: optional. Category ID to set on this Pageview tag
 *
 * returns nothing, causes a document.write of an image request for this tag.
 */
function cmCreatePageviewTag( pageID, templateName, searchString, categoryID, help, error, errormsg, tool, flash, adlink, appID, adlob ) {
	var cm = new _cm("tid", "1", "vn2", "e3.1");
	if (pageID) {
		cm.pi = pageID;
	} else {
		cm.pi = getDefaultPageID(templateName);
	}
	cm.se = searchString;
	cm.cg = categoryID;
	if (help) {
		cm.pv4 = "HELP";
	}
	if (tool) {
		cm.pv4 = "TOOL";
	}
	if (error) {
		cm.pv4 = "ERROR";
	}
	cm.pv5 = errormsg;
	cm.pv6 = adlink;
	cm.pv7 = appID;
	cm.pv8 = adlob;

	cmFillAdStrings(cm);
        // alert("Coremetrics DEBUG: category=" + categoryID + " page=" + pageID);

	// if available, override the referrer with the frameset referrer
	if (parent.cm_ref != null) {
		cm.rf = parent.cm_ref;
		parent.cm_ref = document.URL;
	}
	if (flash) {
		cm.loadImg();
	} else {
		cm.writeImg();
	}
}

/*
 * Creates a Pageview tag with the given Page ID
 *
 * pageID		: required. Page ID to set on this Pageview tag
 *
 * returns nothing, causes an in memory load of an image request for this tag.
 */
function cmCreateInMemoryPageviewTag(pageID) {
	if (pageID) {
		var cm = new _cm("tid", "1", "vn2", "e3.1");
		cm.pi = pageID;
		cmFillAdStrings(cm);
		// if available, override the referrer with the frameset referrer
		if (parent.cm_ref != null) {
			cm.rf = parent.cm_ref;
			parent.cm_ref = document.URL;
		}

		cm.loadImg();
	}
}

function cmGetAppStepName(){
	//alert(document["cmutils"].src);

	//var array = document.plugins;
	//for (var i=0;i<array.length; i++){
		//if (array[i].src.indexOf("image.cfm")>-1){
		//	alert(array[i].src);
		//}
	//}
	cmAppStepName = "test";
}

function cmGetDefaultOrderID(){
	var dt = new Date();
	var randomOrderID = Math.round(Math.random() * 1000 );
	// alert( dt.getTime()%10000000 + '' + randomOrderID );
	return dt.getTime()%10000000 + '' + randomOrderID;
}

function cmCreateFormFieldTag(appName, appStepNumber, appStepName, appCategory, fieldName){
	var cm = new _cm("tid", "7", "vn2", "e3.1");
	var dt = new Date();
	var cmRand = dt.getTime()%10000000;

	cm.li  = 2;
	cm.ps1 = appName;
	cm.ps2 = appStepNumber;
	cm.ps3 = appStepName;
	cm.ps4 = cmRand;
	cm.ps5 = fieldName;
	cm.ps6 = appCategory;


	//document.hitImage[cm_hitImageIndex] = new Image();
	//document.hitImage[cm_hitImageIndex].src = cm.getImgSrc();
	//cm_hitImageIndex++;
	cm.writeImg();

}

var cmRandom;
var cmAppName;
var cmAppStepName;
var cmAppStepNumber;
var cmAppCategory;

/*
 *  Application Tags
 */
function cmCreateApplicationTags( pageID, appName, appStepNumber, appStepName, help, error, errormsg, tool, category,
	first, last, saved, state, productID, custID, orderID, adlink, adlob, cm_overdraft, cm_funding, cm_instantDecision,
	cm_resumed, productName, productType, pageCount ) {

	cm_AlternateFormName = appName + "_" + appStepName;
	cm_AlternateFormName = cm_AlternateFormName.split(":").join("").split(";").join("");

	var cm = new _cm("tid", "1", "vn2", "e3.1");
	
	if (!pageCount && pageCount !== null && pageCount !== undefined) {
			cm.pc="N";
	}else cm.pc="Y";
	
	if (appStepName) {
		cmAppStepName = appStepName;
	} else {
		cmGetAppStepName();
	}
	if (appName) {
		appName = cmRemoveWhiteSpace(appName);
		cm.pv1 = appName;
	}
	if (pageID) {
		cm.pi = pageID;
	} else {
		cm.pi = getDefaultApplicationPageID(appName, appStepName, appStepNumber );
	}

	if (category){
		cm.cg = category;
	} else {
		category = appName + ":" + state;
		cm.cg = category;
	}

	cm.pv3 = cmAppStepName;

	if (appStepNumber) {
		cm.pv2 = appStepNumber;
	}

	if (help) {
		cm.pv4 = "HELP";
	}
	if (tool) {
		cm.pv4 = "TOOL";
	}
	if (error) {
		cm.pv4 = "ERROR";
	}
	if (errormsg) {
		cm.pv5 = errormsg;
	}
	cm.pv7 = orderID;

	//  Pass productID as comma delimited list
	if ( productID ) {

		productArray = productID.split(',');
		productNameArray = new Array();
		productTypeArray = new Array();
		if ( productName ) {
			productNameArray = productName.split(',');
		}
		if ( productType ) {
			productTypeArray = productType.split(',');
		}

		var orderSKUData = '';
		var orderTotal = 0;

	// Begin DEL by GDC Dev Team for WR13795

	//	if (!orderID) {
	//		orderID = cmGetDefaultOrderID();
	//	}

	// End DEL by GDC Dev Team for WR13795

	// Begin ADD by GDC Dev Team for WR13795
	// To prevent duplication of Order IDs in the last step of an application, set a cookie and access it whenever a new Order ID generation is not required
		// setCookie - function to set the cookie
		function setCookie(name,value,path,domain) {
			var strCookieAssign = name + "=" + escape (value) + ((path) ? "; path=" + path : "") + ((domain) ? "; domain=" + domain : "");
	  		document.cookie = strCookieAssign;
		}

		function deleteCookie(name,path,domain)
		{
		    if (getCookie(name))
		    {
		        document.cookie = name + "=" + ((path) ? "; path=" + path : "") + ((domain) ? "; domain=" + domain : "") + "; expires=Thu, 01-Jan-70 00:00:01 GMT";
		    }
		}

		// getCookie - function to get the cookie
		function getCookie (name) {
			var dcookie = document.cookie;
			var cname = name + "=";
			var clen = dcookie.length;
			var cbegin = 0;
			while (cbegin < clen) {
				var vbegin = cbegin + cname.length;
				if (dcookie.substring(cbegin, vbegin) == cname) {
					var vend = dcookie.indexOf (";", vbegin);
					if (vend == -1) vend = clen;
					return unescape(dcookie.substring(vbegin, vend));
				}
				cbegin = dcookie.indexOf(" ", cbegin) + 1;
				if (cbegin == 0) break;
			}
		return null;
		}

		if (first) {
			deleteCookie("OrderIDcookie","/",".bankofamerica.com");
		}

		if (last) {
			if (!orderID) {
				if ((getCookie ("OrderIDcookie") == undefined) || ((getCookie ("OrderIDcookie"))&&(getCookie ("OrderIDcookie") == ""))) {
					orderID = cmGetDefaultOrderID();
					setCookie("OrderIDcookie",orderID,"/",".bankofamerica.com");
				}
				orderID = getCookie ("OrderIDcookie");
			}
		}

	// End ADD by GDC Dev Team for WR13795


		for (var i=0; i < productArray.length; i++) {
			if ((first)&&(productArray[i])) {
				// alert("FIRST: " +productArray[i]);
				var tempName = appName;
				if ((productNameArray[i] != null) && (productNameArray[i] != "")) {
					tempName = productNameArray[i];
				}
				var singleProductFlag = 0;
				var tempProductType = productTypeArray[i];
				if (productTypeArray.length > 1) { singleProductFlag = 1; }
				if (!tempProductType) { tempProductType = null };
				cmCreateShopAction5Tag(productArray[i], tempName, category, state, tempProductType, singleProductFlag);
			}
			if ((last)&&(productArray[i])) {
				// alert("LAST: " + productArray[i]);
				var tempName = appName;
				if ((productNameArray[i] != null) && (productNameArray[i] != "")) {
					tempName = productNameArray[i];
				}
				var singleProductFlag = 0;
				var tempProductType = productTypeArray[i];
				if (productTypeArray.length > 1) { singleProductFlag = 1; }
				if (!tempProductType) { tempProductType = null };
				cmCreateShopAction9Tag(productArray[i], tempName, custID, orderID, category, cm_overdraft, cm_funding, state, tempProductType, singleProductFlag);
				orderSKUData = orderSKUData + '|' + productArray[i] + '|1|1|';
				orderTotal++;
			}
		}

		if ((last) && (orderSKUData)){
			// alert( '[orderSKUData=' + orderSKUData + '][custID=' + custID + '][orderTotal='
			//      + orderTotal + '][orderID=' + orderID + ']');
			cmCreateOrderTag(orderID, orderTotal, orderSKUData, custID, state);
		}
	}

	if (adlink) {
		cm.pv6 = adlink;
	}

	if (adlob) {
		cm.pv8 = adlob;
	}

	cmFillAdStrings(cm);

	// if available, override the referrer with the frameset referrer
	if (parent.cm_ref != null) {
		cm.rf = parent.cm_ref;
		parent.cm_ref = document.URL;
	}

	cm.writeImg();
	cmAppName = appName;
	cmAppStepNumber = appStepNumber;
	cmAppCategory = category;
	cmSetupApplicationTextBoxTags(category, first, last, saved, cm_overdraft, cm_funding, cm_instantDecision, cm_resumed, state, orderID);
}

function cmCreateApplicationTagsInMemory( pageID, appName, appStepNumber, appStepName, help, error, errormsg, tool, category,
	first, last, saved, state, productID, custID, orderID, adlink, adlob, productName, productType ) {

	cm_AlternateFormName = appName + "_" + appStepName;
	cm_AlternateFormName = cm_AlternateFormName.split(":").join("").split(";").join("");

	var cm = new _cm("tid", "1", "vn2", "e3.1");
	if (appStepName) {
		cmAppStepName = appStepName;
	} else {
		cmGetAppStepName();
	}
	if (appName) {
		appName = cmRemoveWhiteSpace(appName);
		cm.pv1 = appName;
	}
	if (pageID) {
		cm.pi = pageID;
	} else {
		cm.pi = getDefaultApplicationPageID(appName, appStepName, appStepNumber );
	}

	if (category){
		cm.cg = category;
	} else {
		category = appName + ":" + state;
		cm.cg = category;
	}

	cm.pv3 = cmAppStepName;

	if (appStepNumber) {
		cm.pv2 = appStepNumber;
	}

	if (help) {
		cm.pv4 = "HELP";
	}
	if (tool) {
		cm.pv4 = "TOOL";
	}
	if (error) {
		cm.pv4 = "ERROR";
	}
	if (errormsg) {
		cm.pv5 = errormsg;
	}

	//  Pass productID as comma delimited list
	if ( productID ) {

		productArray = productID.split(',');
		productNameArray = new Array();
		productTypeArray = new Array();
		if ( productName ) {
			productNameArray = productName.split(',');
		}
		if ( productType ) {
			productTypeArray = productType.split(',');
		}

		var orderSKUData = '';
		var orderTotal = 0;

		if (!orderID) {
			orderID = cmGetDefaultOrderID();
		}

		for (var i=0; i < productArray.length; i++) {
			if ((first)&&(productArray[i])) {
				// alert("FIRST: " +productArray[i]);
				var tempName = appName;
				if ((productNameArray[i] != null) && (productNameArray[i] != "")) {
					tempName = productNameArray[i];
				}
				var singleProductFlag = 0;
				var tempProductType = productTypeArray[i];
				if (productTypeArray.length > 1) { singleProductFlag = 1; }
				if (!tempProductType) { tempProductType = null };
				cmCreateShopAction5TagInMemory(productArray[i], tempName, category, state, tempProductType, singleProductFlag);
			}
			if ((last)&&(productArray[i])) {
				// alert("LAST: " + productArray[i]);
				var tempName = appName;
				if ((productNameArray[i] != null) && (productNameArray[i] != "")) {
					tempName = productNameArray[i];
				}
				var singleProductFlag = 0;
				var tempProductType = productTypeArray[i];
				if (productTypeArray.length > 1) { singleProductFlag = 1; }
				if (!tempProductType) { tempProductType = null };
				cmCreateShopAction9TagInMemory(productArray[i], tempName, custID, orderID, category, cm_overdraft, cm_funding, state, tempProductType, singleProductFlag);
				orderSKUData = orderSKUData + '|' + productArray[i] + '|1|1|';
				orderTotal++;
			}
		}

		if ((last) && (orderSKUData)){
			// alert( '[orderSKUData=' + orderSKUData + '][custID=' + custID + '][orderTotal='
			//      + orderTotal + '][orderID=' + orderID + ']');
			cmCreateOrderTagInMemory(orderID, orderTotal, orderSKUData, custID, state);
		}
	}

	if (adlink) {
		cm.pv6 = adlink;
	}

	if (adlob) {
		cm.pv8 = adlob;
	}


	cmFillAdStrings(cm);

	// if available, override the referrer with the frameset referrer
	if (parent.cm_ref != null) {
		cm.rf = parent.cm_ref;
		parent.cm_ref = document.URL;
	}

	cm.loadImg();
	cmAppName = appName;
	cmAppStepNumber = appStepNumber;
	cmSetupApplicationTextBoxTagsInMemory(category, first, last, saved);
}

/* Creates Tag to track Business Selector Tool
*/
function cmCreateToolTag(pageID, toolName, toolStepNum, toolStepName, group, category, first, last, update, prodRec) {

	cmCreatePageviewTag(pageID, null, null, category);

	var cm = new _cm("tid", "7", "vn2", "e3.1");
	cm.li  = 3;
	cm.ps1 = toolName;
	cm.ps2 = toolStepNum;
	cm.ps3 = toolStepName;
	if(group) {
		cm.ps4 = group;
	}
	cm.ps5 = category;
	if(first) {
		cm.ps6 = "FIRST";
	}
	if(last) {
		cm.ps7 = "LAST";
	}
	if(update) {
		cm.ps8 = "UPDATE";
	}
	if(prodRec) {
		cm.ps9 = prodRec;
	}

	cm.writeImg();

}

/*
 * Creates an acceptable default Page ID value to use for Pageview tags.
 */
function getDefaultPageID(templateName) {
	if (!templateName){
		templateName ="";
	}
	var cmTitle = document.title;

	var tempIndex1 = cmTitle.indexOf("Bank of America |");
	if (tempIndex1 == 0) {
		cmTitle = cmTitle.substr(17);
	} else if ( cmTitle.indexOf("Banc of America Investment Services, Inc. |") == 0 ) {
		cmTitle = cmTitle.substr(43);
	}
	if	((templateName == "interstitial : CA") || (templateName == "interstitial : OOF") || (templateName == "interstitial : NW") || (templateName == "interstitial : MODEL")){
		cmTitle = cmTitle + " :" + templateName;
	}
	else{
		cmTitle = cmTitle + " (" + templateName + ")";
	}

	return(cmTitle);
}

/*
 * PageView Tag for OnClick Events.
 */
function cmPageviewOnClick(pageID,theURL,category) {
	if (pageID && pageID != "")
    {
		var cm = new _cm("tid", "1", "vn2", "e3.1");
        cm.pi = pageID;
        if (theURL && theURL != "")
		{
        	cm.ul = theURL;
		}

		if(category) {
			cm.cg = category;
		}

	 	// if available, override the referrer with the frameset referrer
		if (parent.cm_ref != null) {
			cm.rf = parent.cm_ref;
			parent.cm_ref = document.URL;
		}

        var imgRequest = new Image();
        imgRequest.src = cm.getImgSrc();
	}
	return true;
}


/*
 * Creates an acceptable default Page ID value to use for Pageview tags.
 */
function getDefaultApplicationPageID(appName, appStepName, appStepNumber){

	// alert( "stepname: " + appStepName + " stepnum: " + appStepNumber );
	var	cmPageID = "Application: " + appName + " Step: " + appStepNumber + " (" + appStepName + ")";
	return(cmPageID);
}

/*
 * Creates a Pageview tag with the default value for Page ID.
 * Format of Page ID is "x/y/z/MyPage.asp"
 *
 * returns nothing, causes a document.write of an image request for this tag.
 */
function cmCreateDefaultPageviewTag(templateName) {
	cmCreatePageviewTag(getDefaultPageID(templateName), null, null);
}

function cmGetAdString(){
	var linkCt = document.links.length;
	var lurl;
	var i;
	var adString = "";
	var ndx;
	var ad;
	for (i = 0; i < linkCt; i++) {
		lurl = document.links[i].href;
		ndx = lurl.lastIndexOf("adlink=");
		ndx2 = lurl.lastIndexOf("/adtrack/");
		if ((ndx >= 0) && (ndx2>0)) {
			ad = lurl.substring(ndx+7, lurl.length).toLowerCase();
			if (ad.indexOf("&amp;") >= 0){
				ad = ad.substring(0, ad.indexOf("&amp;"));
			}
			adString += "|" + ad + "|";
		}
	}
	return adString;
}

/*
 *  WSuayan: Pull the stepName from Jeff Tucker's Fast Track.
 */

function cmGetQueryParam( paramName, urlString ) {
	var strValue = "";
	var ndx;

	ndx = urlString.lastIndexOf( paramName + "=" );
	if ( ndx >= 0 ) {
		strValue = urlString.substring( ndx + paramName.length + 1, urlString.length).toLowerCase();
		if ( strValue.indexOf("&") >= 0 ){
			strValue = strValue.substring(0, strValue.indexOf("&"));
		}
	}
	return strValue;
}

function cmGetStepID( urlString ){
	var stepID = "";
	var ndx;

	var stepIdName = cmGetQueryParam("page", urlString );
	ndx = stepIdName.indexOf("_");
	if ( ndx >= 0 ) {
		stepID = stepIdName.substring( 0, ndx ).toLowerCase();
	}
	return stepID;
}

function cmGetStepName( urlString ){
	var stepName = "";
	var ndx;
	var stepIdName = cmGetQueryParam("page", urlString );
	ndx = stepIdName.indexOf("_");
	if ( ndx >= 0 ) {
		stepName = stepIdName.substring( ndx + 1, urlString.length ).toLowerCase();
	} else {
		stepName = stepIdName;
	}
	return stepName;
}

/* WSuayan  END */


function cmFillAdStrings(cm){
	var adString = cmGetAdString();
	var maxlength = 100;
	var length = adString.length;
	if (length<=maxlength)
	{
		cm.pv11 = adString;
	} else {
		cm.pv11 = adString.substring(0,maxlength);
		if (length<=2*maxlength){
			cm.pv12 = adString.substring(maxlength,length);
		} else {
			cm.pv12 = adString.substring(maxlength,2*maxlength);
			if (length<=3*maxlength){
				cm.pv13 = adString.substring(2*maxlength,length);
			} else {
				cm.pv13 = adString.substring(2*maxlength,3*maxlength);
				if (length<=4*maxlength){
					cm.pv14 = adString.substring(3*maxlength,length);
				} else {
					cm.pv14 = adString.substring(3*maxlength,4*maxlength);
					cm.pv15 = adString.substring(4*maxlength,length);
				}
			}
		}
	}
}

/*
 * Creates a registration tag
 *
 * Page Count = "Y"
 */
function cmCreateRegistrationTag(pageID, templateName, cust_id, olb_customer,  state, advisorInfo, categoryID, firm,
								 adlink, adlob, homelink, officelink) {
	var cm = new _cm("tid", "2", "vn2", "e3.1");
	cm.cd = cust_id;
	cm.sa = state;
	if (pageID) {
		cm.pi = pageID;
	} else {
		cm.pi = getDefaultPageID(templateName);
	}
	cm.cg  = categoryID;
	cm.pv6 = adlink;
	cm.pv8 = adlob;
	cm.rg1 = cust_id;
	cm.rg2 = advisorInfo;
	cm.rg11 = olb_customer;

	if(olb_customer) {
		cm.rg12 = state;
	}

	if(firm) {
		cm.rg3 = firm;
	}

	if(homelink) {
		cm.rg4 = homelink;
	}
	if(officelink) {
		cm.rg5 = officelink;
	}

	// if available, override the referrer with the frameset referrer
	if (parent.cm_ref != null) {
		cm.rf = parent.cm_ref;
		parent.cm_ref = document.URL;
	}

	cmFillAdStrings(cm);
	cm.pc="Y";

	cm.li = 101;
	cm.ps1 = cust_id;
	cm.ps2 = advisorInfo;
	cm.ps3 = state;
	cm.ps4 = olb_customer;
	cm.ps5 = firm;
	cm.ps6 = homelink;
	cm.ps7 = officelink;


	cm.writeImg();
}

function cmCreateTechProps(pageID, categoryID, templateName, adlink, adlob){
	var cm = new _cm("tid", "6", "vn2", "e3.1");
	cm.addTP();
	if (pageID) {
		cm.pi = pageID;
	} else {
		cm.pi = getDefaultPageID(templateName);
	}

	// if available, override the referrer with the frameset referrer
	if (parent.cm_ref != null) {
		cm.rf = parent.cm_ref;
		parent.cm_ref = document.URL;
	}


	cm.cg = categoryID;
	cm.pv6 = adlink;
	cm.pv8 = adlob;
	cmFillAdStrings(cm);
	cm.pc = "Y";
	cm.writeImg();
}


//Even though the event parameter is not used, it must remain since Netscape will
//automatically send it as the first parameter, the rest of the time it will be null
function cmSendFormFieldTag(name, write){
	var cm = new _cm("tid", "7", "vn2", "e3.1");
	cm.li  = 2;
	cm.ps1 = cmAppName;
	cm.ps2 = cmAppStepNumber;
	cm.ps3 = cmAppStepName;
	cm.ps4 = cmRandom;
	cm.ps5 = name;
	cm.ps6 = cmAppCategory;

	//if (write)
	//{
	cm.writeImg();
	//} else {
	//	var image1 = new Image();
	//	image1.src = cm.getImgSrc();
	//}
}

function cmCreateFormEventTag(appName, appStepNumber, appStepName, appCategory, elementName, elementState) {
	var cm = new _cm("tid", "7", "vn2", "e3.1");
	cm.li  = 4;
	cm.ps1 = appName;
	cm.ps2 = appStepNumber;
	cm.ps3 = appStepName;
	cm.ps4 = elementName;
	cm.ps5 = elementState;
	cm.ps6 = appCategory;

	//document.hitImage[cm_hitImageIndex] = new Image();
	//document.hitImage[cm_hitImageIndex].src = cm.getImgSrc();
	//cm_hitImageIndex++;
	cm.writeImg();
}

var cmFormEventCounter = 0;
var cmFormEventElement = new Array();
var cmFormEventPointer = new Array();
var cmFormEventFirst   = new Array();

function cmSetEvent(elem) {
	cmFormEventElement[cmFormEventCounter] = elem;
	if (!elem.cm_touched) {
	if(elem.type == "text" || elem.type == "textarea" || elem.type == "password") {
		//cmFormEventPointer[cmFormEventCounter] = elem.onchange;
		//cmFormEventFirst[cmFormEventCounter] = true;
		cmFormEventElement[cmFormEventCounter].cm_oldOnChange = elem.onchange;
		cmFormEventFirst[cmFormEventCounter] = true;
		elem.onchange = new Function("cmMultipleEvents("+cmFormEventCounter+");");
	} else if (elem.type == "select") {
		cmFormEventElement[cmFormEventCounter].cm_oldOnChange = elem.onchange;
		cmFormEventFirst[cmFormEventCounter] = true;
		elem.onchange = new Function("cmMultipleEvents("+cmFormEventCounter+");");
	} else {
		//cmFormEventPointer[cmFormEventCounter] = elem.onclick;
		cmFormEventElement[cmFormEventCounter].cm_oldOnChange = elem.onclick;
		elem.onclick = new Function("cmMultipleEvents("+cmFormEventCounter+");");
	}
	}

	elem.cm_touched = true;
	cmFormEventCounter++; 

}

function cmMultipleEvents(id){
	var cm_elem = cmFormEventElement[id];
	var cm_val;
	if(cm_elem.type == "radio") {
		cmCreateFormEventTag(cmAppName, cmAppStepNumber, cmAppStepName, cmAppCategory, cm_elem.name, cm_elem.value);
	} else if(cm_elem.type == "checkbox") {
		cm_val = cm_elem.checked ? "T":"F";
		cmCreateFormEventTag(cmAppName, cmAppStepNumber, cmAppStepName, cmAppCategory, cm_elem.name, cm_val);
	} else if(cm_elem.type == "select") {
		cm_val = cm_elem.options[cm_elem.selectedIndex];
		cmCreateFormEventTag(cmAppName, cmAppStepNumber, cmAppStepName, cmAppCategory, cm_elem.name, cm_val);
	} else if(cm_elem.type == "text" || cm_elem.type == "textarea" || cm_elem.type == "password") {
		if(cmFormEventFirst[id] == true ){
			cmCreateFormFieldTag(cmAppName, cmAppStepNumber, cmAppStepName, cmAppCategory, cm_elem.name);
			cmFormEventFirst[id] = false;
		}
	}
	if (cm_elem.cm_oldOnChange != null){
		cm_elem.cm_oldOnChange();
	}
}

function cmSetupApplicationTextBoxTags(category, first, last, saved, cm_overdraft, cm_funding, cm_instantDecision, cm_resumed, state, orderID){

	var cm = new _cm("tid", "7", "vn2", "e3.1");
	cm.li = 1;
	cm.ps1= cmAppName;
	cm.ps2 = cmAppStepNumber;
	cm.ps3 = cmAppStepName;
	cm.ps4 = orderID;
	cm.ps5= category;
	if (first){
		cm.ps6="FIRST";
	}
	if (last){
		cm.ps7="LAST";
	}
	if (saved){
		cm.ps8="SAVED";
	}
	cm.ps9 = cm_overdraft;
	cm.ps10 = cm_funding;
	cm.ps11 = cm_instantDecision;
	if(cm_resumed) {
		cm.ps12 = "RESUMED";
	}
	cm.ps13 = state;

	cm.writeImg();


	var cm_val;

	for (var i=0;i<document.forms.length; i++){
		for (var j=0;j<document.forms[i].elements.length; j++)
		{
			var el = document.forms[i].elements[j];
			if (el.type=="checkbox")
			{
				cm_val = el.checked ? "T":"F";
				cmCreateFormEventTag(cmAppName, cmAppStepNumber, cmAppStepName, cmAppCategory, el.name, cm_val);
				cmSetEvent(el);
			}
			else if (el.type=="radio") {
				if(el.checked == true) {
					cmCreateFormEventTag(cmAppName, cmAppStepNumber, cmAppStepName, cmAppCategory, el.name, el.value);
				}
				cmSetEvent(el);
			}
			else if (el.type=="select") {
				if(el.selectedIndex != -1) {
					cmCreateFormEventTag(cmAppName, cmAppStepNumber, cmAppStepName, cmAppCategory, el.name, el.options[el.selectedIndex]);
				}
				cmSetEvent(el);
			}
			else if (el.type == "text" || el.type == "textarea" || el.type == "password") {
				if(el.value==""){
					cmSetEvent(el);
				} else {
					cmCreateFormFieldTag(cmAppName, cmAppStepNumber, cmAppStepName, cmAppCategory, el.name);
				}
			}
		}
	}
}

function cmCreateAppSubmitTimingStart() {
	var cm = new _cm("tid", "7", "vn2", "e3.1");
	cm.li = 600;
	cm.writeImg();
}

function cmCreateAppSubmitTimingEnd() {
	var cm = new _cm("tid", "7", "vn2", "e3.1");
	cm.li = 601;
	cm.writeImg();
}

function cU(){
	if(cm_SkipHandlerReg.indexOf("F")==-1){
		var i,form,cV9,j,e;
		for(i=0;i<cG6.forms.length;i++){
			form=cG6.forms[i];
			if(form.cM1==null){
				form.cM1=i;
				if(cF(5))
					cV9=form.attributes.name.nodeValue;
				else if(form.attributes.getNamedItem){
					cV9=form.attributes.getNamedItem('name');
					if(cV9)cV9=cV9.value;
				}else
					cV9=form.name;
				if(!cV9)
					cV9="";
				if (cm_AlternateFormName != "") {
					cGD=cGD+cm_AlternateFormName+"_"+cV9+":"+i+";";
				}
				else {
					cGD=cGD+cV9+":"+i+";";
				}
				form.onsubmit=cK(form,"onsubmit",form.onsubmit,"cP(e)",cP);
				form.onreset=cK(form,"onreset",form.onreset,"cQ(e)",cQ);
				for(j=0;j<form.elements.length;j++){
					e=form.elements[j];
					e.cM1=i;
					e.cM2=j;
					e.cM3="";
					e.onfocus=cK(e,"onfocus",e.onfocus,"cS(e)",cS);
					e.onblur=cK(e,"onblur",e.onblur,"cT(e)",cT);
					e.onchange=cK(e,"onchange",e.onchange,"cR(e)",cR);
					if(e.type=='submit'||e.type=='button')
						e.onclick=cK(e,"onclick",e.onclick,"CF(e)",CF);
				}
			}
		}
	}
}

/* Touch Clarity 
 * Copyright (c) Touch Clarity Ltd 2001-2007. All rights reserved. Patent Pending.
 * Privacy Policy at http://www.touchclarity.com/privacy/
 */
(function(){
	var _1={Version:"4.2.1#323",Vendor:"Touch Clarity",Filename:"eluminate.js"};
	_1.Loader=function(){
		var _2=this;
		var _3={server:"",path:"/www/global/js/tc_logging",args:"coremetrics=true"};
		this.init=function(){
			return _buildScriptTag();
		};
		function _buildScriptTag(){
			var _4="";
			var _5="";
			if(_3.server){
				_4="http"+(window.location.href.substring(0,6)=="https:"?"s":"")+"://";
			}
			_5=""+_4+_3.server+_3.path+".js?"+_3.args;
			document.write("<scr" + "ipt type=\"text/javascript\" src=\""+_5+"\"></scr" + "ipt>");
			return true;
		}
	};
	var _6=new _1.Loader();
	_6.init();
})

();

//-->