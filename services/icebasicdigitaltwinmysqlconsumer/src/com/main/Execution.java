/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.main;

import java.sql.SQLException;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * @author mitch
 */
public class Execution{

    ProcessAgent processA;
    //ProductAgent productA;
    MachineAgent machineA;
    MySQL mysql;
    long timestampSinceLastcheck;

    public Execution(){
        mysql = new MySQL(); //MySQL OBJECT
        Date D = new Date(1L);
        timestampSinceLastcheck = D.getTime();
        processA = new ProcessAgent();
        machineA = new MachineAgent(); 
    }
    
    public boolean Execute(){
    
        String[] processes = mysql.GetData("SELECT * FROM factory.ProcessStatus WHERE status='Start'").split("\\r?\\n");
        if(processes[0].compareTo("")==0)
        {
            //No processes
            return false;
        }
        for(int i=0; i<processes.length;i++)
        {
            String[] arr = processes[i].split(",");
            int id = Integer.parseInt(arr[0]);
            Process process = new Process(id);
            processA.addProcess(process);
        }
          
            //Read the readings database.
        String[] readings = mysql.GetData("SELECT * FROM factory.TaskHistory WHERE timestamp > "+timestampSinceLastcheck+" AND status !='Failed' AND status !='Delayed' ORDER BY timestamp").split("\\r?\\n");

            //Sets all of the machines to Ready 
        //mysql.InsertData("UPDATE factory.Machine SET state='Ready'");
        String[] machines = mysql.GetData("SELECT * FROM factory.Machine").split("\\r?\\n");
        for(int i=0; i<machines.length;i++)
        {
            String[] arr = machines[i].split(",");
            int id = Integer.parseInt(arr[0]);
            String description = arr[1];
            String state = arr[2];
            Machine machine = new Machine(id,description,state);
            machineA.addMachine(machine);
        }

        for(int i=0; i<readings.length; i++)        
        {
         if(readings[i].compareTo("")!=0)
         {
             System.out.println("Execution.java line 71 "+readings[i]);
             String[] arr = readings[i].split(",");
             long timestamp = Long.parseLong(arr[2]);
             timestampSinceLastcheck = timestamp;
             int processId = Integer.parseInt(arr[0]);

             if(processA.getProcess(processId)!= null)
             {
                 String checkExists = mysql.GetData("SELECT * FROM factory.processedData WHERE timestamp="+timestamp).split("\\r?\\n")[0];
                 if(checkExists.compareTo("")== 0)
                 {
                     String taskID = arr[1];
                     String taskStatus = arr[3];
                     String processTemplateID = "";
                     int MachineId = 0;
                     String task = "";
                     String value = "";

                     String[] valueArr = mysql.GetData("SELECT * FROM factory.Reading WHERE timestamp='"+timestamp+"'").split("\\r?\\n");
                     if(valueArr[0].compareToIgnoreCase("")!=0)
                     {
                         arr = valueArr[0].split(",");
                         value = arr[1];
                         MachineId = Integer.parseInt(arr[2]);
                     }

                     String[] taskArr = mysql.GetData("SELECT * FROM factory.TaskTemplate WHERE taskID='"+taskID+"' AND machineIDFK='"+MachineId+"'").split("\\r?\\n");
                     if(taskArr[0].compareToIgnoreCase("")!=0)
                     {
                         arr = taskArr[0].split(",");
                         processTemplateID = arr[1];
                         task = arr[3];
                     }


                     //UPDATE PRODUCT AND ITEMS
                     String status = "";
                     try {
                         status = machineA.updateMachineStatus(MachineId, task, value, timestamp, processId);
                     } catch (SQLException ex) {
                         Logger.getLogger(Execution.class.getName()).log(Level.SEVERE, null, ex);
                     } catch (ClassNotFoundException ex) {
                         Logger.getLogger(Execution.class.getName()).log(Level.SEVERE, null, ex);
                     } catch (InterruptedException ex) {
                         Logger.getLogger(Execution.class.getName()).log(Level.SEVERE, null, ex);
                     }

                     String updateDuration = mysql.GetData("SELECT * FROM factory.ProcessHistory WHERE runningProcessID='"+processId+"' order by timestamp desc limit 1").split("\\r?\\n")[0];
                     if(updateDuration.compareTo("")!=0)
                     {
                         arr = updateDuration.split(",");
                         long ts = Long.parseLong(arr[0].trim());
                         long duration = timestamp-ts;
                         if(status.contains("EndEvent"))
                         {
                             mysql.InsertData("UPDATE factory.ProcessHistory SET duration="+duration+", status='Complete' WHERE runningProcessID='"+processId+"'");
                         }
                         else
                         {
                             mysql.InsertData("UPDATE factory.ProcessHistory SET duration="+duration+" WHERE runningProcessID='"+processId+"'");
                         }  
                     }
                     else
                     {
                         mysql.InsertData("INSERT INTO factory.ProcessHistory (runningProcessID,timestamp,status,duration, processIDFK) VALUES ("+processId+",'"+timestamp+"',"+"'Start',0,'"+processTemplateID+"')");
                     }
                     mysql.InsertData("INSERT INTO factory.processedData VALUES ("+timestamp+")");
                 }
             }
         }
     }

   return true;
}
    
    
}
