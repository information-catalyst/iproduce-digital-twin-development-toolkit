package com.informationcatalyst.kafkaJavaFrame;

public class JSONMessage {
    private String command;
    private String status;


    public JSONMessage(String command, String status){
        this.command = command;
        this.status = status;
    }

    public JSONMessage(){
        this("","");
    }


    public String getCommand() {
        return command;
    }

    public String getStatus() {
        return status;
    }

    public void setCommand(String command) {
        this.command = command;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
