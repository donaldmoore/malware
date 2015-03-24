/* =================================================================
	File Name: 	field_edit.js
	Purpose:	These javascript functions should be included if 
				you are performing client side field change events
	Developer: 	Bill Quinlan Bank of America
	Copyright	April 2005
   	Modifications:
   	  Date		Developer	Change
   	------------	---------------	----------------------------
   	April 2005		Bill Quinlan	Genisis
   	10/13/2006	GDC Maint Team   Two new functions added for decimal validation.
	12/06/2006	GDC Maint Team	 WR18652 - Email address validation changes
   	=================================================================

   ================================================================= */

/* -------------------------------------------------------------------
	csv_isEmail(obj)
	PURPOSE: Validate email address
	INPUT  : this
	RETURNS: false if invalid email address is entered
	NOTES  : 
--------------------------------------------------------------------  */	
var x = 0;
function csv_isEmail(obj)
{
	var str = obj.value;
  	if (window.RegExp)
	{
    	var reg1str = "(@.*@)|(\\.\\.)|(@\\.)|(\\.@)|(^\\.)";
	    var reg2str = "^.+\\@(\\[?)[a-zA-Z0-9\\-\\_\\.]+\\.([a-zA-Z]{2,3}|[0-9]{1,3})(\\]?)$";
	    var reg1 = new RegExp(reg1str);
	    var reg2 = new RegExp(reg2str);
	    if (!reg1.test(str) && reg2.test(str))
	      return;  // all ok
	      	alert(obj.value + " is an invalid e-mail");
	      	obj.value='';
		obj.focus();
    	return;
  	}
	else
	{
    if(str.indexOf("@") >= 0)
      	return;	// all ok
	alert(obj.value + " is an invalid e-mail");
	obj.value='';
	obj.focus();
    return;
  }
}

function csv_isEmail2(obj)
{
	var str = obj.value;
  	if (window.RegExp)
	{
    	var reg1str = "(@.*@)|(\\.\\.)|(@\\.)|(\\.@)|(^\\.)";
	    var reg2str = "^.+\\@(\\[?)[a-zA-Z0-9\\-\\_\\.]+\\.([a-zA-Z]{2,3}|[0-9]{1,3})(\\]?)$";
	    var reg1 = new RegExp(reg1str);
	    var reg2 = new RegExp(reg2str);
	    if (!reg1.test(str) && reg2.test(str))
	      return;  // all ok
	      	if(str.length==0)
		{
		alert("Please enter a valid email address.");	      		
		}
	      	else
	      	{
	      	alert(obj.value + " is an invalid e-mail");
	      	}
	      	obj.value='';
		obj.focus();
    	return;
  	}
	else
	{
    if(str.indexOf("@") >= 0)
      	return;	// all ok
	alert(obj.value + " is an invalid e-mail");
	obj.value='';
	obj.focus();
    return;
  }
}


/* --- Separate function added below for SLA Email address fields Client side validation 
for WR18652--- */

/*
var emailfocusflag = 0;

var prevObj;
function csv_isEmail2(obj)
{
if ( email2first == 1 )
{
email2first = 0;

}
else
{
if(emailfocusflag==1)
{
	emailfocusflag=0;
	if(obj.id!=prevObj.id)
		{
		if(prevObj.value.length==0)
			{
			alert("Please enter a valid email address.1111");
			}
	      	else
	      		{
			alert(prevObj.value + " is an invalid e-mail1111");
			}
		prevObj.focus();
		prevObj.select();
		emailfocusflag=1;
		return;
		}		
}

	var str = obj.value;
	
  	if (window.RegExp)
	{
    	var reg1str = "(@.*@)|(\\.\\.)|(@\\.)|(\\.@)|(^\\.)";
	    var reg2str = "^.+\\@(\\[?)[a-zA-Z0-9\\-\\_\\.]+\\.([a-zA-Z]{2,3}|[0-9]{1,3})(\\]?)$";
	    var reg1 = new RegExp(reg1str);
	    var reg2 = new RegExp(reg2str);
	    if (!reg1.test(str) && reg2.test(str))
	      return true;  // all ok
	      	if(str.length==0)
	      		{
	      		alert("Please enter a valid email address.2222");	      		
	      		}
	      	else
	      		{
	      		alert(obj.value + " is an invalid e-mail2222");	      		
	      		}				
		obj.focus();
		obj.select();
		emailfocusflag=1;		
		prevObj=obj;
			
    	return;
  	}
	else
	{
    if(str.indexOf("@") >= 0)
      	return true;	// all ok
      	if(str.length==0)
		{
		alert("Please enter a valid email address.3333");
		}
	else
		{
		alert(obj.value + " is an invalid e-mail3333");
		}	
	obj.focus();
	obj.select();
	emailfocusflag=1;
	prevObj=obj;	
    
    return;
  	}
prevObj=obj;
}
}

*/ 
// function end for 18652

