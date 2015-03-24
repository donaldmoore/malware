/*
This script determines the chat routing, invitation location on the page
and the button image properties 
BEGIN configuration Script
*/

var lpUASimagesPath = "chat_deployment_local-deposits/images"; 
var lpdbButtonImageHeight = "16";
var lpdbButtonImageWidth = "177";

if (typeof(lpUASlanguage)=="undefined") lpUASlanguage = "english";
if (typeof(lpUASunit)=="undefined") lpUASunit = "deposits";

var lpUAScontext = document.title;

var lpUASinvitePositionX = 347;
var lpUASinvitePositionY = 114;

var lpUASbuttonTitle = "Live Chat";
var lpUASinvitationTitle="Invitation popup window for live chat with a representative";
var lpUASinvitationCloseTitle="Close chat invitation";