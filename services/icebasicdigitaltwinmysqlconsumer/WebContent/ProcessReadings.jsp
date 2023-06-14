<%-- 
    Document   : ProcessReadings
    Created on : 27-Apr-2018, 13:09:57
    Author     : mitch
--%>
<%@ page import="com.main.Run"%>
<%@ page import="java.sql.DriverManager"%>
<%@ page import="java.sql.ResultSet"%>
<%@ page import="java.sql.SQLException"%>
<%@ page import="java.sql.Statement"%>
<%@ page import="org.apache.commons.lang3.StringEscapeUtils"%>
<%@ page import="java.sql.*"%>
<%@page contentType="text/html" pageEncoding="windows-1252"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
        <title>JSP Page</title>
    </head>
    <body>
        <%
         Class.forName("com.mysql.jdbc.Driver"); //connector
        //ice: icemain.hopto.org:3306/factory","root","FWv!Bv%}>+ySt[9xaq8"
        //local: jdbc:mysql://192.168.99.100:3306/factory","root","test"
        //kafkanetwork jdbc:mysql://kafkanetwork_kafkamysql_1:3306/factory","root","test
        java.sql.Connection con = DriverManager.getConnection("jdbc:mysql://"+System.getenv("KAFKA_MYSQL")+"?autoReconnect=true&useSSL=false","root","test"); //connection string
        Statement st= con.createStatement(); //creates connection string statement
        st.executeUpdate(StringEscapeUtils.unescapeJava("UPDATE factory.status SET status='true' WHERE name='processing'")); //for each insert statement execute the insert statement into the database
        con.close();
            
           //boolean historic = Boolean.parseBoolean(request.getParameter("historic"));
           Run run = new Run();
           run.Go();
        %>   
    </body>
</html>
