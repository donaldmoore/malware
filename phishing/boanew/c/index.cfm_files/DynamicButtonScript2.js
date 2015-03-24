
if (typeof(hcPageID) == "undefined")
 hcPageID=Math.round(Math.random()*9999999999);

if (typeof(lpdbButtonContext) == "undefined")
	lpdbButtonContext = document.title;

if (typeof(lpdbButtonActionURLSuffix) == "undefined")
	lpdbButtonActionURLSuffix = "";

if (typeof(lpdbRedirectActionURLSuffix) == "undefined")
	lpdbRedirectActionURLSuffix = "";

if (typeof(lpdbButtonImpressionSuffix) == "undefined")
	lpdbButtonImpressionSuffix = "";

if (typeof(lpdbButtonName) == "undefined")
	lpdbButtonName = "Generic";

if (typeof(lpdbButtonRoom) == "undefined")
	lpdbButtonRoom = lpdbButtonName;

if (typeof(lpdbOutcomeDirQualifier) == "undefined")
	lpdbOutcomeDirQualifier = "";

var lpdbRedirectAttempts;
if (typeof(lpdbRedirectAttempts)=="undefined")
	lpdbRedirectAttempts=10;

var lpdbRedirectTimeout;
if (typeof(lpdbRedirectTimeout)=="undefined")
	lpdbRedirectTimeout=500;

var hcNS = (document.layers) ? true : false;
var hcIE = (document.all) ? true : false;
var hcIE5 = false;
if (hcIE) {
	hcIE5 = navigator.appVersion.indexOf("IE 5.")>=0;
}
var hcDOM = (document.getElementById) ? true : false;
if (hcIE)
	hcDOM = false;
var hcMAC = (navigator.platform) && (navigator.platform.toUpperCase().indexOf("MAC") >= 0);
if (hcNS)
	hcMAC = false;

var hcPointerString = hcIE5 ? "hand" : "pointer";

var lpLocation = document.location.toString();
var lpProtocol = "http";
if ((lpLocation != null) && (lpLocation.indexOf("https:") == 0))
	lpProtocol = "https";

var lpdbImpressionTimeoutSeconds;
if (typeof(lpdbImpressionTimeoutSeconds)=="undefined")
	lpdbImpressionTimeoutSeconds=35;

var lpdbImpressionRefreshFrequency;
if (typeof(lpdbImpressionRefreshFrequency)=="undefined")
	lpdbImpressionRefreshFrequency=5;

var lpdbImpressionFrequency;
if (typeof(lpdbImpressionFrequency)=="undefined")
	lpdbImpressionFrequency=4;

var lpdbButtonImpressionImage;
var lpdbImpressionTimeoutCounter = 0;
var lpdbImpressionRefreshCounter = 0;
var lpdbLastImpressionWidth=-1;

var lpdbServerBusyRetry = 15;
var lpdbCommDelayRetry=5;
var lpdbFirstConnection = true;
var lpdbWaitTimer;

function lpdbButtonImpressionCheckImage() {
    lpdbImpressionTimeoutCounter++;
	lpdbImpressionRefreshCounter++;
	if (lpdbImpressionTimeoutCounter > lpdbImpressionTimeoutSeconds*lpdbImpressionFrequency) {
		if (typeof(lpdbAlternateImageURL) != "undefined" && lpdbAlternateImageURL!=null)
			return lpdbApplyButtonRule(0);
		else
			return lpdbApplyButtonRule(40);
	}
	var imageWidth = lpdbButtonImpressionImage.width;

    if (imageWidth == 24) return false;

    if (imageWidth >= 40) {
        if (lpdbFirstConnection) {
            lpdbFirstConnection = false;
            if (typeof(lpdbRefreshRate) != "undefined") {
                setTimeout("lpdbButtonImpressionGo("+lpdbRefreshRate+")", lpdbRefreshRate*1000);
            }
        }
        if (imageWidth != lpdbLastImpressionWidth)
			return lpdbApplyButtonRule(imageWidth);
		else
			return true;
	} else {
        if (!lpdbFirstConnection) {
            if (imageWidth==30 && lpdbImpressionRefreshCounter >= (lpdbImpressionRefreshFrequency * lpdbServerBusyRetry) ||
                    imageWidth!=30 && lpdbImpressionRefreshCounter >= (lpdbImpressionRefreshFrequency * lpdbCommDelayRetry)) {
                lpdbButtonImpressionSetSource();
                lpdbImpressionRefreshCounter = 0;
            }
        }
        else {
            lpdbFirstConnection = false;
            lpdbWaitForVisitor();
        }
    }
	return false;
}

