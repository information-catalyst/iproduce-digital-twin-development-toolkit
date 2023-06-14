function resetpage() {
    location.reload();
}

//Function to load a place to the webView
function loadPlace(placeId){
    location.href = location.href.replace(/place=[^&]+/, 'place=' + placeId);
}

function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//set the default place
var place = getParameterByName('place');
if ((place == null) || (place == "")) {
    place = config.defaultPlace;
}

var id = getParameterByName('id');
queryParam = getParameterByName('title');
dataSource = getParameterByName('url');
dataSource += "?&pagesize=10";
$("#heading").html(queryParam);
var uname = getParameterByName('uname');

//Link back to previous page
var parts = getParameterByName('topLevel');
var linkBack = "";
if (parts != null) {
    for (var i = 0; i < parts.length; i++) {
        linkBack += parts[i];
    }
}
prevPage = getParameterByName('backLink') + "&id=" + getParameterByName('id') + "&topLevel=" + linkBack + "&uname=" + uname;
$("#headingHREF").attr("href", prevPage);
hierarchy = getParameterByName('hierarchy') + " " + queryParam;
$("#hierarchy").html(hierarchy);