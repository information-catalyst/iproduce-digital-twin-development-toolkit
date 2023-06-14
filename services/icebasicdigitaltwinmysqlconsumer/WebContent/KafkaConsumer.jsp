<%-- 
    Document   : kafkaConsumer
    Created on : 17-Apr-2018, 18:18:48
    Author     : mitch
--%>
<%@page import="org.apache.commons.lang3.StringEscapeUtils"%>
<%@page import="java.sql.Statement"%>
<%@page import="java.sql.DriverManager"%>
<%@ page import="com.main.KafkaReaderCommands"%>
<%@ page import="com.main.KafkaReaderBpmndata"%>
<%@page contentType="text/html" pageEncoding="windows-1252"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
        <title>JSP Page</title>
    </head>
    <body>
        
        <%
            
            String topic = request.getParameter("topic");
            
        	java.sql.Connection  con = DriverManager.getConnection("jdbc:mysql://"+System.getenv("KAFKA_MYSQL")+"?autoReconnect=true&useSSL=false","root","test"); //connection string
            Statement st= con.createStatement(); //creates connection string statement
            st.executeUpdate(StringEscapeUtils.unescapeJava("UPDATE factory.status SET status='true' WHERE name='"+topic+"'"));
            con.close();
            
            if(topic.compareToIgnoreCase("commands")==0)
            {
            KafkaReaderCommands KR = new KafkaReaderCommands();
            out.println("KR Created");
            KR.consume();
            }
            else if(topic.compareToIgnoreCase("bpmndata")==0)
            {
                KafkaReaderBpmndata KRB = new KafkaReaderBpmndata();
                KRB.consume();
            }
 
        %>
        
    </body>
</html>
