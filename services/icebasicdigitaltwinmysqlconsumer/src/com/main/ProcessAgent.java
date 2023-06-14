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
public class ProcessAgent {
    
    private final ArrayList<Process> processes;

    
    
    public ProcessAgent(){
        processes = new ArrayList<Process>();
    }
    
    public void addProcess(Process proc)
    {
        processes.add(proc);
    }
    
    public void removeProcess(Process proc)
    {
        //int pos = 0;
        //Find the position of the process in the ArrayList
        for(int i =0; i< processes.size(); i++)
        {
            if(proc.equals(processes.get(i)))
            {
                processes.remove(i);
            }
        }
    }
    
    public Process getProcess(Process proc)
    {
        //Find the position of the process in the ArrayList
        for(int i =0; i< processes.size(); i++)
        {
            if(proc.equals(processes.get(i)))
            {
                return processes.get(i);
            }
        }
        return null;
    }
    
    public Process getProcess(int proc)
    {
        for(int i =0; i< processes.size(); i++)
        {
            if(proc == processes.get(i).getId())
            {
                return processes.get(i);
            }
        }
        return null;
    }
    
    public Process getProcessByPos(int proc)
    {
     return processes.get(proc);
    }
    
    public int getProcessLength()
    {
        return processes.size();
    }
    
}