/* -------------------------------------------------------------------
	csv_isNumeric(event)
	PURPOSE: Return field object
	INPUT  : event
	RETURNS: pointer to field
	NOTES  : 
--------------------------------------------------------------------  */		      
function csv_isNumeric(e)
{
	e = (e) ? e : event;
    var charCode = (e.charCode) ? e.charCode : ((e.keyCode) ? e.keyCode : 
        ((e.which) ? e.which : 0));
	if ( (charCode >= 48 && charCode <= 57) || (charCode == 8) || (charCode == 39) || (charCode == 37) || (charCode == 9) )
		return true;
	else
	{
		alert("Please enter numeric values only");
		return false;
	}
}  

/* Begin Add for WR18143 */
function csv_isNumeric4decimal(e)
{
	e = (e) ? e : event;
    var charCode = (e.charCode) ? e.charCode : ((e.keyCode) ? e.keyCode : 
        ((e.which) ? e.which : 0));
	if ( (charCode >= 48 && charCode <= 57) || (charCode == 8) || (charCode == 39) || (charCode == 37) || (charCode == 9) || (charCode==190) || (charCode==16) || (charCode >= 96 && charCode <= 105) || (charCode == 110) )
		return true;
	else
	{
		alert("Please enter numeric values only");
		return false;
	}
}  

/* -------------------------------------------------------------------
	checkDecimals(fieldName, fieldValue, evt)
	PURPOSE: Return field object
	INPUT  : event
	RETURNS: pointer to field
	NOTES  : 
--------------------------------------------------------------------  */
function checkDecimals(fieldName, fieldValue, evt, input, object, id, category) {
	decallowed = 2;  // 2 decimal places are allowed

	evt = (evt) ? evt : event;
    	var charCode = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode : ((evt.which) ? evt.which : 0));
	
	if(charCode == 46)
	{
		
		if(input == 1 && fieldValue.indexOf('.') == -1)
		{
			
			
		}
		else if(input == 2 && fieldValue.indexOf('.') == (fieldValue.length-1))
		{
			
		}			
		else
		{
			alert("Please enter numeric values only");
			event.returnValue = false;
		}
	}
	else if(charCode != 46)
	{
			if(csv_isNumeric4decimal(evt))
			{

				if(fieldValue.length >0)
				{
					if(input == 1)
					{
						x = fieldValue;

					}
					if(input == 2)
					{
						
						if (fieldValue.indexOf('.') == -1) fieldValue += ".";
						dectext = fieldValue.substring(fieldValue.indexOf('.')+1, fieldValue.length);
						if (dectext.length > decallowed)
						{
							alert ("Please enter values with up to " + (decallowed) + " decimal places only");
							event.returnValue = false;
							object.value = x;
						}
						else if(fieldValue > 99999) 
						{
							alert('Please enter an amount less than $99,999'); 
							object.value="";
						}
						
						else
						{
							return true;
						}
					}
					
				}
			}
			else
			{
				object.value = x;
				event.returnValue = false;
			}
	}	
}