function lpdbButtonImpressionLoopImage(tempRefreshRate) {
    if (lpdbButtonImpressionCheckImage()) {
		lpdbCheckRefresh(tempRefreshRate);
		return;
	}
	setTimeout("lpdbButtonImpressionLoopImage("+ tempRefreshRate +")", 1000.0/lpdbImpressionFrequency);
}

function lpdbCheckRefresh(tempRefreshRate){
    if (tempRefreshRate > 0)
		setTimeout("lpdbRefresh("+tempRefreshRate+")", 1000.0*tempRefreshRate);
}

function lpdbReset() {
	lpdbImpressionTimeoutCounter = 0;
	lpdbImpressionRefreshCounter = 0;
}
function lpdbRefresh(tempRefreshRate) {
	lpdbReset();
	lpdbInitDynamicButtonRealtime(tempRefreshRate,false);
}

function lpdbButtonImpressionSetSource() {
	if (typeof(lpdbDefaultQueryURL) != "undefined") {
		lpdbImpressionPage = lpProtocol + "://" + lpdbDefaultQueryURL;
	} else if (typeof(lpdbAlternateImageURL) != "undefined" && lpdbAlternateImageURL == 0) {
		lpdbImpressionPage = lpProtocol + "://" + lpServerName + "/hcp/width/img90.gif";
	} else {
		lpdbImpressionPage = lpProtocol + "://" + lpServerName + "/hcp/width/img40.gif";
	}
	if ((hcIE && (! hcMAC)) || (hcNS))
		lpdbButtonImpressionImage = new Image();
	else if (hcDOM || (hcIE && hcMAC && (document.createElement))) {
		document.body.removeChild(lpdbButtonImpressionImage);
		lpdbButtonImpressionImage = document.createElement('IMG');
		lpdbButtonImpressionImage.style.visibility = "hidden";
		lpdbButtonImpressionImage.style.position = "absolute";
		lpdbButtonImpressionImage.style.top = "0px";
		lpdbButtonImpressionImage.style.left = "0px";
		document.body.appendChild(lpdbButtonImpressionImage);
	}

	lpdbButtonImpressionImage.src = lpProtocol + "://" + lpServerName + "/hc/" + lpNumber +
		"/cmd/url/?site=" + lpNumber +
		"&page="+escape(lpdbImpressionPage) +
		"&SESSIONVAR!impression-query-name="+escape(lpdbButtonName)+
		"&SESSIONVAR!impression-query-room="+escape(lpdbButtonRoom)+
		"&id=" + hcPageID +
		"&info=button-impression:"+escape(lpdbButtonName)+"("+escape(lpdbButtonContext)+")"+
		lpdbButtonImpressionSuffix +
		"&waitForVisitor=true&d="+(new Date().getTime());
}

function lpdbButtonImpressionGo(tempRefreshRate) {
	lpdbButtonImpressionSetSource() ;
	lpdbButtonImpressionLoopImage(tempRefreshRate);
}

function lpdbFindButtonImage(name) {
	if (hcDOM) {
		return document.getElementsByTagName("IMG")[name];
	} else if (typeof(document.getElementById)!="undefined") {
		return document.getElementById(name);
	} else {
		for (var i = 0; i < document.images.length; i++) {
			if (document.images[i].name == name)
				return document.images[i];
		}
	}
	return null;
}

var lpdbButtonStateAvailable = "Available";
var lpdbButtonStateBusy = "Busy";
var lpdbButtonStateOffline = "Offline";

function lpdbButtonActionFunction() {
	lpdbOpenChatWindow(lpdbButtonStateAvailable);
}

function lpdbOpenChatWindow(buttonState) {
	window.open(lpdbEvaluateButtonActionURL(buttonState), 'chat' + lpNumber, 'width=472,height=320,status=0,resizable=0,menubar=no,scrollbars=no');
}
function lpdbDoNothingFunction() {
}

function lpdbCustomHandler(width) {
	return false;
}

