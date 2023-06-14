
// code for PDE communication  via kafka
kfws = new kafkaws();
kfws.connect("commands", commandMessageHandler);

function startSelectCounter() {
    SelectCounterTime = performance.now();
    var nowEpoch = Date.now();
    kfws.send("task:Task_SelectCounter,status:started,timestamp:" + nowEpoch, "test");
}

function startReturnCounter() {
    ReturnCounterTime = performance.now();
    var nowEpoch = Date.now();
    kfws.send("task:Task_ReturnCounter,status:started,timestamp:" + nowEpoch, "test");
}

function startCookCounter() {
    CookCounterTime = performance.now();
    var nowEpoch = Date.now();
    kfws.send("task:Task_CookCounter,status:started,timestamp:" + nowEpoch, "test");
}

function startDrillCounter() {
    DrillCounterTime = performance.now();
    var nowEpoch = Date.now();
    kfws.send("task:Task_DrillCounter,status:started,timestamp:" + nowEpoch, "test");
}


function endSelectCounter() {
    var now = performance.now();
    var nowEpoch = Date.now();
    SelectCounterTime = Math.round(now - SelectCounterTime);
    //kfws.send("task:Task_SelectCounter,status:ended,timestamp:"+nowEpoch,"test");
    //kfws.send("task:Task_SelectCounter,ElapsedTime:"+SelectCounterTime+",timestamp:"+nowEpoch,"test");


    var payload = {
        task: "Task_SelectCounter",
        action: "done"
    };
    kfws.sendJSON(JSON.stringify(payload), "commands");
    //kfws.send("Task_SelectCounter:done","commands");

    var payload = {
        time: 1234,
        reading: 5678,
        textstuff: "StringStuff"
    };
    kfws.sendJSON(JSON.stringify(payload), "other");
}

function endReturnCounter() {
    var now = performance.now();
    var nowEpoch = Date.now();
    ReturnCounterTime = Math.round(now - ReturnCounterTime);
    //kfws.send("task:Task_ReturnCounter,status:ended,timestamp:"+nowEpoch,"test");
    //kfws.send("task:Task_ReturnCounter,ElapsedTime:"+ReturnCounterTime+",timestamp:"+nowEpoch,"test");

    var payload = {
        task: "Task_ReturnCounter",
        action: "done"
    };
    kfws.sendJSON(JSON.stringify(payload), "commands");
    //        kfws.send("Task_ReturnCounter:done","commands");
}

function endCookCounter() {
    var now = performance.now();
    var nowEpoch = Date.now();
    CookCounterTime = Math.round(now - CookCounterTime);
    //kfws.send("task:Task_CookCounter,status:ended,timestamp:"+nowEpoch,"test");
    //kfws.send("task:Task_CookCounter,ElapsedTime:"+CookCounterTime+",timestamp:"+nowEpoch,"test");

    var payload = {
        task: "Task_CookCounter",
        action: "done"
    };
    kfws.sendJSON(JSON.stringify(payload), "commands");
}

function endDrillCounter() {
    var now = performance.now();
    var nowEpoch = Date.now();
    DrillCounterTime = Math.round(now - DrillCounterTime);
    //kfws.send("task:Task_DrillCounter,status:ended,timestamp:"+nowEpoch,"test");
    //kfws.send("task:Task_DrillCounter,ElapsedTime:"+DrillCounterTime+",timestamp:"+nowEpoch,"test");

    var payload = {
        task: "Task_DrillCounter",
        action: "done"
    };
    kfws.sendJSON(JSON.stringify(payload), "commands");
}