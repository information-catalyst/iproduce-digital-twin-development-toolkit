package com.rest.endpoints;

import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonReader;

import org.apache.commons.codec.binary.Base64;

public class GetMachineData {

	public static void main(String[] args) throws IOException {
		String response = restGetMachineData();
		//String response = restGetRobot1Data();
		System.out.println(response);
	}
	/**
	 * This function picks up ALL machine data from a remote repository
	 * @return Json String containing ALL machine data
	 * @throws IOException
	 */
	public static String restGetMachineData() throws IOException { 
		StringBuilder sb = new StringBuilder();
		String responseString = null;
		try {			
   			//authentication to connect to the underlying DB
   			  String user = "write";
   			  String pass = "dSbWrtCH6u";
   			  String authString = user+":"+pass;
   			  byte[] authBytes = Base64.encodeBase64(authString.getBytes());
   			  String authStringEnc = new String(authBytes);
   			  //setup HTTP connection
   			  URL url = new URL("http://icemain.hopto.org:8080/factory/fagormachinedata"); //retrieve data from external dwh
   			 
   			  //URL url = new URL("http://192.168.99.100:8080/factory/fagormachine"); //retrieve data from local dwh
   			  HttpURLConnection conn = (HttpURLConnection) url.openConnection();
   			  conn.setRequestMethod("GET");
   			  conn.setRequestProperty("Authorization", "Basic " + authStringEnc);
   			  conn.setRequestProperty("Accept", "application/json");
   			  if (conn.getResponseCode() != 200) {
   				throw new RuntimeException("Failed : HTTP error code: "+ conn.getResponseCode());
   			  }
   			  //get data from REST service
   			  JsonReader reader = Json.createReader(new InputStreamReader(conn.getInputStream()));
   			  JsonObject jo = reader.readObject();   			  
   			  JsonArray array = jo.getJsonObject("_embedded").getJsonArray("rh:doc");
   			  //System.out.println(array);   			  
   			  sb.append("[");
   			  for(int i=0;i<array.size();i++){
   			  JsonObject joo = array.getJsonObject(i);
   			  sb.append("{\"metadata\":"+joo.getJsonObject("metadata")+",");
   			  sb.append("\"data\":"+joo.getJsonObject("data")+"},");
   			  //System.out.println(joo.getJsonObject("metadata"));   			  
   			  //System.out.println(joo.getJsonObject("data"));
   			  }
   			  sb.deleteCharAt(sb.length()-1);
   			  sb.append("]");
   			  responseString = sb.toString();
   			     			  conn.disconnect();  
       	}
   		catch (Exception e){
   			System.out.println("Problem in accessing remote server: "+e);
   		} 
		//System.out.println(responseString);
       	return responseString;
       }
	
	/**
	 * This function picks up ALL automotive (robot1) data from a remote repository
	 * @return Json String containing ALL data
	 * @throws IOException
	 */
	public static String restGetRobot1Data() throws IOException { 
		StringBuilder sb = new StringBuilder();
		String responseString = null;
		try {			
   			//authentication to connect to the underlying DB
   			  String user = "admin";
   			  String pass = "FWv!Bv%}>+ySt[9xaq8";
   			  String authString = user+":"+pass;
   			  byte[] authBytes = Base64.encodeBase64(authString.getBytes());
   			  String authStringEnc = new String(authBytes);
   			  //setup HTTP connection
   			  URL url = new URL("http://176.35.40.239:8081/factory/robot1"); //retrieve data from external dwh
   			  //URL url = new URL("http://192.168.99.100:8080/factory/fagormachine"); //retrieve data from local dwh
   			  HttpURLConnection conn = (HttpURLConnection) url.openConnection();
   			  conn.setRequestMethod("GET");
   			  conn.setRequestProperty("Authorization", "Basic " + authStringEnc);
   			  conn.setRequestProperty("Accept", "application/json");
   			  if (conn.getResponseCode() != 200) {
   				throw new RuntimeException("Failed : HTTP error code: "+ conn.getResponseCode());
   			  }
   			  //get data from REST service
   			  JsonReader reader = Json.createReader(new InputStreamReader(conn.getInputStream()));
   			  JsonObject jo = reader.readObject();   			  
   			  JsonArray array = jo.getJsonObject("_embedded").getJsonArray("rh:doc");
   			  //System.out.println(array);   			  
   			  sb.append("[");
   			  for(int i=0;i<array.size();i++){
   			  JsonObject joo = array.getJsonObject(i);
   			  sb.append("{\"metadata\":"+joo.getJsonObject("metadata")+",");
   			  sb.append("\"data\":"+joo.getJsonObject("data")+"},");
   			  //System.out.println(joo.getJsonObject("metadata"));   			  
   			  //System.out.println(joo.getJsonObject("data"));
   			  }
   			  sb.deleteCharAt(sb.length()-1);
   			  sb.append("]");
   			  responseString = sb.toString();
   			     			  conn.disconnect();  
       	}
   		catch (Exception e){
   			System.out.println("Problem in accessing remote server: "+e);
   		} 
		System.out.println(responseString);
       	return responseString;
       }
}
