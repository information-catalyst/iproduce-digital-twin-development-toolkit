"use strict";
var WebSocket = WebSocket || MozWebSocket;


class kafkaws{
  //variable connection = null;

  constructor() {
    console.log("build");
  };


  deliberateReconnect(){
    // starts as a stub but we may do more than connect e.g.
    // count reconencts over time
    console.log("deliberate reconect")
    this.connect();
  }

  connect(topic,messageHandler) {

    var that = this;
    //var serverUrl = "ws://icemain.hopto.org:7061/v2/broker/?topics=test";
    // connect to 
    var serverLocation = config.serverLocation;
    //var serverUrl = "ws://"+serverLocation+":7061/v2/broker/?topics=commands";
    var serverUrl = "ws://"+serverLocation+config.webSocketUrl+topic;

    this.connection = new WebSocket(serverUrl);

    this.connection.onopen = function(evt) {
      console.log("status:open");  
    };

    this.connection.onerror = function (evt) {
        console.log("An error occured while connecting... " + evt);
    };

    this.connection.onclose = function () {
        console.log("hello.. The coonection has been closed");
        // assume server time out so reconnect
        that.deliberateReconnect ();
    };

    this.connection.onmessage = messageHandler;
/*
    this.connection.onmessage = function(evt) {
      console.log("onMessage");
      //var f = document.getElementById("chatbox").contentDocument;
      var text = "";
      var msg = JSON.parse(evt.data);

      text = msg.message;
      console.log(text);
      // quick spoof response
      if(text.endsWith(":done") == false){

        counterCount = 0;
        if(text.startsWith("Task_SelectCounter")){
            selectCounterState = true;
            startSelectCounter();
        } else if(text.startsWith("Task_ReturnCounter")){
            selectCounterState = false;
            returnCounterState = true;
            startReturnCounter();
        } else if(text.startsWith("Task_CookCounter")){
            cookCounterState = true;
            drillCounterState = false;
            startCookCounter();
        } else if(text.startsWith("Task_DrillCounter")){
            cookCounterState = false;
            drillCounterState = true;
            startDrillCounter();
        } 

        //console.log("setTimeout");
        //setTimeout(function() { that.send(text+":done"); },15000);
      }

    };
*/    
  };

  send(payload,topic) {
    console.log("send");
    var msg = {
      message: payload,
      topic: topic,
    };
    this.connection.send(JSON.stringify(msg));
    console.log("sending"+JSON.stringify(msg));
  };

  sendJSON(payload,topic) {
    console.log("send");
    var msg = {
      message: payload,
      topic: topic,
    };
    this.connection.send(JSON.stringify(msg));
    console.log("sending"+JSON.stringify(msg));
  };


}
