//TODO:- need to review this later in more details. 

rotationMotorBackward = 0;
rotationMotorForward = 0;
elevationMotorBackward = 0;
elevationMotorForward = 0;
extensionMotorBackward = 0;
extensionMotorForward = 0;
xhttpMultiProcessor = new XMLHttpRequest();
xhttpMultiProcessor.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

        var jsonResponse = JSON.parse(xhttpMultiProcessor.responseText)
        rotationMotorBackward = parseFloat(jsonResponse[0]["MotPwm[0-0]"]);
        rotationMotorForward = parseFloat(jsonResponse[0]["MotPwm[0-1]"]);
        elevationMotorBackward = parseFloat(jsonResponse[0]["MotPwm[0-2]"]);
        elevationMotorForward = parseFloat(jsonResponse[0]["MotPwm[0-3]"]);
        extensionMotorBackward = parseFloat(jsonResponse[0]["MotPwm[0-4]"]);
        extensionMotorForward = parseFloat(jsonResponse[0]["MotPwm[0-5]"]);

    }
};


var timerFunction = function() {
    xhttpMultiProcessor.open("GET", "http://icemain.hopto.org:8058/factoryapi/factory/Multi_Processor", true);
    xhttpMultiProcessor.send();
    setTimeout(timerFunction, 100);
}

//todo reinstate as needed //timerFunction();