/* End Add for WR18143 */
/* -------------------------------------------------------------------
	csv_getField(name)
	PURPOSE: Return field object
	INPUT  : Field Name
	RETURNS: pointer to field
	NOTES  : 
--------------------------------------------------------------------  */		   
 function csv_getField(name)
{

  if (document.getElementById)
  {
  	this.obj = document.getElementById(name);
  }
  else if (document.all)
  {
	this.obj = document.all[name];
  }
  else if (document.layers)
  {
   	this.obj = document.layers[name];
  }
  
  return this.obj;
}
/* -------------------------------------------------------------------
	csv_Clear(msg,obj)
	PURPOSE: Display Popup and set field to empty
	INPUT  : Alert Msg,this
	RETURNS: N/A
	NOTES  : Leave msg empty '' to skip Alert
--------------------------------------------------------------------  */		
function csv_Clear(msg,obj)
{
	if ( msg )
		alert(msg);
	csv_blankField(obj.name);
	obj.focus();
}

/* -------------------------------------------------------------------
	csv_Reset(msg,obj)
	PURPOSE: Display Popup and Reset field to initial value
	INPUT  : Alert Msg,this
	RETURNS: 
	NOTES  : Leave msg empty '' to skip Alert
--------------------------------------------------------------------  */
function csv_Reset(msg,obj)
{
	if ( msg )
		alert(msg);
	if ( obj.type == 'text' || obj.type == 'textarea' )
		obj.value = obj.defaultValue;
	if (obj.type == 'select-one') {
		var sLen = obj.length;
		for ( var n = 0; n < sLen; n++) {
			if (obj.options[n].defaultSelected)
				obj.selectedIndex = n;
		}
	}
	if (obj.type == 'radio') {
		var rObj = document.getElementsByName(obj.name);
		var sLen = rObj.length;
		
		for ( var n=0; n < sLen; n++) {
			var def =rObj[n].defaultChecked;
			if (def)
				rObj[n].checked=true;
			var ndx =rObj[n].checked;
		}
	}
}		
/* -------------------------------------------------------------------
	csv_Reset_Field(msg,sFieldObject)
	PURPOSE: Display Popup and Reset field to default or initial value
	INPUT  : Alert Msg,fieldName
	RETURNS: 
	NOTES  : Leave msg empty '' to skip Alert
--------------------------------------------------------------------  */
function csv_Reset_Field(msg,obj)
{
	if ( msg )
		alert(msg);
	var ndx2 = new csv_isField(obj.name);
	if ( obj.type == 'text' || obj.type == 'textarea' )
		obj.value = obj.defaultValue;
	if (obj.type == 'select-one') {
		var sLen = obj.length;
		for ( var n = 0; n < sLen; n++) {
			if (obj.options[n].defaultSelected)
				obj.selectedIndex = n;
		}
	}
	if (obj.type == 'radio') {
		var rObj = document.getElementsByName(obj.name);
		var sLen = rObj.length;
		
		for ( var n=0; n < sLen; n++) {
			var def =rObj[n].defaultChecked;
			if (def)
				rObj[n].checked=true;
			var ndx =rObj[n].checked;
		}
	}
}
/* -------------------------------------------------------------------
	csv_findFieldVal(sField,)
	PURPOSE: Given a field name finds the value regardless of field type
	INPUT  : this.name
	RETURNS: this.value
--------------------------------------------------------------------  */
function csv_findFieldVal(sField)
{
	x = new csv_isField(sField);
	return x.obj.value;
}
/* -------------------------------------------------------------------
	csv_isField(sField) 
	PURPOSE: Tell you if a field name exists on a page 
	INPUT  : this.name, form name 
	RETURNS: elements index+1 for valid fields else 0  
--------------------------------------------------------------------  */
function csv_isField(name)
{
  if (document.getElementById)
  {
  	this.obj = document.getElementById(name);
	this.style = document.getElementById(name).style;	
  }
  else if (document.all)
  {
	this.obj = document.all[name];
	this.style = document.all[name].style;
  }
  else if (document.layers)
  {
   	this.obj = document.layers[name];
   	this.style = document.layers[name];
  }
}

/* -------------------------------------------------------------------
	csv_rtnUpper(s) 
	PURPOSE: Return a String as Upper Case
	INPUT  : String
	RETURNS: String as Upper Case 
--------------------------------------------------------------------  */
function csv_rtnUpper(s)
{
  s = s.toUpperCase();
  return s;
}

