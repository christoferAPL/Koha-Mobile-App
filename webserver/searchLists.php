<?php 
# *********************************************************************************************************************************************
# * File last edited: March 16, 2020
# * - shows the canned searching options
# * 
# * 03-13-20: Base version - CZ
# *********************************************************************************************************************************************

# *********************************************************************************************************************************************
# * Need ability to specify the Koha Report number, then the report name to show on the screen. Needs to pull back uniform results
# * - array scope (0: title to show in app;    1: Koha report number)
# *********************************************************************************************************************************************
$cannedReports['list'][] = array('ListName' => 'Downloadable eBooks', 'RptNumber' => '483');
$cannedReports['list'][] = array('ListName' => 'Downloadable eVideo', 'RptNumber' => '484');
$cannedReports['list'][] = array('ListName' => 'Ajax Healthy Kids: Play!', 'RptNumber' => '493');

# ****************************************************************************************************************************
# * Output to JSON
# ****************************************************************************************************************************
header('Content-Type: application/json');
echo json_encode($cannedReports);
?>