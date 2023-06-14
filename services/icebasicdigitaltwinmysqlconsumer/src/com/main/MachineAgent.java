/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.main;

import java.sql.SQLException;
import java.util.ArrayList;

/**
 *
 * @author mitch
 */
public class MachineAgent {
    
    private final ArrayList<Machine> machines;
    MySQL mysql = new MySQL(); //MySQL OBJECT
    
    public MachineAgent()
    {
        machines = new ArrayList<Machine>();
    }
    
    public void addMachine(Machine mac)
    {
        machines.add(mac);
    }
    
    public Machine getMachine(int machine)
    {
        for(int i =0; i< machines.size(); i++)
        {
            if(machine == machines.get(i).getId())
            {
                return machines.get(i);
            }
        }
        return null;
    }
    
    public void removeMachine(Machine mac)
    {
        for(int i =0; i< machines.size(); i++)
        {
            if(mac.equals(machines.get(i)))
            {
                machines.remove(i);
            }
        }
    }
    
    public Sensor getSensor(String sensorId)
    {
        for(int i =0; i< machines.size(); i++)
        {
            if(machines.get(i).getSensorById(sensorId)!= null)
            {
                return machines.get(i).getSensorById(sensorId);
            }
        }
        return null;
    }
    
    
    public int getMachineID(String machineId)
    {
        if(machineId.compareToIgnoreCase("crane1")==0)
        {
            return 0;
        }
        if(machineId.compareToIgnoreCase("crane")==0)
        {
            return 5;
        }
        if(machineId.compareToIgnoreCase("conveyora")==0)
        {
            return 6;
        }
        if(machineId.compareToIgnoreCase("conveyorb")==0)
        {
            return 7;
        }
        if(machineId.compareToIgnoreCase("oven")==0)
        {
            return 1;
        }
        if(machineId.compareToIgnoreCase("drill")==0)
        {
            return 2;
        }
        if(machineId.compareToIgnoreCase("conveyor")==0)
        {
            return 3;
        }
        if(machineId.compareToIgnoreCase("car")==0)
        {
            return 4;
        }
        return 100;
    }
    
    public String updateMachineStatus(int machineId, String task, String value, long time, int processId) throws SQLException, ClassNotFoundException, InterruptedException
    {
//        System.out.print(machines.get(0).getState()+",");  

        
        if(value.compareToIgnoreCase("Start")==0)
        {

            if(task.compareToIgnoreCase("EndEvent")==0)
            {
                mysql.InsertData("UPDATE factory.ProcessStatus SET status= 'Complete' WHERE pStatusID='"+processId+"'");
                return task;
            }
            else
            {
                mysql.InsertData("UPDATE factory.Machine SET state='"+task+"', stateInt=1 WHERE machineID='"+machineId+"'");
                String machineHistory = mysql.GetData("SELECT * FROM factory.MachineHistory WHERE processid="+processId+" AND machineIDFK="+machineId).split("\\r?\\n")[0];
                if(machineHistory.trim().compareToIgnoreCase("")!=0)
                {
                    long duration = Integer.parseInt(machineHistory.split(",")[3]);
                    machineHistory = mysql.GetData("SELECT * FROM factory.MachineHistory WHERE processid="+processId+" order by timestamp desc limit 1").split("\\r?\\n")[0];
                    long ts = Long.parseLong(machineHistory.split(",")[0]);
                    duration += time-ts;
                    mysql.InsertData("UPDATE factory.MachineHistory set duration="+duration+", timestamp="+time+" WHERE processid="+processId+" AND machineIDFK="+machineId);
                }
                else
                {
                    mysql.InsertData("INSERT INTO factory.MachineHistory (timestamp,machineIDFK,status,duration,processId) VALUES ("+time+",'"+machineId+"','"+task+"',0,'"+processId+"')");
                }
                return task;
            }
        }
        else if(value.compareToIgnoreCase("done")==0){
            String updateDuration = mysql.GetData("SELECT * FROM factory.MachineHistory WHERE processid="+processId+" AND machineIDFK="+machineId+" order by timestamp desc limit 1").split("\\r?\\n")[0];
            if(updateDuration.trim().compareTo("")!=0)
            {
                String[] arr = updateDuration.split(",");
                long timestamp = Long.parseLong(arr[0]);
                long duration = Long.parseLong(arr[3]);
                duration += time-timestamp;
                mysql.InsertData("UPDATE factory.MachineHistory set duration="+duration+", timestamp="+time+" WHERE processid="+processId+" AND machineIDFK="+machineId);
            }
            mysql.InsertData("UPDATE factory.Machine SET state="+"'Ready', stateInt=0 WHERE machineID='"+machineId+"'");
            return task;
        }
        
        System.out.println("MachineAgent.java line 156 "+"Fail! Value:"+value);
        return "Fail";
    }
    
}