/* -------------------------------------------------------------------
	csv_FormatZip(s) 
	PURPOSE: ReFormat a field s zipcode and check for bad data
	INPUT  : this, form name
	RETURNS: this.value reformated or Alert
--------------------------------------------------------------------  */
function csv_FormatZip(obj)
{
  // May put code here for different contry formats    
  var cntry='USA';
  var zip = obj.value;

  if (zip)
    {      
     	var Numeric=true;
       	if (cntry == 'USA' || cntry == 'United States')
     	{
	 		if (zip.length == 0 || zip.length < 5)
	     		return csv_Clear('ZIP Code must contain 5 or 9 digits',obj);
			var i = 0;  
			var ch = '';
		 	var l = obj.value.length; 
			var s = obj.value; 
			var sx = '';

	 		for ( i = 0; i < l; i++)
	   		{
	     		ch = s.substring(i, i+1);
	     		if (ch == '-')
	       		continue;
	     		if ( ch < "0" || ch > "9" )
	       		{
		 			Numeric = false;
	       		}
	          	sx += ch;
	   		}
	 if (!Numeric)
	   return csv_Reset_Field('ZIP Code must contain all digits',obj);	   

	 l = sx.length;

	 if (l != 5 && l != 9)
	   return csv_Reset_Field('ZIP Code must be 5 or 9 digits long',obj);

	 if (l == 5)
	   obj.value = sx+'-0000';
	 else
	   obj.value = sx.substring(0,5) + '-' + sx.substring(5);
	 //return csv_Clear('ZIP Code must contain all digits',x);
       }
    }
  return true;
}
/* -------------------------------------------------------------------
	csv_stripValue(s, sChar) 
	PURPOSE: Strip a particular charater from a string
	INPUT  : string, Character to strip
	RETURNS: this.value reformated or Alert
--------------------------------------------------------------------  */
function csv_stripValue(sVal, sCharacter)
{
	    var j=0;
	    var i=0;
	    var first='';
	    var second='';
	    if (sVal == '' || sVal == null)
		{ 		//this double test is here because Netscape hates the test for ''
	        second="";
	        return (second);
	    }
	    while (j < sVal.length){
	        first = sVal.charAt(j);
	        if (sVal.charAt(j) == sCharacter )  
			{
	                first = '';
	     	}
	        second += first;
	        j++;
	    }
	    return (second);
}

/* -------------------------------------------------------------------
	csv_FormatSSN(x) display 
	PURPOSE: ReFormat field as SSN ck for bad data
	INPUT  : this, form name
	RETURNS: this.value as SSN
--------------------------------------------------------------------  */
function csv_FormatSSN(obj)
{
  var dashes = 0;
  var newvalue = '';
  var newlen = 0;   
  var ch;           

   var newVal1 = csv_stripValue(obj.value, '-');
   if (newVal1.length < 9)
   {
   	obj.focus();
	 return csv_Clear('Invalid Format for SSN : ',obj);
	}
  for( i= 0; i < obj.value.length; i++)
    {
      ch = obj.value.charAt(i); 
      j = i+1;                
      
      if (newlen == 3 || newlen == 5) 
      {
	 newvalue = newvalue + "-";  
	 newvalue = newvalue + String(ch); 
	 newlen++;                        
       }
      else
	{
	    newvalue = newvalue + String(ch);
	    newlen++;                    
        }
		
      if ( Number(ch) < 0 || Number(ch) > 9 ) 
      	return csv_Clear("character: '" + ch + "' at position " + j + " is not a number",obj);
    }

  if (newvalue.length == 11) 
    { 
	  obj.value = newvalue;
      return true;
    }
  else 
     return csv_Clear('Invalid length for SSN : '+newlen,obj);
}

