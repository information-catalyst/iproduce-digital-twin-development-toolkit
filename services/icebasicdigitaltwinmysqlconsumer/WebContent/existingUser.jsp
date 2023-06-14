<%-- 
    Document   : existingUser.jsp
    Created on : 25-Nov-2016, 16:33:23
    Author     : mitch
--%>

<%@page contentType="text/html" pageEncoding="windows-1252"%>
<!DOCTYPE html>
<html>
	<head>
                <%@ page import="java.io.*,java.util.*,java.sql.*"%>
                <%@ page import="javax.servlet.http.*,javax.servlet.*" %>
                
		<link rel="stylesheet" href="css/bootstrap.min.css" />
		<link rel="stylesheet" href="css/Forms.css" />
		<script src="js/jquery-3.2.1.min.js"></script>
		<script src="js/bootstrap.min.js"></script>
		<script src="js/trialForms.js"></script>
		<title>ICE Data Platform</title>
	</head>
	<body>
            <div style=" position: absolute; top: 0px; right: 0px;">
    <img src="resources/ice.png"/>
</div>
		<div id="main" class="container" >
                    
                           <%
         String user = request.getParameter("uname"); 
         user = user.replaceAll("%20", " ");
         String pass = request.getParameter("pass");
         pass = pass.replaceAll("%20", "");
         %>    
         
         <div class="col-xs-2"> <img id="logoPic" class="thumbnail img-responsive" style="height:120px" alt="Bootstrap template" src=""> </div>
         
         <div class="page-header">  
               <div class="icon-img col-xs-2 col-xs-offset-2">
               <input class="nav-buttons" id="testButton" type="button" value='Add Logo'/>
		</div>
              <div class="icon-img col-xs-2">
               <input class="nav-buttons" id="OpenData" type="button" value='Add New Data Structure'/>
		</div>
            
         <h1><%=user%> Data Structures </h1> 
        </div>
        
           <div id="modal-content" class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">X</button>
                    <h3 id="header-edit-question">Add a New Logo</h3>
                </div>
                <div class="modal-body">
                <!-- Upload LOGO -->
            <form id="upload-logo" class="upload-logo" action="/rateme/logo/new">
            <div class="form-group">
            <label for="file">
            Select a logo:
            </label>
            <input type="file" id="file" name="file"/>
            <button id="upload-button" type="submit" class="btn btn-default" style="display:none">Upload</button>
            </div>
            </form>
                </div>
                <div class="modal-footer">
                    <a href="#" class="btn" data-dismiss="modal">Cancel</a>
                    <a id="btn-accept-logo" href="#" class="btn btn-primary" data-dismiss="modal">Upload</a>
                </div>
            </div>
        </div>
        </div>

 <%
Class.forName("com.mysql.jdbc.Driver"); //connector
//java.sql.Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/formsubmit","admin","FWv!Bv%}>+ySt[9xaq8"); //connection string for MYSQL instance on localhost/pc
//java.sql.Connection con = DriverManager.getConnection("jdbc:mysql://192.168.0.11:3306/formsubmit","admin","FWv!Bv%}>+ySt[9xaq8"); //connection string for local machine
//java.sql.Connection con = DriverManager.getConnection("jdbc:mysql://192.168.1.9:3306/formsubmit","admin","FWv!Bv%}>+ySt[9xaq8"); //connection string for local machine
//java.sql.Connection con = DriverManager.getConnection("jdbc:mysql://192.168.99.100:3306/formsubmit","root","FWv!Bv%}>+ySt[9xaq8"); //connection string for local docker
java.sql.Connection con = DriverManager.getConnection("jdbc:mysql://"+System.getenv("ICE_MYSQL"),"root","FWv!Bv%}>+ySt[9xaq8"); //connection string for ICE server
Statement st= con.createStatement(); //creates connection string statement
Statement st2= con.createStatement(); //creates connection string statement
ResultSet rs = st.executeQuery("SELECT * FROM formsubmit.users where Username = '"+user+"' AND Password = '"+pass+"';");
boolean emptyRS = false;
if(!rs.next())
{
    emptyRS = true;
}
rs.beforeFirst();
while (rs.next()) {
            String Uid = rs.getString(1);
            String Username = rs.getString(2);
            String Password = rs.getString(3);
            String iName = rs.getString(4);
            String userImage = rs.getString(5);
            %>
            <script>
                var src = "getImage.jsp?imageId="+"<%=userImage%>";
                var srcImage = src.split("/");
                $("#logoPic").attr("src","getImage.jsp?imageId="+srcImage[3]);
            </script>    
            <%
            
            ResultSet rs2 = st2.executeQuery("SELECT * FROM formsubmit.form where ID='"+iName+"' AND Link ='';");
            while (rs2.next()) {
            String Uid2 = rs2.getString(1);
            String id = rs2.getString(2);
            String lName = rs2.getString(3);
            String iName2 = rs2.getString(4);
            String desc = rs2.getString(5);
            String pic = rs2.getString(6);
            if(pic.compareTo("No file")!=0)
            {
            String[] picPath = pic.split("/");
            //pic = picPath[picPath.length -3]+"/" + picPath[picPath.length -2]+"/" + picPath[picPath.length -1]; // get: Resources/pictures/filename
            pic = picPath[picPath.length - 1]; //Just picture name
            }
            else
            {
            //pic =  "resources/pictures/1 (1).png";
              pic =  "1 (1).png";
            }
            String link = rs2.getString(8);
            String connector = rs2.getString(7);
            String displayLink = "";
            if(connector.compareTo("No Connector")!=0)
            {
            displayLink = "Link to Data Source";
            }
            String dataType = rs2.getString(9);
            
   %>
   
                <div class="col-xs-4">
                <div class="well">
                    <img class="thumbnail img-responsive " alt="Bootstrap template" style="height:320px; display:block; margin:auto;" src="getImage.jsp?imageId=<%=pic%>">
                    <p class="text-center"><a href="trialBackend.jsp?name=<%= iName2 %>&id=<%= iName2%>&topLevel=&uname=<%=user%>"><%= iName2 %></a></p>
                    <p class="text-center"><%=desc%> </p>
                     </div>
                </div>
   <% }}%>
               
                <script>
                $("#OpenData").click((function(){
                    //window.location.href='BackendIndex.html?uname='+$("#uname").val()+'&pass='+$("#pass").val();
                    window.location.href='BackendIndex.html?uname=<%=user%>&pass=<%=pass%>';
                 }));
                 
                  $('#testButton').click(function () {
                    $('#modal-content').modal({
                        show: true
                    });
                });
                </script>

             </div>
    </body>
</html>
