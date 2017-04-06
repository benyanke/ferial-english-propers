<?php

$spreadsheetKey="16PYP_tEqubwKEZlfqZLwiVydMQ6ZPV02w-rkOwI2S5I";

// Parsing this spreadsheet: https://spreadsheets.google.com/pub?key=0Ah0xU81penP1dFNLWk5YMW41dkcwa1JNQXk3YUJoOXc&hl=en&output=html
$url = 'http://spreadsheets.google.com/feeds/list/' . $spreadsheetKey . '/od6/public/values?alt=json';
$file= file_get_contents($url);
$json = json_decode($file);

echo "<pre>"; print_r($json);
die;

$rows = $json->{'feed'}->{'entry'};
foreach($rows as $row) {
  echo '<p>';
  $title = $row->{'gsx$title'}->{'$t'};
  $author = $row->{'gsx$author'}->{'$t'};
  $review = $row->{'gsx$review'}->{'$t'};
  echo $title . ' by ' . $author . '<br>' . $review;
  echo '</p>';
}
// See this here: http://imagine-it.org/google/spreadsheets/showspreadsheet.php
?>
