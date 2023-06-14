// Function to reload the given Iframe.
function forceReload(iframe) {
  if (iframe.src.indexOf("reloadtimestamp") > -1) {
    // Check if we still have a reloadtimestamp in the URL from a previous refresh
    iframe.src = iframe.src.replace(
      /reloadtimestamp=[^&]+/,
      "reloadtimestamp=" + Date.now()
    ); // And if so, replace it instead of appending so the URL doesn't grow too long.
  } else {
    // Else we will append the reloadtimestamp
    iframe.src +=
      (iframe.src.indexOf("?") > -1 ? "&" : "?") +
      "reloadtimestamp=" +
      Date.now(); // If the URL contains a ?, append &reloadtimestamp=...; otherwise, append ?reloadtimestamp=...
  }
}

//Function to reload the grafana dasahboard.
function forceReloadGrafana() {
  forceReload(document.getElementById("grafana"));
}

//Function to retrive all the processes from the baseX database
function getProcesses() {
  var xmlhttp = new XMLHttpRequest();
  var url = config.basexUrl;
  var statusDiv = document.getElementById("ProcessSelectStatus");
  statusDiv.innerHTML = "Booting";

  xmlhttp.onreadystatechange = function () {
    //        if (this.status != 0 && this.status != 200) {
    statusDiv.innerHTML =
      "ReadyState" +
      this.readyState.toString() +
      "Status:" +
      this.status.toString() +
      "Text:" +
      this.statusText;
    //        }
    if (this.readyState == 4 && this.status == 200) {
      var xmlDoc = this.responseXML;
      addProcessesToDropDown(xmlDoc);
    }
    if (this.readyState == 4 && this.status == 502) {
      // If the baseX database is not reddy try again in 15 seconds.
      setTimeout(getProcesses, 15000);
    }
  };

  xmlhttp.open("GET", url, true);
  xmlhttp.setRequestHeader(
    "Authorization",
    "Basic " + btoa(config.basexUsername + ":" + config.basexPassword)
  );
  xmlhttp.send();
}

//Funtion to add proceses to the dropdown from the XML.
function addProcessesToDropDown(xmlDoc) {
  var xcn = xmlDoc.getElementsByTagName("rest:resource");
  for (var i = 0; i < xcn.length; i++) {
    //var fName = xmlDoc.getElementsByTagName("rest:resource")[0].childNodes[0].nodeValue;
    var fName =
      xmlDoc.getElementsByTagName("rest:resource")[i].childNodes[0].nodeValue;
    var x = document.getElementById("ProcessSelect");
    var option = document.createElement("option");
    option.text = fName;
    x.add(option);
  }
}

var rcount = 0;

function testGrafanaDirect() {
  var xmlhttp = new XMLHttpRequest();
  var url = config.grafanaPath;
  var statusDiv = document.getElementById("GrafanaStatus");
  statusDiv.innerHTML = "Booting 2";

  xmlhttp.onreadystatechange = function () {
    //        if (this.status != 0 && this.status != 200) {
    statusDiv.innerHTML =
      "ReadyState" +
      this.readyState.toString() +
      "Status:" +
      this.status.toString() +
      "Text:" +
      this.statusText;
    //        }
    if (this.readyState == 4 && this.status == 200) {
      statusDiv.innerHTML = "good";
      setTimeout(forceReloadGrafana, 15000);
    }
    if (this.readyState == 4 && this.status != 200) {
      rcount++;
      statusDiv.innerHTML =
        "retry count:" +
        rcount +
        " Status:" +
        this.status.toString() +
        " Text:" +
        this.statusText;
      setTimeout(testGrafanaDirect, 15000);
    }
  };

  xmlhttp.open("GET", url, true);
  //xmlhttp.setRequestHeader("Authorization", "Basic " + btoa("admin:admin"));
  xmlhttp.send();
}

// load events

// when thwe content is loaded fi up the iframes to the correct target server before fetching content
window.addEventListener("DOMContentLoaded", () => {
  onLoadFixFrameSources();
});

// when the page is loaded fix up navigation and fetch data
window.addEventListener("load", () => {
  carousel();
  // fetch the available pmn processes to execute
  getProcesses();
  testGrafanaDirect();
});

