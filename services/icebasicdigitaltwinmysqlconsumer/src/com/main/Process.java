/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.main;

/**
 *
 * @author mitch
 */
public class Process {
    
    private int id;
    private String name;
    private int nextProcessID;
    private long startTime;
    private long endtime;
    private Progress progress;

    
    public Process()
    {
        progress = new Progress();
    }
    
    public Process(int id)
    {
        progress = new Progress();
        this.id = id;
    }
    
    public Process(int id, String name, int nextProcessID, long startTime)
    {
        progress = new Progress();
        this.id = id;
        this.name = name;
        this.nextProcessID = nextProcessID;
        this.startTime = startTime;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getNextProcessID() {
        return nextProcessID;
    }

    public void setNextProcessID(int nextProcessID) {
        this.nextProcessID = nextProcessID;
    }

    public long getStartTime() {
        return startTime;
    }

    public void setStartTime(long startTime) {
        this.startTime = startTime;
    }

    public long getEndtime() {
        return endtime;
    }

    public void setEndtime(long endtime) {
        this.endtime = endtime;
    }
    
    public Progress getProgress() {
        return progress;
    }

    public void setProgress(Progress progress) {
        this.progress = progress;
    }
    
}
