/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.main;

import java.sql.SQLException;
import java.util.Date;
import java.util.Random;

/**
 *
 * @author mitch
 */
public class FakeData {
    
    MySQL mysql = new MySQL(); //MySQL OBJECT
    
    public Long createData() throws ClassNotFoundException, SQLException, InterruptedException{
        
         Date d = new Date();
        Long time = d.getTime();
        Long startTime = time;
        int processId = 121;
        //Timestamp,Value,SensorId,ItemId
        
        try{
        String process = mysql.GetData("SELECT * FROM factory.Process ORDER BY id DESC LIMIT 1");
        if(process.compareTo("")!=0)
        {
        String[] arr = process.split(",");
        processId = Integer.parseInt(arr[0].trim())+1;
        mysql.InsertData("INSERT INTO factory.Process (id) VALUES ("+processId+")");
        }
        
        //Sets time to the last inputted readings.
//        String lastTime = mysql.GetData("SELECT * FROM factory.Reading ORDER BY timestamp DESC LIMIT 1");
//        if(lastTime.compareTo("")!=0)
//        {
//        String[] arr = lastTime.split(",");
//        time = Long.parseLong(arr[0].trim());
//        startTime = time+1;
//        time = rand(time);
//        }
  
            
        mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', null, 'StartProcess', "+processId+")");
        time = rand(time);
       

mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'crane1', 'crane1_MoveToWarehouse', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'crane1', 'crane1_MoveToWarehouse', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'crane1', 'crane1_PickupWhite', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'crane1', 'crane1_PickupWhite', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'crane1', 'crane1_MoveToOven', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'crane1', 'crane1_MoveToOven', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'crane1', 'crane1_Drop', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'crane1', 'crane1_Drop', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'crane1', 'crane1_Reset', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'crane1', 'crane1_Reset', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'drill', 'drill_runMotor', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'drill', 'drill_runMotor', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'Oven', 'OvenCooking', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'Oven', 'OvenCooking', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'Oven', 'OvenMoveToOven', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'Oven', 'OvenMoveToOven', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'Oven', 'OvenPickupCounter', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'Oven', 'OvenPickupCounter', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'Oven', 'OvenMoveToDrilling', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'Oven', 'OvenMoveToDrilling', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'Oven', 'OvenDrop', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'Oven', 'OvenDrop', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'drill', 'drill_moveToDrill', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'drill', 'drill_moveToDrill', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'drill', 'drill_drillCounter', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'drill', 'drill_drillCounter', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'drill', 'drill_moveToConveyor', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'drill', 'drill_moveToConveyor', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'drill', 'drill_deposit', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'drill', 'drill_deposit', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'drill', 'drill_runConveyor', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'drill', 'drill_runConveyor', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'drill', 'drill_Reset', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'drill', 'drill_Reset', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'Conveyor', 'ConveyorWaiting', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'Conveyor', 'ConveyorWaiting', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'Conveyor', 'ConveyorSort', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'Conveyor', 'ConveyorSort', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'crane1', 'crane1_Move2', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'crane1', 'crane1_Move2', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'crane1', 'crane1_Pickup2', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'crane1', 'crane1_Pickup2', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'crane1', 'crane1_MoveToWarehouse2', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'crane1', 'crane1_MoveToWarehouse2', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'crane1', 'crane1_Drop2', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'crane1', 'crane1_Drop2', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'crane1', 'crane1_Reset2', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'crane1', 'crane1_Reset2', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'Car', 'CarForward', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'Car', 'CarForward', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'Car', 'CarLeft', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'Car', 'CarLeft', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'Car', 'CarForward1', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'Car', 'CarForward1', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'Car', 'CarLeft1', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'Car', 'CarLeft1', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'Car', 'CarForward2', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'Car', 'CarForward2', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'Crane', 'MoveToConveyorB', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'Crane', 'MoveToConveyorB', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'Crane', 'PickupWhiteState', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'Crane', 'PickupWhiteState', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'Crane', 'MoveToConveyorA', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'Crane', 'MoveToConveyorA', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'Crane', 'DropState', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'Crane', 'DropState', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'Crane', 'ResetState', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'Crane', 'ResetState', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'ConveyorA', 'StartBeltA1', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'ConveyorA', 'StartBeltA1', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'ConveyorA', 'PushAState', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'ConveyorA', 'PushAState', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'ConveyorA', 'ResetAState', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'ConveyorA', 'ResetAState', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'ConveyorA', 'SlowBeltA2', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'ConveyorA', 'SlowBeltA2', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'ConveyorA', 'ToolAState', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'ConveyorA', 'ToolAState', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'ConveyorA', 'StartBeltA2', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'ConveyorA', 'StartBeltA2', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'ConveyorB', 'StartBeltB1', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'ConveyorB', 'StartBeltB1', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'ConveyorB', 'StopBeltA2', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'ConveyorB', 'StopBeltA2', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'ConveyorB', 'ConveyorBPush', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'ConveyorB', 'ConveyorBPush', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'ConveyorB', 'ResetBState', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'ConveyorB', 'ResetBState', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'Start', 'ConveyorB', 'StartBeltB2', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', 'ConveyorB', 'StartBeltB2', "+processId+")");
time = rand(time);
mysql.InsertData("INSERT INTO factory.Reading VALUES ("+time+", 'End', null, 'EndProcess', "+processId+")");

        

        }
        catch(Exception e){
            System.out.println("FakeData.java line 238 "+e);
        }
        time = rand(time);
        return startTime;
    }
    
    public Long rand(Long time)
    {
        Random r = new Random();
        int Low = 500;
        int High = 4000;
        time += r.nextInt(High-Low) + Low;
        return time; 
    }
    
}

