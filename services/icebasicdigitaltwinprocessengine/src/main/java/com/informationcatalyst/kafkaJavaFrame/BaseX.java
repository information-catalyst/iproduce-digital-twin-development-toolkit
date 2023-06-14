/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.informationcatalyst.kafkaJavaFrame;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author mitch
 */
public class BaseX {
    
    String base = "http://basexhttp:8984/rest/Factory_Processes/";
    URL url = null;
    
    public String LoadXML(String process)
    {
        try 
        {
            //url = new URL(base + process+".xml");
            url = new URL(base + process);
        } catch (MalformedURLException ex)
        {
            System.out.println("MalformedURLException");
            java.util.logging.Logger.getLogger(KafkaJavaFrameApplication.class.getName()).log(Level.SEVERE, null, ex);
        }

         // Establish the connection to the URL
        HttpURLConnection conn=null;
        try 
        {
            conn = (HttpURLConnection) url.openConnection();
        } catch (IOException ex) 
        {
            System.out.println("IOException ");
            java.util.logging.Logger.getLogger(KafkaJavaFrameApplication.class.getName()).log(Level.SEVERE, null, ex);
        }

        String userCredentials = "admin:admin";
        String basicAuth = "Basic " + java.util.Base64.getEncoder().encodeToString(userCredentials.getBytes());
        conn.setRequestProperty ("Authorization", basicAuth);

        // Print the HTTP response code
        int code = 0;
        try {
            code = conn.getResponseCode();
            System.out.println("\n* HTTP response: " + code +
            " (" + conn.getResponseMessage() + ')');
        } catch (IOException ex) {
            Logger.getLogger(KafkaJavaFrameApplication.class.getName()).log(Level.SEVERE, null, ex);
        }

        String lines = "";
        // Check if request was successful
        if(code == HttpURLConnection.HTTP_OK) 
        {
            // Print the received result to standard output
            System.out.println("\n* Result:");
            // Get and cache input as UTF-8 encoded stream
            try
            {
                 BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
                 // Print all lines of the result
                 String line = "";
                 boolean linesleft = true;
                 while(linesleft)
                 {
                    if((line = br.readLine()) != null)
                    {
                      System.out.println(line);
                      lines += line;
                    }
                    else
                    {
                        break;
                    }
                 }
            }
            catch (Exception e) {
           System.out.println("Exception - " + e.getMessage());
            }
        }

        // Close connection
        conn.disconnect();
        return lines;
    }
    
}