function lpdbApplyButtonRule(width) {
	var response = false;
	var style = null;
	var hcDynamicIconImage=lpdbFindButtonImage('hcDynamicIcon');
	if (hcDynamicIconImage!=null) {
		style = hcDynamicIconImage.style;
	}
	if (width == 40) {
		response = true;
	} else
	if (width == 50) {
		if (typeof(lpdbButtonImageURL) != "undefined" && lpdbButtonImageURL != null) {
			if (hcDynamicIconImage!=null)
				hcDynamicIconImage.src = lpdbButtonImageURL;
			if (style != null)
				style.cursor = hcPointerString;
			lpdbButtonAction = lpdbButtonActionFunction;
		}
		if (typeof(lpdbMEname) != "undefined") {
			parent.document.getElementById(lpdbMEname).style.display="block";
			parent.document.getElementById("lpMEguide").style.display="block";
		}
		response = true;
	} else 	if (width == 60) {
		if (typeof(lpdbAlternateButtonBusyImageURL) != "undefined" && lpdbAlternateButtonBusyImageURL != null) {
			if (hcDynamicIconImage!=null)
				hcDynamicIconImage.src = lpdbAlternateButtonBusyImageURL;
			if (typeof(lpdbBusyActionFunction) != "undefined") {
			    if (style != null)
			        style.cursor = hcPointerString;
			    lpdbButtonAction = lpdbBusyActionFunction;
			} else {
			    if (style != null)
			        style.cursor = "default";
			    lpdbButtonAction = lpdbDoNothingFunction;
			}
		}
		response = true;
	} else 	if (width == 70) {
		if (typeof(lpdbAlternateButtonOfflineImageURL) != "undefined" && lpdbAlternateButtonOfflineImageURL != null) {
			if (hcDynamicIconImage!=null)
				hcDynamicIconImage.src = lpdbAlternateButtonOfflineImageURL;
			if (typeof(lpdbOfflineActionFunction) != "undefined") {
				if (style != null)
					style.cursor = hcPointerString;
				lpdbButtonAction = lpdbOfflineActionFunction;
			} else {
				if (style != null)
					style.cursor = "default";
				lpdbButtonAction = lpdbDoNothingFunction;
			}
		}
		response = true;
	} else 	if (width == 80 || width == 0) {
		if (typeof(lpdbAlternateImageURL) != "undefined" && lpdbAlternateImageURL != null) {
			if (hcDynamicIconImage!=null)
				hcDynamicIconImage.src = lpdbAlternateImageURL;
			if (typeof(lpdbAlternateFunction) != "undefined") {
				if (style != null)
					style.cursor = hcPointerString;
				lpdbButtonAction = lpdbAlternateFunction;
			} else {
				if (style != null)
					style.cursor = "default";
				lpdbButtonAction = lpdbDoNothingFunction;
			}
		}
		if (typeof(lpdbDefaultActionURL)!="undefined") {
			lpdbActionURL = lpProtocol + "://" + lpdbDefaultActionURL;
		} else {
			lpdbActionURL = lpProtocol + "://" + lpServerName + "/hcp/html/SalesEdition/ServiceTemporarilyUnavailable.html";
		}
		response = true;
	} else if (width == 90) {
		// (a)
		// For a type-1 button implementation with image-name reference
		//  	no need to reload image (no change)
		//	need to make it clickable and connect to action
		if (style != null)
			style.cursor = hcPointerString;
		lpdbButtonAction = lpdbButtonActionFunction;
		// (b)
		// For a type-1 button implementation with no image-name reference
		// 	lpdbButtonActionURL is set at the bottom of this script
		// 	nothing else to do
		response = true;
	} else
		response = lpdbCustomHandler(width);

	if (response) {
		lpdbLastImpressionWidth = width;
	}
	return response;
}

function lpdbInitDynamicButtonRealtime(tempRefreshRate,setAction) {
	if ((hcIE && (! hcMAC)) || (hcNS))
		lpdbButtonImpressionImage = new Image();
	else if (hcDOM || (hcIE && hcMAC && (document.createElement))) {
		lpdbButtonImpressionImage = document.createElement('IMG');
		lpdbButtonImpressionImage.style.visibility = "hidden";
		document.body.appendChild(lpdbButtonImpressionImage);
		lpdbButtonImpressionImage.style.position = "absolute";
		lpdbButtonImpressionImage.style.top = "0px";
		lpdbButtonImpressionImage.style.left = "0px";
	}
	if(setAction)
	    lpdbButtonAction = lpdbDoNothingFunction;
	setTimeout("lpdbButtonImpressionGo("+tempRefreshRate+")", 10);
}

