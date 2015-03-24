// JavaScript Document
/* account_overview.js */
document.write("<style type='text/css'>");
document.write(".to-do-list {display: none}");
document.write("</style>");

YAHOO.namespace("account.dom");

YAHOO.account.dom.init = function()
{
	var changeLinks = YAHOO.util.Dom.getElementsByClassName("expand-list", "h3");
	YAHOO.util.Event.addListener(changeLinks, "click", displayInlineShow);
	var resCenter = document.getElementById("res-content");
	var fraudMgmt = document.getElementById("fraud-content");
	if (resCenter == null)
	{
		toggleMiniDashboard('account-to-do-content','hide-description','none');
	}
	else
	{
		toggleMiniDashboard('account-to-do-content','hide-description','block');
	}

};

function displayInlineShow(e, id)
{
	var id = (this.id) ? this.id : id;
	switch (id)
	{
		case "hide-description":
		var displayStatus = YAHOO.util.Dom.getStyle('account-to-do-content', 'display');
		toggleMiniDashboard('account-to-do-content',id,displayStatus);
		break;
		case "hide-fraud-mgmt-filters":
		var displayStatus = YAHOO.util.Dom.getStyle('fraud-content', 'display');
		toggleMiniDashboard('fraud-content',id,displayStatus);
		break;
		case "hide-res-center":
		var displayStatus = YAHOO.util.Dom.getStyle('res-content', 'display');
		toggleMiniDashboard('res-content',id,displayStatus);
		break;
	}
}

function toggleMiniDashboard(thisObj, classObj, displayStatus)
{
	if (document.getElementById(thisObj) && document.getElementById(classObj))
	{
		if(displayStatus == 'block')
		{
			document.getElementById(thisObj).style.display = "none"; 
			document.getElementById(classObj).childNodes[0].className="arrow-right";
		}
		else
		{
			document.getElementById(thisObj).style.display = "block"; 
			document.getElementById(classObj).childNodes[0].className="arrow-down";
		}
	}
}

YAHOO.util.Event.addListener(window, "load", YAHOO.account.dom.init);