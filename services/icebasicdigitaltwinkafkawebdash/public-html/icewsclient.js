"use strict";
var connection = null;
var clientID = 0;

var WebSocket = WebSocket || MozWebSocket;


function reconnect() {
    setStatus("status:reconnect");  

    connect();
}

function connect() {
  //var serverUrl = "ws://icemain.hopto.org:7061/v2/broker/?topics=test";
  // connect to 
  var serverLocation = window.location.hostname;
  // strip any www prefix, TODO regex would be good here
  serverLocation = serverLocation.replace("www.","")
  var serverUrl = "ws://"+serverLocation+":7061/v2/broker/?topics=commands,test,io,events";

  connection = new WebSocket(serverUrl);

  connection.onopen = function(evt) {
    setStatus("status:open");  
  };
  var oldnum = 0;
  var msgTimes = [];

  connection.onerror = function(evt) {
    setStatus("status:onerror");  
  };

  connection.onclose = function(evt) {
    setStatus("status:onclose");  
    reconnect();
  };

  connection.onmessage = function(evt) {
    //var f = document.getElementById("chatbox").contentDocument;
    var text = "";
    var topic = "";
    var msg = JSON.parse(evt.data);

    text = msg.message;
    topic = msg.topic;

    if (text.length) {
      setStatus(text);
      prependToLog(topic, text);
    }
  };
  setStatus("status:booted");  
}

function send() {
/*  
  var msg = {
    text: document.getElementById("text").value,
    type: "message",
    id: clientID,
    date: Date.now()
  };
  connection.send(JSON.stringify(msg));
  document.getElementById("text").value = "";
*/
}

function handleKey(evt) {
/*  
  if (evt.keyCode === 13 || evt.keyCode === 14) {
    if (!document.getElementById("send").disabled) {
      send();
    }
  }
*/  
}

function removeAllText(element) {

    // loop through all the nodes of the element
    var nodes = element.childNodes;

    for(var i = 0; i < nodes.length; i++) {

        var node = nodes[i];

        // if it's a text node, remove it
        if(node.nodeType == Node.TEXT_NODE) {

            node.parentNode.removeChild(node);


            i--; // have to update our incrementor since we just removed a node from childNodes

        } else

        // if it's an element, repeat this process
        if(node.nodeType == Node.ELEMENT_NODE) {

            removeAllText(node);

        }
    }
}


function setStatus(textString){
  var theDiv = document.getElementById("lastmessage");  
  var content = document.createTextNode(textString);
  if (theDiv.firstChild != null){
    theDiv.removeChild(theDiv.firstChild)
  }
  theDiv.appendChild(content);
}

function clearStatus(){
  var theDiv = document.getElementById("lastmessage");
  removeAllText(theDiv);
}


function appendToLog(textString){
      var theDiv = document.getElementById("logbox");

      var content = document.createTextNode(textString);
      var br = document.createElement("br");
      theDiv.appendChild(content);
      theDiv.appendChild(br);
}

function epochToNice(unix_timestamp){
      // Create a new JavaScript Date object based on the timestamp
      // multiplied by 1000 so that the argument is in milliseconds, not seconds.
      var date = new Date(parseInt(unix_timestamp));
      // Hours part from the timestamp
      var hours = date.getHours();
      // Minutes part from the timestamp
      var minutes = "0" + date.getMinutes();
      // Seconds part from the timestamp
      var seconds = "0" + date.getSeconds();

      // Will display time in 10:30:23 format
      var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
      return formattedTime;
}

function prependToLog(topicstring, textString){
      var theDiv = document.getElementById("logbox");
      // default raw content
      var content = document.createTextNode(textString);


      if(topicstring =="test"){
        var jsonText = JSON.parse(textString);

        var content = document.createElement("pre");
        content.textContent = JSON.stringify(jsonText, null, 2);

        if( textString.indexOf("Factory4") != -1){
          // conveyor a
          theDiv = document.getElementById("logboxLogsa");
        }else if( textString.indexOf("Factory5") != -1){
          // conveyor b
          theDiv = document.getElementById("logboxLogsb");
        }else if( textString.indexOf("Factory3") != -1){
          // crane
          theDiv = document.getElementById("logboxLogsc");
        }else{
          theDiv = document.getElementById("logboxLogs");
        }
      }else if(topicstring =="io"){
        var jsonText = JSON.parse(textString);

        var content = document.createElement("pre");
        content.textContent = JSON.stringify(jsonText, null, 2);

        if( textString.indexOf("ConveyoraMachine") != -1){
          // conveyor a
          theDiv = document.getElementById("logboxIOA");
        }else if( textString.indexOf("ConveyorbMachine") != -1){
          // conveyor b
          theDiv = document.getElementById("logboxIOB");
        }else if( textString.indexOf("Crane") != -1){
          // crane
          theDiv = document.getElementById("logboxIOC");
        }else{
          theDiv = document.getElementById("logboxIO");
        }
      }else{
        // commands
        var jsonText = JSON.parse(textString);
        var timeText = epochToNice(jsonText.timestamp);
        var tasknameText = jsonText.task;
        var statusText = jsonText.action;
        //content = document.createTextNode(tasknameText+" "+statusText+" @"+timeText);          
        content = document.createTextNode(  timeText+" "+statusText+" "+tasknameText);          
        if( textString.indexOf("Factory4") != -1){
          theDiv = document.getElementById("logboxA");
        }else if( textString.indexOf("Factory5") != -1){
          theDiv = document.getElementById("logboxB");
        }else if( textString.indexOf("Factory3") != -1){
          theDiv = document.getElementById("logboxC");
        }else{
          theDiv = document.getElementById("logbox");
        }
      }


      var contentDiv = document.createElement("div");
      contentDiv.classList.add("listitem");
      contentDiv.insertBefore(content, contentDiv.firstChild);


      // add to list 
      if (theDiv.childElementCount % 2 == 0){
        contentDiv.classList.add("odd");
      }
      theDiv.insertBefore(contentDiv, theDiv.firstChild);
}


function clearLog(){
  var theDiv = document.getElementById("logbox");
  removeAllText(theDiv);
}

window.onload = function() {
  connect();
};

function pad(num, size) {
    var s = "000000000000000000000000000" + num;
    return s.substr(s.length-size);
};

function pads(num, size) {
    var s = "_______________________________________" + num;
    return s.substr(s.length-size);
};