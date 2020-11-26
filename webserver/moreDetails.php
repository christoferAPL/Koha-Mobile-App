<?php 
# *********************************************************************************************************************************************
# * File last edited: November 12, 2020
# * - previously handled only the news section, now provides information for all sections on the MORE page of the app
# * 
# * 11-12-20: updated for the newly created MORE section - CZ
# * 03-13-20: Base version, but copied from Drupal Widget - CZ
# *********************************************************************************************************************************************

# *********************************************************************************************************************************************
# * Universal Links - potetially used in multiple places in the MORE section
# *********************************************************************************************************************************************
$phone      = '905-683-4000';
$website    = '';
$catalogue  = '';

$hours      = array('Closed', 'Closed', '9:30AM-7:00PM', '9:30AM-7:00PM', '9:30AM-7:00PM', '9:30AM-7:00PM', '9:30AM-7:00PM');
$weekDay    = date("w");   # used to determine what day of the week we're on
$todayHours = $hours[$weekDay];


# *********************************************************************************************************************************************
# * Links for the More Page
# * - pathing for app ... shows the title, subtitle and the program flow
# *********************************************************************************************************************************************
$pageLink[] = array('title' => "What's On", 'subtitle' => "Programs, Events and Services.", 'path' => "WhatsOn");
$pageLink[] = array('title' => "Contact Us", 'subtitle' => "We're just a click away.", 'path' => "ContactUs");
$pageLink[] = array('title' => "News", 'subtitle' => "Stay up to date on important Library News.", 'path' => "News");
$pageLink[] = array('title' => "About", 'subtitle' => "Version 1.4.0", 'path' => "null");

# *********************************************************************************************************************************************
# * WHATS ON
# *********************************************************************************************************************************************
$whatsOnBlurb = "Discover What's On at the Library and learn more about our current programs, events, and services.";
$whatsOnButton = "View this Month's What's On";
$whatsOnLink  = 'https://cdn.flipsnack.com/widget/v2/widget.html?hash=h9a7a0sk9s';

# *********************************************************************************************************************************************
# * CONTACT US
# *********************************************************************************************************************************************
$contactUsBlurb    = "It's easy to get help and information on any of our services.";
$contactUsMailLink = "mailto:";

# *********************************************************************************************************************************************
# * NEWS
# *********************************************************************************************************************************************
$news[] = array('date' => 'Nov. 11, 2020', 'newsItem' => "The Library will be upgrading it's catalogue on November 16th.");
$news[] = array('date' => 'Oct. 20, 2020', 'newsItem' => "Access to Main Branch entry doors, drop boxes, computers and collections may be limited due to construction.");
$news[] = array('date' => 'Sept. 2020', 'newsItem' => "All branches of the Ajax Public Library are now open with limited services. Curbside pick-up, browsing, computer bookings and study space available! Please see our website for additional information.");

# ****************************************************************************************************************************
# * assemble the data above into an array for json-ing
# ****************************************************************************************************************************
$more['universal'] = array('todayHours' => $todayHours, 'phone' => $phone, 'website' => $website, 'catalogue' => $catalogue); 
$more['options']   = $pageLink;
$more['whatsOn']   = array('button' => $whatsOnButton, 'blurb' => $whatsOnBlurb, 'link' => $whatsOnLink);
$more['contactUs'] = array('blurb' => $contactUsBlurb, 'email' => $contactUsMailLink);
$more['news']      = array('news' => $news);


# ****************************************************************************************************************************
# * Output to JSON
# ****************************************************************************************************************************
header('Content-Type: application/json');
echo json_encode($more);

?>