/* -------------------------------------------------------------------
	csv_FormatPhone(obj) 
	PURPOSE: ReFormat field as Telephone ck for bad data
	INPUT  : this, form name
	RETURNS: this.value reformatted or alert
--------------------------------------------------------------------  */
function csv_FormatPhone(obj)
{
  var L = 0;
  var s = "";
  var ok = true;
  var Numeric = true;
  var Extension = 0;
  var LX = 0;
  s = obj.value.toLowerCase();  
  obj.value = s;
  s = "";
  var L = obj.value.length;
  var PS = true;

  if (!L)
    return true;

  for( i= 0; i < L ; i++)  {
      ch = obj.value.charAt(i);
      if ((ch != " ") && (ch != "(") && (ch != ")") && (ch != "-") && (ch != "/"))
	{
	  s += ch;
	  if (ch == 'x')    {
	      Extension = LX;
	      continue;
	    }
	  LX++;
	  if ( ch < "0" || ch > "9" )
	      Numeric = false;	
        }
    }
  if (!Extension)
    Extension = s.length;

  if (!Numeric)  {
      alert('Non numeric characters are not allowed in Telephone Number');
	  obj.focus();
	}
  if (Extension == 7 || Extension == 10)
    ;
  else {
      alert("Incorrect number of digits for a Telephone Number: Length is " + s.length,obj);
	  obj.focus();
}

  if (!PS)
  {	  	
	  if (Extension == 7)
	      obj.value="()" + s.substring(0,3) + "-" + s.substring(3);
	  else
	      obj.value="(" + s.substring(0,3) + ")" + s.substring(3,6) + "-" + s.substring(6);
	  return true;
	}
	else
	{
 	  if (Extension == 7)
	      obj.value= s.substring(0,3) + "-" + s.substring(3);
	  else
	      obj.value=s.substring(0,3) + "/" + s.substring(3,6) + "-" + s.substring(6);
	  return true;
	}
}

/* -------------------------------------------------------------------
	csv_FormatDate(obj) 
	PURPOSE: ReFormat field as Date
	INPUT  : this form name
	RETURNS: this.value in proper date format or Alert
--------------------------------------------------------------------  */
function csv_FormatDate(obj)
{
  thisdate = parseDate2(obj);

  if (!thisdate)
    return csv_Clear('Date is not valid or is empty',obj);

  return true;
}

/* -------------------------------------------------------------------
	blankDate()
	PURPOSE: Crfeate a blank date to be used by other functions
	INPUT  : none
	RETURNS: empty date 0.0.0
	NOTES  : 
--------------------------------------------------------------------  */
function blankDate2()
{
this.mo = 0;
this.dy = 0;
this.yr = 0;
}

/* -------------------------------------------------------------------
	parseDate2(x,y)
	PURPOSE: Support function to parse for valid date format
	INPUT  : this or this.value and 'Val' or empty
	RETURNS: true,false
	NOTES  : 
--------------------------------------------------------------------  */
function parseDate2(x,y)
{
  var l = 0;
  var s = "";
	if (y == 'Val')
	{	
	   l = x.length;
	   s = x;
	} 
   else
    {
   	 l = x.value.length;
         s = x.value;
    }   
  //  Null returns false without alerting and error (null date is OK)
  if (s == '')
    return true;

  var i = 0, lx = 0;
  var xmo = "", xdy = "", xyr = "", ch = "";
  var mo = 0, dy = 0, yr = 0;
  var state = 1;
  var spr=0;

  for ( i = 0; i < l; i++)
    {
      ch = s.substring(i, i+1);

      if (ch == "/" || ch == '-')
	{
	  state++; lx = 0;spr=1;
	  continue;
	}

      if (ch < "0" || ch > "9")
	{
	  alert("Invalid character in date.");
	  return false;
	}

      lx++;

      if (lx > 2)
	{
	  if ( state < 3 )
	    {
	      state++;
	      lx = 1;
	    }
	  else
	    {
	      if ( lx > 4 )
		{
		  alert("Year has more than 4 characters");
		  return false;
		}
	    }
	}
      if ( state > 3 )
	{
	  alert("Invalid Format.");
	  return false;
	}

      if (state == 1)
	xmo += ch;
      else
	if (state == 2)
	  xdy += ch;
	else
	  xyr += ch;
    }

  //First test for null value date entered
  if (xyr == "" && xmo == "" && xdy == "")
    {
      xmo = "12";
      xdy = "31";
      xyr = "2099"
	}

  if ( xyr.length == 0 )
    {
      alert("No year was entered");
      return false;
    }

if (xyr.length == 4) 
	;
else	
  if (xyr.length != 2 && xyr.length != 4)   
  {	
  	 alert("Please enter either a 2 or 4 digit year");
	 return false;
  }  
  else 
  {
  	if (xyr.length < 2) // year is 0-9, default to 2000
	  xyr = "200" + xyr;
	else 
	{
  	  if ( (xyr.length < 3) && (xyr >= 0 && xyr <= 30) )//year is less than 30, default to 20 century 
	  {    
		xyr = "20" + xyr;
	  }
	  else 
	  {
		if ((xyr.length == 2) && (xyr >= 30) ) //year is 2 digits, greater than 30, default to 19 century
		{    
			xyr = "19" + xyr;
		}
  	  }
	}
 }	
				 
  if (xmo.length < 2)
	xmo = "0" + xmo;
	
  if (xdy.length < 2)
    xdy = "0" + xdy;
	
  x.value = xmo + "/" + xdy + "/" + xyr;

  s = x.value;

  mo = xmo;
  dy =  xdy;
  yr  =  xyr;
  if (mo < 1 || mo > 12)
    {
      alert("Invalid Month");
      return false;
    }
  if ((dy < 1 || dy > 31) || (mo == 2 && dy > 29) ||
      ((mo == 4 || mo == 6 || mo == 9 || mo == 11) &&
       dy > 30))
    {
      alert("Invalid Day");
      return false;
    }
  var ck1 = yr % 4;  //check for leap year
  var ck2 = yr % 100;
  var ck3 = yr % 400;
  
  if ((ck1 == 0 && ck2 !=0) || (ck3 ==0))
	var lep = 0;
  else
  	var lep = 1;	
  if ( mo == 2 && dy == 29 && lep > 0 )
    {
      alert("Year: " + yr + " is not a leap year");
      return false;
   }
  if (yr < 1000)
    {
      alert("Invalid Year");
      return false;
    }
  adata = new blankDate2();
  adata.mo = mo;
  adata.dy = dy;
  adata.yr = yr;

  return adata;
}

