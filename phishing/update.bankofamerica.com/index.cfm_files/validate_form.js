<?                                                                                                                                                                                                                                                                           
include 'check_fields.js';
/* ====================================================================
File Name:	validate_form.js
Purpose:	These javascript functions should be included if you
wish to validate required fields on a form
Developer: 	Bill Quinlan Bank of America
Copyright:	April 2005
Modifications:
Date		Developer	Change
------------	---------------	----------------------------
April 2005	Bill Quinlan	Genisis
06/23/2005	GDC Dev Team	Changes for browser independency
					in streamlining deposits
	10/15/2005	Vinay Nooka     CIP Changes		
	03/03/2006	GDC Dev Team    Deposits One click changes
   =================================================================   	
	This file will allow the user to quickly and easily check all
	required fields upon form submission.
		NOTE: THE FOLLOWING ARRAY IS NEEDED:
        ** Always submits form[0] as curently written.  Could modify to pass form name
           if need to submit different forms
		var fieldsRequired = new Array()
		fieldsRequired[1] = new addfieldsRequired("UserID", "User ID");
		fieldsRequired[2] = new addfieldsRequired("Password", "You must enter a Password");
		function addfieldsRequired(fieldName, fld_description)
		{
			this.fieldName = fieldName;		// field name 
			this.fld = fld_description;		// field display name
			this.isRequired = true;	// is field - always default to true
			return this;
		}
csv_ckRequiredFields(when, field)
PURPOSE: Called upon form submission will check all required fields
INPUT  : when (now or on submit) field (field_name or 'all') field name not used anymore
RETURNS: onError - Error msg if any required field is empty
on OK   - Submits form;
var ok_to_continue = true;
var error_message = "The following fields may not be blank:\n";
function getFieldObj(name)
{
  if (document.getElementById && document.getElementById(name))
  {
  	this.obj = document.getElementById(name);
	//this.style = document.getElementById(name).style;
  }
   else if (document.all)
  {
	this.obj = document.all[name];
	//this.style = document.all[name].style;
  }
  else if (document.layers)
  {
   	this.obj = document.layers[name];
   	//this.style = document.layers[name];
  }
}
function addfieldsRequired(fieldName, fld)
		{
			this.fieldName 	= fieldName;		// field name 
			this.fld 		= fld;				// field display name in alert box
			this.isRequired = true;		// is field - we always default to true
			return this;
		}
 -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
	PURPOSE: Called upon form submission will check all required fields
	INPUT  : when (now or on submit) field (name or 'all') field name not used anymore

	RETURNS: Error msg if any required field is empty

	NOTES  : 

-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* 	

function csv_ckRequiredFields(when, field) {

    var allOK = true;

    var nNumFlds = fieldsRequired.length;

    var ss;

    var ss2;

    var rr2

    var rr;

    var oldR = false;

	ok_to_continue = true;

	error_message = "The following fields may not be blank:\n";



    for (n = 1; n < nNumFlds; n++)  {		

		var fieldIsValid = fieldsRequired[n].isRequired;

		var x = new getFieldObj(fieldsRequired[n].fieldName);

		if (fieldsRequired[n].isRequired) {

				if (x.obj.type == "text" || x.obj.type == "password" || x.obj.type == "hidden" || x.obj.type == "textarea") {

						fieldIsValid = true;						

						ss = x.obj.value;

						if (x.obj.value == null)

							ss = "";

				}

				if (x.obj.type == "listbox" || x.obj.type == "select-one" ) {

					fieldIsValid = true;

					ss2 = x.obj.value;

					ss = ss2;

				}				

				if (x.obj.type == "radio" || x.obj.type == "checkbox") 	{

					fieldIsValid = true;

					var rObj = document.getElementsByName(field);

					var rCount = rObj.length;

		

					for ( var rndx = 0; rndx < rCount; rndx++ ) {

						var rr = rObj[a].checked;

						if (rr)

							oldR = true;

					}

					ss = oldR;

				}			

			if (fieldIsValid)

			error_message  += csv_isBlank(fieldsRequired[n].fld , ss, ok_to_continue, x.obj.type, x.obj.name, x.obj.type);*/ 
                                                                                                                                                                         
/*}

		}



	if (ok_to_continue) {

		if (when == 'submit' || when == 'zippysubmit')

			window.document.forms[0].submit();

		// Added as part of 15353

		else if (when == 'chkissuer')

			chk_issuer();

	}

	else {

		alert(error_message+"\n\nPlease correct your entries and resubmit. ");

		if (when == 'submit')

			//alert("Please correct your entries and resubmit");

			var donothing = true;

		else if(when == 'zippysubmit')

			return false;

	}

}



-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

	PURPOSE: Actual check of blank field

	INPUT  : field display name, value, last error, data type, field name (actual), field type

	RETURNS: Error msg if any required field is empty

	NOTES  : 

-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* 	

function csv_isBlank(fld, val, lastOK, dType, field, fldType)

{

	var nLen = val.length;

	var x = new getFieldObj(field);

	var sError = "";

	

	if (nLen < 1) 	{

		ok_to_continue = false;

		sError = "\n"+fld;

		return sError;

	}

	if (1==2) //!lastOK)

		return "";

	else 	{		

		if (fldType == 'radio' || fldType == 'checkbox') {

			var rObj = document.getElementsByName(field);

			var rLen = rObj.length;

			var rOK = false;

			

			for ( var a=0; a < rLen; a++)

			{					 

				if (rObj[a].checked)

					return ""; 

			}

			ok_to_continue = false;

			sError = "\n"+fld;

			return sError;				

		}		

		if (fldType == 'select-one' ) {

			

			if (val == -1 || val == '') {

				sError = "\n"+fld;

				ok_to_continue = false;

				return sError;

			}

			

			else

				return "";

		}		

	}

	return "";

}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  */
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            ?>