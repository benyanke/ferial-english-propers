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

// Not yet fully working, leave disabled
var fade = false;
var fadetime = "slow";

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

  // Change the headings into human-readable headings
  data = cleanupdata(rawdata);

  // Creates a nested array from the flat array, seperating by season
  data = nest_chants_by_season(data);

  // Create the navigation by season
  create_nav(data);

  // Display chants
  display_chants(data);

  // When loading is complete, hide all the "loading" elements around the page
  hide_loading_elements();

  // debugging lines
  console.log("");
  console.log("For the curious, here's our chant list:");
  console.dir(data);

}

// Converts from Google Spreadsheet's confusing headings to human readable data headings
// Does not minipulate data beyond changing headings
function cleanupdata(rawdata) {

  // final output array
  var out = [];

  // Get the main data body - ignore spreadsheet metadata
  data = rawdata.feed.entry;

  // Loop through raw data to reformat
  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    var tmp = {}; // to be added to output array at end of loop instance

    // Parse data into a new array with clearer headers
    tmp.id = row.gsx$_cn6ca.$t;
    tmp.last_updated = row.updated.$t;
    tmp.season = row.gsx$season.$t;
    tmp.day_type = row.gsx$type.$t;
    tmp.week = {
      'roman' : row.gsx$wk.$t,
      'int' : row.gsx$wkint.$t,
    };
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



//    console.log(tmp)

    // Add parsed data to the output array
    out.push(tmp);
  }

  return out;
}


function nest_chants_by_season(data) {
  var out = {}; // final output
  var seasons = []; // list of seasons found

//  console.log(data);

  // Get unique list of seasons from source data
  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    var rowseason = row.season;

    // Add seasons uniquely to season list
    if(seasons.indexOf(row.season) === -1) {
      seasons.push(row.season);
    }
  } // end season-list for loop



  // Convert to a nested array by season, then by week
  // This is not efficient, O(n^2)
  // TODO: rewrite later to do in O(n) time.
  for (var i = 0; i < seasons.length; i++) {
    var season = seasons[i];
    var tmp = [];

//    console.log("Starting sorting \"" + season + "\" chants");

    for (var j = 0; j < data.length; j++) {
      var row = data[j];

      // if the row matches, push to the tmp
      if(row.season == season) {
        tmp.push(row);
      } //end season if
    } //end data for loop

    out[season] = tmp;

  } // end nested array conversion


  console.log("Finished sorting chants by season");

  // return ALSO outputs to console
  return out;

} // end nest_chants_by_season


function create_nav(data) {
  console.log("Creating navigation from season list");

  // Get list of seasons, contained in the keys of the main data
  seasons = Object.keys(data);

  for (var i = 0; i < seasons.length; i++) {
    var season = seasons[i];
//    console.log("Adding nav entry for " + season);

    // Sanitize for use within url
    id = sanitize_season_name(season);

    add_nav_entry(season, id);
  } // end loop through season

} // end create_nav


function add_nav_entry(name, id) {

  $('ul.nav').append(
    $('<li>').attr('class','page-scroll').append(
      $('<a>').attr('href','#' + id).append(name)
  ));

  return 0;
} // end add_nav_entry


// Call this on load completion
function hide_loading_elements() {
  console.log("Loading complete, hiding \"loading\" elements");

  if(fade) {
    $('.hideonload').fadeOut(fadetime);
  } else {
    $('.hideonload').hide();
  }

}


function display_chants(data) {

//  console.log("Displaying all chants");

  // Get list of seasons, contained in the keys of the main data
  seasons = Object.keys(data);

  // Loop through seasons
  for (var season in data) {
    var chants_within_season = data[season];

    display_season_heading(season);
    display_season_chants(chants_within_season);
    display_season_footing();

  } // end season loop


} // end display_chants


function display_season_heading(season) {

  $("body").append(`<!-- ` + season + ` Chants -->
    <section id="` + sanitize_season_name(season) + `" class="intro-section">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <h1>` + season + `</h1>
                    <p>Chants for ` + season + `</p>`);

} // end display_season_heading

function display_season_footing(season) {

  $("body").append(`
                </div>
            </div>
        </div>
    </section>`);

} // end display_season_footing

function display_season_chants(chants_within_season) {
  console.log("Sorting through chants in SEASON");


  for (var i = 0; i < chants_within_season.length; i++) {
    var chant = chants_within_season[i];

    display_single_chant(chant, "body");

  } // end loop within season

} // end display_season_chants




function display_single_chant(chant, appendto) {

  console.log("Displaying \"" + chant.incipit.latin + "\"");

  // Create container for chant
  $(appendto).append(`<span id=chantid` + chant.id + `>` + chant.incipit.latin + `</div><br />`);



  // Setting up exsurge
  var ctxt = new exsurge.ChantContext();


  // Select proper GABC file
  if(chant.score.aae_raw.length > 10) {
    var gabc = chant.score.aae_raw;
  } else if(chant.score.by_raw.length > 10) {
    var gabc = chant.score.by_raw;
  } else {
    return 0;
  }


//   document.write(gabc);

    var ctxt = new exsurge.ChantContext();
    ctxt.lyricTextFont = "'Crimson Text', serif";
    ctxt.lyricTextSize *= 1.2;
    ctxt.dropCapTextFont = ctxt.lyricTextFont;
    ctxt.annotationTextFont = ctxt.lyricTextFont;
    var score;
    var gabcSource = document.getElementById('gabcSource');
    var chantContainer = document.getElementById('chant-container');



/*

  var score = exsurge.Gabc.loadChantScore(ctxt, gabc, true);

  // perform layout on the chant
  score.performLayout(ctxt, function() {
    score.layoutChantLines(ctxt, 1000, function() {

      // render the score to svg code
      var svgNode = document.createElement('div');
      var innerHtml = score.createDrawable(ctxt);
      svgNode.innerHTML = innerHtml;
      document.body.appendChild(svgNode);
    });
  });


*/



} // end display_single_chant


function sanitize_season_name(season) {

  // Convert to lowercase
  id = season.toLowerCase();

  // Convert special characters to space
  id = id.replace(/[^a-zA-Z0-9]/g, ' ');

  // Convert spaces to hyphen
  id = id.replace(/\s+/g, '-');

  return id;

} //end sanitize_season_name

