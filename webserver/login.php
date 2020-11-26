<?php
# ****************************************************************************************************************************
# * Last Edit: November 7, 2019
# * - config file for SIP connectivity for mobile app
# *
# * 11-07-19: removed unnecessary code from being sent back - CZ
# * 10-31-19: refactored, cleaned up and commented code - CZ
# ****************************************************************************************************************************

# ****************************************************************************************************************************
# * include the required files
# ****************************************************************************************************************************
include_once('config.php');
include_once('sip2.php');

# ****************************************************************************************************************************
# * instanciate the SIP instance
# ****************************************************************************************************************************
$mysip = new sip2;

# ****************************************************************************************************************************
# * connect to SIP service; fail if not succcessful. if we pass this, then connection was successful
# ****************************************************************************************************************************
if(! $mysip->connect()) { 
 die();
}

# ****************************************************************************************************************************
# * Do a quick check to ensure that the login credentials are correct - for SIP
# ****************************************************************************************************************************
$sc_login = $mysip->msgLogin(SIP_LOGIN, SIP_PASSWORD);
$mysip->parseLoginResponse($mysip->get_message($sc_login));
  
# ****************************************************************************************************************************
# * Prep the patron information for checking - dummy out something just in case
# ****************************************************************************************************************************
$barcode = "thisisadummybarcodeincaseitisleftblank";
$pin     = 1234567890;

if (! empty($_GET['barcode'])) { $barcode = $_GET['barcode']; }
if (! empty($_GET['pin'])) { $pin = $_GET['pin']; }  

# ****************************************************************************************************************************
# * fail if the barcode is not 14 digits long
# ****************************************************************************************************************************
if (strlen($barcode) != 14) {
  $patronInfo = array('ValidLogin'   => 'No');
  header('Content-Type: application/json');
  echo json_encode($patronInfo);
  die();
}
  
$mysip->patron = $barcode;
$mysip->patronpwd = $pin;

# ****************************************************************************************************************************
# * Unsure why this needs to be 'charged', but it works
# ****************************************************************************************************************************
$ptrnmsg = $mysip->msgPatronInformation('charged');
$patron_info = $mysip->parsePatronInfoResponse( $mysip->get_message($ptrnmsg));
//print_r($patron_info);

# ****************************************************************************************************************************
# * need to check if the password put in is correct ... json-ing this because it puts the associative array into a string
# ****************************************************************************************************************************
if (strpos(json_encode($patron_info), 'Invalid password') > 0) {
  $patronInfo = array('ValidLogin'   => 'No');  
} else {

# ****************************************************************************************************************************
# * assemble the patron information array
# ****************************************************************************************************************************
  $patronInfo = array(
    'ValidLogin'   => 'Yes',
    'ChargeCount'  => $patron_info['fixed']['ChargedCount'],
    'OverdueCount' => $patron_info['fixed']['OverdueCount'],
    'Name'         => substr($patron_info['variable']['Raw'][2], 2),
    'CKO'          => $checkOutList,
    'Fines'        => $patron_info['variable']['BV'][0]
  );
}
// print_r($patronInfo);

# ****************************************************************************************************************************
# * Output to JSON
# ****************************************************************************************************************************
header('Content-Type: application/json');
echo json_encode($patronInfo);
?>