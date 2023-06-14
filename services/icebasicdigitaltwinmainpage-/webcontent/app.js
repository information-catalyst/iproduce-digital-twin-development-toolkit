import $ from 'jquery';

import BpmnModeler from 'bpmn-js/lib/Modeler';

import diagramXML from '../resources/newDiagram.bpmn';

import BpmnJS from 'bpmn-js'

import ReconnectingWebSocket from 'reconnecting-websocket';

var container = $('#js-drop-zone');

var previousTask = "";
var previousSeq = "";
var ReceivedBMPN = false;
//var waitingMessages = [""];

var modeler = new BpmnModeler({
	  container: '#js-canvas'
});

var modeling = modeler.get('modeling');

var elementRegistry;	
var sequenceFlow;

const rws2 = new ReconnectingWebSocket('ws://icemain.hopto.org:7061/v2/broker/?topics=bpmndata');

rws2.addEventListener('open', () => {
    console.log('connected');
});

rws2.addEventListener('close', () => {
    console.log('Closed');
	rws2.reconnect();
});

rws2.addEventListener('message', (data) => {
    console.log(data.data);
	var jsonObj = JSON.parse(data.data);
	var jsonObj2 = JSON.parse(jsonObj.message);
	console.log(jsonObj2.rawxml);
	openDiagram(jsonObj2.rawxml)
	$("#statusHeader").text(jsonObj2.processname);
	//$(".djs-container").find(".viewport").css({transform:" matrix(0.5,0,0,0.5,275,-22)"});
	//for(var i =0;i<waitingMessages.length;i++)
	//{
	//	parseMessage(waitingMessages[i]);
	//}
});

rws2.addEventListener('error', (error) => {
    console.log(error);
});

const rws = new ReconnectingWebSocket('ws://icemain.hopto.org:7061/v2/broker/?topics=commands'); //icemain.hopto.org:7061

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
						//waitingMessages = [];
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
								//console.log(i+" "+sequenceFlow[i].targetRef.id +" " + jsonObj2.task);
								//console.log($("g").find("[data-element-id='"+sequenceFlow[i].id+"']"));
								//console.log($("g").find("[data-element-id='"+sequenceFlow[i].id+"']").find(".djs-seegment-dragger"));
								//console.log($("g").find("[data-element-id='"+sequenceFlow[i].id+"']").children("g").children("path"));
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
		//waitingMessages.push(data);
		setTimeout(function() { parseMessage(data); },1000);
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
		//viewer = new BpmnJS({ container: '.bjs-container' });
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

//Try 1 that should work from example
				//modeling.setColor(sequenceFlow[i],{"stroke":"MediumBlue","stroke-width":"5px"});
				
				
				//Try 2.
				//var overlays = viewer.get('overlays');
				//count = i;
				//viewer.importXML(diagramXML, function() {
				//	
				//  var overlays = viewer.get('overlays');
				//  console.log(overlays);
				//  var VelementRegistry = viewer.get('elementRegistry');
				//  console.log(VelementRegistry);
				//  var VsequenceFlowElement = VelementRegistry.get('Process_1');
				//  console.log(VsequenceFlowElement);
				//  var VsequenceFlow = VsequenceFlowElement.businessObject.flowElements;
				//  console.log(VsequenceFlow);
				//  var shape = VsequenceFlow[count];
				//  console.log(shape);
				//
				//  var $overlayHtml =
				//	$('<div class="highlight-overlay">')
				//	  .css({
				//		width: shape.width,
				//		height: shape.height
				//	  });
				//
				//  overlays.add(sequenceFlow[count].id, {
				//	position: {
				//	  top: -5,
				//	  left: -5
				//	},
				//	html: $overlayHtml
				//  });
				//});