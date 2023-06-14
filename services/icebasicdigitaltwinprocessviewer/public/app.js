import $ from 'jquery';

import BpmnModeler from 'bpmn-js/lib/Modeler';

import diagramXML from '../resources/newDiagram.bpmn';

import BpmnJS from 'bpmn-js'

import ReconnectingWebSocket from 'reconnecting-websocket';

var container = $('#js-drop-zone');

var previousTask = "";
var previousSeq = "";
var ReceivedBMPN = false;

var modeler = new BpmnModeler({
	  container: '#js-canvas'
});

var modeling = modeler.get('modeling');

var elementRegistry;	
var sequenceFlow;


//const rws2 = new ReconnectingWebSocket('ws://icemain.hopto.org:7061/v2/broker/?topics=execution');
console.log('initialisation stuff is here cpo');

var serverLocation = window.location.hostname;
// strip any www prefix, TODO regex would be good here
serverLocation = serverLocation.replace("www.","")
var ws_url2 = "ws://"+serverLocation+":7061/v2/broker/?topics=execution";
var rws2 = new ReconnectingWebSocket(ws_url2);

var statusDiv = document.getElementById("statustext2");
statusDiv.innerHTML = "Connecting to:"+ws_url2;



rws2.addEventListener('open', () => {
	var statusDiv = document.getElementById("statustext3");
	statusDiv.innerHTML = "Open";
    console.log('connected');
});

rws2.addEventListener('close', () => {
	var statusDiv = document.getElementById("statustext3");
	statusDiv.innerHTML = "Closed";
    console.log('Closed');
	rws2.reconnect();
});

rws2.addEventListener('error', e => {
	var statusDiv = document.getElementById("statustext3");
	statusDiv.innerHTML = "error:"+e.toString();
	//statusDiv.innerHTML = "error:"+m.toString();
    console.log('error');
	rws2.reconnect();
});



