<?php
# ****************************************************************************************************************************
# * Last Edit: November 7, 2019
# * - config file for SIP connectivity for mobile app
# *
# * 11-07-19: refactored, cleaned up and commented code - CZ
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
# * - will pass back the 'ValidLogin' field to determine if the password is correct or not
# ****************************************************************************************************************************
if (strpos(json_encode($patron_info), 'Invalid password') > 0) {
  $patronInfo = array('ValidLogin'   => 'No');  
} else {

# ****************************************************************************************************************************
# * grab the array of current checkouts and how many items are checked out (unforunately count($checkouts) doesn't provide
# * fully accurate information
# ****************************************************************************************************************************
  $numberCKO = $patron_info['fixed']['ChargedCount'];
  $checkouts = $patron_info['variable']['AU'];
  
# ****************************************************************************************************************************
# * declare the variable to hold the data for the items checked out
# ****************************************************************************************************************************
  $patronInfo['ValidLogin'] = "Yes";
  $patronInfo['issueCount']   = $patron_info['fixed']['ChargedCount'];
  $patronInfo['holdsPending'] = $patron_info['fixed']['UnavailableCount'];
  $patronInfo['fines']        = 0 + $patron_info['variable']['BV'][0];
  
# ****************************************************************************************************************************
# * loop over result set to format it into a usable json item
# ****************************************************************************************************************************
  for ($x=0; $x < $numberCKO; $x++) {
    $grabItemInfo = $mysip->msgItemInformation($checkouts[$x]);
    $itemInfo     = $mysip->parseItemInfoResponse($mysip->get_message($grabItemInfo));
	//print_r($itemInfo);
	//die();

# ****************************************************************************************************************************
# * need to clean up some of the data
# ****************************************************************************************************************************
	$title   = preg_replace('~[^a-zA-Z\d\s:]+$~', '', $itemInfo['variable']['AJ'][0]);
	$dateDue = '' . substr($itemInfo['variable']['AH'][0], 0, strpos($itemInfo['variable']['AH'][0], ' '));
	$dateDue = substr($dateDue, 0, 4) . '-' . substr($dateDue, 4, 2) . '-' . substr($dateDue, 6, 2);

# ****************************************************************************************************************************
# * set icons - the switch is based on the collection code
# ****************************************************************************************************************************
    $icon = 'placeholder.png';
	
    switch ($itemInfo['variable']['CR'][0]) {
      case 'DVDFIC':
	  case 'BLUFIC':
	  case 'BLUNONFIC':
	  case 'DVDNONFIC':
        $icon = 'media.png';
        break;
	  case 'MUSIC':
        $icon = 'music.png';
        break;
      case 'FICTION':
	  case 'NONFICTION':
        $icon = 'books.png';
        break;
	  default:
	    $icon = 'noImageAvailable.png';
    }
	
    $patronInfo['Items'][] = array('barcode' => $itemInfo['variable']['AB'][0], 'key' => $title, 'dateDue' => $dateDue, 'thumbnail' => $icon); 
  }  
}
// print_r($patronInfo);

# ****************************************************************************************************************************
# * Output to JSON
# ****************************************************************************************************************************
header('Content-Type: application/json');
echo json_encode($patronInfo);
?>