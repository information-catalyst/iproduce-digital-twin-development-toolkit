// URL for the websocket service.
const ws_url = "ws://" + config.serverLocation + config.webSocketUrl;
var ws = new ReconnectingWebSocket(ws_url);
ws.onopen = function(event) {
    console.log("open");
};
ws.onmessage = function(data) {
    console.log(data);
    var jsonObj = JSON.parse(data.data);
    var jsonObj2 = JSON.parse(jsonObj.message);
    if (jsonObj2.commands == "done")
    {
        $('#start').prop('disabled', false);
    } else if (jsonObj2.commands == "start") {
        $('#start').prop('disabled', true);
    }
};
ws.onclose = function(event) {
    console.log(event);
};
ws.onerror = function(error) {
    console.log(error);
};