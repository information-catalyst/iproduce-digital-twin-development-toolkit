 


window.addEventListener("DOMContentLoaded", () => {
  onLoadFixFrameSources();
});



window.addEventListener("load", () => {


  
  var carousels = document.querySelectorAll(".carousel");

  for (var i = 0; i < carousels.length; i++) {
    carousel(carousels[i]);
  }
});

function carousel(root) {
  var figure = root.querySelector(".carousel-container"),
    nav = root.querySelector("nav"),
    images = figure.children,
    n = images.length,
    gap = root.dataset.gap || 0,
    bfc = "bfc" in root.dataset,
    theta = 2 * Math.PI / n,
    currImage = 0;

  setupCarousel(n, parseFloat(getComputedStyle(images[0]).width));
  window.addEventListener("resize", () => {
    setupCarousel(n, parseFloat(getComputedStyle(images[0]).width));
  });

  setupNavigation();

  function setupCarousel(n, s) {
    var apothem = s / (2 * Math.tan(Math.PI / n));

    figure.style.transformOrigin = `50% 50% ${-apothem}px`;

    for (var i = 0; i < n; i++) images[i].style.padding = `${gap}px`;
    for (i = 1; i < n; i++) {
      images[i].style.transformOrigin = `50% 50% ${-apothem}px`;
      images[i].style.transform = `rotateY(${i * theta}rad)`;
    }
    if (bfc)
      for (i = 0; i < n; i++) images[i].style.backfaceVisibility = "hidden";

    rotateCarousel(currImage);
  }



  function clickIfFound(tDoc,tTag,tString){
    var aTags = tDoc.getElementsByTagName(tTag);
    var searchText = tString;
    var found;

    for (var i = 0; i < aTags.length; i++) {
      if (aTags[i].textContent == searchText) {
        found = aTags[i];
        break;
      }
    }
    found.click();
  }

  function doubleClickIfFound(tDoc,tTag,tString){
        var sTags = tDoc.getElementsByTagName(tTag);
        var searchText = tString;
        var found;

        for (var i = 0; i < sTags.length; i++) {
          if (sTags[i].textContent == searchText) {
            found = sTags[i];
            break;
          }
        }
        //found.click();
        var event = new MouseEvent('dblclick', {
          'view': window,
          'bubbles': true,
          'cancelable': true
        });
        found.dispatchEvent(event);
  }



/*
  // Alternate iframe document extraction code 
  // WARNIG THIS FAILED BUT EXPECT BROWSER COMPATIBILTY ISSUES
    if (window.frames && window.frames.pdeFrame &&
        (iframeDoc = window.frames.pdeFrame.document)) {
        iframeBody = iframeDoc.body;
        ifromContent = iframeBody.innerHTML;
    }

  // extended iframe document extraction code
    var e = document.getElementById("pdeFrame");

    var iframeDoc;
    var iframeBody;
    var iframeContent;
    
    if(e != null) {
       iframeDoc = e.contentWindow.document;
       iframeBody = e.contentWindow.document.body;
       iframeContent = e.contentWindow.document.body.innerHTML;
    }


*/

  function runPDE(taskname = "3DFactory4_001") {
    //get iframe doc of PDE 
    var e = document.getElementById("pdeFrame");

    var iframeDoc;
    if(e != null) {
       iframeDoc = e.contentWindow.document;
    }

    // start controlling the embeded frame
    // open process store
    clickIfFound(iframeDoc,"a","Process store")

    // wait for process store to open
    setTimeout(function() {
       // load process 
        doubleClickIfFound(iframeDoc,"span",taskname);

        // click the play button
        var iTags = iframeDoc.getElementsByClassName("fa-play");
        iTags[0].click();

        // wait for process to load
        setTimeout(function() {
            // press start simulation
            clickIfFound(iframeDoc,"span","Start simulation");
        }, (10 * 1000));


    }, (10 * 1000));
  }


  function setupNavigation() {
    nav.addEventListener("click", onClick, true);

    function onClick(e) {
      e.stopPropagation();

      var t = e.target;
      if (t.tagName.toUpperCase() != "BUTTON") return;

      if (t.classList.contains("next")) {
        currImage++;
      } else if (t.classList.contains("prev")){
        currImage--;
      } else if (t.classList.contains("run")){
        var e = document.getElementById("ddlViewBy");
        var strUser = e.options[e.selectedIndex].value;



        runPDE(strUser);
      }

      rotateCarousel(currImage);
    }



    window.addEventListener("keydown", dealWithKeyboard, false);

    function dealWithKeyboard(e) {
      e.stopPropagation();
      switch(e.keyCode) {
          case 37:
              // left key pressed
              currImage--;
              rotateCarousel(currImage);
              break;
          case 38:
              // up key pressed
              break;
          case 39:
              // right key pressed
              currImage++;
              rotateCarousel(currImage);
              break;
          case 40:
              // down key pressed
              break;  
      }   

    }

  }

  function rotateCarousel(imageIndex) {
    //figure.style.width  = "80px";
    figure.style.transform = `rotateY(${imageIndex * -theta}rad)`;
  }
}

function onLoadFixFrameSources() {
  var pdeUrl =":7080/pde";
  var threedeeUrl =":7081/crane101.html?place=1";
  var grafanaUrl =":7066/d/w24U8uZik/process-data?orgId=1&from=now-15m&to=now&refresh=5s&var-machine=All&var-states=All&var-Process=All";
  //var videoUrl =":7076/view.html";
  var videoUrl =":7073/factory/webcam.html";

  var dashUrl =":7063";
/* */
  var baseUrl = location.hostname;
  document.getElementById('pdeFrame').src = "http://"+baseUrl+pdeUrl;
  document.getElementById('digitaltwinframe').src = "http://"+baseUrl+threedeeUrl;
  document.getElementById('grafana').src = "http://"+baseUrl+grafanaUrl;
  document.getElementById('videoframe').src = "http://"+baseUrl+videoUrl;
  //document.getElementById('webdashframe').src = "http://"+baseUrl+dashUrl;



  function forceReload(iframe){
      if(iframe.src.indexOf('reloadtimestamp') > -1){ // Check if we still have a reloadtimestamp in the URL from a previous refresh
        iframe.src = iframe.src.replace(/reloadtimestamp=[^&]+/, 'reloadtimestamp=' + Date.now()); // And if so, replace it instead of appending so the URL doesn't grow too long.
      }else{ // Else we will append the reloadtimestamp
        iframe.src += (iframe.src.indexOf('?') > -1 ? "&" : "?") + 'reloadtimestamp=' + Date.now();// If the URL contains a ?, append &reloadtimestamp=...; otherwise, append ?reloadtimestamp=...
      }
  };

  forceReload(document.getElementById('pdeFrame'));
  forceReload(document.getElementById('digitaltwinframe'));
  forceReload(document.getElementById('grafana'));
  forceReload(document.getElementById('videoframe'));
  //forceReload(document.getElementById('webdashframe'));







/* */  
}

