<%-- 
    Document   : GetBaseX
    Created on : 21 Aug 2018, 17:23:25
    Author     : mitch
--%>

<%@page import="org.w3c.dom.Element"%>
<%@page import="org.w3c.dom.Document"%>
<%@page import="javax.xml.parsers.DocumentBuilder"%>
<%@page import="javax.xml.parsers.DocumentBuilderFactory"%>
<%@page import="java.net.URLEncoder"%>
<%@page import="java.io.InputStreamReader"%>
<%@page import="java.io.BufferedReader"%>
<%@page import="java.io.InputStream"%>
<%@page import="java.io.DataOutputStream"%>
<%@page import="java.lang.StringBuilder"%>
<%@page import="java.net.HttpURLConnection"%>
<%@page import="java.net.URL"%>
<%@page contentType="text/html" pageEncoding="windows-1252"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
        <title>Get BaseX</title>
    </head>
    <body>
         <%
    
    String urlParam = request.getParameter("url");
             
    HttpURLConnection connection = null;
    String targetURL = "http://basexhttp:8984/rest/Factory_Processes/"+urlParam;
    try {
        //Create connection
        URL url = new URL(targetURL);
        connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");
        String userCredentials = "admin:admin";
        String basicAuth = "Basic " + java.util.Base64.getEncoder().encodeToString(userCredentials.getBytes());
        connection.setRequestProperty ("Authorization", basicAuth);

        BufferedReader in = new BufferedReader(new InputStreamReader(
                                    connection.getInputStream()));
        String inputLine;
        while ((inputLine = in.readLine()) != null)
        {
            out.println(inputLine);
        }
        in.close();
  } catch (Exception e) {
        e.printStackTrace();
        out.println("null");
  } finally {
    if (connection != null) {
      connection.disconnect();
    }
  }
            
         %>   
    </body>
</html>
