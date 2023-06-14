package com.rest.endpoints;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.ParseException;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.apache.commons.codec.binary.Base64;

//import com.stream.processing.StreamBatchProcessing;
import static java.lang.Double.parseDouble;

//import com.bda.batch.FetchBatchData;
//import com.stream.processing.StreamBatchProcessing;


/** 
 * @author Usman W(ICE)
 * 
 *This service offers endpoints to receive different types of data
 *It annotates the incoming data with contextualised tags
 *It stores the annotated data in dockerised DWH (MongoDB), thourgh its REST interface (RESTHeart)
 *
 ****This service has been replaced with direct RestHeart API calls***
 */
@Path("/postdata")
public class RestEndpoints {

	private static final String DHS_REST_URI = System.getenv("DHS_REST_URI");

	@GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getMsg()
    {
         return "Waiting for data...use /process or /pressmachinetemperaturestream";
    }
    /**   
     * TEST
     * @param streamData
     * This function receives (dummy) Temperature data
     * It annotates the incoming data with timestamp
     * The annotated data is stored in dockerised DWH, through its RESTheart interface
     * @return Response
     */
    @POST
	@Path("/pressmachinetemperaturestream")
	@Consumes(MediaType.APPLICATION_JSON)
    public Response restStreamResponse(String streamData) {
    	//prepare raw sensor data for storage
    	java.util.Date date= new java.util.Date();
    	long timestamp=date.getTime();//new SimpleDateFormat("HH:mm:ss").format(new Date());		
		String json = "{\"temperature\":"+ streamData+", \"timestamp\":\""+timestamp+"\"}";		
		try {
			//authentication to connect to the underlying DB
			  String user = "admin";
			  String pass = "FWv!Bv%}>+ySt[9xaq8";
			  String authString = user+":"+pass;
			  byte[] authBytes = Base64.encodeBase64(authString.getBytes());
			  String authStringEnc = new String(authBytes);
			  
			  URL url = new URL("http://192.168.99.100:8080/factory/pressmachinetemperature");
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
			  os.write(json.getBytes());
			  //clean up
			  os.flush();	
			  if (conn.getResponseCode() != HttpURLConnection.HTTP_CREATED) {
					throw new RuntimeException("Failed : HTTP error code : "
						+ conn.getResponseCode());
				}			
			  os.close();			  
			  conn.disconnect();  
		}
		catch (Exception e){
			System.out.println("EXCEPTION: "+e);
		}
    	return Response.status(201).entity(streamData).build(); 
    	}
      
