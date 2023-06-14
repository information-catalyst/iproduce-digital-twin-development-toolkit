package com.rest.endpoints;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import org.apache.commons.codec.binary.Base64;
import java.io.File;
import java.io.FileInputStream;
import javax.json.*;

public class RestClient {
    
    public static void main(String [] args) throws IOException
	{
        pickupAndPostData();
  
        }
    
    /**
	 * This function picks up (dummy) Fagor data from a Json file
	 * It sends the data to a REST client 
	 * @throws IOException
	 */
	public static void pickupAndPostData() throws IOException{
		//File file = new File("src/main/resources/input/iceData.json");
		File file = new File("C:\\Users\\mitch\\Documents\\JsonFiles\\FROGA_2016-11-9_10-39-32.json");
		InputStream is = new FileInputStream(file);
		JsonReader reader = Json.createReader(is);
		JsonArray array = reader.readArray();
		
		//breakup the data into individual Json documents
		for(int i=0;i<array.size();i++){
			JsonObject jo = array.getJsonObject(i);
//			try {
//				Thread.sleep(2000);
//			} catch (InterruptedException e) {				
//				//e.printStackTrace();
//			}
			//System.out.println(jo.toString());
			//send data to the REST client
			//FagorMachineData(jo);		//through tomcat on local endpoint
			FagorMachineDataResthearClient(jo);	//through restheart on remote endpoint
		}
	}

	
	/**
	 * This function provides a client that posts Fagor data directly on ReastHeart API endpoint on remote server
	 * @param jo
	 */
	public static void FagorMachineDataResthearClient(JsonObject jo){	
	try {
                  System.out.println("FagorMachineDataResthearClient");
		  //authentication to connect to the underlying DB
		  String user = "write";
		  String pass = "dSbWrtCH6u";
		  String authString = user+":"+pass;
		  byte[] authBytes = Base64.encodeBase64(authString.getBytes());
		  String authStringEnc = new String(authBytes);
		  //URL url = new URL("http://192.168.99.100:8080/factory/fagormachinedata");//local - fagor
		  //URL url = new URL("http://176.35.40.239:8081/ice/cps");//remote - ice
		  URL url = new URL("http://icemain.hopto.org:8080/factory/c2krobotdata"); // remore - fagor
		  
		  HttpURLConnection conn = (HttpURLConnection) url.openConnection();
		  conn.setRequestMethod("POST");
		  //conn.setDoInput(true);
		  conn.setDoOutput(true);			  
		  conn.setRequestProperty("Authorization", "Basic " + authStringEnc);
		  conn.setRequestProperty("Content-Type", "application/json");			  
		  //open connection
		  conn.connect();
		  //send data to REST service
		  OutputStream os = conn.getOutputStream();
		  os.write(jo.toString().getBytes());
		  //clean up
		  os.flush();	
			if (conn.getResponseCode() != HttpURLConnection.HTTP_CREATED) {throw new RuntimeException("Failed : HTTP error code : "+ conn.getResponseCode());
			}			
		  os.close();			  
		  conn.disconnect();  
	}
	catch (Exception e){
		System.out.println("EXCEPTION: "+e);
	 }
	}
	
}


