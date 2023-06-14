/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.main;

import java.util.ArrayList;


public class ProcessTemplateFailureCheckObject {
    
    RunningStat average;
    int id;
    ArrayList<String> tasks;

    public ProcessTemplateFailureCheckObject(double average, int id) {
        this.average = new RunningStat();
        this.average.Push(average);
        this.id = id;
        this.tasks = new ArrayList<String>();
    }

    public void addAverage(double average) {
        this.average.Push(average);
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
    
    public void addTask(String task)
    {
        this.tasks.add(task);
    }
    
    
    
    
    
}
