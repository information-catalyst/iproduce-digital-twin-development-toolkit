<%-- 
    Document   : login
    Created on : 21-Oct-2016, 10:18:56
    Author     : mitch
    Purpose    : Establish the connection with database and submit pre_specified (in forms.js) query in the database
--%>


<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<%@ page import ="java.sql.*" %>
<%@ page import ="javax.sql.*" %>
<%@ page import ="java.io.*" %>

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
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
String field1=request.getParameter("data"); //gets the submitted data
String[] parts = field1.split("\\r?\\n"); // splits string into seperate insert statements
for(int i = 0; i< parts.length;i++) 
{
 st.executeUpdate(parts[i].trim()); //for each insert statement execute the insert statement into the database
 out.println(parts[i].trim()); //print results

}

%>
    </body>
</html>