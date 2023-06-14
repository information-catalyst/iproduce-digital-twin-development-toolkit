$(function () {

    function initMap(locations, relationships) {
   
        var location1 = new google.maps.LatLng(50.8019192, 5.220265499999982);//Tenneco Belgium
        
        var mapCanvas = document.getElementById('map');
        var mapOptions = {
            center: location1,
            zoom: 5,
            panControl: false,
            scrollwheel: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        
        var map = new google.maps.Map(mapCanvas, mapOptions);

        locations = locations.split("\n"); //Create array of the string of locations.
        
        var names = [];
        var locs = [];
        var markers = [];
        var infowindows = [];
        var longs = [];
        var lats = [];
        var types = [];
        
        var markerImage = 'resources/map/marker.png';
        
        for(var i =0;i<locations.length-1;i++)
        {
            
            names[i] = locations[i].split(",")[0];
            longs[i] = locations[i].split(",")[1];
            lats[i] = locations[i].split(",")[2];
            var desc = locations[i].split(",")[3];
            var link = locations[i].split(",")[4];
            types[i] = locations[i].split(",")[5];
            console.log(types[i]);
            
            locs[i] = new google.maps.LatLng(longs[i], lats[i]);//Skoda Parague
            
            markers[i] = new google.maps.Marker({
                    position: locs[i],
                    map: map,
                    icon: markerImage
        });
        
        var contentString = '<div class="info-window">' +
                '<h3>'+names[i]+'</h3>' +
                '<div class="info-content">' +
                '<p>'+desc+'</p>' +
                '<p>Click here to explore <a href="'+link+'">'+names[i]+' Data Sources</a></p>' +
                '</div>' +
                '</div>';
            
            infowindows[i] = new google.maps.InfoWindow({
            content: contentString,
            maxWidth: 400
        });
        
         markers[i].addListener('click', (function (i)
         {return function()
             { 
               {//console.log(i);
            infowindows[i].open(map, markers[i]);
          }
      };
  }(i)));
  
       } //End For
       
       
       var lineSymbol = {
         path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
        };
        
        var lines = [];
       
       relationships = relationships.split("\n"); //Create array of the string of locations.
       
       for(var i =0 ; i < relationships.length-1; i++)
       {
           
        var from = relationships[i].split(",")[0];
        var to = relationships[i].split(",")[1];
        var type = relationships[i].split(",")[2];
        var toid;
        var fromid;
        
        if(type=="supplier")
        {
            type = "#FF0000";
        }
        else{
            type = "#0000FF";
        }
        
        for(var j =0; j< locations.length; j++)
        {
            if(from == names [j])
            {
                fromid = j;
            }
            if(to == names [j])
            {
                toid = j;
            }
        }
        
        lines[i] = new google.maps.Polyline({
        path: [
        new google.maps.LatLng(longs[fromid], lats[fromid]), 
        new google.maps.LatLng(longs[toid], lats[toid])
        ],
        icons: [{
        icon: lineSymbol,
        offset: '100%'
      }],
        strokeColor: type,
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: map
        });
       }
 
        // Create the DIV to hold the control and call the CenterControl()
        // constructor passing in this DIV.
        var centerControlDiv = document.createElement('div');
        CenterControl(centerControlDiv, map, markers, types, lines, relationships, names);
        
        centerControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerControlDiv);
    }
    
    function CenterControl(controlDiv, map, markers, types, lines, relationships,names) {

        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '0px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to hide element';
        controlDiv.appendChild(controlUI);
        
        // Set CSS for the control border.
        var controlUI2 = document.createElement('div');
        controlUI2.style.backgroundColor = '#fff';
        controlUI2.style.border = '2px solid #fff';
        controlUI2.style.borderRadius = '3px';
        controlUI2.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI2.style.cursor = 'pointer';
        controlUI2.style.marginBottom = '0px';
        controlUI2.style.textAlign = 'center';
        controlUI2.title = 'Click to hide element';
        controlDiv.appendChild(controlUI2);
        
        // Set CSS for the control border.
        var controlUI3 = document.createElement('div');
        controlUI3.style.backgroundColor = '#fff';
        controlUI3.style.border = '2px solid #fff';
        controlUI3.style.borderRadius = '3px';
        controlUI3.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI3.style.cursor = 'pointer';
        controlUI3.style.marginBottom = '0px';
        controlUI3.style.textAlign = 'center';
        controlUI3.title = 'Click to hide element';
        controlDiv.appendChild(controlUI3);
        
        // Set CSS for the control border.
        var controlUI4 = document.createElement('div');
        controlUI4.style.backgroundColor = '#fff';
        controlUI4.style.border = '2px solid #fff';
        controlUI4.style.borderRadius = '3px';
        controlUI4.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI4.style.cursor = 'pointer';
        controlUI4.style.marginBottom = '0px';
        controlUI4.style.textAlign = 'center';
        controlUI4.title = 'Click to hide element';
        controlDiv.appendChild(controlUI4);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '12px';
        controlText.style.lineHeight = '20px';
        controlText.style.paddingLeft = '2px';
        controlText.style.paddingRight = '2px';
        controlText.style.backgroundColor = 'rgb(169, 169, 169)';
        controlText.innerHTML = 'Production Facility';
        controlUI.appendChild(controlText);
        
        // Set CSS for the control interior.
        var controlText2 = document.createElement('div');
        controlText2.style.color = 'rgb(25,25,25)';
        controlText2.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText2.style.fontSize = '12px';
        controlText2.style.lineHeight = '20px';
        controlText2.style.paddingLeft = '2px';
        controlText2.style.paddingRight = '2px';
        controlText2.style.backgroundColor = 'rgb(169, 169, 169)';
        controlText2.innerHTML = 'Automation Solution';
        controlUI2.appendChild(controlText2);
        
        // Set CSS for the control interior.
        var controlText3 = document.createElement('div');
        controlText3.style.color = 'rgb(25,25,25)';
        controlText3.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText3.style.fontSize = '12px';
        controlText3.style.lineHeight = '20px';
        controlText3.style.paddingLeft = '2px';
        controlText3.style.paddingRight = '2px';
        controlText3.style.backgroundColor = 'rgb(169, 169, 169)';
        controlText3.innerHTML = 'OEM';
        controlUI3.appendChild(controlText3);
        
         // Set CSS for the control interior.
        var controlText4 = document.createElement('div');
        controlText4.style.color = 'rgb(25,25,25)';
        controlText4.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText4.style.fontSize = '12px';
        controlText4.style.lineHeight = '20px';
        controlText4.style.paddingLeft = '2px';
        controlText4.style.paddingRight = '2px';
        controlText4.style.backgroundColor = 'rgb(169, 169, 169)';
        controlText4.innerHTML = 'Supplier';
        controlUI4.appendChild(controlText4);

        // Setup the click event listeners PROD
        controlUI.addEventListener('click', function() {
            var colour;
            if($(this).children().css('background-color') == 'rgb(169, 169, 169)')
            {
                colour = "white";
            }
            else{
                colour = "DarkGrey"
            }
            
            $(this).children().css('background-color', colour);

            for(var i =0; i< types.length; i++)
            {
                if(types[i] == "prod")
                {
                    var vis = markers[i].getVisible();
                    if(vis)
                    {
                        vis = false;
                    }
                    else
                    {
                        vis = true;
                    }
                  markers[i].setVisible(vis); //How to hide a marker.
                  
                  for(var j =0; j<relationships.length-1;j++)
                  {
                      var from = relationships[j].split(",")[0];
                      var to = relationships[j].split(",")[1];
                      
                      
                      if((names[i] == from || names[i] == to))
                      {
                            var toPos = names.indexOf(to);
                            var fromPos = names.indexOf(from);
                            var vis = true;
                            if(markers[toPos].getVisible() == false || markers[fromPos].getVisible() == false)
                            {
                                vis = false;
                            }
                            lines[j].setVisible(vis);
                            //lineAlreadyToggled[j] = true;
                      }
                  }
                }
            }
        });
        
         // Setup the click event listeners AUTO
        controlUI2.addEventListener('click', function() {
            var colour;
            if($(this).children().css('background-color') == 'rgb(169, 169, 169)')
            {
                colour = "white";
            }
            else{
                colour = "DarkGrey"
            }
            
            $(this).children().css('background-color', colour);
            
            for(var i =0; i< types.length; i++)
            {
                if(types[i] == "auto")
                {
                     var vis = markers[i].getVisible();
                    if(vis)
                    {
                        vis = false;
                    }
                    else
                    {
                        vis = true;
                    }
                  markers[i].setVisible(vis); //How to hide a marker.
                  
                  for(var j =0; j<relationships.length-1;j++)
                  {
                      var from = relationships[j].split(",")[0];
                      var to = relationships[j].split(",")[1];
                      if(names[i] == from || names[i] == to)
                      {
                            var toPos = names.indexOf(to);
                            var fromPos = names.indexOf(from);
                            var vis = true;
                            if(markers[toPos].getVisible() == false || markers[fromPos].getVisible() == false)
                            {
                                vis = false;
                            }
                            lines[j].setVisible(vis);
                            //lineAlreadyToggled[j] = true;
                      }
                  }
                }
            }
        });
        
        // Setup the click event listeners OEM
        controlUI3.addEventListener('click', function() {
            var colour;
            if($(this).children().css('background-color') == 'rgb(169, 169, 169)')
            {
                colour = "white";
            }
            else{
                colour = "DarkGrey"
            }
            
            $(this).children().css('background-color', colour);

            for(var i =0; i< types.length; i++)
            {
                if(types[i] == "oem")
                {
                    var vis = markers[i].getVisible();
                    if(vis)
                    {
                        vis = false;
                    }
                    else
                    {
                        vis = true;
                    }
                  markers[i].setVisible(vis); //How to hide a marker.

                  for(var j =0; j<relationships.length-1;j++)
                  {
                      var from = relationships[j].split(",")[0];
                      var to = relationships[j].split(",")[1];
                      if(names[i] == from || names[i] == to)
                      {
                            var toPos = names.indexOf(to);
                            var fromPos = names.indexOf(from);
                            var vis = true;
                            if(markers[toPos].getVisible() == false || markers[fromPos].getVisible() == false)
                            {
                                vis = false;
                            }
                            lines[j].setVisible(vis);
                      }
                  }
                }
            }
        });
        
        // Setup the click event listeners Supplier
        controlUI4.addEventListener('click', function() {
            var colour;
            if($(this).children().css('background-color') == 'rgb(169, 169, 169)')
            {
                colour = "white";
            }
            else{
                colour = "DarkGrey"
            }
            
            $(this).children().css('background-color', colour);
                  
            for(var i =0; i< types.length; i++)
            {
                if(types[i] == "supplier")
                {
                    var vis = markers[i].getVisible();
                    if(vis)
                    {
                        vis = false;
                    }
                    else
                    {
                        vis = true;
                    }
                  markers[i].setVisible(vis); //How to hide a marker.

                  for(var j =0; j<relationships.length-1;j++)
                  {
                      var from = relationships[j].split(",")[0];
                      var to = relationships[j].split(",")[1];
                      if(names[i] == from || names[i] == to)
                      {
                            var toPos = names.indexOf(to);
                            var fromPos = names.indexOf(from);
                            var vis = true;
                            if(markers[toPos].getVisible() == false || markers[fromPos].getVisible() == false)
                            {
                                vis = false;
                            }
                            lines[j].setVisible(vis);
                      }
                  }
                }
            }
        });


      }


//        var markerImage = 'resources/map/marker.png';
//        var markerImage1 = 'resources/pictures/skoda_logo.png';
//        var markerImage2 = 'resources/pictures/control2k_logo.png';
//        var markerImage3 = 'resources/pictures/tenneco_logo.png';
//        var markerImage4 = 'resources/pictures/fagor_logo.png';


    function loadTheMap(){
    //Load locations on the map.
    $.ajax({
        type: "post",
        url: "getIndexMapLocations.jsp",
        success: function(msg) {
            //console.log(msg);
            msg = msg.split("<body>")[1];
            msg = msg.split("</body")[0].replace(/(^[ \t]*\n)/gm, "");
            //console.log(msg);
            loadTheRelationships(msg);
        },
        error: function(request,error){
            //Error
        }
        });
    }
    
    function loadTheRelationships(loadTheMap){
    //Load locations on the map.
    $.ajax({
        type: "post",
        url: "getIndexMapRelationships.jsp",
        success: function(msg) {
            //console.log(msg);
            msg = msg.split("<body>")[1];
            msg = msg.split("</body")[0].replace(/(^[ \t]*\n)/gm, "");
            console.log(msg);
            //Generate Map.
        google.maps.event.addDomListener(window, 'load', initMap(loadTheMap,msg));
        },
        error: function(request,error){
            console.log("Error: "+error);
        }
        });
    }
    
    loadTheMap();

});