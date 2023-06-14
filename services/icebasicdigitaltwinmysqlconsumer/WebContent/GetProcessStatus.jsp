<%-- 
    Document   : GetProcessStatus
    Created on : 16-May-2018, 11:35:37
    Author     : mitch
--%>
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
        <h1>Hello World!</h1>
        <%
            
                 Class.forName("com.mysql.jdbc.Driver"); //connector
        //ice: icemain.hopto.org:3306/factory","root","FWv!Bv%}>+ySt[9xaq8"
        //local: jdbc:mysql://192.168.99.100:3306/factory","root","test"
        //jdbc:mysql://kafkanetwork_kafkamysql_1:3306/factory","root","test"
String topic = request.getParameter("topic");
java.sql.Connection con = DriverManager.getConnection("jdbc:mysql://"+System.getenv("KAFKA_MYSQL")+"?autoReconnect=true&useSSL=false","root","test"); //connection string
        
Statement st= con.createStatement(); //creates connection string statement
ResultSet rs = st.executeQuery(StringEscapeUtils.unescapeJava("SELECT * FROM factory.status WHERE name='"+topic+"'")); //for each insert statement execute the insert statement into the database
String ret = "";
while (rs.next()) {
    
    ResultSetMetaData rsmd = rs.getMetaData();
    int columnCount =  rsmd.getColumnCount();
    for(int i =1;i<=columnCount;i++)
    {
     ret += rs.getString(rsmd.getColumnName(i))+",";
    }
    ret = ret.substring(0,ret.length()-1);
    ret +=  System.lineSeparator();
}
con.close();

out.println(ret);
           
        %>   
    </body>
</html>

