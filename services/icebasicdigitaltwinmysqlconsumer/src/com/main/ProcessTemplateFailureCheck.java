/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.main;

import java.util.ArrayList;
import java.util.Date;

/**
 *
 * @author mitch
 */
public class ProcessTemplateFailureCheck {
    
    
    MySQL mysql = new MySQL(); //MySQL OBJECT
    private final ArrayList<ProcessTemplateFailureCheckObject> processTemplateAverages;
    
    public ProcessTemplateFailureCheck()
    {
        processTemplateAverages = new ArrayList<ProcessTemplateFailureCheckObject>();
        String[] processes = mysql.GetData("SELECT * FROM ProcessHistory WHERE status='Complete'").split("\\r?\\n");
        if(processes[0].compareToIgnoreCase("")!=0)
        {
            for(int i =0; i < processes.length; i++)
            {
                int processIDFK = Integer.parseInt(processes[i].split(",")[1]);
                int duration = Integer.parseInt(processes[i].split(",")[4]);
                boolean newProcess = true;
                for(int j=0;j<processTemplateAverages.size();j++)
                {
                    if(processIDFK == processTemplateAverages.get(j).getId())
                    {
                        //processTemplateAverages Already exists add duration to it's average.
                        newProcess = false;
                        processTemplateAverages.get(j).addAverage(duration);
                    }
                }
                if(newProcess)
                {
                    ProcessTemplateFailureCheckObject ptfco = new ProcessTemplateFailureCheckObject(duration,processIDFK);
                    String[] tasks = mysql.GetData("SELECT * FROM TaskTemplate WHERE ProcessIDFK='"+processIDFK+"'").split("\\r?\\n");
                    if(tasks[0].compareToIgnoreCase("")!=0)
                    {
                        for(int j =0; j < tasks.length; j++)
                        {
                            ptfco.addTask(tasks[j].split(",")[0]);
                        }
                    }
                    processTemplateAverages.add(ptfco);
                }
            }
        }
    }
    
    
    
    public void CheckForFailures() 
    {
        Date d = new Date();
        long time = d.getTime();
        
        //Checks the average process time for that process template to see if it has failed.
        String[] processes = mysql.GetData("SELECT * FROM ProcessHistory WHERE status='Start'").split("\\r?\\n");
        if(processes[0].compareToIgnoreCase("")!=0)
        {
            for(int i =0; i < processes.length; i++)
            {
                try{
                    long timestamp = Long.parseLong(processes[i].split(",")[0]);
                    int processIDFK = Integer.parseInt(processes[i].split(",")[1]);
                    int runningProcessID = Integer.parseInt(processes[i].split(",")[2]);
                    //int duration = Integer.parseInt(processes[i].split(",")[4]);
                    long durationCheck = time - timestamp;

                    for(int j=0; j < processTemplateAverages.size(); j++)
                    {
                        if(processIDFK==processTemplateAverages.get(j).getId())
                        {
                            double mean = this.processTemplateAverages.get(j).average.Mean();
                            double standardDeviation = this.processTemplateAverages.get(j).average.StandardDeviation();
                            int mutliplier = 2;
                            //double lowerFence = mean - (standardDeviation * mutliplier);
                            double upperFence = mean + (standardDeviation * mutliplier);
                            System.out.println("ProcessTemplateFailureCheck.java line 387 "+"Template - Duration: "+durationCheck+"  upperFence:"+upperFence);

                            if(durationCheck > upperFence)
                            {
                                //TO DO Check the process against the taskTemplate to see where it is stuck.
                                String processHistory = mysql.GetData("SELECT * FROM TaskHistory WHERE runningProcessID='"+runningProcessID+"' order by timestamp DESC LIMIT 1").split("\\r?\\n")[0];
                                if(processHistory.trim().compareToIgnoreCase("")!=0)
                                {
                                    String endTask = processTemplateAverages.get(j).tasks.get(processTemplateAverages.get(j).tasks.size()-1);
                                    String lastExecutedTask = processHistory.split(",")[1];
                                    
                                    if(endTask.compareToIgnoreCase(lastExecutedTask)!=0)
                                    {
                                        mysql.InsertData("UPDATE ProcessStatus SET status='Failed' WHERE pStatusID="+runningProcessID);
                                        mysql.InsertData("UPDATE ProcessHistory SET status='Failed' WHERE runningProcessID="+runningProcessID);
                                        System.out.println("ProcessTemplateFailureCheck.java line 102"+"UPDATED PROCESS: "+runningProcessID+" TO FAILED - EndTask:"+endTask+" - lastExecutedTask:"+lastExecutedTask);
                                    }
                                }
                                else
                                {
                                    mysql.InsertData("UPDATE ProcessStatus SET status='Failed' WHERE pStatusID="+runningProcessID);
                                    mysql.InsertData("UPDATE ProcessHistory SET status='Failed' WHERE runningProcessID="+runningProcessID);
                                    System.out.println("ProcessTemplateFailureCheck.java line 109 "+"UPDATED PROCESS: "+runningProcessID+" TO FAILED");
                                }
                            }
                        }
                    }
                }
                catch(ArrayIndexOutOfBoundsException e)
                {
                    System.out.println("ProcessTemplateFailureCheck.java line 117 "+"ProcessTemplate Error: "+e);
                }
            }    
        }
    }
    
}

