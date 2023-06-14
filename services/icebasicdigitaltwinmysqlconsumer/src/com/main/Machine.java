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
public class Machine {
    
    
    private int id;
    private String description;
    private String state;
    private ArrayList<Sensor>  sensors;
    
    public Machine(){
        sensors = new ArrayList<Sensor>();
    }
    
    public Machine(int id, String description, String state)
    {
        this.id = id;
        this.description = description;
        this.state = state;
        sensors = new ArrayList<Sensor>();
    }
    

    public int getId() {
        return id;
    }
    
    public String getName(int num)
    {
        
        if(num == 0)
        {
            return "Crane1";
        }
        if(num == 1)
        {
            return "Oven";
        }
        if(num == 2)
        {
            return "Drill";
        }
        if(num == 3)
        {
            return "Conveyor";
        }
        if(num == 4)
        {
            return "car";
        }
         if(num == 5)
        {
            return "Crane";
        }
        if(num == 6)
        {
            return "Conveyora";
        }
        if(num == 7)
        {
            return "Conveyorb";
        }
        if(num == 8)
        {
            return "warehouse";
        }
        return null;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public Sensor getSensor(Sensor sensor) {
        for(int i =0; i< sensors.size(); i++)
        {
            if(sensor.equals(sensors.get(i)))
            {
                return sensors.get(i);
            }
        }
        return null;
    }

    public void addSensor(Sensor sensor) {
        this.sensors.add(sensor);
    }
    
    
    public Sensor getSensor(int sensor)
    { 
        return sensors.get(sensor);
    }
    
    
     public Sensor getSensorById(String sensorId)
    { 
        for(int i =0; i< sensors.size(); i++)
        {
            if(sensorId.compareTo(sensors.get(i).getId())==0)
            {
                return sensors.get(i);
            }
        }
        return null;
    }
    
    public int sensorListLength()
    {
        return sensors.size();
    }
    
    
    
}
