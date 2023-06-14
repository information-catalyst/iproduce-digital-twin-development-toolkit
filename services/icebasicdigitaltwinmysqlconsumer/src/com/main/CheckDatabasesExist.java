/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.main;

import java.sql.SQLException;
import javax.servlet.annotation.WebListener;

/**
 *
 * @author mitch
 */
@WebListener
public class CheckDatabasesExist  {
    
    public CheckDatabasesExist() throws ClassNotFoundException, SQLException, InterruptedException{
        
        MySQL mysql = new MySQL();

        //Checks to see if the databases exist and if not creates and populates them where necessary.
//        String database = mysql.GetData("SELECT * FROM information_schema.tables WHERE table_schema = 'factory'");
//        if(database.compareTo("")==0)
//        {
//            mysql.InsertData("CREATE DATABASE `factory` /*!40100 DEFAULT CHARACTER SET latin1 */;");
//        }

        Thread.sleep(10000);

        String itemDB = mysql.GetData("SELECT * FROM information_schema.tables WHERE table_schema = 'factory' AND table_name = 'Item'");
        if(itemDB.compareTo("")==0)
        {
            mysql.InsertData("CREATE TABLE `Item` (\n" +
            "  `id` int(11) DEFAULT NULL,\n" +
            "  `colour` text,\n" +
            "  `status` text,\n" +
            "  `productid` int(11) NOT NULL AUTO_INCREMENT,\n" +
            "  PRIMARY KEY (`productid`)\n" +
            ") ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;");

        }

        String itemHist = mysql.GetData("SELECT * FROM information_schema.tables WHERE table_schema = 'factory' AND table_name = 'ItemHistory'");
        if(itemHist.compareTo("")==0)
        {
            mysql.InsertData("CREATE TABLE `ItemHistory` (\n" +
            "  `timestamp` bigint(20) NOT NULL,\n" +
            "  `itemIDFK` int(11) NOT NULL,\n" +
            "  `runningProcessID` varchar(100) NOT NULL,\n" +
            "  `location` varchar(100) NOT NULL,\n" +
            "  `duration` bigint(20) DEFAULT NULL,\n" +
            "  PRIMARY KEY (`timestamp`)\n" +
            ") ENGINE=InnoDB DEFAULT CHARSET=latin1;");
        }


        String machineDB = mysql.GetData("SELECT * FROM information_schema.tables WHERE table_schema = 'factory' AND table_name = 'Machine'");
        if(machineDB.compareTo("")==0)
        {
            mysql.InsertData("CREATE TABLE `Machine` (\n" +
            "  `machineID` int(11) NOT NULL,\n" +
            "  `name` varchar(100) NOT NULL,\n" +
            "  `state` varchar(45) DEFAULT NULL,\n" +
            "  `stateInt` int(1) DEFAULT '0',\n" +
            "  PRIMARY KEY (`machineID`)\n" +
            ") ENGINE=InnoDB DEFAULT CHARSET=latin1;");
            
            mysql.InsertData("INSERT INTO factory.Machine VALUES ('0', 'crane1', 'Ready',0)");
            mysql.InsertData("INSERT INTO factory.Machine VALUES ('1', 'oven', 'Ready',0)");
            mysql.InsertData("INSERT INTO factory.Machine VALUES ('2', 'drill', 'Ready',0)");
            mysql.InsertData("INSERT INTO factory.Machine VALUES ('3', 'conveyor', 'Ready',0)");
            mysql.InsertData("INSERT INTO factory.Machine VALUES ('4', 'car', 'Ready',0)");
            mysql.InsertData("INSERT INTO factory.Machine VALUES ('5', 'crane', 'Ready',0)");
            mysql.InsertData("INSERT INTO factory.Machine VALUES ('6', 'conveyora', 'Ready',0)");
            mysql.InsertData("INSERT INTO factory.Machine VALUES ('7', 'conveyorb', 'Ready',0)");
            mysql.InsertData("INSERT INTO factory.Machine VALUES ('8', 'warehouse', 'Ready',0)");
        }



        String machineHistDB = mysql.GetData("SELECT * FROM information_schema.tables WHERE table_schema = 'factory' AND table_name = 'MachineHistory'");
        if(machineHistDB.compareTo("")==0)
        {
            mysql.InsertData("CREATE TABLE `MachineHistory` (\n" +
            "  `timestamp` bigint(20) NOT NULL,\n" +
            "  `machineIDFK` int(11) NOT NULL,\n" +
            "  `status` varchar(50) NOT NULL,\n" +
            "  `duration` bigint(15) DEFAULT NULL,\n" +
            "  `processid` varchar(45) DEFAULT NULL,\n" +
            "  PRIMARY KEY (`timestamp`)\n" +
            ") ENGINE=InnoDB DEFAULT CHARSET=latin1;");
        }

        String machineStat = mysql.GetData("SELECT * FROM information_schema.tables WHERE table_schema = 'factory' AND table_name = 'MachineStatus'");
        if(machineStat.compareTo("")==0)
        {
            mysql.InsertData("CREATE TABLE `MachineStatus` (\n" +
            "  `mStatusID` int(11) NOT NULL,\n" +
            "  `status` varchar(50) NOT NULL,\n" +
            "  PRIMARY KEY (`mStatusID`)\n" +
            ") ENGINE=InnoDB DEFAULT CHARSET=latin1;");
        }

        String processedData = mysql.GetData("SELECT * FROM information_schema.tables WHERE table_schema = 'factory' AND table_name = 'processedData'");
        if(processedData.compareTo("")==0)
        {
            mysql.InsertData("CREATE TABLE `processedData` (\n" +
            "  `timestamp` bigint(20) NOT NULL,\n" +
            "  PRIMARY KEY (`timestamp`)\n" +
            ") ENGINE=InnoDB DEFAULT CHARSET=latin1;");
        }


        String processHistDB = mysql.GetData("SELECT * FROM information_schema.tables WHERE table_schema = 'factory' AND table_name = 'ProcessHistory'");
        if(processHistDB.compareTo("")==0)
        {
            mysql.InsertData("CREATE TABLE `ProcessHistory` (\n" +
            "  `timestamp` bigint(20) NOT NULL,\n" +
            "  `processIDFK` int(11) NOT NULL,\n" +
            "  `runningProcessID` varchar(100) NOT NULL,\n" +
            "  `status` varchar(50) NOT NULL,\n" +
            "  `duration` bigint(15) NOT NULL,\n" +
            "  PRIMARY KEY (`timestamp`)\n" +
            ") ENGINE=InnoDB DEFAULT CHARSET=latin1;");
        }

        String processStat = mysql.GetData("SELECT * FROM information_schema.tables WHERE table_schema = 'factory' AND table_name = 'ProcessStatus'");
        if(processStat.compareTo("")==0)
        {
            mysql.InsertData("CREATE TABLE `ProcessStatus` (\n" +
            "  `pStatusID` int(11) NOT NULL,\n" +
            "  `status` varchar(50) NOT NULL,\n" +
            "  PRIMARY KEY (`pStatusID`)\n" +
            ") ENGINE=InnoDB DEFAULT CHARSET=latin1;");
        }

        String processTemp = mysql.GetData("SELECT * FROM information_schema.tables WHERE table_schema = 'factory' AND table_name = 'ProcessTemplate'");
        if(processTemp.compareTo("")==0)
        {
            mysql.InsertData("CREATE TABLE `ProcessTemplate` (\n" +
            "  `processID` int(11) NOT NULL,\n" +
            "  `name` varchar(100) DEFAULT NULL,\n" +
            "  `xml` varchar(500) DEFAULT NULL,\n" +
            "  PRIMARY KEY (`processID`)\n" +
            ") ENGINE=InnoDB DEFAULT CHARSET=latin1;");
        }

        String reading = mysql.GetData("SELECT * FROM information_schema.tables WHERE table_schema = 'factory' AND table_name = 'Reading'");
        if(reading.compareTo("")==0)
        {
            mysql.InsertData("CREATE TABLE `Reading` (\n" +
            "  `timestamp` bigint(20) NOT NULL,\n" +
            "  `value` varchar(40) DEFAULT NULL,\n" +
            "  `machineIDFK` int(11) NOT NULL,\n" +
            "  `task` varchar(100) DEFAULT NULL,\n" +
            "  PRIMARY KEY (`timestamp`)\n" +
            ") ENGINE=InnoDB DEFAULT CHARSET=latin1;");
        }

        String sensor = mysql.GetData("SELECT * FROM information_schema.tables WHERE table_schema = 'factory' AND table_name = 'Sensor'");
        if(sensor.compareTo("")==0)
        {
            mysql.InsertData("CREATE TABLE `Sensor` (\n" +
            "  `sensorID` int(11) NOT NULL,\n" +
            "  `name` varchar(100) NOT NULL,\n" +
            "  `machineIDFK` int(11) NOT NULL,\n" +
            "  PRIMARY KEY (`sensorID`)\n" +
            ") ENGINE=InnoDB DEFAULT CHARSET=latin1;");
        }

        String statusDB = mysql.GetData("SELECT * FROM information_schema.tables WHERE table_schema = 'factory' AND table_name = 'status'");
        if(statusDB.compareTo("")==0)
        {
            mysql.InsertData("CREATE TABLE `status` (\n" +
            "  `name` varchar(45) NOT NULL,\n" +
            "  `status` varchar(5) DEFAULT NULL,\n" +
            "  PRIMARY KEY (`name`)\n" +
            ") ENGINE=InnoDB DEFAULT CHARSET=latin1;");

            mysql.InsertData("INSERT INTO factory.status VALUES ('bpmndata','false')");
            mysql.InsertData("INSERT INTO factory.status VALUES ('commands','false')");
            mysql.InsertData("INSERT INTO factory.status VALUES ('processing','false')");
            mysql.InsertData("INSERT INTO factory.status VALUES ('watchdog','false')");
        }
        else
        {
             mysql.InsertData("UPDATE factory.status SET status='false'");
        }

        String taskFlow = mysql.GetData("SELECT * FROM information_schema.tables WHERE table_schema = 'factory' AND table_name = 'TaskFlow'");
        if(taskFlow.compareTo("")==0)
        {
            mysql.InsertData("CREATE TABLE `TaskFlow` (\n" +
            "  `taskIDFK` varchar(100) NOT NULL,\n" +
            "  `nextTaskIDFK` varchar(100) DEFAULT NULL,\n" +
            "  PRIMARY KEY (`taskIDFK`)\n" +
            ") ENGINE=InnoDB DEFAULT CHARSET=latin1;");
        }

        String taskHist = mysql.GetData("SELECT * FROM information_schema.tables WHERE table_schema = 'factory' AND table_name = 'TaskHistory'");
        if(taskHist.compareTo("")==0)
        {
            mysql.InsertData("CREATE TABLE `TaskHistory` (\n" +
            "  `runningProcessID` varchar(100) NOT NULL,\n" +
            "  `taskIDFK` varchar(100) NOT NULL,\n" +
            "  `timestamp` bigint(20) NOT NULL,\n" +
            "  `status` varchar(50) NOT NULL,\n" +
            "  `duration` bigint(20) DEFAULT NULL,\n" +
            "  `itemIDFK` int(11) DEFAULT NULL,\n" +
            "  PRIMARY KEY (`timestamp`)\n" +
            ") ENGINE=InnoDB DEFAULT CHARSET=latin1;");
        }

        String taskStat = mysql.GetData("SELECT * FROM information_schema.tables WHERE table_schema = 'factory' AND table_name = 'TaskStatus'");
        if(taskStat.compareTo("")==0)
        {
            mysql.InsertData("CREATE TABLE `TaskStatus` (\n" +
            "  `tStatusID` int(11) NOT NULL,\n" +
            "  `status` varchar(50) DEFAULT NULL,\n" +
            "  PRIMARY KEY (`tStatusID`)\n" +
            ") ENGINE=InnoDB DEFAULT CHARSET=latin1;");
        }

        String taskTemp = mysql.GetData("SELECT * FROM information_schema.tables WHERE table_schema = 'factory' AND table_name = 'TaskTemplate'");
        if(taskTemp.compareTo("")==0)
        {
            mysql.InsertData("CREATE TABLE `TaskTemplate` (\n" +
            "  `taskID` int(11) NOT NULL,\n" +
            "  `processIDFK` int(11) NOT NULL,\n" +
            "  `machineIDFK` int(11) NOT NULL,\n" +
            "  `name` varchar(100) NOT NULL,\n" +
            "  `splitType` varchar(3) NOT NULL,\n" +
            "  `joinType` varchar(3) NOT NULL,\n" +
            "  PRIMARY KEY (`taskID`)\n" +
            ") ENGINE=InnoDB DEFAULT CHARSET=latin1;");
        }
                
    }
    
}
