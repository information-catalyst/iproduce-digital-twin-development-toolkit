/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.main;

import java.sql.SQLException;
import java.util.Date;

/**
 *
 * @author mitch
 */
public class Run {
    
//    public static void main(String [] args) throws SQLException, ClassNotFoundException, InterruptedException
//    {
//     boolean loop = true;
//        //CheckDatabasesExist CDE = new CheckDatabasesExist();
//        //while(loop)
//        //{
//        //FakeData fd = new FakeData();
//        //long time = fd.createData();
//        //long time = 1527172061389L; 
//        Date d = new Date();
//        long time = d.getTime();
//        FailureDetection FD = new FailureDetection();
//        FD.CheckForFailures(time);
//        
//        Execution ex = new Execution();
//        ex.getCurrentStates(true); //Historic is whether or not readings from before the current time are processed or not.
//        //}
//        while(loop) //Loops until the user clicks the stop processes button at: StatusPage.html 
//        {
//            FD.CheckForFailures(time);
//            Date d2 = new Date();
//            time = d2.getTime();
//            ex.getCurrentStates(true);
//            try
//            {
//                Thread.sleep(1000);
//            }
//            catch (InterruptedException e)
//            {
//                 Thread.currentThread().interrupt(); // restore interrupted status
//            }
//        }
//    }
    
    public void Go() throws SQLException, ClassNotFoundException, InterruptedException{
        
        boolean loop = true;
//        Date d = new Date();
//        long time = d.getTime();
//        FailureDetection FD = new FailureDetection();
//        FD.CheckForFailures(time);
        
        Execution ex = new Execution();
        ex.Execute();

        while(loop) //Loops until the user clicks the stop processes button at: StatusPage.html 
        {
            MySQL ms = new MySQL();
            String status = ms.GetData("SELECT * From factory.status WHERE name='processing'");
            if(status.trim().contains("false"))
            {
                loop = false;
            }
            //FD.CheckForFailures(time);
            //Date d2 = new Date();
            
            ex.Execute();
            try
            {
                Thread.sleep(1000);
                //time = d2.getTime();
            }
            catch (InterruptedException e)
            {
                 Thread.currentThread().interrupt(); // restore interrupted status
            }
        }
    }
    
}
