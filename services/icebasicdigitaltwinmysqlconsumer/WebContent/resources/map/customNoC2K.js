$(function () {

    function initMap() {

        var location1 = new google.maps.LatLng(50.0875726, 14.4189987);//Skoda Parague
        var location2 = new google.maps.LatLng(51.495515, -3.5428704999999354);//C2K Bridgend
        var location3 = new google.maps.LatLng(50.8019192, 5.220265499999982);//Tenneco Belgium
        var location4 = new google.maps.LatLng(43.0553641, -2.492384799999968);//Fagor Spain
        var location5 = new google.maps.LatLng(47.0553641, 1.492384799999968);//Inbetween Fagor and Tenneco

        var mapCanvas = document.getElementById('map');
        var mapOptions = {
            center: location5,
            zoom: 5,
            panControl: false,
            scrollwheel: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        var map = new google.maps.Map(mapCanvas, mapOptions);

        var markerImage = 'resources/map/marker.png';
        var markerImage1 = 'resources/pictures/skoda_logo.png';
        var markerImage2 = 'resources/pictures/control2k_logo.png';
        var markerImage3 = 'resources/pictures/tenneco_logo.png';
        var markerImage4 = 'resources/pictures/fagor_logo.png';

//        var marker1 = new google.maps.Marker({
//                    position: location1,
//                    map: map,
//                    icon: markerImage
//        });
//        var marker2 = new google.maps.Marker({
//                    position: location2,
//                    map: map,
//                    icon: markerImage
//        });
        var marker3 = new google.maps.Marker({
                    position: location3,
                    map: map,
                    icon: markerImage
        });
        var marker4 = new google.maps.Marker({
                    position: location4,
                    map: map,
                    icon: markerImage
        });
//        var contentString1 = '<div class="info-window">' +
//                '<h3>SKODA Prague</h3>' +
//                '<div class="info-content">' +
//                '<p>The skoda manufacturing factility provides numerous data sources to be utilised and linked with partner companies.</p>' +
//                '<p>Click here to explore <a href="dataSources.jsp?name=SKODA&id=SKODA&topLevel=">SKODA Data Sources</a></p>' +
//                '</div>' +
//                '</div>';

//        var contentString2 = '<div class="info-window">' +
//                '<h3>C2K Bridgend</h3>' +
//                '<div class="info-content">' +
//                '<p>The C2K manufacturing factility provides numerous data sources to be utilised and linked with partner companies.</p>' +
//                '<p>Click here to explore <a href="dataSources.jsp?name=C2K&id=C2K&topLevel=">C2K Data Sources</a></p>' +
//                '</div>' +
//                '</div>';

        var contentString3 = '<div class="info-window">' +
                '<h3>Tenneco Belgium</h3>' +
                '<div class="info-content">' +
                '<p>The Tenneco manufacturing factility provides numerous data sources to be utilised and linked with partner companies.</p>' +
                '<p>Click here to explore <a href="dataSources.jsp?name=Tenneco&id=Tenneco&topLevel=">Tenneco Data Sources</a></p>' +
                '</div>' +
                '</div>';

        var contentString4 = '<div class="info-window">' +
                '<h3>Fagor Spain</h3>' +
                '<div class="info-content">' +
                '<p>The Fagor manufacturing factility provides numerous data sources to be utilised and linked with partner companies.</p>' +
                 '<p>Click here to explore <a href="dataSources.jsp?name=Fagor&id=Fagor&topLevel=">Fagor Data Sources</a></p>' +
                '</div>' +
                '</div>';


//        var infowindow1 = new google.maps.InfoWindow({
//            content: contentString1,
//            maxWidth: 400
//        });
//        var infowindow2 = new google.maps.InfoWindow({
//            content: contentString2,
//            maxWidth: 400
//        });
        var infowindow3 = new google.maps.InfoWindow({
            content: contentString3,
            maxWidth: 400
        });
        var infowindow4 = new google.maps.InfoWindow({
            content: contentString4,
            maxWidth: 400
        });

//        marker1.addListener('click', function () {
//            infowindow1.open(map, marker1);
//        });

//        marker2.addListener('click', function () {
//            infowindow2.open(map, marker2);
//        });

        marker3.addListener('click', function () {
            infowindow3.open(map, marker3);
        });

        marker4.addListener('click', function () {
            infowindow4.open(map, marker4);
        });
    }
    google.maps.event.addDomListener(window, 'load', initMap);
});