function carousel(root) {
  setupNavigation();

  scaleFrames();

  window.addEventListener("resize", scaleFrames, true);

  function scaleFrames() {
    var wrappers = document.getElementsByClassName("wrapper");

    var resizefunction = function (wrapper) {
      var outerW = wrapper.offsetWidth;
      var outerH = wrapper.offsetHeight;

      var targetW = 1880;
      var targetH = 900;

      var scalex = outerW / targetW;
      var scaley = outerH / targetH;

      var scaleToUse = scalex;
      if (scalex > scaley) {
        scaleToUse = scaley;
      }

      var x = wrapper.getElementsByTagName("iframe")[0];

      function forceReload(iframe) {
        if (iframe.src.indexOf("reloadtimestamp") > -1) {
          // Check if we still have a reloadtimestamp in the URL from a previous refresh
          iframe.src = iframe.src.replace(
            /reloadtimestamp=[^&]+/,
            "reloadtimestamp=" + Date.now()
          ); // And if so, replace it instead of appending so the URL doesn't grow too long.
        } else {
          // Else we will append the reloadtimestamp
          iframe.src +=
            (iframe.src.indexOf("?") > -1 ? "&" : "?") +
            "reloadtimestamp=" +
            Date.now(); // If the URL contains a ?, append &reloadtimestamp=...; otherwise, append ?reloadtimestamp=...
        }
      }
      x.style.transform = "scale(" + scaleToUse + ")";
      //forceReload(x);
    };

    for (var i = 0; i < wrappers.length; i++) {
      resizefunction(wrappers[i]);
    }
  } // endscale frames

  function clickIfFound(tDoc, tTag, tString) {
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

  function doubleClickIfFound(tDoc, tTag, tString) {
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
    var event = new MouseEvent("dblclick", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    found.dispatchEvent(event);
  }

  function setupNavigation() {
    // add handler for process  start click
    var nav = document.getElementById("navbar");
    nav.addEventListener("click", onClick, true);

    // add zoom and reload handler
    var framecontrols = document.getElementsByClassName("framecontrols");
    document.getElementById("hidden1").style.display = "none"; // prime the pump style display should be none but lets make sure
    for (var i = 0; i < framecontrols.length; i++) {
      //framecontrols[i].addEventListener('click', reloadfunction, false);
      framecontrols[i].addEventListener("click", reloadfunction, true);
    }

    function onClick(e) {
      e.stopPropagation();
      var t = e.target;
      if (t.tagName.toUpperCase() != "BUTTON") return;

      //MITCH added
      if ($("#ProcessSelect").val() !== null) {
        var payload = JSON.stringify({
          commands: "start",
          process: $("#ProcessSelect option:selected").html(),
        });
        var msg = {
          topic: "execution",
          message: payload,
        };
        console.log("Sending " + JSON.stringify(msg));
        ws.send(JSON.stringify(msg));

        //disable start button
        $("#start").prop("disabled", true);
      }
      //MITCH added
    }

    function reloadfunction(e) {
      e.stopPropagation();

      var t = e.target;
      if (t.tagName.toUpperCase() != "BUTTON") return;

      if (t.classList.contains("Reload")) {
        var x = t.parentElement.parentElement.getElementsByTagName("iframe")[0];
        forceReload(x);
      }

      if (t.classList.contains("Zoom")) {
        var divtozoom = t.parentElement.parentElement;
        var paddingdiv = document.getElementById("hidden1");
        var resizefunction = function (wrapper) {
          var outerW = wrapper.offsetWidth;
          var outerH = wrapper.offsetHeight;

          var targetW = 1880;
          var targetH = 900;

          var scalex = outerW / targetW;
          var scaley = outerH / targetH;

          var scaleToUse = scalex;
          if (scalex > scaley) {
            scaleToUse = scaley;
          }

          var x = wrapper.getElementsByTagName("iframe")[0];
          x.style.transform = "scale(" + scaleToUse + ")";
        };

        if (paddingdiv.style.display == "none") {
          divtozoom.classList = "overlayzoom";
          resizefunction(divtozoom);
          paddingdiv.style.display = "block";
        } else {
          divtozoom.classList = "wrapper box";
          resizefunction(divtozoom);
          paddingdiv.style.display = "none";
        }
      }
    }

    window.addEventListener("keydown", dealWithKeyboard, false);

    function dealWithKeyboard(e) {
      e.stopPropagation();
      switch (e.keyCode) {
        case 37:
          // left key pressed
          break;
        case 38:
          // up key pressed
          break;
        case 39:
          // right key pressed

          break;
        case 40:
          // down key pressed
          break;
      }
    }
  }
}

function onLoadFixFrameSources() {
  //var pdeUrl =":7080/pde";
  var peUrl = config.processviewerUrl;
  //  var peUrl =":7080/front/pe";
  var threedeeUrl = config.web3dUrl;
  var grafanaUrl = config.grafanaUrl;
  //var videoUrl =":7076/view.html";
  var videoUrl = config.liveCamUrl;

  document.getElementById("peFrame").src = "http://" + config.baseUrl + peUrl;
  document.getElementById("digitaltwinframe").src =
    "http://" + config.baseUrl + threedeeUrl;
  document.getElementById("grafana").src =
    "http://" + config.baseUrl + grafanaUrl;
  document.getElementById("videoframe").src =
    "http://" + config.baseUrl + videoUrl;
  //document.getElementById('webdashframe').src = "http://"+baseUrl+dashUrl;
  forceReload(document.getElementById("peFrame"));
  forceReload(document.getElementById("digitaltwinframe"));
  forceReload(document.getElementById("grafana"));
  forceReload(document.getElementById("videoframe"));
  //forceReload(document.getElementById('webdashframe'));
}