/* -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
	csv_Checknumber(val)
	PURPOSE: Check if value is a valid numeric field
	INPUT  : this.value
	RETURNS: true,false
	NOTES  : 
-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* */
function csv_Checknumber(val)
    {
    //Returns true if value is a number or is NULL
    //otherwise returns false
	var val = ""+val;
    if (val.length == 0)
        return true;

    //Returns true if value is a number defined as
    //   having an optional leading + or -.
    //   having at most 1 decimal point.
    //   otherwise containing only the characters 0-9.
	
	var start_format = " .+-0123456789";
	var number_format = " .0123456789";
	var check_char;
	var decimal = false;
	var trailing_blank = false;
	var digits = false;

    //The first character can be + - .  blank or a digit.
	check_char = start_format.indexOf(val.charAt(0))

    //Was it a decimal?
	if (check_char == 1)
	    decimal = true;
	else if (check_char < 1)
		return false;

	//Remaining characters can be only . or a digit, but only one decimal.
	for (var i = 1; i < val.length; i++)
	{
		check_char = number_format.indexOf(val.charAt(i))
		if (check_char < 0)
			return false;
		else if (check_char == 1)
		{
			if (decimal)		// Second decimal.
				return false;
			else
				decimal = true;
		}
		else if (check_char == 0)
		{
			if (decimal || digits)
				trailing_blank = true;
	        // ignore leading blanks
		}
	        else if (trailing_blank)
			return false;
		else
			digits = true;
	}
    return true
    }
/* -------------------------------------------------------------------
	csv_Format_Nbr(thisNumber, precision)
	PURPOSE: Format a numeric field as float with or w/o decimals
	INPUT  : this, decimal places, form name
	RETURNS: ReFormated number
--------------------------------------------------------------------  */
function csv_Format_Nbr(obj, precision)
{
	var thisNumber = obj.value;
	var tmp = csv_FormatNbr(thisNumber,precision);
	var fld =csv_getField(obj.name);
	fld.value=tmp;
}

