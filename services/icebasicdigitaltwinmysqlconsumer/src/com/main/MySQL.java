/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.main;

import java.net.ConnectException;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import org.apache.commons.lang3.StringEscapeUtils;
import java.sql.*;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author mitch
 */
public class MySQL {
    
    public void InsertData(String statement) {
        System.out.println(statement);
        try{
            Class.forName("com.mysql.jdbc.Driver"); //connector
        }
        catch(ClassNotFoundException e){
            System.out.println("MySQL.java line 30 "+e);
            return;
        }
        //ice: icemain.hopto.org:3306/factory","root","FWv!Bv%}>+ySt[9xaq8"
        //local: jdbc:mysql://192.168.99.100:3306/factory","root","test"
        //kafkanetwork jdbc:mysql://kafkanetwork_kafkamysql_1:3306/factory?autoReconnect=true&useSSL=false","root","test
        java.sql.Connection con = null;
        try{
            con = DriverManager.getConnection("jdbc:mysql://"+System.getenv("KAFKA_MYSQL")+"?autoReconnect=true&useSSL=false","root","test"); //connection string
            Statement st= con.createStatement(); //creates connection string statement
            st.executeUpdate(StringEscapeUtils.unescapeJava(statement)); //for each insert statement execute the insert statement into the database
        }
        catch(SQLException e)
        {
           Logger.getLogger(MySQL.class.getName()).log(Level.SEVERE, null, e);
           if(e.getCause() instanceof ConnectException)
           {
               try {
                        Thread.sleep(5000);
                    } catch (InterruptedException ex) {
                        Logger.getLogger(MySQL.class.getName()).log(Level.SEVERE, null, ex);
                    }
                InsertData(statement);
           }   
        }
        finally{
            try 
            {
                con.close();
            } 
            catch (SQLException ex) 
            {
                Logger.getLogger(MySQL.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    public String GetData(String statement) {
        System.out.println(statement);
        try{
        Class.forName("com.mysql.jdbc.Driver"); //connector
        }
        catch(ClassNotFoundException e){
            System.out.println("MySQL.java line 73 "+e);
            return "SQL Driver Not Found";
        }
        //ice: icemain.hopto.org:3306/factory","root","FWv!Bv%}>+ySt[9xaq8"
        //local: jdbc:mysql://192.168.99.100:3306/factory","root","test"
        java.sql.Connection con = null;
            try
            {
                con = DriverManager.getConnection("jdbc:mysql://"+System.getenv("KAFKA_MYSQL")+"?autoReconnect=true&useSSL=false","root","test"); //connection string

                Statement st= con.createStatement(); //creates connection string statement
                ResultSet rs = st.executeQuery(StringEscapeUtils.unescapeJava(statement)); //for each insert statement execute the insert statement into the database
                String ret = "";
                while (rs.next()) {

                    ResultSetMetaData rsmd = rs.getMetaData();
                    int columnCount =  rsmd.getColumnCount();
                    for(int i =1;i<=columnCount;i++)
                    {
                     ret += rs.getString(rsmd.getColumnName(i))+",";
                    }
                    ret = ret.substring(0,ret.length()-1);
                    ret +=  System.lineSeparator();
                }
                return ret;
            }
            catch(SQLException e){
                Logger.getLogger(MySQL.class.getName()).log(Level.SEVERE, null, e);
                if(e.getCause() instanceof ConnectException)
                {
                    try {
                        Thread.sleep(5000);
                    } catch (InterruptedException ex) {
                        Logger.getLogger(MySQL.class.getName()).log(Level.SEVERE, null, ex);
                    }
                  InsertData(statement);
                }
            }
            finally{
                try 
                {
                     con.close();
                }
                catch (SQLException ex) 
                {
                    Logger.getLogger(MySQL.class.getName()).log(Level.SEVERE, null, ex);
                }
                catch(java.lang.NullPointerException e)
                {
                    System.out.println("MySQL.java line 122 "+"MYSQL: "+e);
                }

            }
            return "Error";
        }

    
}
