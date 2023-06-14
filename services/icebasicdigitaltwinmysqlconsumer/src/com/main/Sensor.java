/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.main;

import java.util.ArrayList;

/**
 *
 * @author mitch
 */
public class Sensor {
    
    private String id;
    private int machineId;
    private boolean active;

    public int getMachineId() {
        return machineId;
    }

    public void setMachineId(int machineId) {
        this.machineId = machineId;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
    private final ArrayList<String> readings;
    
    public Sensor(){
         readings = new ArrayList<String>();
    }
    
    public Sensor(String id, int machineId,boolean active){
        this.id = id;
        this.machineId = machineId;
        this.active = active;
        readings = new ArrayList<String>();
    }
    
    public int addReading(String reading) 
    {        
        readings.add(reading);
        return machineId;
    }
    
    public String getReading(int reading)
    {
        return readings.get(reading);
    }

    public String getId() {
        return id;
    }
    

    public void setId(String id) {
        this.id = id;
    }

    
}
