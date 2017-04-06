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
var rawdata = null; // raw json from google drive
var data; // reformatted json


console.log( "Data source: " + source );


var jqxhr = $.get( source, function(datafromweb) {
  console.log( "Data loaded from Google successfully");
  rawdata = datafromweb
//  alert( "success" );
  processdata();
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



function processdata() {
  var debug = JSON.stringify(rawdata);

  // Process the data into a more usable format
  data = cleanupdata(rawdata);
  console.dir(data);

}

function cleanupdata(rawdata) {

  // final output array
  var out = [];

  // Get the main data body - ignore spreadsheet metadata
  data = rawdata.feed.entry;


  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    var tmp = {}; // to be added to output array at end of loop instance

//    console.dir(row);

    // Parse data

    // row ID
    tmp.id = row.gsx$_cn6ca.$t;
    tmp.last_updated = row.updated.$t;
    tmp.season = row.gsx$season.$t;
    tmp.week = row.gsx$wk.$t;
    tmp.days = row.gsx$days.$t;
    tmp.yrs = row.gsx$yrs.$t;
    tmp.dates = row.gsx$dates.$t;
    tmp.notes = row.gsx$notes.$t;
    tmp.sep_pg = row.gsx$seppg.$t;
    tmp.scripture_citation = row.gsx$scriptureverses.$t;
    tmp.proper = row.gsx$proper.$t;
    tmp.incipit = {
      'latin' : row.gsx$incipitlatin.$t,
      'english' : row.gsx$incipitsepenglish.$t
    };
    tmp.text = {
      'english_romanmissal' : row.gsx$romanmissaltranslationifnotsep.$t,
      'english_other' : row.gsx$rgpandorproprietarytranslationifnotseporinromanmissal.$t
    };
    tmp.verses = {
      'communion' : row.gsx$versesifco.$t,
      'offertory' : row.gsx$offverses.$t
    };
    tmp.score = {
      'by_raw' : row.gsx$gabccodesubmittedbybenyanke.$t,
      'aae_raw' : row["gsx$gabcrevisionsbyaristotlea.esguerra"].$t,
      'final_from_source' : row.gsx$gabcwopsalmtone.$t,
    };
    tmp.page_number = {
      'graduale_romanum' : row.gsx$grpg.$t,
      'simple_english_propers' : row.gsx$feppg.$t,
    };

    tmp.duplicate = row.gsx$duplicate.$t;
    tmp.psalmtoneformula = row.gsx$psalmtoneformula.$t;
    tmp.psalmtone = row.gsx$psalmtone.$t;



    console.log(tmp)

    // Add parsed data to the output array
    out.push(tmp);
  }

  return out;
}

// function score(id, season, week, days, years, dates, notes, seppg, scripturevs, proper, mode, incipit-latin, incipit-sep-english, incipit-rm-english, incipit-other-english, co-verses, by-gabc, aae-gabc, private-note, gr-pg, fep-pg, gabc, of-vs, duplicate, sep-header, psalmtone-formula, psalmtone);

/*

document.body.innerHTML = debug;

console.log(rawdata);
*/