function testBaseXDirect2(process) {
	var url = "/bpmndirect/rest/Factory_Processes/"+process+"/";


    var xmlhttp = new XMLHttpRequest();
    //var url = "/bpmndirect/rest/Factory_Processes/";
    var statusDiv = document.getElementById("statustext3");
    statusDiv.innerHTML = "Booting";

    xmlhttp.onreadystatechange = function() {

//        if (this.status != 0 && this.status != 200) {
            statusDiv.innerHTML = "ReadyState"+this.readyState.toString()+"Status:" + this.status.toString() + "Text:" + this.statusText;
//        }


        if (this.readyState == 4 && this.status == 200) {
            //var parser = new DOMParser();
            //var xmlTExtDoc = this.responseText;            
            var xmlDoc = this.responseXML;            
            //var xmlResponse = this.response;

            var xmlRet = new XMLSerializer().serializeToString(xmlDoc);


            openDiagram(xmlRet);

/*
            var xcn  = xmlDoc.getElementsByTagName("rest:resource");

            for (var i=0; i<xcn.length; i++){


                //var fName = xmlDoc.getElementsByTagName("rest:resource")[0].childNodes[0].nodeValue;
                var fName = xmlDoc.getElementsByTagName("rest:resource")[i].childNodes[0].nodeValue;
                var x = document.getElementById("ProcessSelect");
                var option = document.createElement("option");
                option.text = fName;
                x.add(option);

            }


*/





        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.setRequestHeader("Authorization", "Basic " + btoa("admin:admin"));

    xmlhttp.overrideMimeType('text/xml');



    xmlhttp.send();    
}    


rws2.addEventListener('message', (data) => {
	console.log('execution message');
	
	console.log(data.data);
	var jsonObj = JSON.parse(data.data);
	var jsonObj2 = JSON.parse(jsonObj.message);
	var process = jsonObj2.process;
	console.log(process);
	var commands = jsonObj2.commands;
	
	var statusDiv = document.getElementById("statustext3");
	statusDiv.innerHTML = "kafka excution message received";


	if(commands=="start")
	{

		statusDiv.innerHTML = "kafka start excution message received fetcjhing xml";
		console.log('start message go get the xml');
	
		testBaseXDirect2(process);
	}

	if(commands=="NOTstart")
	{

		statusDiv.innerHTML = "kafka start excution message received fetcjhing xml";
		console.log('start message go get the xml');
	
		testBaseXDirect2(process);
		$.ajax({
//Chris
//			url: "http://"+window.location.hostname+":"+window.location.port+"/baseXrest/Factory_Processes/"+process+".xml",
//			url: "http://basexhttp/rest/Factory_Processes/"+process+".xml",
			url: "/bpmndirect/rest/Factory_Processes/"+process,
			method: "GET",

/*
			data: JSON.stringify(data),
			cache: false,
			async: false, 

*/
			dataType: "xml",

			beforeSend: function (xhr) {
				xhr.setRequestHeader ("Authorization", "Basic " + btoa("admin" + ":" + "admin"));
			},
			success: function (data) {
				console.log('success  message go get the xml');

/*
				var xmlRet = new XMLSerializer().serializeToString(data.documentElement);
				data = '<?xml version="1.0" encoding="UTF-8"?>' + xmlRet;
				openDiagram(data);
				$("#statusHeader").text(jsonObj2.processname);
*/

//chris says do it this way
				var dataDocElement = data.documentElement;
				var xmlRet = new XMLSerializer().serializeToString(dataDocElement);
		//		openDiagram(xmlRet);
				$("#statusHeader").text(jsonObj2.processname);
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.log('error  message go get the xml');
				
			}
		});
	}
});

rws2.addEventListener('error', (error) => {
    console.log(error);
});

//const rws = new ReconnectingWebSocket('ws://icemain.hopto.org:7061/v2/broker/?topics=commands'); //icemain.hopto.org:7061
var ws_url = "ws://"+serverLocation+":7061/v2/broker/?topics=commands";
var rws = new ReconnectingWebSocket(ws_url);




rws.addEventListener('open', () => {
    console.log('connected');
});

rws.addEventListener('close', () => {
    console.log('Closed');
	rws.reconnect();
});


function parseMessage(data)
{
	var jsonObj = JSON.parse(data.data);
	var jsonObj2 = JSON.parse(jsonObj.message);
	
	if(ReceivedBMPN)
	{
		if(jsonObj2.hasOwnProperty("source"))
		{
			if(jsonObj2.source == "failure")
			{
				for(var i=0;i<sequenceFlow.length;i++)
				{
					if(sequenceFlow[i].id.indexOf(jsonObj2.task) != -1)
					{
						$("g").find("[data-element-id='"+sequenceFlow[i].id+"']").children("g").children("rect").css({"stroke":"red","stroke-width":"5px"});
						$("g").find("[data-element-id='"+previousSeq+"']").children("g").children("path").css({"stroke":"black","stroke-width":"2px"});
						break;
					}
				}
				previousTask = jsonObj2.task;
			}
		}
		
		if(jsonObj2.hasOwnProperty("action"))
		{
			if(jsonObj2.action.includes("start"))
			{

				if(previousTask != "")
				{
					$("g").find("[data-element-id='"+previousTask+"']").children("g").children("rect").css({"stroke":"black","stroke-width":"2px"});
				}
				if(jsonObj2.hasOwnProperty("task"))
				{
					$("#statusHeader").text(jsonObj2.task);
					if(previousTask=="StartEvent_1")
					{
						for(var i=0;i<sequenceFlow.length;i++)
						{
							if(sequenceFlow[i]["\$type"]=="bpmn:SequenceFlow")
							{
								if(sequenceFlow[i].targetRef.id==jsonObj2.task)
								{
									$("g").find("[data-element-id='"+sequenceFlow[i].id+"']").children("g").children("path").css({"stroke":"MediumBlue","stroke-width":"5px"});
									previousSeq = sequenceFlow[i].id;
									break;
								}
							}
						}
					}
				
				
				
					for(var i=0;i<sequenceFlow.length;i++)
					{
						if(sequenceFlow[i].id==jsonObj2.task)
						{
							$("g").find("[data-element-id='"+jsonObj2.task+"']").children("g").children("rect").css({"stroke":"MediumBlue","stroke-width":"5px"});
							$("g").find("[data-element-id='"+previousSeq+"']").children("g").children("path").css({"stroke":"black","stroke-width":"2px"});
							break;
						}
					}
				
					previousTask = jsonObj2.task;
				}
				else if(jsonObj2.hasOwnProperty("event"))
				{
					var parsed = jsonObj2.event.split("#")[0];
					$("#statusHeader").text(jsonObj2.event);
					$("g").find("[data-element-id='"+previousSeq+"']").children("g").children("path").css({"stroke":"black","stroke-width":"2px"});
					$("g").find("[data-element-id='"+parsed+"']").children("g").children("circle").css({"fill":"MediumBlue"});
					previousTask = parsed;
					if(jsonObj2.event.indexOf("EndEvent") != -1)
					{
						ReceivedBMPN = false; //Reset it to receive the new BPMN.
					}
				}
			}
			
			if(jsonObj2.action.includes("done"))
			{
				if(previousTask != "")
				{
					$("g").find("[data-element-id='"+previousTask+"']").children("g").children("rect").css({"stroke":"black","stroke-width":"2px"});
				}
				if(jsonObj2.hasOwnProperty("task"))
				{
					for(var i=0;i<sequenceFlow.length;i++)
					{
						if(sequenceFlow[i]["\$type"]=="bpmn:SequenceFlow")
						{
							if(sequenceFlow[i].sourceRef.id==jsonObj2.task)
							{
								$("g").find("[data-element-id='"+sequenceFlow[i].id+"']").children("g").children("path").css({"stroke":"MediumBlue","stroke-width":"5px"});
								previousSeq = sequenceFlow[i].id;
								break;
							}
						}
					}
					
					previousTask = jsonObj2.task;
				}
				else if(jsonObj2.hasOwnProperty("event"))
				{
					var parsed = jsonObj2.event.split("#")[0];
					console.log(parsed);
					console.log($("g").find("[data-element-id='"+parsed+"']"));
					console.log($("g").find("[data-element-id='"+parsed+"']").children("g"));
					console.log($("g").find("[data-element-id='"+parsed+"']").children("g").children("rect"));
					$("g").find("[data-element-id='"+parsed+"']").children("g").children("rect").css({"stroke":"MediumBlue","stroke-width":"5px"});
					previousTask = parsed;
				}
			}
		}
	}
	else
	{
		setTimeout(function() { parseMessage(data); },1500);
	}
}

rws.addEventListener('message', (data) => {
    console.log(data.data);
	parseMessage(data);
});


rws.addEventListener('error', (error) => {
    console.log(error);
});



function createNewDiagram() {
  openDiagram(diagramXML);
}

function openDiagram(xml) {

  modeler.importXML(xml, function(err) {

    if (err) {
      container
        .removeClass('with-diagram')
        .addClass('with-error');

      container.find('.error pre').text(err.message);

      console.error(err);
    } else {
      container
        .removeClass('with-error')
        .addClass('with-diagram');
		
		elementRegistry = modeler.get('elementRegistry');
		var sequenceFlowElement = elementRegistry.get('Process_1');
		sequenceFlow = sequenceFlowElement.businessObject.flowElements;
		console.log(sequenceFlow);
    }


  });
  
  ReceivedBMPN = true;

}


// helpers //////////////////////

function debounce(fn, timeout) {

  var timer;

  return function() {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(fn, timeout);
  };
}