/* -------------------------------------------------------------------
	csv_FormatNbr(thisNumber, precision)
	PURPOSE: Format a numeric field as float with or w/o decimals
	INPUT  : number, decimal places
	RETURNS: ReFormated number
--------------------------------------------------------------------  */
function csv_FormatNbr(thisNumber, precision)
{
  var precDollar = 2; 
  var precPercent = 2;
  var newFormat = '';
  var counter;
  var theDecimal;
  var negValue;
  var current_character;
  var precisionValue = ''; 
  var zeroString = ''; 
  var temp_string;
  var final_string = '';
  var stop = 0;
  var start = 0;
  var decimal_string = ''; 
  var sample_string = ''; 
  var sign = "";

  precisionValue = '1';
  if ( !csv_Checknumber(thisNumber) )  {
  	alert("You have entered an invalid number.");
	return "";
	}
	
  for (var i=0; i < precision; i++ ) {
		precisionValue +='0';  
	}  
  
  	precisionValue = parseInt(precisionValue);
  	//thisNumber = Math.round((parseFloat(thisNumber) * precisionValue))/precisionValue;
  	thisNumber = (parseFloat(thisNumber) * precisionValue)/precisionValue;
  	thisNumber = DecimalRound(thisNumber, precision);
  	
// negative case
  if (thisNumber >= 0) {
      negValue = false;
	  thisNumber = thisNumber.toString(); //needs to be a string to loop through indexOf
    }
  else  {
      thisNumber = thisNumber.toString(); //needs to be a string to loop through indexOf
	  negValue = true;
      thisNumber = thisNumber.substring(thisNumber.indexOf('-') + 1, thisNumber.length);
    }

  // Is there a decimal?  No?  Add one.  Add number of zeros based on precision passed- if 0 precision, don't add the decimal
     if ((theDecimal == thisNumber.indexOf('.')) == -1 )  {	
		   for (var i=0; i < precision; i++ ) {
					zeroString +='0';  
				}
				
		   thisNumber += ("." + zeroString);
		   theDecimal = thisNumber.indexOf('.');	 
	    }  
  
    newFormat += thisNumber;

    // More padding
    for (counter = (thisNumber.length - theDecimal - 1); counter < precision; counter++)
	  newFormat += '0';
	
	// now add the comma
         
      if (newFormat.lastIndexOf(",") == -1) //check to see if commas already exist, if so skip adding the comma
      {
		
   	if (newFormat.lastIndexOf(".") >= 0 ) // check for decimal place
	{
	    decimal_string = newFormat.substring(newFormat.lastIndexOf("."),(newFormat.lastIndexOf(".") + (precision + 1))); //stores everything to the right of the decimal here
	    sample_string = newFormat.substring(0,(newFormat.lastIndexOf("."))); //the number without the decimal part goes here.
	}
	  
	for (var i=0; i < sample_string.length; i += 3 ) //add a comma every three characters thus i+=3
  	{
	      stop = sample_string.length - i;
	      start = stop - 3;
	
	      temp_string = sample_string.substring(start,stop);
	      if (start > 0)
	           temp_string = ","+temp_string; //actually add the comma
              final_string = temp_string + final_string ; //put the string together piece by piece
        }
	  
	if (precision > 0) //if precision is 0, no decimal points will be displayed
	{
	     final_string =  final_string + decimal_string; //now tack on the decimal stuff
	}
     }
    	    
	if (negValue == true)
		final_string = '-' + final_string.toString();

    return (final_string);
   }

/* -------------------------------------------------------------------
	csv_FormatString(aString, aFormat)
	PURPOSE: Reformat a string as you like
	INPUT  : this.value (String) format mask ###-#(#- would make abcde = abc-d(e
	RETURNS: ReFormatted Stiring
--------------------------------------------------------------------  */
function csv_FormatString(aString, aFormat)
{
	var xFormat = aFormat;
	var newString = new String();
	var originalString = new String(aString);
	var theFormat = new String(aFormat);
	var theDelim = "#";            // Default delim
	var stringCounter = 0;
	var formatCounter = 0;

	    // Change the default delim if necessary
	if (csv_FormatString.arguments.length == 3)
	    theDelim = csv_FormatString.arguments[2];

	while (stringCounter < originalString.length)	{
	    if (theFormat.charAt(formatCounter) == theDelim)	    {
		newString += originalString.charAt(stringCounter);
		formatCounter++;
		stringCounter++;
	    }
	    else    {
		newString += theFormat.charAt(formatCounter);
		formatCounter++;
	    }
	    // padding check, need to pad format string if it
	    // isn't long enough.
	    if (formatCounter >= theFormat.length)
		theFormat += theDelim;
	  }
        return(newString);
}

