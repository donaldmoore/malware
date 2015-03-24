/*
      6/22/2005 ::: Praveen Vasireddy
      Tracking for SEO (Natural Search)
*/

function PayPalNaturalSearch(pName, adRotatorId,doc){
      var aEngines=new Array();
       this.addEngines = function( pArray ){
	     for(var i=0;i<pArray.length;i++){
		     aEngines[i]=pArray[i];
	     }
      }
      //Local methods         
      this.init = function(){
            //Determine if it's a google link and disable exit popup if so
            if (doc.location.search.indexOf("xpufu=x") != -1)
                  window.cleanUp = new Function();
            this.track(pName,adRotatorId);
      }
     
      this.track = function (pgName,adRotatorId){
            //Determine if this page was referenced from a natural search URL
            var searchURL = false;
	    var strReferrer = doc.referrer; 
	    for (var i=0; i<aEngines.length && !searchURL; i++){
		    
		    if(strReferrer.indexOf(aEngines[i]) >-1){
			    searchURL = true;
		    }
           }
	    if (searchURL){
                  //Track based on rotation ID
                  var im = '<img width="1" height="1" src="https://altfarm.mediaplex.com/ad/lt/';
                  im += adRotatorId+'?mpt=';
                  im += escape((new Date()).toGMTString()) + '&mpcl=';
                  im += escape(pgName) + '&mpvl=' + escape(strReferrer) + '">';
                  doc.write(im);
            }
      }
     
}