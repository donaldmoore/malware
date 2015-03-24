/* ====================================================================

	File Name:	csv_dhtml.js
	Purpose:	This is a generic script file for performing DHTML
                please use this file as a baseline for any other DHTML scripts
                
	Developer: 	Bill Quinlan Bank of America
	Copyright:	April 2005
   	Modifications:
	  Date		Developer	Change
	------------	---------------	----------------------------
	April 2005	Bill Quinlan	Genisis
   =================================================================   
*/	
var dom = document.getElementById? 1 : 0;
var ie  = document.all? 1 : 0;
var ns  = document.layers? 1 : 0;

function showObject(objList){var a = objList.split(',');for(var i = 0; i < a.length; i++){show(a[i]);}}
function hideObject(objList){var a = objList.split(',');for(var i = 0; i < a.length; i++){hide(a[i]);}}
function show(obj){obj = findObj(obj);if(!obj) return;if (dom || ie){obj.style.visibility = "visible";obj.style.display = "";}else if (ns){if(document.layers[obj]){obj.visibility = "show";obj.display = "";}}}
function hide(obj){obj = findObj(obj);if(!obj) return;if (dom || ie){obj.style.visibility = "hidden";obj.style.display = "none";}else if (ns){if(document.layers[obj]){obj.visibility = "hide";obj.display = "none";}}}
function getObj(obj){var p, i, found, doc;doc = document;if(!(found = doc[obj]) && ie){found = doc.all[obj];}for (i=0; !found && i < doc.forms.length; i++){found = doc.forms[i][obj];}for(i=0; !found && ns && i < doc.layers.length; i++){found = find(obj,doc.layers[i].document);}if(!found && dom){found = document.getElementById(obj);}return found;}
function findObj(obj){var p, i, found, doc;doc = document;if(!(found = doc[obj]) && ie){found = doc.all[obj];}for (i=0; !found && i < doc.forms.length; i++){found = doc.forms[i][obj];}for(i=0; !found && ns && i < doc.layers.length; i++){found = find(obj,doc.layers[i].document);}if(!found && dom){found = document.getElementById(obj);}return found;}

function isDHTML()
{
	var DHTML = (document.getElementById || document.all || document.layers);
	return DHTML;
}

