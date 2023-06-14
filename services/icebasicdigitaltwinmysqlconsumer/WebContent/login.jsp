<%-- 
    Document   : login
    Created on : 25-Nov-2016, 16:40:35
    Author     : mitch
--%>

<%@page contentType="text/html" pageEncoding="windows-1252"%>
<!DOCTYPE html>
<%@ page import ="java.sql.*" %>
<%@ page import ="javax.sql.*" %>
<%@ page import ="java.io.*" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
        <title>JSP Page</title>
    </head>
    <body>
        <%
Class.forName("com.mysql.jdbc.Driver"); //connector
//java.sql.Connection con = DriverManager.getConnection("jdbc:mysql://192.168.0.11:3306/formsubmit","admin","FWv!Bv%}>+ySt[9xaq8"); //connection string for local machine mine
//java.sql.Connection con = DriverManager.getConnection("jdbc:mysql://192.168.1.9:3306/formsubmit","admin","FWv!Bv%}>+ySt[9xaq8"); //connection string for local machine zara
//java.sql.Connection con = DriverManager.getConnection("jdbc:mysql://192.168.99.100:3306/formsubmit","root","FWv!Bv%}>+ySt[9xaq8"); //connection string for local docker
java.sql.Connection con = DriverManager.getConnection("jdbc:mysql://"+System.getenv("ICE_MYSQL"),"root","FWv!Bv%}>+ySt[9xaq8"); //connection string for ICE server
Statement st= con.createStatement(); //creates connection string statement
String field1=request.getParameter("data"); //gets the submitted data
ResultSet rs = st.executeQuery(field1); //for each insert statement execute the insert statement into the database
if(rs.next())
{
    out.println("Existing");
}
%>
    </body>
</html>
