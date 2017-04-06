/*
* Ferial English Propers Parser
*
*
*/

/* Steps:
* Get JSON
* Select seasons from json, reformat into nested json array by season
* Parse new json
*/

var source="https://spreadsheets.google.com/feeds/list/16PYP_tEqubwKEZlfqZLwiVydMQ6ZPV02w-rkOwI2S5I/od6/public/values?alt=json";
// var source="https://brokenspreadsheets.google.com/feeds/list/16PYP_tEqubwKEZlfqZLwiVydMQ6ZPV02w-rkOwI2S5I/od6/public/values?alt=json";
var rawdata; // raw json from google drive
var data; // reformatted json


console.log( "Data source: " + source );


var jqxhr = $.get( source, function(datafromweb) {
  console.log( "Data loaded from Google successfully");
  rawdata = this.datafromweb
//  alert( "success" );
})
  .fail(function() {
    console.log( "There was an error connecting to data. Can not continue" );
  })
/*  .always(function() {
    alert( "finished" );
  });
*/
// Perform other work here ...
 
// Set another completion function for the request above

/* jqxhr.always(function() {
  alert( "second finished" );
});
*/


