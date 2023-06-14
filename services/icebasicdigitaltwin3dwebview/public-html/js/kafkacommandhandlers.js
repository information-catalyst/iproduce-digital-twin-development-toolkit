var currentAnimator = null;
var doneAnimator = null;

// called each frame
function newAnimateFunction() {

    if (currentAnimator != null) {
        var animationReturnCode = currentAnimator()
        if (animationReturnCode == true) {
            // current animation has reached its endpoint
            currentAnimator = null;
            if (doneAnimator != null) {
                // if we have one do an on animation reaches endpoint action, usually send a done message
                doneAnimator();
                doneAnimator = null;
            }

        }
    } else {
        // if we don't have a current animation see if one is queued
        unqueueAction(); // nothing to do get the next action from message queue
    }

}



/*

// Generisc queue actions
Q.enqueue("A");
Q.enqueue("B");
Q.enqueue("C");

alert(Q.dequeue());
alert(Q.dequeue());
alert(Q.dequeue());
*/

function Queue() {
    this.stac = new Array();
    this.dequeue = function() {
        return this.stac.pop();
    }
    this.enqueue = function(item) {
        this.stac.unshift(item);
    }
}



var actionQueue = new Queue();

function unqueueAction() {
    payload = actionQueue.dequeue();
    if (payload != undefined && payload != null) {


        // currentAnimator = taskList[payload.task];
        currentAnimator = modelList[place]?.tasksList[payload.task]
        var taskName = payload.task;
        var prettyTask = taskName.replace(/_/g, " ");


        prettyTask = prettyTask.replace(/([A-Z])/g, ' $1').replace(/^./, function(str) {
            return str.toUpperCase();
        });
        prettyTask = prettyTask.replace(/\b\w/g, l => l.toUpperCase())
        /*
        // insert a space before all caps
        .replace(/([A-Z])/g, ' $1')
        // uppercase the first character
        .replace(/^./, function(str){ return str.toUpperCase(); })
        */
        document.getElementById("taskStatus").innerHTML = prettyTask;

        doneAnimator = function() {
            var time2 = Date.now();

            payload["source"] = "threedee";
            payload["action"] = "done";
            payload["timestamp"] = time2;
            if (sendResponseMessage == true) {
                kfws.sendJSON(JSON.stringify(payload), "commands");
            }
        };
    }
}

var queueAction = function(payload) {
    actionQueue.enqueue(payload);
}


var sendResponseMessage = false;

function toggleResponseMessage() {

    if (sendResponseMessage == false) {
        sendResponseMessage = true;
        document.getElementById("buttonRespond").innerHTML = "Sending Responses";
    } else {
        sendResponseMessage = false;
        document.getElementById("buttonRespond").innerHTML = "NOT Sending Responses";
    }
}


var commandMessageHandler = function(evt) {
    console.log("onMessage");
    //var f = document.getElementById("chatbox").contentDocument;
    var text = "";
    var msg = JSON.parse(evt.data);
    console.log(msg.message);
    var payload = JSON.parse(msg.message);
    if (typeof payload.task == 'undefined') {
        return;
    }

    var task = payload.task;
    var action = payload.action;
    console.log(text);
    // quick spoof response
    if (action != "done") {
        // defaultAction(task);
        x = modelList[place]?.tasksList[task];
        queueAction(payload);

    }


}


// Function to test the animation of the selected place.
function testAnimation(place) {
    console.log(modelList[place].tasksList)
    addTasksToQ(modelList[place].tasksList)
}

// Function to add all the tasks of a given task list to the queue.
function addTasksToQ(list){
  for (var k in list) {
      if (list.hasOwnProperty(k)) {
          var payload = {};
          payload.action = "start";
          payload.task = k;
          queueAction(payload);
      }
  }
}