    /**
     * CREMA - Machine Usecase
     * @param qry
     * This function accepts a built_query string
     * It annotates the incoming string 
     * It stores the annotated string in the dockerised DWH, through its REST interface
     * @return Response
     */
    @POST
    @Path("/builtqueries")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response restQueryResponse(String qry) {
    	//prepare query string for storage
    	String json = "{\"query\":\""+ qry+"\"}";	
		try {
			  //authentication to connect to the underlying DB
			  String user = "admin";
			  String pass = "FWv!Bv%}>+ySt[9xaq8";
			  String authString = user+":"+pass;
			  byte[] authBytes = Base64.encodeBase64(authString.getBytes());
			  String authStringEnc = new String(authBytes);
			  URL url = new URL("http://192.168.99.100:8080/factory/builtqueries");			
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
			  os.write(json.getBytes());
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
		return Response.status(201).entity(qry).build(); 
    	}
    /** 
     * CREMA - Machine Usecase    
     * @param fmd
     * This function accepts FAGOR machine data - as JSON string
     * It stores the data in the dockerised DWH, through its REST interface
     * @return Response
     */
    @POST
	@Path("/fagormachinedata")
	@Consumes(MediaType.APPLICATION_JSON)
    public Response restFagorResponse(String fmd) {
		try {
			//authentication to connect to the underlying DB
			  String user = "admin";
			  String pass = "FWv!Bv%}>+ySt[9xaq8";
			  String authString = user+":"+pass;
			  byte[] authBytes = Base64.encodeBase64(authString.getBytes());
			  String authStringEnc = new String(authBytes);
			  //setup HTTP connection
			  URL url = new URL("http://192.168.99.100:8080/factory/fagormachine");
			 //URL url = new URL("http://http://176.35.40.239:8081/factory/fagormachinedata");
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
			  os.write(fmd.getBytes());
			  os.flush();	
				if (conn.getResponseCode() != HttpURLConnection.HTTP_CREATED) {
					throw new RuntimeException("Failed : HTTP error code : "
						+ conn.getResponseCode());
				}			
			  os.close();			  
			  conn.disconnect();  
		}
		catch (Exception e){
			System.out.println("EXCEPTION: "+e);
		}
    	return Response.status(201).entity(fmd).build(); 
    }
    
    /**   
     * CREMA - Automotive Usecase  
     * @param fmd
     * This function accepts Robot1 data (from Automotive usecase) - as JSON string
     * It stores the data in the dockerised DWH, through its REST interface
     * @return Response
     * @throws IOException 
     */
    @POST
	@Path("/robot1data")
	@Consumes(MediaType.APPLICATION_JSON)
    public Response restRobot1Response(String rd) throws IOException { 
    	try {			
			//authentication to connect to the underlying DB
			  String user = "admin";
			  String pass = "FWv!Bv%}>+ySt[9xaq8";
			  String authString = user+":"+pass;
			  byte[] authBytes = Base64.encodeBase64(authString.getBytes());
			  String authStringEnc = new String(authBytes);
			  //setup HTTP connection
			  URL url = new URL("http://192.168.99.100:8080/factory/robot1");
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
			  os.write(rd.getBytes());
			  os.flush();	
				if (conn.getResponseCode() != HttpURLConnection.HTTP_CREATED) {
					throw new RuntimeException("Failed : HTTP error code : "
						+ conn.getResponseCode());
				}			
			  os.close();			  
			  conn.disconnect();  
		}
		catch (Exception e){
			System.out.println("EXCEPTION: "+e);
		}
    	return Response.status(201).entity(rd).build(); 
    }
    /**
     * CREMA - Automotive Usecase
     * Send Robot1 (Automotive UC) data to external server - Endpoint: /factory/robot1
     * @param rd
     * @return
     * @throws IOException
     */
    @POST
   	@Path("/c2krobot1")
   	@Consumes(MediaType.APPLICATION_JSON)
       public Response restC2KRobot1Response(String rd) throws IOException { 
       	try {			
   			//authentication to connect to the underlying DB
   			  String user = "admin";
   			  String pass = "FWv!Bv%}>+ySt[9xaq8";
   			  String authString = user+":"+pass;
   			  byte[] authBytes = Base64.encodeBase64(authString.getBytes());
   			  String authStringEnc = new String(authBytes);
   			  //setup HTTP connection
   			  URL url = new URL("http://http://176.35.40.239:8081/factory/robot1");
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
   			  os.write(rd.getBytes());
   			  os.flush();	
   				if (conn.getResponseCode() != HttpURLConnection.HTTP_CREATED) {
   					throw new RuntimeException("Failed : HTTP error code : "+ conn.getResponseCode());
   				}			
   			  os.close();			  
   			  conn.disconnect();  
   		}
   		catch (Exception e){
   			return Response.status(503).entity(e).build();
   		}
       	return Response.status(201).entity("Data Stored").build(); 
       }
    
    /**
     * CREMA - Automotive Usecase
     * This service receives ROBOT2 data and posts it on DHW 
     */  
    @POST
   	@Path("/c2krobot2")
   	@Consumes(MediaType.APPLICATION_JSON)
       public Response restC2KRobot2Response(String rd) throws IOException { 
       	try {			
   			//authentication to connect to the underlying DB
   			  String user = "admin";
   			  String pass = "FWv!Bv%}>+ySt[9xaq8";
   			  String authString = user+":"+pass;
   			  byte[] authBytes = Base64.encodeBase64(authString.getBytes());
   			  String authStringEnc = new String(authBytes);
   			  //setup HTTP connection
   			  URL url = new URL("http://http://176.35.40.239:8081/factory/robot2");
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
   			  os.write(rd.getBytes());
   			  os.flush();	
   				if (conn.getResponseCode() != HttpURLConnection.HTTP_CREATED) {
   					throw new RuntimeException("Failed : HTTP error code : "
   						+ conn.getResponseCode());
   				}			
   			  os.close();			  
   			  conn.disconnect();  
       	}
   		catch (Exception e){
   			return Response.status(503).entity(e).build();
   		}
       	return Response.status(201).entity("Data Stored").build(); 
       }
    
    /**
     * @param incomingData
     * TBD
     * @return Response
     */
    @POST
	@Path("/process")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response restStreamResponse(InputStream incomingData) {
		StringBuilder stringBuilder = new StringBuilder();
		try {
			BufferedReader in = new BufferedReader(new InputStreamReader(incomingData));
			String line = null;
			while ((line = in.readLine()) != null) {
				stringBuilder.append(line);
			}
		} catch (Exception e) {
			System.out.println("Error Parsing process Data: - ");
		}
		System.out.println("Process Data Received: " + stringBuilder.toString());
 
		// return HTTP response 200 in case of success
		return Response.status(200).entity(stringBuilder.toString()).build();
	}
   
    /**
     * CREMA - Machine Usecase
     * This service receives a list of data parameters from multiselect dropdown list. 
     * It then invokes another service that gets all data from DWH. The data is passed 
     * to a DHS map (service) that filters the data to extract only specific parameters.
     * The filtered data is returned in a CSV format by the DHS map. The CSV data 
     * is then returned to the HTML page which invokes this service.
     * @param param
     * @return
     * @throws IOException
     */
    @GET
   	@Path("/machinecsvdatawithparam")   
   	public String restCsvDataWithParam(@QueryParam(value = "fields") String param) throws IOException {   	   	
       //String JsonData = "[{\"metadata\":{\"machine_type\":\"Hydraulic press\",\"active\":false,\"location\":\"43.0649Ã�€��‚° N, 2.4902Ã�€��‚° W\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"timestamp\":\"2016-01-06 5:38:38:000\",\"customer\":\"FAGOR test\"},\"data\":{\"pressure_clutch\":18.5425,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"mechanical_clutchingTime\":234.4328,\"displacement_time_braking\":32.8841,\"mechanical_brakingTime\":365.6518,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"displacement_time_clutching\":105.5665,\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"crankshaft_position\":884.0154,\"oil_temp_out\":33.4047,\"overshoot_angle\":8.9963,\"oil_temp_in\":46.7426,\"machine_total_strokes\":309.2366,\"pressure90\":33.0333,\"oil_flow\":29.6357,\"synchronized_time\":\"2016-03-23 8:12:15:000\"}},{\"metadata\":{\"machine_type\":\"Hydraulic press\",\"active\":false,\"location\":\"43.0649Ã�€��‚° N, 2.4902Ã�€��‚° W\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"timestamp\":\"2016-01-06 5:38:38:000\",\"customer\":\"FAGOR test\"},\"data\":{\"pressure_clutch\":18.5425,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"mechanical_clutchingTime\":234.4328,\"displacement_time_braking\":32.8841,\"mechanical_brakingTime\":365.6518,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"displacement_time_clutching\":105.5665,\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"crankshaft_position\":884.0154,\"oil_temp_out\":33.4047,\"overshoot_angle\":8.9963,\"oil_temp_in\":46.7426,\"machine_total_strokes\":309.2366,\"pressure90\":33.0333,\"oil_flow\":29.6357,\"synchronized_time\":\"2016-03-23 8:12:15:000\"}},{\"metadata\":{\"machine_type\":\"Hydraulic press\",\"active\":false,\"location\":\"43.0649Ã�€��‚° N, 2.4902Ã�€��‚° W\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"timestamp\":\"2016-01-06 5:38:38:000\",\"customer\":\"FAGOR test\"},\"data\":{\"pressure_clutch\":18.5425,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"mechanical_clutchingTime\":234.4328,\"displacement_time_braking\":32.8841,\"mechanical_brakingTime\":365.6518,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"displacement_time_clutching\":105.5665,\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"crankshaft_position\":884.0154,\"oil_temp_out\":33.4047,\"overshoot_angle\":8.9963,\"oil_temp_in\":46.7426,\"machine_total_strokes\":309.2366,\"pressure90\":33.0333,\"oil_flow\":29.6357,\"synchronized_time\":\"2016-03-23 8:12:15:000\"}},{\"metadata\":{\"machine_type\":\"Hydraulic press\",\"active\":false,\"location\":\"43.0649Ã�€��‚° N, 2.4902Ã�€��‚° W\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"timestamp\":\"2016-01-06 5:38:38:000\",\"customer\":\"FAGOR test\"},\"data\":{\"pressure_clutch\":18.5425,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"mechanical_clutchingTime\":234.4328,\"displacement_time_braking\":32.8841,\"mechanical_brakingTime\":365.6518,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"displacement_time_clutching\":105.5665,\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"crankshaft_position\":884.0154,\"oil_temp_out\":33.4047,\"overshoot_angle\":8.9963,\"oil_temp_in\":46.7426,\"machine_total_strokes\":309.2366,\"pressure90\":33.0333,\"oil_flow\":29.6357,\"synchronized_time\":\"2016-03-23 8:12:15:000\"}},{\"metadata\":{\"machine_type\":\"Hydraulic press\",\"active\":false,\"location\":\"43.0649Ã�€��‚° N, 2.4902Ã�€��‚° W\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"timestamp\":\"2016-01-06 5:38:38:000\",\"customer\":\"FAGOR test\"},\"data\":{\"pressure_clutch\":18.5425,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"mechanical_clutchingTime\":234.4328,\"displacement_time_braking\":32.8841,\"mechanical_brakingTime\":365.6518,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"displacement_time_clutching\":105.5665,\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"crankshaft_position\":884.0154,\"oil_temp_out\":33.4047,\"overshoot_angle\":8.9963,\"oil_temp_in\":46.7426,\"machine_total_strokes\":309.2366,\"pressure90\":33.0333,\"oil_flow\":29.6357,\"synchronized_time\":\"2016-03-23 8:12:15:000\"}},{\"metadata\":{\"timestamp\":\"2016-01-06 5:38:38:000\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-9545698973\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649Ã‚Â° N, 2.4902Ã‚Â° W\"},\"data\":{\"displacement_time_braking\":32.8841,\"mechanical_clutchingTime\":234.4328,\"mechanical_brakingTime\":365.6518,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"synchronized_time\":\"2016-03-23 8:12:15:000\",\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"pressure90\":33.0333,\"pressure_clutch\":18.5425,\"oil_temp_in\":46.7426,\"oil_temp_out\":33.4047,\"oil_flow\":29.6357,\"overshoot_angle\":8.9963,\"machine_total_strokes\":309.2366,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"crankshaft_position\":884.0154,\"displacement_time_clutching\":105.5665}},{\"metadata\":{\"timestamp\":\"2016-01-06 5:38:38:000\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-9545698973\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649Ã‚Â° N, 2.4902Ã‚Â° W\"},\"data\":{\"displacement_time_braking\":32.8841,\"mechanical_clutchingTime\":234.4328,\"mechanical_brakingTime\":365.6518,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"synchronized_time\":\"2016-03-23 8:12:15:000\",\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"pressure90\":33.0333,\"pressure_clutch\":18.5425,\"oil_temp_in\":46.7426,\"oil_temp_out\":33.4047,\"oil_flow\":29.6357,\"overshoot_angle\":8.9963,\"machine_total_strokes\":309.2366,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"crankshaft_position\":884.0154,\"displacement_time_clutching\":105.5665}},{\"metadata\":{\"timestamp\":\"2016-01-06 5:38:38:000\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649Ã‚Â° N, 2.4902Ã‚Â° W\"},\"data\":{\"displacement_time_braking\":32.8841,\"mechanical_clutchingTime\":234.4328,\"mechanical_brakingTime\":365.6518,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"synchronized_time\":\"2016-03-23 8:12:15:000\",\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"pressure90\":33.0333,\"pressure_clutch\":18.5425,\"oil_temp_in\":46.7426,\"oil_temp_out\":33.4047,\"oil_flow\":29.6357,\"overshoot_angle\":8.9963,\"machine_total_strokes\":309.2366,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"crankshaft_position\":884.0154,\"displacement_time_clutching\":105.5665}},{\"metadata\":{\"timestamp\":\"2016-04-26 6:15:07:000\",\"machined_id\":\"b576f433-d0bf-4809-b5b9-1a3c29a390a1\",\"active\":true,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":17.201,\"mechanical_clutchingTime\":354.6658,\"mechanical_brakingTime\":61.4296,\"clutching_pressure\":79.4047,\"braking_pressure\":46.4175,\"synchronized_time\":\"2016-01-06 10:20:10:000\",\"braking_starting_time\":\"2016-03-13 6:45:44:000\",\"pressure90\":23.7131,\"pressure_clutch\":8.3332,\"oil_temp_in\":94.0141,\"oil_temp_out\":78.1173,\"oil_flow\":17.0967,\"overshoot_angle\":13.8626,\"machine_total_strokes\":324.9034,\"die_reference\":975.1541,\"die_total_strokes\":886.5273,\"machine_speed\":658.9038,\"height_regulation\":139.959,\"crankshaft_position\":556.0995,\"displacement_time_clutching\":99.0998}},{\"metadata\":{\"timestamp\":\"2016-03-20 9:11:12:000\",\"machined_id\":\"d8270f70-c8c6-4976-8b6b-ba33de7a4e9b\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":140.5786,\"mechanical_clutchingTime\":480.2788,\"mechanical_brakingTime\":9.8697,\"clutching_pressure\":79.5314,\"braking_pressure\":58.2605,\"synchronized_time\":\"2016-05-05 4:58:28:000\",\"braking_starting_time\":\"2016-02-26 2:42:45:000\",\"pressure90\":44.9351,\"pressure_clutch\":92.9785,\"oil_temp_in\":127.1295,\"oil_temp_out\":67.8993,\"oil_flow\":8.0589,\"overshoot_angle\":5.2979,\"machine_total_strokes\":694.3427,\"die_reference\":699.0524,\"die_total_strokes\":950.7532,\"machine_speed\":151.5129,\"height_regulation\":707.1301,\"crankshaft_position\":297.216,\"displacement_time_clutching\":25.6339}},{\"metadata\":{\"timestamp\":\"2016-03-21 11:06:17:000\",\"machined_id\":\"fb05a7f5-c3ab-4c56-a76f-5ce94747ecdd\",\"active\":true,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":116.528,\"mechanical_clutchingTime\":284.5677,\"mechanical_brakingTime\":339.2657,\"clutching_pressure\":22.8921,\"braking_pressure\":7.3097,\"synchronized_time\":\"2016-03-20 2:00:40:000\",\"braking_starting_time\":\"2016-03-03 8:37:59:000\",\"pressure90\":80.0256,\"pressure_clutch\":5.4607,\"oil_temp_in\":111.1341,\"oil_temp_out\":15.8034,\"oil_flow\":20.9505,\"overshoot_angle\":5.4017,\"machine_total_strokes\":340.2802,\"die_reference\":872.3174,\"die_total_strokes\":896.8749,\"machine_speed\":672.8013,\"height_regulation\":151.3786,\"crankshaft_position\":120.2196,\"displacement_time_clutching\":123.3033}},{\"metadata\":{\"timestamp\":\"2016-05-01 3:47:26:000\",\"machined_id\":\"0f7eae7a-bd49-491c-9425-1177f625409a\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":5.7155,\"mechanical_clutchingTime\":28.5274,\"mechanical_brakingTime\":326.5642,\"clutching_pressure\":38.1248,\"braking_pressure\":56.5709,\"synchronized_time\":\"2016-01-29 12:23:20:000\",\"braking_starting_time\":\"2016-01-18 8:11:09:000\",\"pressure90\":13.4258,\"pressure_clutch\":13.1641,\"oil_temp_in\":58.6054,\"oil_temp_out\":79.1179,\"oil_flow\":0.9031,\"overshoot_angle\":1.3502,\"machine_total_strokes\":786.1123,\"die_reference\":472.3231,\"die_total_strokes\":932.7124,\"machine_speed\":518.4946,\"height_regulation\":694.5719,\"crankshaft_position\":927.5106,\"displacement_time_clutching\":100.3067}},{\"metadata\":{\"timestamp\":\"2016-03-31 9:53:28:000\",\"machined_id\":\"0ff12519-337e-475e-aae8-764b83f0abff\",\"active\":true,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":25.1523,\"mechanical_clutchingTime\":598.0154,\"mechanical_brakingTime\":318.1685,\"clutching_pressure\":96.4427,\"braking_pressure\":93.062,\"synchronized_time\":\"2016-02-27 4:50:02:000\",\"braking_starting_time\":\"2016-05-02 2:42:48:000\",\"pressure90\":40.6673,\"pressure_clutch\":20.4064,\"oil_temp_in\":107.2217,\"oil_temp_out\":5.6903,\"oil_flow\":53.8065,\"overshoot_angle\":11.5325,\"machine_total_strokes\":68.6748,\"die_reference\":921.7098,\"die_total_strokes\":373.9564,\"machine_speed\":393.1439,\"height_regulation\":0.8307,\"crankshaft_position\":166.1139,\"displacement_time_clutching\":55.3388}},{\"metadata\":{\"timestamp\":\"2016-02-10 1:38:26:000\",\"machined_id\":\"13e3b4f1-c853-4d8c-83f8-13a9b24f951a\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":164.333,\"mechanical_clutchingTime\":133.4461,\"mechanical_brakingTime\":52.0495,\"clutching_pressure\":17.5617,\"braking_pressure\":0.7914,\"synchronized_time\":\"2016-03-01 2:13:22:000\",\"braking_starting_time\":\"2016-04-29 9:32:55:000\",\"pressure90\":55.0245,\"pressure_clutch\":65.1695,\"oil_temp_in\":57.3731,\"oil_temp_out\":78.5193,\"oil_flow\":48.457,\"overshoot_angle\":7.1768,\"machine_total_strokes\":747.0743,\"die_reference\":349.2149,\"die_total_strokes\":370.9946,\"machine_speed\":141.7083,\"height_regulation\":261.7422,\"crankshaft_position\":705.0579,\"displacement_time_clutching\":81.5826}},{\"metadata\":{\"timestamp\":\"2016-01-06 5:38:38:000\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":32.8841,\"mechanical_clutchingTime\":234.4328,\"mechanical_brakingTime\":365.6518,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"synchronized_time\":\"2016-03-23 8:12:15:000\",\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"pressure90\":33.0333,\"pressure_clutch\":18.5425,\"oil_temp_in\":46.7426,\"oil_temp_out\":33.4047,\"oil_flow\":29.6357,\"overshoot_angle\":8.9963,\"machine_total_strokes\":309.2366,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"crankshaft_position\":884.0154,\"displacement_time_clutching\":105.5665}}]";
       
    	//Get all machine data as Json String
    	String JsonData = GetMachineData.restGetMachineData();       
        //Send the Json String to DHS map
       URL url; //the url of the map is currently set for local docker container, it should be changed to the docker container running on the server
    //   if(param==null)
    //   url = new URL("http:// " + DHS_REST_URI + "/dhs/convert4bda?token=1");
    //   else
    //   url = new URL("http:// " + DHS_REST_URI + "/dhs/convert4bda?token=1&fields="+param);
         url = new URL("http:// " + DHS_REST_URI + "/dhs/convert4bda?token=mytoken5&fields="+param+"&format=csv&timeformat=timestamp");      
       //Setup HTTP connection	  
	   HttpURLConnection conn = (HttpURLConnection) url.openConnection();
	   conn.setRequestMethod("POST");	   
	   conn.setDoOutput(true);			  
	   //conn.setRequestProperty("Authorization", "Basic " + authStringEnc);
	   conn.setRequestProperty("Content-Type", "application/json");	   
	   conn.connect();
	   //send Json String to REST service of DHS Map, running on a docker container
       OutputStream os = conn.getOutputStream();
	   os.write(JsonData.toString().getBytes());
	   os.flush();
	   
	   StringBuffer responseString = new StringBuffer();
	   if (conn.getResponseCode() == HttpURLConnection.HTTP_OK) 
	   {
		//get response from DHS Map	   	   
		   BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
		   String dhsResponse;		   
		   while ((dhsResponse = in.readLine()) != null) {
			responseString.append(dhsResponse+"\n");			
		   }		   		   
		   in.close();	  
	   }
	   else
			throw new RuntimeException("Failed : HTTP error code: "+ conn.getResponseCode());
	   if(conn != null)
		   conn.disconnect();
	 //return response from DHS map, which is a CSV document with filtered parameters 
	 return responseString.toString().substring(0, responseString.length()-1);
	 //Test it on: http://localhost:8080/BdaREST/rest/postdata/csvdatawithparam?fields=pressure90
   	}
    
    
    /**
     * CREMA - Machine Usecase
     * This service receives a single data parameter from multiselect dropdown list. 
     * It then invokes another function that gets required data from DWH through REST call.
     * @param param
     * @return csv array with timestamp in millis
     * @throws IOException
     * @throws ParseException 
     */  
    @GET
   	@Path("/automotivecsvdatawithparam")   
   	public String restAutomotiveCsvDataWithParam(@QueryParam(value = "fields") String param) throws IOException {   	   	
       //String JsonData = "[{\"metadata\":{\"machine_type\":\"Hydraulic press\",\"active\":false,\"location\":\"43.0649Ã�€��‚° N, 2.4902Ã�€��‚° W\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"timestamp\":\"2016-01-06 5:38:38:000\",\"customer\":\"FAGOR test\"},\"data\":{\"pressure_clutch\":18.5425,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"mechanical_clutchingTime\":234.4328,\"displacement_time_braking\":32.8841,\"mechanical_brakingTime\":365.6518,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"displacement_time_clutching\":105.5665,\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"crankshaft_position\":884.0154,\"oil_temp_out\":33.4047,\"overshoot_angle\":8.9963,\"oil_temp_in\":46.7426,\"machine_total_strokes\":309.2366,\"pressure90\":33.0333,\"oil_flow\":29.6357,\"synchronized_time\":\"2016-03-23 8:12:15:000\"}},{\"metadata\":{\"machine_type\":\"Hydraulic press\",\"active\":false,\"location\":\"43.0649Ã�€��‚° N, 2.4902Ã�€��‚° W\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"timestamp\":\"2016-01-06 5:38:38:000\",\"customer\":\"FAGOR test\"},\"data\":{\"pressure_clutch\":18.5425,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"mechanical_clutchingTime\":234.4328,\"displacement_time_braking\":32.8841,\"mechanical_brakingTime\":365.6518,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"displacement_time_clutching\":105.5665,\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"crankshaft_position\":884.0154,\"oil_temp_out\":33.4047,\"overshoot_angle\":8.9963,\"oil_temp_in\":46.7426,\"machine_total_strokes\":309.2366,\"pressure90\":33.0333,\"oil_flow\":29.6357,\"synchronized_time\":\"2016-03-23 8:12:15:000\"}},{\"metadata\":{\"machine_type\":\"Hydraulic press\",\"active\":false,\"location\":\"43.0649Ã�€��‚° N, 2.4902Ã�€��‚° W\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"timestamp\":\"2016-01-06 5:38:38:000\",\"customer\":\"FAGOR test\"},\"data\":{\"pressure_clutch\":18.5425,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"mechanical_clutchingTime\":234.4328,\"displacement_time_braking\":32.8841,\"mechanical_brakingTime\":365.6518,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"displacement_time_clutching\":105.5665,\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"crankshaft_position\":884.0154,\"oil_temp_out\":33.4047,\"overshoot_angle\":8.9963,\"oil_temp_in\":46.7426,\"machine_total_strokes\":309.2366,\"pressure90\":33.0333,\"oil_flow\":29.6357,\"synchronized_time\":\"2016-03-23 8:12:15:000\"}},{\"metadata\":{\"machine_type\":\"Hydraulic press\",\"active\":false,\"location\":\"43.0649Ã�€��‚° N, 2.4902Ã�€��‚° W\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"timestamp\":\"2016-01-06 5:38:38:000\",\"customer\":\"FAGOR test\"},\"data\":{\"pressure_clutch\":18.5425,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"mechanical_clutchingTime\":234.4328,\"displacement_time_braking\":32.8841,\"mechanical_brakingTime\":365.6518,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"displacement_time_clutching\":105.5665,\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"crankshaft_position\":884.0154,\"oil_temp_out\":33.4047,\"overshoot_angle\":8.9963,\"oil_temp_in\":46.7426,\"machine_total_strokes\":309.2366,\"pressure90\":33.0333,\"oil_flow\":29.6357,\"synchronized_time\":\"2016-03-23 8:12:15:000\"}},{\"metadata\":{\"machine_type\":\"Hydraulic press\",\"active\":false,\"location\":\"43.0649Ã�€��‚° N, 2.4902Ã�€��‚° W\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"timestamp\":\"2016-01-06 5:38:38:000\",\"customer\":\"FAGOR test\"},\"data\":{\"pressure_clutch\":18.5425,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"mechanical_clutchingTime\":234.4328,\"displacement_time_braking\":32.8841,\"mechanical_brakingTime\":365.6518,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"displacement_time_clutching\":105.5665,\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"crankshaft_position\":884.0154,\"oil_temp_out\":33.4047,\"overshoot_angle\":8.9963,\"oil_temp_in\":46.7426,\"machine_total_strokes\":309.2366,\"pressure90\":33.0333,\"oil_flow\":29.6357,\"synchronized_time\":\"2016-03-23 8:12:15:000\"}},{\"metadata\":{\"timestamp\":\"2016-01-06 5:38:38:000\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-9545698973\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649Ã‚Â° N, 2.4902Ã‚Â° W\"},\"data\":{\"displacement_time_braking\":32.8841,\"mechanical_clutchingTime\":234.4328,\"mechanical_brakingTime\":365.6518,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"synchronized_time\":\"2016-03-23 8:12:15:000\",\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"pressure90\":33.0333,\"pressure_clutch\":18.5425,\"oil_temp_in\":46.7426,\"oil_temp_out\":33.4047,\"oil_flow\":29.6357,\"overshoot_angle\":8.9963,\"machine_total_strokes\":309.2366,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"crankshaft_position\":884.0154,\"displacement_time_clutching\":105.5665}},{\"metadata\":{\"timestamp\":\"2016-01-06 5:38:38:000\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-9545698973\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649Ã‚Â° N, 2.4902Ã‚Â° W\"},\"data\":{\"displacement_time_braking\":32.8841,\"mechanical_clutchingTime\":234.4328,\"mechanical_brakingTime\":365.6518,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"synchronized_time\":\"2016-03-23 8:12:15:000\",\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"pressure90\":33.0333,\"pressure_clutch\":18.5425,\"oil_temp_in\":46.7426,\"oil_temp_out\":33.4047,\"oil_flow\":29.6357,\"overshoot_angle\":8.9963,\"machine_total_strokes\":309.2366,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"crankshaft_position\":884.0154,\"displacement_time_clutching\":105.5665}},{\"metadata\":{\"timestamp\":\"2016-01-06 5:38:38:000\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649Ã‚Â° N, 2.4902Ã‚Â° W\"},\"data\":{\"displacement_time_braking\":32.8841,\"mechanical_clutchingTime\":234.4328,\"mechanical_brakingTime\":365.6518,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"synchronized_time\":\"2016-03-23 8:12:15:000\",\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"pressure90\":33.0333,\"pressure_clutch\":18.5425,\"oil_temp_in\":46.7426,\"oil_temp_out\":33.4047,\"oil_flow\":29.6357,\"overshoot_angle\":8.9963,\"machine_total_strokes\":309.2366,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"crankshaft_position\":884.0154,\"displacement_time_clutching\":105.5665}},{\"metadata\":{\"timestamp\":\"2016-04-26 6:15:07:000\",\"machined_id\":\"b576f433-d0bf-4809-b5b9-1a3c29a390a1\",\"active\":true,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":17.201,\"mechanical_clutchingTime\":354.6658,\"mechanical_brakingTime\":61.4296,\"clutching_pressure\":79.4047,\"braking_pressure\":46.4175,\"synchronized_time\":\"2016-01-06 10:20:10:000\",\"braking_starting_time\":\"2016-03-13 6:45:44:000\",\"pressure90\":23.7131,\"pressure_clutch\":8.3332,\"oil_temp_in\":94.0141,\"oil_temp_out\":78.1173,\"oil_flow\":17.0967,\"overshoot_angle\":13.8626,\"machine_total_strokes\":324.9034,\"die_reference\":975.1541,\"die_total_strokes\":886.5273,\"machine_speed\":658.9038,\"height_regulation\":139.959,\"crankshaft_position\":556.0995,\"displacement_time_clutching\":99.0998}},{\"metadata\":{\"timestamp\":\"2016-03-20 9:11:12:000\",\"machined_id\":\"d8270f70-c8c6-4976-8b6b-ba33de7a4e9b\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":140.5786,\"mechanical_clutchingTime\":480.2788,\"mechanical_brakingTime\":9.8697,\"clutching_pressure\":79.5314,\"braking_pressure\":58.2605,\"synchronized_time\":\"2016-05-05 4:58:28:000\",\"braking_starting_time\":\"2016-02-26 2:42:45:000\",\"pressure90\":44.9351,\"pressure_clutch\":92.9785,\"oil_temp_in\":127.1295,\"oil_temp_out\":67.8993,\"oil_flow\":8.0589,\"overshoot_angle\":5.2979,\"machine_total_strokes\":694.3427,\"die_reference\":699.0524,\"die_total_strokes\":950.7532,\"machine_speed\":151.5129,\"height_regulation\":707.1301,\"crankshaft_position\":297.216,\"displacement_time_clutching\":25.6339}},{\"metadata\":{\"timestamp\":\"2016-03-21 11:06:17:000\",\"machined_id\":\"fb05a7f5-c3ab-4c56-a76f-5ce94747ecdd\",\"active\":true,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":116.528,\"mechanical_clutchingTime\":284.5677,\"mechanical_brakingTime\":339.2657,\"clutching_pressure\":22.8921,\"braking_pressure\":7.3097,\"synchronized_time\":\"2016-03-20 2:00:40:000\",\"braking_starting_time\":\"2016-03-03 8:37:59:000\",\"pressure90\":80.0256,\"pressure_clutch\":5.4607,\"oil_temp_in\":111.1341,\"oil_temp_out\":15.8034,\"oil_flow\":20.9505,\"overshoot_angle\":5.4017,\"machine_total_strokes\":340.2802,\"die_reference\":872.3174,\"die_total_strokes\":896.8749,\"machine_speed\":672.8013,\"height_regulation\":151.3786,\"crankshaft_position\":120.2196,\"displacement_time_clutching\":123.3033}},{\"metadata\":{\"timestamp\":\"2016-05-01 3:47:26:000\",\"machined_id\":\"0f7eae7a-bd49-491c-9425-1177f625409a\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":5.7155,\"mechanical_clutchingTime\":28.5274,\"mechanical_brakingTime\":326.5642,\"clutching_pressure\":38.1248,\"braking_pressure\":56.5709,\"synchronized_time\":\"2016-01-29 12:23:20:000\",\"braking_starting_time\":\"2016-01-18 8:11:09:000\",\"pressure90\":13.4258,\"pressure_clutch\":13.1641,\"oil_temp_in\":58.6054,\"oil_temp_out\":79.1179,\"oil_flow\":0.9031,\"overshoot_angle\":1.3502,\"machine_total_strokes\":786.1123,\"die_reference\":472.3231,\"die_total_strokes\":932.7124,\"machine_speed\":518.4946,\"height_regulation\":694.5719,\"crankshaft_position\":927.5106,\"displacement_time_clutching\":100.3067}},{\"metadata\":{\"timestamp\":\"2016-03-31 9:53:28:000\",\"machined_id\":\"0ff12519-337e-475e-aae8-764b83f0abff\",\"active\":true,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":25.1523,\"mechanical_clutchingTime\":598.0154,\"mechanical_brakingTime\":318.1685,\"clutching_pressure\":96.4427,\"braking_pressure\":93.062,\"synchronized_time\":\"2016-02-27 4:50:02:000\",\"braking_starting_time\":\"2016-05-02 2:42:48:000\",\"pressure90\":40.6673,\"pressure_clutch\":20.4064,\"oil_temp_in\":107.2217,\"oil_temp_out\":5.6903,\"oil_flow\":53.8065,\"overshoot_angle\":11.5325,\"machine_total_strokes\":68.6748,\"die_reference\":921.7098,\"die_total_strokes\":373.9564,\"machine_speed\":393.1439,\"height_regulation\":0.8307,\"crankshaft_position\":166.1139,\"displacement_time_clutching\":55.3388}},{\"metadata\":{\"timestamp\":\"2016-02-10 1:38:26:000\",\"machined_id\":\"13e3b4f1-c853-4d8c-83f8-13a9b24f951a\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":164.333,\"mechanical_clutchingTime\":133.4461,\"mechanical_brakingTime\":52.0495,\"clutching_pressure\":17.5617,\"braking_pressure\":0.7914,\"synchronized_time\":\"2016-03-01 2:13:22:000\",\"braking_starting_time\":\"2016-04-29 9:32:55:000\",\"pressure90\":55.0245,\"pressure_clutch\":65.1695,\"oil_temp_in\":57.3731,\"oil_temp_out\":78.5193,\"oil_flow\":48.457,\"overshoot_angle\":7.1768,\"machine_total_strokes\":747.0743,\"die_reference\":349.2149,\"die_total_strokes\":370.9946,\"machine_speed\":141.7083,\"height_regulation\":261.7422,\"crankshaft_position\":705.0579,\"displacement_time_clutching\":81.5826}},{\"metadata\":{\"timestamp\":\"2016-01-06 5:38:38:000\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":32.8841,\"mechanical_clutchingTime\":234.4328,\"mechanical_brakingTime\":365.6518,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"synchronized_time\":\"2016-03-23 8:12:15:000\",\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"pressure90\":33.0333,\"pressure_clutch\":18.5425,\"oil_temp_in\":46.7426,\"oil_temp_out\":33.4047,\"oil_flow\":29.6357,\"overshoot_angle\":8.9963,\"machine_total_strokes\":309.2366,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"crankshaft_position\":884.0154,\"displacement_time_clutching\":105.5665}}]";
       
    	//Get all machine data as Json String
    	String JsonData = GetMachineData.restGetRobot1Data();       
        //Send the Json String to DHS map
       URL url; //the url of the map is currently set for local docker container, it should be changed to the docker container running on the server
    //   if(param==null)
    //   url = new URL("http:// " + DHS_REST_URI + "/dhs/convert4bda?token=1");
    //   else
    //   url = new URL("http:// " + DHS_REST_URI + "/dhs/convert4bda?token=1&fields="+param);
         url = new URL("http:// " + DHS_REST_URI + "/dhs/convert4bda?token=mytoken5&fields="+param+"&format=csv&timeformat=timestamp");      
       //Setup HTTP connection	  
	   HttpURLConnection conn = (HttpURLConnection) url.openConnection();
	   conn.setRequestMethod("POST");	   
	   conn.setDoOutput(true);			  
	   //conn.setRequestProperty("Authorization", "Basic " + authStringEnc);
	   conn.setRequestProperty("Content-Type", "application/json");	   
	   conn.connect();
	   //send Json String to REST service of DHS Map, running on a docker container
       OutputStream os = conn.getOutputStream();
	   os.write(JsonData.toString().getBytes());
	   os.flush();
	   
	   StringBuffer responseString = new StringBuffer();
	   if (conn.getResponseCode() == HttpURLConnection.HTTP_OK) 
	   {
		//get response from DHS Map	   	   
		   BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
		   String dhsResponse;		   
		   while ((dhsResponse = in.readLine()) != null) {
			responseString.append(dhsResponse+"\n");			
		   }		   		   
		   in.close();	  
	   }
	   else
			throw new RuntimeException("Failed : HTTP error code: "+ conn.getResponseCode());
	   if(conn != null)
		   conn.disconnect();
	 //return response from DHS map, which is a CSV document with filtered parameters 
	 return responseString.toString().substring(0, responseString.length()-1);
	 //Test it on: http://localhost:8080/BdaREST/rest/postdata/csvdatawithparam?fields=pressure90
   	}
    /**
     * CREMA - Machine Usecase
     * This service receives a single data parameter from multiselect dropdown list. 
     * It then invokes another service that gets all data from DWH. The data is passed 
     * to a DHS map (service) that filters the data to extract only specific parameters.
     * The filtered data is returned in a CSV format + within Brackets by the DHS map. 
     * The CSV data is then returned to the HTML page which invokes this service.
     * @param param
     * @return csv array with actual timestamp
     * @throws IOException
     */    
    @GET
   	@Path("/machinecsvdatawithbrackets")   
   	public String restCsvDataWithBrackets(@QueryParam(value = "fields") String param) throws IOException {   	   	
       //String JsonData = "[{\"metadata\":{\"machine_type\":\"Hydraulic press\",\"active\":false,\"location\":\"43.0649Ã�€��‚° N, 2.4902Ã�€��‚° W\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"timestamp\":\"2016-01-06 5:38:38:000\",\"customer\":\"FAGOR test\"},\"data\":{\"pressure_clutch\":18.5425,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"mechanical_clutchingTime\":234.4328,\"displacement_time_braking\":32.8841,\"mechanical_brakingTime\":365.6518,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"displacement_time_clutching\":105.5665,\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"crankshaft_position\":884.0154,\"oil_temp_out\":33.4047,\"overshoot_angle\":8.9963,\"oil_temp_in\":46.7426,\"machine_total_strokes\":309.2366,\"pressure90\":33.0333,\"oil_flow\":29.6357,\"synchronized_time\":\"2016-03-23 8:12:15:000\"}},{\"metadata\":{\"machine_type\":\"Hydraulic press\",\"active\":false,\"location\":\"43.0649Ã�€��‚° N, 2.4902Ã�€��‚° W\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"timestamp\":\"2016-01-06 5:38:38:000\",\"customer\":\"FAGOR test\"},\"data\":{\"pressure_clutch\":18.5425,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"mechanical_clutchingTime\":234.4328,\"displacement_time_braking\":32.8841,\"mechanical_brakingTime\":365.6518,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"displacement_time_clutching\":105.5665,\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"crankshaft_position\":884.0154,\"oil_temp_out\":33.4047,\"overshoot_angle\":8.9963,\"oil_temp_in\":46.7426,\"machine_total_strokes\":309.2366,\"pressure90\":33.0333,\"oil_flow\":29.6357,\"synchronized_time\":\"2016-03-23 8:12:15:000\"}},{\"metadata\":{\"machine_type\":\"Hydraulic press\",\"active\":false,\"location\":\"43.0649Ã�€��‚° N, 2.4902Ã�€��‚° W\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"timestamp\":\"2016-01-06 5:38:38:000\",\"customer\":\"FAGOR test\"},\"data\":{\"pressure_clutch\":18.5425,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"mechanical_clutchingTime\":234.4328,\"displacement_time_braking\":32.8841,\"mechanical_brakingTime\":365.6518,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"displacement_time_clutching\":105.5665,\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"crankshaft_position\":884.0154,\"oil_temp_out\":33.4047,\"overshoot_angle\":8.9963,\"oil_temp_in\":46.7426,\"machine_total_strokes\":309.2366,\"pressure90\":33.0333,\"oil_flow\":29.6357,\"synchronized_time\":\"2016-03-23 8:12:15:000\"}},{\"metadata\":{\"machine_type\":\"Hydraulic press\",\"active\":false,\"location\":\"43.0649Ã�€��‚° N, 2.4902Ã�€��‚° W\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"timestamp\":\"2016-01-06 5:38:38:000\",\"customer\":\"FAGOR test\"},\"data\":{\"pressure_clutch\":18.5425,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"mechanical_clutchingTime\":234.4328,\"displacement_time_braking\":32.8841,\"mechanical_brakingTime\":365.6518,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"displacement_time_clutching\":105.5665,\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"crankshaft_position\":884.0154,\"oil_temp_out\":33.4047,\"overshoot_angle\":8.9963,\"oil_temp_in\":46.7426,\"machine_total_strokes\":309.2366,\"pressure90\":33.0333,\"oil_flow\":29.6357,\"synchronized_time\":\"2016-03-23 8:12:15:000\"}},{\"metadata\":{\"machine_type\":\"Hydraulic press\",\"active\":false,\"location\":\"43.0649Ã�€��‚° N, 2.4902Ã�€��‚° W\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"timestamp\":\"2016-01-06 5:38:38:000\",\"customer\":\"FAGOR test\"},\"data\":{\"pressure_clutch\":18.5425,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"mechanical_clutchingTime\":234.4328,\"displacement_time_braking\":32.8841,\"mechanical_brakingTime\":365.6518,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"displacement_time_clutching\":105.5665,\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"crankshaft_position\":884.0154,\"oil_temp_out\":33.4047,\"overshoot_angle\":8.9963,\"oil_temp_in\":46.7426,\"machine_total_strokes\":309.2366,\"pressure90\":33.0333,\"oil_flow\":29.6357,\"synchronized_time\":\"2016-03-23 8:12:15:000\"}},{\"metadata\":{\"timestamp\":\"2016-01-06 5:38:38:000\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-9545698973\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649Ã‚Â° N, 2.4902Ã‚Â° W\"},\"data\":{\"displacement_time_braking\":32.8841,\"mechanical_clutchingTime\":234.4328,\"mechanical_brakingTime\":365.6518,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"synchronized_time\":\"2016-03-23 8:12:15:000\",\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"pressure90\":33.0333,\"pressure_clutch\":18.5425,\"oil_temp_in\":46.7426,\"oil_temp_out\":33.4047,\"oil_flow\":29.6357,\"overshoot_angle\":8.9963,\"machine_total_strokes\":309.2366,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"crankshaft_position\":884.0154,\"displacement_time_clutching\":105.5665}},{\"metadata\":{\"timestamp\":\"2016-01-06 5:38:38:000\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-9545698973\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649Ã‚Â° N, 2.4902Ã‚Â° W\"},\"data\":{\"displacement_time_braking\":32.8841,\"mechanical_clutchingTime\":234.4328,\"mechanical_brakingTime\":365.6518,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"synchronized_time\":\"2016-03-23 8:12:15:000\",\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"pressure90\":33.0333,\"pressure_clutch\":18.5425,\"oil_temp_in\":46.7426,\"oil_temp_out\":33.4047,\"oil_flow\":29.6357,\"overshoot_angle\":8.9963,\"machine_total_strokes\":309.2366,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"crankshaft_position\":884.0154,\"displacement_time_clutching\":105.5665}},{\"metadata\":{\"timestamp\":\"2016-01-06 5:38:38:000\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649Ã‚Â° N, 2.4902Ã‚Â° W\"},\"data\":{\"displacement_time_braking\":32.8841,\"mechanical_clutchingTime\":234.4328,\"mechanical_brakingTime\":365.6518,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"synchronized_time\":\"2016-03-23 8:12:15:000\",\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"pressure90\":33.0333,\"pressure_clutch\":18.5425,\"oil_temp_in\":46.7426,\"oil_temp_out\":33.4047,\"oil_flow\":29.6357,\"overshoot_angle\":8.9963,\"machine_total_strokes\":309.2366,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"crankshaft_position\":884.0154,\"displacement_time_clutching\":105.5665}},{\"metadata\":{\"timestamp\":\"2016-04-26 6:15:07:000\",\"machined_id\":\"b576f433-d0bf-4809-b5b9-1a3c29a390a1\",\"active\":true,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":17.201,\"mechanical_clutchingTime\":354.6658,\"mechanical_brakingTime\":61.4296,\"clutching_pressure\":79.4047,\"braking_pressure\":46.4175,\"synchronized_time\":\"2016-01-06 10:20:10:000\",\"braking_starting_time\":\"2016-03-13 6:45:44:000\",\"pressure90\":23.7131,\"pressure_clutch\":8.3332,\"oil_temp_in\":94.0141,\"oil_temp_out\":78.1173,\"oil_flow\":17.0967,\"overshoot_angle\":13.8626,\"machine_total_strokes\":324.9034,\"die_reference\":975.1541,\"die_total_strokes\":886.5273,\"machine_speed\":658.9038,\"height_regulation\":139.959,\"crankshaft_position\":556.0995,\"displacement_time_clutching\":99.0998}},{\"metadata\":{\"timestamp\":\"2016-03-20 9:11:12:000\",\"machined_id\":\"d8270f70-c8c6-4976-8b6b-ba33de7a4e9b\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":140.5786,\"mechanical_clutchingTime\":480.2788,\"mechanical_brakingTime\":9.8697,\"clutching_pressure\":79.5314,\"braking_pressure\":58.2605,\"synchronized_time\":\"2016-05-05 4:58:28:000\",\"braking_starting_time\":\"2016-02-26 2:42:45:000\",\"pressure90\":44.9351,\"pressure_clutch\":92.9785,\"oil_temp_in\":127.1295,\"oil_temp_out\":67.8993,\"oil_flow\":8.0589,\"overshoot_angle\":5.2979,\"machine_total_strokes\":694.3427,\"die_reference\":699.0524,\"die_total_strokes\":950.7532,\"machine_speed\":151.5129,\"height_regulation\":707.1301,\"crankshaft_position\":297.216,\"displacement_time_clutching\":25.6339}},{\"metadata\":{\"timestamp\":\"2016-03-21 11:06:17:000\",\"machined_id\":\"fb05a7f5-c3ab-4c56-a76f-5ce94747ecdd\",\"active\":true,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":116.528,\"mechanical_clutchingTime\":284.5677,\"mechanical_brakingTime\":339.2657,\"clutching_pressure\":22.8921,\"braking_pressure\":7.3097,\"synchronized_time\":\"2016-03-20 2:00:40:000\",\"braking_starting_time\":\"2016-03-03 8:37:59:000\",\"pressure90\":80.0256,\"pressure_clutch\":5.4607,\"oil_temp_in\":111.1341,\"oil_temp_out\":15.8034,\"oil_flow\":20.9505,\"overshoot_angle\":5.4017,\"machine_total_strokes\":340.2802,\"die_reference\":872.3174,\"die_total_strokes\":896.8749,\"machine_speed\":672.8013,\"height_regulation\":151.3786,\"crankshaft_position\":120.2196,\"displacement_time_clutching\":123.3033}},{\"metadata\":{\"timestamp\":\"2016-05-01 3:47:26:000\",\"machined_id\":\"0f7eae7a-bd49-491c-9425-1177f625409a\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":5.7155,\"mechanical_clutchingTime\":28.5274,\"mechanical_brakingTime\":326.5642,\"clutching_pressure\":38.1248,\"braking_pressure\":56.5709,\"synchronized_time\":\"2016-01-29 12:23:20:000\",\"braking_starting_time\":\"2016-01-18 8:11:09:000\",\"pressure90\":13.4258,\"pressure_clutch\":13.1641,\"oil_temp_in\":58.6054,\"oil_temp_out\":79.1179,\"oil_flow\":0.9031,\"overshoot_angle\":1.3502,\"machine_total_strokes\":786.1123,\"die_reference\":472.3231,\"die_total_strokes\":932.7124,\"machine_speed\":518.4946,\"height_regulation\":694.5719,\"crankshaft_position\":927.5106,\"displacement_time_clutching\":100.3067}},{\"metadata\":{\"timestamp\":\"2016-03-31 9:53:28:000\",\"machined_id\":\"0ff12519-337e-475e-aae8-764b83f0abff\",\"active\":true,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":25.1523,\"mechanical_clutchingTime\":598.0154,\"mechanical_brakingTime\":318.1685,\"clutching_pressure\":96.4427,\"braking_pressure\":93.062,\"synchronized_time\":\"2016-02-27 4:50:02:000\",\"braking_starting_time\":\"2016-05-02 2:42:48:000\",\"pressure90\":40.6673,\"pressure_clutch\":20.4064,\"oil_temp_in\":107.2217,\"oil_temp_out\":5.6903,\"oil_flow\":53.8065,\"overshoot_angle\":11.5325,\"machine_total_strokes\":68.6748,\"die_reference\":921.7098,\"die_total_strokes\":373.9564,\"machine_speed\":393.1439,\"height_regulation\":0.8307,\"crankshaft_position\":166.1139,\"displacement_time_clutching\":55.3388}},{\"metadata\":{\"timestamp\":\"2016-02-10 1:38:26:000\",\"machined_id\":\"13e3b4f1-c853-4d8c-83f8-13a9b24f951a\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":164.333,\"mechanical_clutchingTime\":133.4461,\"mechanical_brakingTime\":52.0495,\"clutching_pressure\":17.5617,\"braking_pressure\":0.7914,\"synchronized_time\":\"2016-03-01 2:13:22:000\",\"braking_starting_time\":\"2016-04-29 9:32:55:000\",\"pressure90\":55.0245,\"pressure_clutch\":65.1695,\"oil_temp_in\":57.3731,\"oil_temp_out\":78.5193,\"oil_flow\":48.457,\"overshoot_angle\":7.1768,\"machine_total_strokes\":747.0743,\"die_reference\":349.2149,\"die_total_strokes\":370.9946,\"machine_speed\":141.7083,\"height_regulation\":261.7422,\"crankshaft_position\":705.0579,\"displacement_time_clutching\":81.5826}},{\"metadata\":{\"timestamp\":\"2016-01-06 5:38:38:000\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":32.8841,\"mechanical_clutchingTime\":234.4328,\"mechanical_brakingTime\":365.6518,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"synchronized_time\":\"2016-03-23 8:12:15:000\",\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"pressure90\":33.0333,\"pressure_clutch\":18.5425,\"oil_temp_in\":46.7426,\"oil_temp_out\":33.4047,\"oil_flow\":29.6357,\"overshoot_angle\":8.9963,\"machine_total_strokes\":309.2366,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"crankshaft_position\":884.0154,\"displacement_time_clutching\":105.5665}}]";
       
    	//Get all machine data as Json String
    	String JsonData = GetMachineData.restGetMachineData();       
        //Send the Json String to DHS map
       URL url; //the url of the map is currently set for local docker container, it should be changed to the docker container running on the server
       
       //url = new URL("http:// " + DHS_REST_URI + "/dhs/convert4bda?token=mytoken5&fields="+param+"&format=array");
       url = new URL("http:// " + DHS_REST_URI + "/dhs/convert4bda?token=mytoken5&fields="+param+"&format=csv&timeformat=timestamp");//+"&format=array&timeformat=millis");
	   //Setup HTTP connection	  
	   HttpURLConnection conn = (HttpURLConnection) url.openConnection();
	   conn.setRequestMethod("POST");	   
	   conn.setDoOutput(true);			  
	   //conn.setRequestProperty("Authorization", "Basic " + authStringEnc);
	   conn.setRequestProperty("Content-Type", "application/json");	   
	   conn.connect();
	   //send Json String to REST service of DHS Map, running on a docker container
       OutputStream os = conn.getOutputStream();
	   os.write(JsonData.toString().getBytes());
	   os.flush();
	   
	   StringBuffer responseString = new StringBuffer();
	   if (conn.getResponseCode() == HttpURLConnection.HTTP_OK) 
	   {
		//get response from DHS Map	   	   
		   BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
		   String dhsResponse;		   
		   while ((dhsResponse = in.readLine()) != null) {
			responseString.append(dhsResponse+"\n");			
		   }		   		   
		   in.close();	  
	   }
	   else
			throw new RuntimeException("Failed : HTTP error code: "+ conn.getResponseCode());
	   if(conn != null)
		   conn.disconnect();
	 //return response from DHS map, which is a CSV document with filtered parameters 
	 return responseString.toString().substring(0, responseString.length()-1);
	 //Test it on: http://localhost:8080/BdaREST/rest/postdata/csvdatawithparam?fields=pressure90
   	}
    
   /**
     * CREMA - Automotive Usecase
     * This service receives a single data parameter from multiselect dropdown list. 
     * It then invokes another function that gets required data from DWH through REST call.
     * @param param
     * @return csv array with timestamp in millis
     * @throws IOException
     * @throws ParseException 
     */      
    @GET
   	@Path("/automotivecsvdatawithbrackets")   
   	public String restAutomotiveCsvDataWithBrackets(@QueryParam(value = "fields") String param) throws IOException {   	   	
       //String JsonData = "[{\"metadata\":{\"machine_type\":\"Hydraulic press\",\"active\":false,\"location\":\"43.0649Ã�€��‚° N, 2.4902Ã�€��‚° W\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"timestamp\":\"2016-01-06 5:38:38:000\",\"customer\":\"FAGOR test\"},\"data\":{\"pressure_clutch\":18.5425,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"mechanical_clutchingTime\":234.4328,\"displacement_time_braking\":32.8841,\"mechanical_brakingTime\":365.6518,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"displacement_time_clutching\":105.5665,\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"crankshaft_position\":884.0154,\"oil_temp_out\":33.4047,\"overshoot_angle\":8.9963,\"oil_temp_in\":46.7426,\"machine_total_strokes\":309.2366,\"pressure90\":33.0333,\"oil_flow\":29.6357,\"synchronized_time\":\"2016-03-23 8:12:15:000\"}},{\"metadata\":{\"machine_type\":\"Hydraulic press\",\"active\":false,\"location\":\"43.0649Ã�€��‚° N, 2.4902Ã�€��‚° W\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"timestamp\":\"2016-01-06 5:38:38:000\",\"customer\":\"FAGOR test\"},\"data\":{\"pressure_clutch\":18.5425,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"mechanical_clutchingTime\":234.4328,\"displacement_time_braking\":32.8841,\"mechanical_brakingTime\":365.6518,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"displacement_time_clutching\":105.5665,\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"crankshaft_position\":884.0154,\"oil_temp_out\":33.4047,\"overshoot_angle\":8.9963,\"oil_temp_in\":46.7426,\"machine_total_strokes\":309.2366,\"pressure90\":33.0333,\"oil_flow\":29.6357,\"synchronized_time\":\"2016-03-23 8:12:15:000\"}},{\"metadata\":{\"machine_type\":\"Hydraulic press\",\"active\":false,\"location\":\"43.0649Ã�€��‚° N, 2.4902Ã�€��‚° W\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"timestamp\":\"2016-01-06 5:38:38:000\",\"customer\":\"FAGOR test\"},\"data\":{\"pressure_clutch\":18.5425,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"mechanical_clutchingTime\":234.4328,\"displacement_time_braking\":32.8841,\"mechanical_brakingTime\":365.6518,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"displacement_time_clutching\":105.5665,\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"crankshaft_position\":884.0154,\"oil_temp_out\":33.4047,\"overshoot_angle\":8.9963,\"oil_temp_in\":46.7426,\"machine_total_strokes\":309.2366,\"pressure90\":33.0333,\"oil_flow\":29.6357,\"synchronized_time\":\"2016-03-23 8:12:15:000\"}},{\"metadata\":{\"machine_type\":\"Hydraulic press\",\"active\":false,\"location\":\"43.0649Ã�€��‚° N, 2.4902Ã�€��‚° W\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"timestamp\":\"2016-01-06 5:38:38:000\",\"customer\":\"FAGOR test\"},\"data\":{\"pressure_clutch\":18.5425,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"mechanical_clutchingTime\":234.4328,\"displacement_time_braking\":32.8841,\"mechanical_brakingTime\":365.6518,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"displacement_time_clutching\":105.5665,\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"crankshaft_position\":884.0154,\"oil_temp_out\":33.4047,\"overshoot_angle\":8.9963,\"oil_temp_in\":46.7426,\"machine_total_strokes\":309.2366,\"pressure90\":33.0333,\"oil_flow\":29.6357,\"synchronized_time\":\"2016-03-23 8:12:15:000\"}},{\"metadata\":{\"machine_type\":\"Hydraulic press\",\"active\":false,\"location\":\"43.0649Ã�€��‚° N, 2.4902Ã�€��‚° W\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"timestamp\":\"2016-01-06 5:38:38:000\",\"customer\":\"FAGOR test\"},\"data\":{\"pressure_clutch\":18.5425,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"mechanical_clutchingTime\":234.4328,\"displacement_time_braking\":32.8841,\"mechanical_brakingTime\":365.6518,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"displacement_time_clutching\":105.5665,\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"crankshaft_position\":884.0154,\"oil_temp_out\":33.4047,\"overshoot_angle\":8.9963,\"oil_temp_in\":46.7426,\"machine_total_strokes\":309.2366,\"pressure90\":33.0333,\"oil_flow\":29.6357,\"synchronized_time\":\"2016-03-23 8:12:15:000\"}},{\"metadata\":{\"timestamp\":\"2016-01-06 5:38:38:000\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-9545698973\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649Ã‚Â° N, 2.4902Ã‚Â° W\"},\"data\":{\"displacement_time_braking\":32.8841,\"mechanical_clutchingTime\":234.4328,\"mechanical_brakingTime\":365.6518,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"synchronized_time\":\"2016-03-23 8:12:15:000\",\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"pressure90\":33.0333,\"pressure_clutch\":18.5425,\"oil_temp_in\":46.7426,\"oil_temp_out\":33.4047,\"oil_flow\":29.6357,\"overshoot_angle\":8.9963,\"machine_total_strokes\":309.2366,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"crankshaft_position\":884.0154,\"displacement_time_clutching\":105.5665}},{\"metadata\":{\"timestamp\":\"2016-01-06 5:38:38:000\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-9545698973\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649Ã‚Â° N, 2.4902Ã‚Â° W\"},\"data\":{\"displacement_time_braking\":32.8841,\"mechanical_clutchingTime\":234.4328,\"mechanical_brakingTime\":365.6518,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"synchronized_time\":\"2016-03-23 8:12:15:000\",\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"pressure90\":33.0333,\"pressure_clutch\":18.5425,\"oil_temp_in\":46.7426,\"oil_temp_out\":33.4047,\"oil_flow\":29.6357,\"overshoot_angle\":8.9963,\"machine_total_strokes\":309.2366,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"crankshaft_position\":884.0154,\"displacement_time_clutching\":105.5665}},{\"metadata\":{\"timestamp\":\"2016-01-06 5:38:38:000\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649Ã‚Â° N, 2.4902Ã‚Â° W\"},\"data\":{\"displacement_time_braking\":32.8841,\"mechanical_clutchingTime\":234.4328,\"mechanical_brakingTime\":365.6518,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"synchronized_time\":\"2016-03-23 8:12:15:000\",\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"pressure90\":33.0333,\"pressure_clutch\":18.5425,\"oil_temp_in\":46.7426,\"oil_temp_out\":33.4047,\"oil_flow\":29.6357,\"overshoot_angle\":8.9963,\"machine_total_strokes\":309.2366,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"crankshaft_position\":884.0154,\"displacement_time_clutching\":105.5665}},{\"metadata\":{\"timestamp\":\"2016-04-26 6:15:07:000\",\"machined_id\":\"b576f433-d0bf-4809-b5b9-1a3c29a390a1\",\"active\":true,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":17.201,\"mechanical_clutchingTime\":354.6658,\"mechanical_brakingTime\":61.4296,\"clutching_pressure\":79.4047,\"braking_pressure\":46.4175,\"synchronized_time\":\"2016-01-06 10:20:10:000\",\"braking_starting_time\":\"2016-03-13 6:45:44:000\",\"pressure90\":23.7131,\"pressure_clutch\":8.3332,\"oil_temp_in\":94.0141,\"oil_temp_out\":78.1173,\"oil_flow\":17.0967,\"overshoot_angle\":13.8626,\"machine_total_strokes\":324.9034,\"die_reference\":975.1541,\"die_total_strokes\":886.5273,\"machine_speed\":658.9038,\"height_regulation\":139.959,\"crankshaft_position\":556.0995,\"displacement_time_clutching\":99.0998}},{\"metadata\":{\"timestamp\":\"2016-03-20 9:11:12:000\",\"machined_id\":\"d8270f70-c8c6-4976-8b6b-ba33de7a4e9b\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":140.5786,\"mechanical_clutchingTime\":480.2788,\"mechanical_brakingTime\":9.8697,\"clutching_pressure\":79.5314,\"braking_pressure\":58.2605,\"synchronized_time\":\"2016-05-05 4:58:28:000\",\"braking_starting_time\":\"2016-02-26 2:42:45:000\",\"pressure90\":44.9351,\"pressure_clutch\":92.9785,\"oil_temp_in\":127.1295,\"oil_temp_out\":67.8993,\"oil_flow\":8.0589,\"overshoot_angle\":5.2979,\"machine_total_strokes\":694.3427,\"die_reference\":699.0524,\"die_total_strokes\":950.7532,\"machine_speed\":151.5129,\"height_regulation\":707.1301,\"crankshaft_position\":297.216,\"displacement_time_clutching\":25.6339}},{\"metadata\":{\"timestamp\":\"2016-03-21 11:06:17:000\",\"machined_id\":\"fb05a7f5-c3ab-4c56-a76f-5ce94747ecdd\",\"active\":true,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":116.528,\"mechanical_clutchingTime\":284.5677,\"mechanical_brakingTime\":339.2657,\"clutching_pressure\":22.8921,\"braking_pressure\":7.3097,\"synchronized_time\":\"2016-03-20 2:00:40:000\",\"braking_starting_time\":\"2016-03-03 8:37:59:000\",\"pressure90\":80.0256,\"pressure_clutch\":5.4607,\"oil_temp_in\":111.1341,\"oil_temp_out\":15.8034,\"oil_flow\":20.9505,\"overshoot_angle\":5.4017,\"machine_total_strokes\":340.2802,\"die_reference\":872.3174,\"die_total_strokes\":896.8749,\"machine_speed\":672.8013,\"height_regulation\":151.3786,\"crankshaft_position\":120.2196,\"displacement_time_clutching\":123.3033}},{\"metadata\":{\"timestamp\":\"2016-05-01 3:47:26:000\",\"machined_id\":\"0f7eae7a-bd49-491c-9425-1177f625409a\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":5.7155,\"mechanical_clutchingTime\":28.5274,\"mechanical_brakingTime\":326.5642,\"clutching_pressure\":38.1248,\"braking_pressure\":56.5709,\"synchronized_time\":\"2016-01-29 12:23:20:000\",\"braking_starting_time\":\"2016-01-18 8:11:09:000\",\"pressure90\":13.4258,\"pressure_clutch\":13.1641,\"oil_temp_in\":58.6054,\"oil_temp_out\":79.1179,\"oil_flow\":0.9031,\"overshoot_angle\":1.3502,\"machine_total_strokes\":786.1123,\"die_reference\":472.3231,\"die_total_strokes\":932.7124,\"machine_speed\":518.4946,\"height_regulation\":694.5719,\"crankshaft_position\":927.5106,\"displacement_time_clutching\":100.3067}},{\"metadata\":{\"timestamp\":\"2016-03-31 9:53:28:000\",\"machined_id\":\"0ff12519-337e-475e-aae8-764b83f0abff\",\"active\":true,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":25.1523,\"mechanical_clutchingTime\":598.0154,\"mechanical_brakingTime\":318.1685,\"clutching_pressure\":96.4427,\"braking_pressure\":93.062,\"synchronized_time\":\"2016-02-27 4:50:02:000\",\"braking_starting_time\":\"2016-05-02 2:42:48:000\",\"pressure90\":40.6673,\"pressure_clutch\":20.4064,\"oil_temp_in\":107.2217,\"oil_temp_out\":5.6903,\"oil_flow\":53.8065,\"overshoot_angle\":11.5325,\"machine_total_strokes\":68.6748,\"die_reference\":921.7098,\"die_total_strokes\":373.9564,\"machine_speed\":393.1439,\"height_regulation\":0.8307,\"crankshaft_position\":166.1139,\"displacement_time_clutching\":55.3388}},{\"metadata\":{\"timestamp\":\"2016-02-10 1:38:26:000\",\"machined_id\":\"13e3b4f1-c853-4d8c-83f8-13a9b24f951a\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":164.333,\"mechanical_clutchingTime\":133.4461,\"mechanical_brakingTime\":52.0495,\"clutching_pressure\":17.5617,\"braking_pressure\":0.7914,\"synchronized_time\":\"2016-03-01 2:13:22:000\",\"braking_starting_time\":\"2016-04-29 9:32:55:000\",\"pressure90\":55.0245,\"pressure_clutch\":65.1695,\"oil_temp_in\":57.3731,\"oil_temp_out\":78.5193,\"oil_flow\":48.457,\"overshoot_angle\":7.1768,\"machine_total_strokes\":747.0743,\"die_reference\":349.2149,\"die_total_strokes\":370.9946,\"machine_speed\":141.7083,\"height_regulation\":261.7422,\"crankshaft_position\":705.0579,\"displacement_time_clutching\":81.5826}},{\"metadata\":{\"timestamp\":\"2016-01-06 5:38:38:000\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":32.8841,\"mechanical_clutchingTime\":234.4328,\"mechanical_brakingTime\":365.6518,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"synchronized_time\":\"2016-03-23 8:12:15:000\",\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"pressure90\":33.0333,\"pressure_clutch\":18.5425,\"oil_temp_in\":46.7426,\"oil_temp_out\":33.4047,\"oil_flow\":29.6357,\"overshoot_angle\":8.9963,\"machine_total_strokes\":309.2366,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"crankshaft_position\":884.0154,\"displacement_time_clutching\":105.5665}}]";
       
    	//Get all machine data as Json String
    	String JsonData = GetMachineData.restGetRobot1Data();       
        //Send the Json String to DHS map
       URL url; //the url of the map is currently set for local docker container, it should be changed to the docker container running on the server
       
       //url = new URL("http:// " + DHS_REST_URI + "/dhs/convert4bda?token=mytoken5&fields="+param+"&format=array");
       url = new URL("http:// " + DHS_REST_URI + "/dhs/convert4bda?token=mytoken5&fields="+param+"&format=csv&timeformat=timestamp");//+"&format=array&timeformat=millis");
	   //Setup HTTP connection	  
	   HttpURLConnection conn = (HttpURLConnection) url.openConnection();
	   conn.setRequestMethod("POST");	   
	   conn.setDoOutput(true);			  
	   //conn.setRequestProperty("Authorization", "Basic " + authStringEnc);
	   conn.setRequestProperty("Content-Type", "application/json");	   
	   conn.connect();
	   //send Json String to REST service of DHS Map, running on a docker container
       OutputStream os = conn.getOutputStream();
	   os.write(JsonData.toString().getBytes());
	   os.flush();
	   
	   StringBuffer responseString = new StringBuffer();
	   if (conn.getResponseCode() == HttpURLConnection.HTTP_OK) 
	   {
		//get response from DHS Map	   	   
		   BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
		   String dhsResponse;		   
		   while ((dhsResponse = in.readLine()) != null) {
			responseString.append(dhsResponse+"\n");			
		   }		   		   
		   in.close();	  
	   }
	   else
			throw new RuntimeException("Failed : HTTP error code: "+ conn.getResponseCode());
	   if(conn != null)
		   conn.disconnect();
	 //return response from DHS map, which is a CSV document with filtered parameters 
	 return responseString.toString().substring(0, responseString.length()-1);
	 //Test it on: http://localhost:8080/BdaREST/rest/postdata/csvdatawithparam?fields=pressure90
   	}
    /**
     * CREMA - Machine Usecase
     * This service receives a single data parameter from multiselect dropdown list. 
     * It then invokes another service that gets all data from DWH. The data is passed 
     * to a DHS map (service) that filters the data to extract only specific parameters.
     * The filtered data is returned in a CSV format + within Brackets by the DHS map. 
     * The CSV data is then returned to the HTML page which invokes this service.
     * @param param
     * @return csv array with timestamp in millis
     * @throws IOException
     */    
    @GET
   	@Path("/machinecsvdatawithbracketswithmillis")   
   	public String restMachineCsvDataWithBracketsWithMillis(@QueryParam(value = "fields") String param) throws IOException {   	   	
       //String JsonData = "[{\"metadata\":{\"machine_type\":\"Hydraulic press\",\"active\":false,\"location\":\"43.0649Ã�€��‚° N, 2.4902Ã�€��‚° W\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"timestamp\":\"2016-01-06 5:38:38:000\",\"customer\":\"FAGOR test\"},\"data\":{\"pressure_clutch\":18.5425,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"mechanical_clutchingTime\":234.4328,\"displacement_time_braking\":32.8841,\"mechanical_brakingTime\":365.6518,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"displacement_time_clutching\":105.5665,\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"crankshaft_position\":884.0154,\"oil_temp_out\":33.4047,\"overshoot_angle\":8.9963,\"oil_temp_in\":46.7426,\"machine_total_strokes\":309.2366,\"pressure90\":33.0333,\"oil_flow\":29.6357,\"synchronized_time\":\"2016-03-23 8:12:15:000\"}},{\"metadata\":{\"machine_type\":\"Hydraulic press\",\"active\":false,\"location\":\"43.0649Ã�€��‚° N, 2.4902Ã�€��‚° W\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"timestamp\":\"2016-01-06 5:38:38:000\",\"customer\":\"FAGOR test\"},\"data\":{\"pressure_clutch\":18.5425,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"mechanical_clutchingTime\":234.4328,\"displacement_time_braking\":32.8841,\"mechanical_brakingTime\":365.6518,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"displacement_time_clutching\":105.5665,\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"crankshaft_position\":884.0154,\"oil_temp_out\":33.4047,\"overshoot_angle\":8.9963,\"oil_temp_in\":46.7426,\"machine_total_strokes\":309.2366,\"pressure90\":33.0333,\"oil_flow\":29.6357,\"synchronized_time\":\"2016-03-23 8:12:15:000\"}},{\"metadata\":{\"machine_type\":\"Hydraulic press\",\"active\":false,\"location\":\"43.0649Ã�€��‚° N, 2.4902Ã�€��‚° W\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"timestamp\":\"2016-01-06 5:38:38:000\",\"customer\":\"FAGOR test\"},\"data\":{\"pressure_clutch\":18.5425,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"mechanical_clutchingTime\":234.4328,\"displacement_time_braking\":32.8841,\"mechanical_brakingTime\":365.6518,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"displacement_time_clutching\":105.5665,\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"crankshaft_position\":884.0154,\"oil_temp_out\":33.4047,\"overshoot_angle\":8.9963,\"oil_temp_in\":46.7426,\"machine_total_strokes\":309.2366,\"pressure90\":33.0333,\"oil_flow\":29.6357,\"synchronized_time\":\"2016-03-23 8:12:15:000\"}},{\"metadata\":{\"machine_type\":\"Hydraulic press\",\"active\":false,\"location\":\"43.0649Ã�€��‚° N, 2.4902Ã�€��‚° W\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"timestamp\":\"2016-01-06 5:38:38:000\",\"customer\":\"FAGOR test\"},\"data\":{\"pressure_clutch\":18.5425,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"mechanical_clutchingTime\":234.4328,\"displacement_time_braking\":32.8841,\"mechanical_brakingTime\":365.6518,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"displacement_time_clutching\":105.5665,\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"crankshaft_position\":884.0154,\"oil_temp_out\":33.4047,\"overshoot_angle\":8.9963,\"oil_temp_in\":46.7426,\"machine_total_strokes\":309.2366,\"pressure90\":33.0333,\"oil_flow\":29.6357,\"synchronized_time\":\"2016-03-23 8:12:15:000\"}},{\"metadata\":{\"machine_type\":\"Hydraulic press\",\"active\":false,\"location\":\"43.0649Ã�€��‚° N, 2.4902Ã�€��‚° W\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"timestamp\":\"2016-01-06 5:38:38:000\",\"customer\":\"FAGOR test\"},\"data\":{\"pressure_clutch\":18.5425,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"mechanical_clutchingTime\":234.4328,\"displacement_time_braking\":32.8841,\"mechanical_brakingTime\":365.6518,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"displacement_time_clutching\":105.5665,\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"crankshaft_position\":884.0154,\"oil_temp_out\":33.4047,\"overshoot_angle\":8.9963,\"oil_temp_in\":46.7426,\"machine_total_strokes\":309.2366,\"pressure90\":33.0333,\"oil_flow\":29.6357,\"synchronized_time\":\"2016-03-23 8:12:15:000\"}},{\"metadata\":{\"timestamp\":\"2016-01-06 5:38:38:000\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-9545698973\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649Ã‚Â° N, 2.4902Ã‚Â° W\"},\"data\":{\"displacement_time_braking\":32.8841,\"mechanical_clutchingTime\":234.4328,\"mechanical_brakingTime\":365.6518,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"synchronized_time\":\"2016-03-23 8:12:15:000\",\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"pressure90\":33.0333,\"pressure_clutch\":18.5425,\"oil_temp_in\":46.7426,\"oil_temp_out\":33.4047,\"oil_flow\":29.6357,\"overshoot_angle\":8.9963,\"machine_total_strokes\":309.2366,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"crankshaft_position\":884.0154,\"displacement_time_clutching\":105.5665}},{\"metadata\":{\"timestamp\":\"2016-01-06 5:38:38:000\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-9545698973\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649Ã‚Â° N, 2.4902Ã‚Â° W\"},\"data\":{\"displacement_time_braking\":32.8841,\"mechanical_clutchingTime\":234.4328,\"mechanical_brakingTime\":365.6518,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"synchronized_time\":\"2016-03-23 8:12:15:000\",\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"pressure90\":33.0333,\"pressure_clutch\":18.5425,\"oil_temp_in\":46.7426,\"oil_temp_out\":33.4047,\"oil_flow\":29.6357,\"overshoot_angle\":8.9963,\"machine_total_strokes\":309.2366,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"crankshaft_position\":884.0154,\"displacement_time_clutching\":105.5665}},{\"metadata\":{\"timestamp\":\"2016-01-06 5:38:38:000\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649Ã‚Â° N, 2.4902Ã‚Â° W\"},\"data\":{\"displacement_time_braking\":32.8841,\"mechanical_clutchingTime\":234.4328,\"mechanical_brakingTime\":365.6518,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"synchronized_time\":\"2016-03-23 8:12:15:000\",\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"pressure90\":33.0333,\"pressure_clutch\":18.5425,\"oil_temp_in\":46.7426,\"oil_temp_out\":33.4047,\"oil_flow\":29.6357,\"overshoot_angle\":8.9963,\"machine_total_strokes\":309.2366,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"crankshaft_position\":884.0154,\"displacement_time_clutching\":105.5665}},{\"metadata\":{\"timestamp\":\"2016-04-26 6:15:07:000\",\"machined_id\":\"b576f433-d0bf-4809-b5b9-1a3c29a390a1\",\"active\":true,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":17.201,\"mechanical_clutchingTime\":354.6658,\"mechanical_brakingTime\":61.4296,\"clutching_pressure\":79.4047,\"braking_pressure\":46.4175,\"synchronized_time\":\"2016-01-06 10:20:10:000\",\"braking_starting_time\":\"2016-03-13 6:45:44:000\",\"pressure90\":23.7131,\"pressure_clutch\":8.3332,\"oil_temp_in\":94.0141,\"oil_temp_out\":78.1173,\"oil_flow\":17.0967,\"overshoot_angle\":13.8626,\"machine_total_strokes\":324.9034,\"die_reference\":975.1541,\"die_total_strokes\":886.5273,\"machine_speed\":658.9038,\"height_regulation\":139.959,\"crankshaft_position\":556.0995,\"displacement_time_clutching\":99.0998}},{\"metadata\":{\"timestamp\":\"2016-03-20 9:11:12:000\",\"machined_id\":\"d8270f70-c8c6-4976-8b6b-ba33de7a4e9b\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":140.5786,\"mechanical_clutchingTime\":480.2788,\"mechanical_brakingTime\":9.8697,\"clutching_pressure\":79.5314,\"braking_pressure\":58.2605,\"synchronized_time\":\"2016-05-05 4:58:28:000\",\"braking_starting_time\":\"2016-02-26 2:42:45:000\",\"pressure90\":44.9351,\"pressure_clutch\":92.9785,\"oil_temp_in\":127.1295,\"oil_temp_out\":67.8993,\"oil_flow\":8.0589,\"overshoot_angle\":5.2979,\"machine_total_strokes\":694.3427,\"die_reference\":699.0524,\"die_total_strokes\":950.7532,\"machine_speed\":151.5129,\"height_regulation\":707.1301,\"crankshaft_position\":297.216,\"displacement_time_clutching\":25.6339}},{\"metadata\":{\"timestamp\":\"2016-03-21 11:06:17:000\",\"machined_id\":\"fb05a7f5-c3ab-4c56-a76f-5ce94747ecdd\",\"active\":true,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":116.528,\"mechanical_clutchingTime\":284.5677,\"mechanical_brakingTime\":339.2657,\"clutching_pressure\":22.8921,\"braking_pressure\":7.3097,\"synchronized_time\":\"2016-03-20 2:00:40:000\",\"braking_starting_time\":\"2016-03-03 8:37:59:000\",\"pressure90\":80.0256,\"pressure_clutch\":5.4607,\"oil_temp_in\":111.1341,\"oil_temp_out\":15.8034,\"oil_flow\":20.9505,\"overshoot_angle\":5.4017,\"machine_total_strokes\":340.2802,\"die_reference\":872.3174,\"die_total_strokes\":896.8749,\"machine_speed\":672.8013,\"height_regulation\":151.3786,\"crankshaft_position\":120.2196,\"displacement_time_clutching\":123.3033}},{\"metadata\":{\"timestamp\":\"2016-05-01 3:47:26:000\",\"machined_id\":\"0f7eae7a-bd49-491c-9425-1177f625409a\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":5.7155,\"mechanical_clutchingTime\":28.5274,\"mechanical_brakingTime\":326.5642,\"clutching_pressure\":38.1248,\"braking_pressure\":56.5709,\"synchronized_time\":\"2016-01-29 12:23:20:000\",\"braking_starting_time\":\"2016-01-18 8:11:09:000\",\"pressure90\":13.4258,\"pressure_clutch\":13.1641,\"oil_temp_in\":58.6054,\"oil_temp_out\":79.1179,\"oil_flow\":0.9031,\"overshoot_angle\":1.3502,\"machine_total_strokes\":786.1123,\"die_reference\":472.3231,\"die_total_strokes\":932.7124,\"machine_speed\":518.4946,\"height_regulation\":694.5719,\"crankshaft_position\":927.5106,\"displacement_time_clutching\":100.3067}},{\"metadata\":{\"timestamp\":\"2016-03-31 9:53:28:000\",\"machined_id\":\"0ff12519-337e-475e-aae8-764b83f0abff\",\"active\":true,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":25.1523,\"mechanical_clutchingTime\":598.0154,\"mechanical_brakingTime\":318.1685,\"clutching_pressure\":96.4427,\"braking_pressure\":93.062,\"synchronized_time\":\"2016-02-27 4:50:02:000\",\"braking_starting_time\":\"2016-05-02 2:42:48:000\",\"pressure90\":40.6673,\"pressure_clutch\":20.4064,\"oil_temp_in\":107.2217,\"oil_temp_out\":5.6903,\"oil_flow\":53.8065,\"overshoot_angle\":11.5325,\"machine_total_strokes\":68.6748,\"die_reference\":921.7098,\"die_total_strokes\":373.9564,\"machine_speed\":393.1439,\"height_regulation\":0.8307,\"crankshaft_position\":166.1139,\"displacement_time_clutching\":55.3388}},{\"metadata\":{\"timestamp\":\"2016-02-10 1:38:26:000\",\"machined_id\":\"13e3b4f1-c853-4d8c-83f8-13a9b24f951a\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":164.333,\"mechanical_clutchingTime\":133.4461,\"mechanical_brakingTime\":52.0495,\"clutching_pressure\":17.5617,\"braking_pressure\":0.7914,\"synchronized_time\":\"2016-03-01 2:13:22:000\",\"braking_starting_time\":\"2016-04-29 9:32:55:000\",\"pressure90\":55.0245,\"pressure_clutch\":65.1695,\"oil_temp_in\":57.3731,\"oil_temp_out\":78.5193,\"oil_flow\":48.457,\"overshoot_angle\":7.1768,\"machine_total_strokes\":747.0743,\"die_reference\":349.2149,\"die_total_strokes\":370.9946,\"machine_speed\":141.7083,\"height_regulation\":261.7422,\"crankshaft_position\":705.0579,\"displacement_time_clutching\":81.5826}},{\"metadata\":{\"timestamp\":\"2016-01-06 5:38:38:000\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":32.8841,\"mechanical_clutchingTime\":234.4328,\"mechanical_brakingTime\":365.6518,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"synchronized_time\":\"2016-03-23 8:12:15:000\",\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"pressure90\":33.0333,\"pressure_clutch\":18.5425,\"oil_temp_in\":46.7426,\"oil_temp_out\":33.4047,\"oil_flow\":29.6357,\"overshoot_angle\":8.9963,\"machine_total_strokes\":309.2366,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"crankshaft_position\":884.0154,\"displacement_time_clutching\":105.5665}}]";
       
    	//Get all machine data as Json String
    	String JsonData = GetMachineData.restGetMachineData();
    	
        //Send the Json String to DHS map
      URL url; //the url of the map is currently set for local docker container, it should be changed to the docker container running on the server
       
       //url = new URL("http:// " + DHS_REST_URI + "/dhs/convert4bda?token=mytoken5&fields="+param+"&format=array");
       url = new URL("http:// " + DHS_REST_URI + "/dhs/convert4bda?token=mytoken5&fields="+param+"&format=array&timeformat=millis");//+"&format=array&timeformat=millis");
	   //Setup HTTP connection	  
	   HttpURLConnection conn = (HttpURLConnection) url.openConnection();
	   conn.setRequestMethod("POST");	   
	   conn.setDoOutput(true);			  
	   //conn.setRequestProperty("Authorization", "Basic " + authStringEnc);
	   conn.setRequestProperty("Content-Type", "application/json");	   
	   conn.connect();
	   //send Json String to REST service of DHS Map, running on a docker container
       OutputStream os = conn.getOutputStream();
	   os.write(JsonData.toString().getBytes());
	   os.flush();
	   
	   StringBuffer responseString = new StringBuffer();
	   if (conn.getResponseCode() == HttpURLConnection.HTTP_OK) 
	   {
		//get response from DHS Map	   	   
		   BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
		   String dhsResponse;		   
		   while ((dhsResponse = in.readLine()) != null) {
			responseString.append(dhsResponse+"\n");			
		   }		   		   
		   in.close();	  
	   }
	   else
			throw new RuntimeException("Failed : HTTP error code: "+ conn.getResponseCode());
	   if(conn != null)
		   conn.disconnect();
	 //return response from DHS map, which is a CSV document with filtered parameters 
	   System.out.println(responseString.toString().substring(0, responseString.length()-1));
	 return responseString.toString().substring(0, responseString.length()-1);
	 //Test it on: http://localhost:8080/BdaREST/rest/postdata/csvdatawithparam?fields=pressure90  
   	}
    
    
    /**
     * CREMA - Automotive Usecase
     * This service receives a single data parameter from multiselect dropdown list. 
     * It then invokes another function that gets required data from DWH through REST call.
     * @param param
     * @return csv array with timestamp in millis
     * @throws IOException
     * @throws ParseException 
     */  
    @GET
   	@Path("/automotivecsvdatawithbracketswithmillis")   
   	public String restAutomotiveCsvDataWithBracketsWithMillis(@QueryParam(value = "fields") String param) throws IOException {   	   	
       //String JsonData = "[{\"metadata\":{\"machine_type\":\"Hydraulic press\",\"active\":false,\"location\":\"43.0649Ã�€��‚° N, 2.4902Ã�€��‚° W\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"timestamp\":\"2016-01-06 5:38:38:000\",\"customer\":\"FAGOR test\"},\"data\":{\"pressure_clutch\":18.5425,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"mechanical_clutchingTime\":234.4328,\"displacement_time_braking\":32.8841,\"mechanical_brakingTime\":365.6518,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"displacement_time_clutching\":105.5665,\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"crankshaft_position\":884.0154,\"oil_temp_out\":33.4047,\"overshoot_angle\":8.9963,\"oil_temp_in\":46.7426,\"machine_total_strokes\":309.2366,\"pressure90\":33.0333,\"oil_flow\":29.6357,\"synchronized_time\":\"2016-03-23 8:12:15:000\"}},{\"metadata\":{\"machine_type\":\"Hydraulic press\",\"active\":false,\"location\":\"43.0649Ã�€��‚° N, 2.4902Ã�€��‚° W\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"timestamp\":\"2016-01-06 5:38:38:000\",\"customer\":\"FAGOR test\"},\"data\":{\"pressure_clutch\":18.5425,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"mechanical_clutchingTime\":234.4328,\"displacement_time_braking\":32.8841,\"mechanical_brakingTime\":365.6518,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"displacement_time_clutching\":105.5665,\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"crankshaft_position\":884.0154,\"oil_temp_out\":33.4047,\"overshoot_angle\":8.9963,\"oil_temp_in\":46.7426,\"machine_total_strokes\":309.2366,\"pressure90\":33.0333,\"oil_flow\":29.6357,\"synchronized_time\":\"2016-03-23 8:12:15:000\"}},{\"metadata\":{\"machine_type\":\"Hydraulic press\",\"active\":false,\"location\":\"43.0649Ã�€��‚° N, 2.4902Ã�€��‚° W\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"timestamp\":\"2016-01-06 5:38:38:000\",\"customer\":\"FAGOR test\"},\"data\":{\"pressure_clutch\":18.5425,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"mechanical_clutchingTime\":234.4328,\"displacement_time_braking\":32.8841,\"mechanical_brakingTime\":365.6518,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"displacement_time_clutching\":105.5665,\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"crankshaft_position\":884.0154,\"oil_temp_out\":33.4047,\"overshoot_angle\":8.9963,\"oil_temp_in\":46.7426,\"machine_total_strokes\":309.2366,\"pressure90\":33.0333,\"oil_flow\":29.6357,\"synchronized_time\":\"2016-03-23 8:12:15:000\"}},{\"metadata\":{\"machine_type\":\"Hydraulic press\",\"active\":false,\"location\":\"43.0649Ã�€��‚° N, 2.4902Ã�€��‚° W\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"timestamp\":\"2016-01-06 5:38:38:000\",\"customer\":\"FAGOR test\"},\"data\":{\"pressure_clutch\":18.5425,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"mechanical_clutchingTime\":234.4328,\"displacement_time_braking\":32.8841,\"mechanical_brakingTime\":365.6518,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"displacement_time_clutching\":105.5665,\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"crankshaft_position\":884.0154,\"oil_temp_out\":33.4047,\"overshoot_angle\":8.9963,\"oil_temp_in\":46.7426,\"machine_total_strokes\":309.2366,\"pressure90\":33.0333,\"oil_flow\":29.6357,\"synchronized_time\":\"2016-03-23 8:12:15:000\"}},{\"metadata\":{\"machine_type\":\"Hydraulic press\",\"active\":false,\"location\":\"43.0649Ã�€��‚° N, 2.4902Ã�€��‚° W\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"timestamp\":\"2016-01-06 5:38:38:000\",\"customer\":\"FAGOR test\"},\"data\":{\"pressure_clutch\":18.5425,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"mechanical_clutchingTime\":234.4328,\"displacement_time_braking\":32.8841,\"mechanical_brakingTime\":365.6518,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"displacement_time_clutching\":105.5665,\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"crankshaft_position\":884.0154,\"oil_temp_out\":33.4047,\"overshoot_angle\":8.9963,\"oil_temp_in\":46.7426,\"machine_total_strokes\":309.2366,\"pressure90\":33.0333,\"oil_flow\":29.6357,\"synchronized_time\":\"2016-03-23 8:12:15:000\"}},{\"metadata\":{\"timestamp\":\"2016-01-06 5:38:38:000\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-9545698973\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649Ã‚Â° N, 2.4902Ã‚Â° W\"},\"data\":{\"displacement_time_braking\":32.8841,\"mechanical_clutchingTime\":234.4328,\"mechanical_brakingTime\":365.6518,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"synchronized_time\":\"2016-03-23 8:12:15:000\",\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"pressure90\":33.0333,\"pressure_clutch\":18.5425,\"oil_temp_in\":46.7426,\"oil_temp_out\":33.4047,\"oil_flow\":29.6357,\"overshoot_angle\":8.9963,\"machine_total_strokes\":309.2366,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"crankshaft_position\":884.0154,\"displacement_time_clutching\":105.5665}},{\"metadata\":{\"timestamp\":\"2016-01-06 5:38:38:000\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-9545698973\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649Ã‚Â° N, 2.4902Ã‚Â° W\"},\"data\":{\"displacement_time_braking\":32.8841,\"mechanical_clutchingTime\":234.4328,\"mechanical_brakingTime\":365.6518,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"synchronized_time\":\"2016-03-23 8:12:15:000\",\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"pressure90\":33.0333,\"pressure_clutch\":18.5425,\"oil_temp_in\":46.7426,\"oil_temp_out\":33.4047,\"oil_flow\":29.6357,\"overshoot_angle\":8.9963,\"machine_total_strokes\":309.2366,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"crankshaft_position\":884.0154,\"displacement_time_clutching\":105.5665}},{\"metadata\":{\"timestamp\":\"2016-01-06 5:38:38:000\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649Ã‚Â° N, 2.4902Ã‚Â° W\"},\"data\":{\"displacement_time_braking\":32.8841,\"mechanical_clutchingTime\":234.4328,\"mechanical_brakingTime\":365.6518,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"synchronized_time\":\"2016-03-23 8:12:15:000\",\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"pressure90\":33.0333,\"pressure_clutch\":18.5425,\"oil_temp_in\":46.7426,\"oil_temp_out\":33.4047,\"oil_flow\":29.6357,\"overshoot_angle\":8.9963,\"machine_total_strokes\":309.2366,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"crankshaft_position\":884.0154,\"displacement_time_clutching\":105.5665}},{\"metadata\":{\"timestamp\":\"2016-04-26 6:15:07:000\",\"machined_id\":\"b576f433-d0bf-4809-b5b9-1a3c29a390a1\",\"active\":true,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":17.201,\"mechanical_clutchingTime\":354.6658,\"mechanical_brakingTime\":61.4296,\"clutching_pressure\":79.4047,\"braking_pressure\":46.4175,\"synchronized_time\":\"2016-01-06 10:20:10:000\",\"braking_starting_time\":\"2016-03-13 6:45:44:000\",\"pressure90\":23.7131,\"pressure_clutch\":8.3332,\"oil_temp_in\":94.0141,\"oil_temp_out\":78.1173,\"oil_flow\":17.0967,\"overshoot_angle\":13.8626,\"machine_total_strokes\":324.9034,\"die_reference\":975.1541,\"die_total_strokes\":886.5273,\"machine_speed\":658.9038,\"height_regulation\":139.959,\"crankshaft_position\":556.0995,\"displacement_time_clutching\":99.0998}},{\"metadata\":{\"timestamp\":\"2016-03-20 9:11:12:000\",\"machined_id\":\"d8270f70-c8c6-4976-8b6b-ba33de7a4e9b\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":140.5786,\"mechanical_clutchingTime\":480.2788,\"mechanical_brakingTime\":9.8697,\"clutching_pressure\":79.5314,\"braking_pressure\":58.2605,\"synchronized_time\":\"2016-05-05 4:58:28:000\",\"braking_starting_time\":\"2016-02-26 2:42:45:000\",\"pressure90\":44.9351,\"pressure_clutch\":92.9785,\"oil_temp_in\":127.1295,\"oil_temp_out\":67.8993,\"oil_flow\":8.0589,\"overshoot_angle\":5.2979,\"machine_total_strokes\":694.3427,\"die_reference\":699.0524,\"die_total_strokes\":950.7532,\"machine_speed\":151.5129,\"height_regulation\":707.1301,\"crankshaft_position\":297.216,\"displacement_time_clutching\":25.6339}},{\"metadata\":{\"timestamp\":\"2016-03-21 11:06:17:000\",\"machined_id\":\"fb05a7f5-c3ab-4c56-a76f-5ce94747ecdd\",\"active\":true,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":116.528,\"mechanical_clutchingTime\":284.5677,\"mechanical_brakingTime\":339.2657,\"clutching_pressure\":22.8921,\"braking_pressure\":7.3097,\"synchronized_time\":\"2016-03-20 2:00:40:000\",\"braking_starting_time\":\"2016-03-03 8:37:59:000\",\"pressure90\":80.0256,\"pressure_clutch\":5.4607,\"oil_temp_in\":111.1341,\"oil_temp_out\":15.8034,\"oil_flow\":20.9505,\"overshoot_angle\":5.4017,\"machine_total_strokes\":340.2802,\"die_reference\":872.3174,\"die_total_strokes\":896.8749,\"machine_speed\":672.8013,\"height_regulation\":151.3786,\"crankshaft_position\":120.2196,\"displacement_time_clutching\":123.3033}},{\"metadata\":{\"timestamp\":\"2016-05-01 3:47:26:000\",\"machined_id\":\"0f7eae7a-bd49-491c-9425-1177f625409a\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":5.7155,\"mechanical_clutchingTime\":28.5274,\"mechanical_brakingTime\":326.5642,\"clutching_pressure\":38.1248,\"braking_pressure\":56.5709,\"synchronized_time\":\"2016-01-29 12:23:20:000\",\"braking_starting_time\":\"2016-01-18 8:11:09:000\",\"pressure90\":13.4258,\"pressure_clutch\":13.1641,\"oil_temp_in\":58.6054,\"oil_temp_out\":79.1179,\"oil_flow\":0.9031,\"overshoot_angle\":1.3502,\"machine_total_strokes\":786.1123,\"die_reference\":472.3231,\"die_total_strokes\":932.7124,\"machine_speed\":518.4946,\"height_regulation\":694.5719,\"crankshaft_position\":927.5106,\"displacement_time_clutching\":100.3067}},{\"metadata\":{\"timestamp\":\"2016-03-31 9:53:28:000\",\"machined_id\":\"0ff12519-337e-475e-aae8-764b83f0abff\",\"active\":true,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":25.1523,\"mechanical_clutchingTime\":598.0154,\"mechanical_brakingTime\":318.1685,\"clutching_pressure\":96.4427,\"braking_pressure\":93.062,\"synchronized_time\":\"2016-02-27 4:50:02:000\",\"braking_starting_time\":\"2016-05-02 2:42:48:000\",\"pressure90\":40.6673,\"pressure_clutch\":20.4064,\"oil_temp_in\":107.2217,\"oil_temp_out\":5.6903,\"oil_flow\":53.8065,\"overshoot_angle\":11.5325,\"machine_total_strokes\":68.6748,\"die_reference\":921.7098,\"die_total_strokes\":373.9564,\"machine_speed\":393.1439,\"height_regulation\":0.8307,\"crankshaft_position\":166.1139,\"displacement_time_clutching\":55.3388}},{\"metadata\":{\"timestamp\":\"2016-02-10 1:38:26:000\",\"machined_id\":\"13e3b4f1-c853-4d8c-83f8-13a9b24f951a\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":164.333,\"mechanical_clutchingTime\":133.4461,\"mechanical_brakingTime\":52.0495,\"clutching_pressure\":17.5617,\"braking_pressure\":0.7914,\"synchronized_time\":\"2016-03-01 2:13:22:000\",\"braking_starting_time\":\"2016-04-29 9:32:55:000\",\"pressure90\":55.0245,\"pressure_clutch\":65.1695,\"oil_temp_in\":57.3731,\"oil_temp_out\":78.5193,\"oil_flow\":48.457,\"overshoot_angle\":7.1768,\"machine_total_strokes\":747.0743,\"die_reference\":349.2149,\"die_total_strokes\":370.9946,\"machine_speed\":141.7083,\"height_regulation\":261.7422,\"crankshaft_position\":705.0579,\"displacement_time_clutching\":81.5826}},{\"metadata\":{\"timestamp\":\"2016-01-06 5:38:38:000\",\"machined_id\":\"b533e21f-ef53-4af8-9e53-95cb63562003\",\"active\":false,\"machine_type\":\"Hydraulic press\",\"customer\":\"FAGOR test\",\"location\":\"43.0649° N, 2.4902° W\"},\"data\":{\"displacement_time_braking\":32.8841,\"mechanical_clutchingTime\":234.4328,\"mechanical_brakingTime\":365.6518,\"clutching_pressure\":77.5957,\"braking_pressure\":19.9283,\"synchronized_time\":\"2016-03-23 8:12:15:000\",\"braking_starting_time\":\"2016-04-03 2:53:46:000\",\"pressure90\":33.0333,\"pressure_clutch\":18.5425,\"oil_temp_in\":46.7426,\"oil_temp_out\":33.4047,\"oil_flow\":29.6357,\"overshoot_angle\":8.9963,\"machine_total_strokes\":309.2366,\"die_reference\":811.4275,\"die_total_strokes\":102.2225,\"machine_speed\":67.2444,\"height_regulation\":526.4015,\"crankshaft_position\":884.0154,\"displacement_time_clutching\":105.5665}}]";
       
    	//Get all machine data as Json String
    	String JsonData = GetMachineData.restGetRobot1Data();       
        //Send the Json String to DHS map
       URL url; //the url of the map is currently set for local docker container, it should be changed to the docker container running on the server
       
       //url = new URL("http:// " + DHS_REST_URI + "/dhs/convert4bda?token=mytoken5&fields="+param+"&format=array");
       url = new URL("http:// " + DHS_REST_URI + "/dhs/convert4bda?token=mytoken5&fields="+param+"&format=array&timeformat=millis");//+"&format=array&timeformat=millis");
	   //Setup HTTP connection	  
	   HttpURLConnection conn = (HttpURLConnection) url.openConnection();
	   conn.setRequestMethod("POST");	   
	   conn.setDoOutput(true);			  
	   //conn.setRequestProperty("Authorization", "Basic " + authStringEnc);
	   conn.setRequestProperty("Content-Type", "application/json");	   
	   conn.connect();
	   //send Json String to REST service of DHS Map, running on a docker container
       OutputStream os = conn.getOutputStream();
	   os.write(JsonData.toString().getBytes());
	   os.flush();
	   
	   StringBuffer responseString = new StringBuffer();
	   if (conn.getResponseCode() == HttpURLConnection.HTTP_OK) 
	   {
		//get response from DHS Map	   	   
		   BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
		   String dhsResponse;		   
		   while ((dhsResponse = in.readLine()) != null) {
			responseString.append(dhsResponse+"\n");			
		   }		   		   
		   in.close();	  
	   }
	   else
			throw new RuntimeException("Failed : HTTP error code: "+ conn.getResponseCode());
	   if(conn != null)
		   conn.disconnect();
	 //return response from DHS map, which is a CSV document with filtered parameters 
	 return responseString.toString().substring(0, responseString.length()-1);
	 //Test it on: http://localhost:8080/BdaREST/rest/postdata/csvdatawithparam?fields=pressure90
   	}
    
    
    /**
     * CREMA - Machine Usecase
     * This service receives a single data parameter from multiselect dropdown list. 
     * It then invokes another function that gets required data from DWH through REST call.
     * @param param
     * @return csv array with timestamp in millis
     * @throws IOException
     * @throws ParseException 
     */    
//    @GET
//   	@Path("/machinestreambatch")   
//	public String MachineStreamData(@QueryParam(value = "fields") String param) throws IOException, ParseException {
//    	    	  
//    	String JsonData= StreamBatchProcessing.getMachineBatch(param);
//    	//System.out.println(JsonData);
//        return JsonData;      
//   	}
        
     /**
     * CREMA - Machine Usecase
     * This service receives a single value.
     * @param param
     * @return It then returns another number +-20%
     * @throws IOException
     * @throws ParseException 
     */     
    @GET    
        @Path("/randomclosenumber")
        public double RandomCloseNumber(@QueryParam(value = "fields") String param) throws IOException, ParseException {
            double inputNum = parseDouble(param);
            double changeAmount =  0.8 + (0.4) * Math.random();
            return inputNum * changeAmount;
        }
    

}
