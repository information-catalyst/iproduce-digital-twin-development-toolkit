
<%-- 
    Document   : getIndexMapLocations
    Created on : 21-Mar-2018, 15:16:17
    Author     : mitch
--%>

<%@page contentType="text/html" pageEncoding="windows-1252"%>
<%@ page import ="java.sql.*" %>
<%@ page import ="javax.sql.*" %>
<%@ page import ="java.io.*" %>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
        <title>JSP Page</title>
    </head>
    <body>
<%
    

Class.forName("com.mysql.jdbc.Driver"); //connector
//java.sql.Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/formsubmit","admin","FWv!Bv%}>+ySt[9xaq8"); //connection string for MYSQL instance on localhost/pc
//java.sql.Connection con = DriverManager.getConnection("jdbc:mysql://192.168.0.11:3306/formsubmit","admin","FWv!Bv%}>+ySt[9xaq8"); //connection string for local machine mine
//java.sql.Connection con = DriverManager.getConnection("jdbc:mysql://192.168.1.9:3306/formsubmit","admin","FWv!Bv%}>+ySt[9xaq8"); //connection string for local machine zara
//java.sql.Connection con = DriverManager.getConnection("jdbc:mysql://192.168.99.100:3306/formsubmit","root","FWv!Bv%}>+ySt[9xaq8"); //connection string for local docker
java.sql.Connection con = DriverManager.getConnection("jdbc:mysql://"+System.getenv("ICE_MYSQL"),"root","FWv!Bv%}>+ySt[9xaq8"); //connection string for ICE server
Statement st= con.createStatement(); //creates connection string statement
String parts = "SELECT * FROM formsubmit.relationships;";
String retValue = "";

 ResultSet rs = st.executeQuery(parts); 
 while(rs.next())
 {
    retValue += rs.getString("owneruserid")+",";
    retValue += rs.getString("partneruserid")+",";
    retValue += rs.getString("type")+"\n";
 }
 out.println(retValue); 


%>
    </body>
</html>