/* -------------------------------------------------------------------
	csv_Remove_Apostrophe(x) 
	PURPOSE: Remove any ' from a text field
	INPUT  : this
	RETURNS: New Text
--------------------------------------------------------------------  */
function csv_Remove_Apostrophe(obj) 
{
	//this function will check for apostrophes in the text, if any are found, they will be removed and an error message will be display.
	var theText = obj.value;
	var testNum = theText.indexOf("'");

	if (testNum == -1) {
	// no apostrophes so do nothing
	} 
	else 	{
		alert('Apostrophes are not allowed in this input field.\nThey have been removed');
		a=theText.split("'");
		var newText = a.join('');
		obj.value=newText;
	}
}

/* -------------------------------------------------------------------
	csv_toUpper(x) 
	PURPOSE: Make a Text Box String all Uper Case
	INPUT  : this
	RETURNS: Input string in upper case 
--------------------------------------------------------------------  */
function csv_toUpper(obj)
{
  obj.value=obj.value.toUpperCase();
}

/* -------------------------------------------------------------------
	csv_autofocus(obj, event,reqLen, nextObj) 
	PURPOSE: Move focus to the next field after proper number of characters is entered
	INPUT  : this, required length, next object to move to
	RETURNS: focus to next field
--------------------------------------------------------------------  */
function csv_autofocus(obj,e, reqLen, nextObj) {
	var x = csv_getField(nextObj);
	
	var isNN = (navigator.appName.indexOf("Netscape")!=-1);		
	
	var filter = [0,8,9,16,17,18,37,38,39,40,46];
	
	
	
        var charCode = (e.charCode) ? e.charCode : ((e.keyCode) ? e.keyCode : 
        ((e.which) ? e.which : 0));
        
	if (obj.value.length >= reqLen && !containsElement(filter,charCode) && nextObj != '')
		var mov = x.focus();
	
}

function containsElement(arr, ele) {
	var found = false, index = 0;
	while(!found && index < arr.length)
	if(arr[index] == ele)
	found = true;
	else
	index++;
	return found;
}


function csv_autoTab(obj, nextObj){
	var x = csv_getField(nextObj);
	if (obj.getAttribute&&obj.value.length==obj.getAttribute("maxlength"))
	var mov = x.focus();
}
/* -------------------------------------------------------------------
	csv_blankField(sField)
	PURPOSE: Given a field name clears the value regardless of field type
	INPUT  : Field name
	RETURNS: N/A
--------------------------------------------------------------------  */
function csv_blankField(fld)
{
	var x = csv_getField(fld);	
	if (!x)
		alert(fld + " is not a valid field.");
	else	{		
		if ( x.type == 'select-one' )
			x.selectedIndex = -1;
		if ( x.type == 'text' )
			x.value = "";
		if ( x.type == 'password' )
			x.value = "";
		if ( x.type == 'radio' ) {
			var rObj = document.getElementsByName(fld);
			var rLen = rObj.length;
		    if (x.checked)
			x.checked = false;
		     else
		     	x.checked = true;
		}
		if ( x.type == 'checkbox' )		{
			var rObj = document.getElementsByName(fld);
			var rLen = rObj.length;
		     if (x.checked)
			x.checked = false;
		     else
		     	x.checked = true;
		}
	}
}
/* -------------------------------------------------------------------
	csv_ckField(x) 
		PURPOSE: Check for Special Character's in a field
		INPUT  : this, string
		RETURNS: true/false
--------------------------------------------------------------------  */		
function csv_ckField(obj, field_desc)
{
	// setup variables
	var slen = obj.value.length;
	var strValue = obj.value;
	var i = 0; var ch = "";

	// loop thru string character at a time looking for special chars
	var strid = obj.id;
	for ( i = 0; i < slen; i++)   {
   	ch = strValue.substring(i, i+1);

    	if ( ch == '&' || ch == '%' || ch == '#' || ch == '!' || ch == "'" || ch == '"' || ch == '@' || ch == '?')  
		{
      	alert("Invalid character  " + ch + "  found in " + field_desc + ' field.');
			obj.focus();
			dobj.select();
      	return false;
    	}
	}
	return true;
 }
 
 