function lpdbWaitForVisitor(){
    if(typeof(lpIsVisitor) == "undefined"){
        lpdbWaitTimer = setTimeout("lpdbWaitForVisitor()", 500);
        return;
    }

	if(lpIsVisitor){
        if (typeof(lpdbRefreshRate) == "undefined") lpdbRefreshRateHere = 0;
        else  lpdbRefreshRateHere = lpdbRefreshRate;
        if (lpdbFirstConnection) {
            setTimeout("lpdbInitDynamicButtonRealtime("+lpdbRefreshRateHere+",true)", 10);
        }
        else {
            lpdbButtonImpressionGo(lpdbRefreshRateHere);
        }
        lpdbFirstConnection=false;
    }else{
        if (lpdbFirstConnection) {
            lpdbInitDynamicButtonRealtime(0,true);
            lpdbFirstConnection=false;
        }
        lpdbWaitTimer = setTimeout("lpdbWaitForVisitor()", 500);
    }
}

if (typeof(lpdbSSL)!="undefined" && lpdbSSL) {
	lpChatProtocol="https";
} else {
	lpChatProtocol="http";
}

function lpdbGenerateChatWindowAvailableURL(){
	return lpdbGenerateChatWindowURL(lpdbButtonStateAvailable);
}
function lpdbGenerateChatWindowBusyURL(){
	return lpdbGenerateChatWindowURL(lpdbButtonStateBusy);
}
function lpdbGenerateChatWindowOfflineURL(){
	return lpdbGenerateChatWindowURL(lpdbButtonStateOffline);
}

function lpdbGenerateChatWindowURL(buttonState) {
	var referrerString = "&referrer=(button%20dynamic-button:"+escape(lpdbButtonName)+"("+escape(lpdbButtonContext)+"))%20"+escape(document.location);
	var forceOfflineString = (buttonState != lpdbButtonStateAvailable) ? ("&forceOffline=true&SESSIONVAR!OfflineTrigger="+buttonState+"Click") : "";
	var url =
		lpChatProtocol + "://" + lpServerName + "/hc/" + lpNumber + "/?cmd=file&file=visitorWantsToChat&site=" +
	 	lpNumber + ((typeof(lpOfflineURL) != "undefined") ? "&offlineURL=" + escape(lpChatProtocol + "://" + lpOfflineURL) : "") +
	 	forceOfflineString +
	 	"&SESSIONVAR!chat-button-name="+escape(lpdbButtonName) +
	 	"&SESSIONVAR!chat-button-room="+escape(lpdbButtonRoom) +
	 	lpdbRedirectActionURLSuffix +
	 	referrerString;
	return url;
}

function lpdbGenerateButtonQueryAvailableURL(redirectPage) {
	return lpdbGenerateButtonQueryURL(redirectPage,lpdbButtonStateAvailable);
}
function lpdbGenerateButtonQueryBusyURL(redirectPage) {
	return lpdbGenerateButtonQueryURL(redirectPage,lpdbButtonStateBusy);
}
function lpdbGenerateButtonQueryOfflineURL(redirectPage) {
	return lpdbGenerateButtonQueryURL(redirectPage,lpdbButtonStateOffline);
}

function lpdbGenerateButtonQueryURL(redirectPage,buttonState) {
	var url =
		lpProtocol + "://" + lpServerName + "/hc/" + lpNumber + "/cmd/url/?site=" + lpNumber +
		"&SESSIONVAR!click-query-name="+escape(lpdbButtonName)+
		"&SESSIONVAR!click-query-room="+escape(lpdbButtonRoom)+
		"&SESSIONVAR!click-query-state="+escape(buttonState)+
		"&SESSIONVAR!button-outcome-dir="+escape(lpdbOutcomeDirQualifier)+
		"&page="+escape(redirectPage) +
		"&id=" + hcPageID +
		"&waitForVisitor=redirectBack&redirectAttempts="+lpdbRedirectAttempts+
		"&redirectTimeout="+lpdbRedirectTimeout+
		lpdbButtonActionURLSuffix+
		"&d="+(new Date().getTime());

	return url;
}

function lpdbEvaluateButtonActionURL(buttonState) {
	var lpdbRedirectActionURL = lpdbGenerateChatWindowURL(buttonState);
	var lpdbButtonActionURL = lpdbGenerateButtonQueryURL(lpdbRedirectActionURL,buttonState);
	return lpdbButtonActionURL;
}

var lpdbActionURL = lpdbEvaluateButtonActionURL(lpdbButtonStateAvailable);

function lpdbDefaultBusyActionFunction() {
	lpdbOpenChatWindow(lpdbButtonStateBusy);
}
function lpdbDefaultOfflineActionFunction() {
	lpdbOpenChatWindow(lpdbButtonStateOffline);
}

////////////////////////////////
setTimeout("lpdbInitDynamicButtonRealtime(0,true)", 10);
