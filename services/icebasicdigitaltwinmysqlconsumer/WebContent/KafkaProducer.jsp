<%-- 
    Document   : kafkaProducer
    Created on : 17-Apr-2018, 18:18:48
    Author     : mitch
--%>
<%@ page import="com.main.KafkaWriter"%>
<%@page contentType="text/html" pageEncoding="windows-1252"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
        <title>JSP Page</title>
    </head>
    <body>
        
        <%
            KafkaWriter KW = new KafkaWriter();
            
            KW.runProducer(5);
            
            
        %>
        
    </body>
</html>
