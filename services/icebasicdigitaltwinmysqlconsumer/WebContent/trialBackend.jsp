  <%-- 
    Document   : trialBackend
    Created on : 24-Nov-2016, 15:23:56
    Author     : mitch
--%>

<%@page contentType="text/html" pageEncoding="windows-1252"%>
<!DOCTYPE html>
<html>
	<head>
                <%@ page import="java.io.*,java.util.*,java.sql.*"%>
                <%@ page import="javax.servlet.http.*,javax.servlet.*" %>
                <%@ page import="java.util.Properties"%>
                <%@ page import="org.apache.commons.codec.binary.Base64"%>
                 <%@ page import="org.apache.commons.io.FileUtils"%>
                 
                
		<link rel="stylesheet" href="css/bootstrap.min.css" />
		<link rel="stylesheet" href="css/Forms.css" />
		<script src="js/jquery-3.2.1.min.js"></script>
		<script src="js/bootstrap.min.js"></script>
		<script src="js/trialForms.js"></script>
		<title>ICE Data Platform</title>
                <style>
                .img-wrap {
    position: relative;
}
.img-wrap .close {
    position: absolute;
    top: 2px;
    right: 2px;
    z-index: 100;
}    

.edit {
    position: absolute;
    top: 2px;
    right: 30px;
    z-index: 100;
}

.edit:hover {
    cursor: pointer;
    font-weight: bold;
}

                    
                 </style>
                
	</head>
	<body>
<div style=" position: absolute; top: 0px; right: 0px;">
    <img src="resources/ice.png"/>
</div>
		<div id="main" class="container" >
                    
                           <%
         String parent = request.getParameter("name");
         parent.replaceAll("%20", " ");
         String hierarchy = request.getParameter("topLevel") + parent + " > ";
         String[] parts = hierarchy.split(">");
         String[] links = new String[parts.length];
         links[0] = "";
         String DBID = request.getParameter("id");
         DBID.replaceAll("%20", "");
         String uname = request.getParameter("uname");
         %>    
         <div class="page-header"> 
<!--             <div id="logoPic" class="col-xs-2"> <img class="thumbnail img-responsive" alt="Bootstrap template" src="getImage.jsp?imageId=WP_20161130_12_36_59_Pro.jpg"> </div>-->
              <div class="icon-img col-xs-2 col-xs-offset-4">
                                    <input class="nav-buttons" id="OpenData" type="button" value='Add Another Instance'/>
		</div>
         <h1><%=parent%> Data Sources <br></h1> 
             
              <%
         for(int i = 1; i < parts.length; i++)//Changed from parts.length -1 for testing
         {
                 links[i]= links[i-1] + parts[i-1] ;
                 links[i] = links[i].replaceAll("\\s","");
                 links[i] += ">";
                 //out.println("links"+i+": "+links[i]);
           if(i<parts.length-1)
           {
            %>   
            <small style="font-size:140%;"><a href="trialBackend.jsp?name=<%=parts[i-1]%>&id=<%=DBID%>&uname=<%=uname%>&topLevel=<%=links[i-1]%>"><%=parts[i-1]%></a> > </small>     
            <%
            }
         }
         %>
</div>

<script>
     function iframeLoaded(iFrameName) {
      var iFrameID = document.getElementById(iFrameName);
      if(iFrameID) {
            // here you can make the height, I delete it first, then I make it again
            iFrameID.height = "";
            iFrameID.height = iFrameID.contentWindow.document.body.scrollHeight + "px";
            iFrameID.width = "";
            iFrameID.width = iFrameID.contentWindow.document.body.scrollWidth + "px";
      }   
  }
    </script>

 <%
Class.forName("com.mysql.jdbc.Driver"); //connector
//java.sql.Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/formsubmit","admin","FWv!Bv%}>+ySt[9xaq8"); //connection string for MYSQL instance on localhost/pc
//java.sql.Connection con = DriverManager.getConnection("jdbc:mysql://192.168.0.11:3306/formsubmit","admin","FWv!Bv%}>+ySt[9xaq8"); //connection string for local machine
//java.sql.Connection con = DriverManager.getConnection("jdbc:mysql://192.168.1.9:3306/formsubmit","admin","FWv!Bv%}>+ySt[9xaq8"); //connection string for local machine
//java.sql.Connection con = DriverManager.getConnection("jdbc:mysql://192.168.99.100:3306/formsubmit","root","FWv!Bv%}>+ySt[9xaq8"); //connection string for local docker
java.sql.Connection con = DriverManager.getConnection("jdbc:mysql://"+System.getenv("ICE_MYSQL"),"root","FWv!Bv%}>+ySt[9xaq8"); //connection string for ICE server
Statement st= con.createStatement(); //creates connection string statement
Statement st2= con.createStatement(); //creates connection string statement
ResultSet rs = st.executeQuery("SELECT * FROM formsubmit.form where id = '"+DBID+"' AND User= '"+uname+"' AND Link = '"+links[links.length-1]+"';");
boolean emptyRS = false;
if(!rs.next())
{
    emptyRS = true;
}
rs.beforeFirst();
while (rs.next()) {
            String Uid = rs.getString(1);
            String id = rs.getString(2);
            String lName = rs.getString(3);
            String iName = rs.getString(4);
            String desc = rs.getString(5);
            String pic = rs.getString(6);
            if(pic.compareTo("No file")!=0)
            {
            String[] picPath = pic.split("/");
            //pic = picPath[picPath.length -3]+"/" + picPath[picPath.length -2]+"/" + picPath[picPath.length -1]; // get: Resources/pictures/filename
            pic = picPath[picPath.length -1]; // get: filename
            }
            else
            {
            pic =  "1 (1).png";
            }
            String pictPath = "getImage.jsp?imageId=" + pic;
            String link = rs.getString(8);
            String connector = rs.getString(7);
            String displayLink = "";
            if(connector.compareTo("No Connector")!=0)
            {
            displayLink = "Link to Data Source";
            }
            String dataType = rs.getString(9);
            String user = rs.getString(10);
            String imageMap = rs.getString(11);
            String linkChild = hierarchy + iName+">"; //This section checks to see if current element has any children and if it does displays a link to children
            linkChild = linkChild.replaceAll("\\s","");
            ResultSet checkChildren = st2.executeQuery("SELECT * FROM formsubmit.form where id = '"+DBID+"' AND Link = '"+linkChild+"';");
            boolean isEmpty = ! checkChildren.first();

            if(dataType.compareTo("heat")==0)
            {
               %>
               <iframe src="<%=connector%>" id="1" onload="iframeLoaded(1)"><%=displayLink%></iframe>
               <%
            }
            else{
   %>
   
            <div class="col-md-4">
                <div class="well">
                    
                    <div class="img-wrap">
                        <span class="edit">Edit</span>
                        <p class="hidden"><%=Uid%>,<%=id%>,<%=lName%>,<%=iName%>,<%=desc%>,<%=pic%>,<%=connector%>,<%=link%>,<%=dataType%>,<%=user%>></p>
                    </div>
                    
                    <div class="img-wrap">
                        <span class="close">&times;</span>
                        <p class="hidden"><%=id%>,<%=iName%>,<%=link%><%=iName%>></p>
                    </div>
                
                    <img class="thumbnail img-responsive" alt="Bootstrap template" src="<%=pictPath%>">
                    
                    <%
                       if(!isEmpty)
                       {
                     %>
                    <p class="text-center"><a href="trialBackend.jsp?name=<%= iName %>&id=<%=DBID%>&topLevel=<%=hierarchy%>&uname=<%=uname%>"><%= iName %></a></p>
                    <%
                        }
                    %>
                    <%
String str=request.getRequestURL()+"?";
Enumeration<String> paramNames = request.getParameterNames();
while (paramNames.hasMoreElements())
{
    String paramName = paramNames.nextElement();
    String[] paramValues = request.getParameterValues(paramName);
    for (int i = 0; i < paramValues.length; i++) 
    {
        String paramValue = paramValues[i];
        str=str + paramName + "=" + paramValue;
    }
    str=str+"&";
}
 str = str.substring(0, str.length()-1);
                      if(isEmpty)  
                      {
                    %>
                     <p class="text-center"><%= iName %></p>
                     <%
                     }
                     %>
                     <p class="text-center"><%=desc%><br></p>
                     <%
                     if(dataType.compareTo("rest")==0)
                     { 
                     if(id.compareTo("C2K")==0)
                     {
                     %>
                    <p class="text-center"><a href="FEDataMiner.html?title=<%= iName %>&url=<%=connector%>&id=<%=DBID%>&hierarchy=<%=hierarchy%>&backLink=<%=str%>&time=Hour&db=test&collection=rangedData"><%=displayLink%></a></p>
                    <%
                    }
                    if(id.compareTo("Fagor")==0)
                     {
                     %>
                    <p class="text-center"><a href="FEDataMiner.html?title=<%= iName %>&url=<%=connector%>&id=<%=DBID%>&hierarchy=<%=hierarchy%>&backLink=<%=str%>&time=Hour&db=factory&collection=fagormachinedata"><%=displayLink%></a></p>
                    <%
                    }
                     if(id.compareTo("Tenneco")==0)
                     {
                     %>
                    <p class="text-center"><a href="FEDataMiner.html?title=<%= iName %>&url=<%=connector%>&id=<%=DBID%>&hierarchy=<%=hierarchy%>&backLink=<%=str%>&time=Hour&db=crema&collection=rangedData"><%=displayLink%></a></p>
                    <%
                    }
                    if(id.compareToIgnoreCase("ICE")==0)
                    {
                    %>
                    <p class="text-center"><a href="FELiveGraph.html?title=<%= iName %>&url=<%=connector%>&id=<%=DBID%>&hierarchy=<%=hierarchy%>&backLink=<%=str%>&time=Hour&db=ice&collection=robocrane"><%=displayLink%></a></p>
                    <%
                    }
                    }
                    if(dataType.compareTo("jdbc")==0)
                     {
                    %>
                    <p class="text-center"><a href="databaseSensor.jsp?title=<%= iName %>&id=<%=DBID%>&hierarchy=<%=hierarchy%>&backLink=<%=str%>&db=<%=connector%>"><%=displayLink%></a></p>
                    <%
                    }
                     if(dataType.compareTo("direct")==0)
                     { 
                     %>
                    <p class="text-center"><a href="<%=connector%>"><%=displayLink%></a></p>
                    <%
                    }
                    if(imageMap.compareTo("true")==0)
                    {
                    %>
                     <p class="text-center"><a href="<%=connector%>">Link to Image Map</a></p>
                    <%
                    }   
                    %>
                </div>
            </div>
   <% }}%>
	
   
        <%
        if(emptyRS)
        {
            %>
            <script>
               $("#fields").removeClass("hidden");
               //$("#OpenData").attr("value","Close New Instance");
//               $('#modal-content').modal({show: true});
           </script>
    <%
        }
    %>
        
             
        <div class="col-xs-12">
        <p> &nbsp </p>
<p> &nbsp </p>
<p class="text-center">
    ICE Data Platform<br>
    <a href="www.informationcatalyst.com" target="_blank">www.informationcatalyst.com</a><br>
    2017
</p>
        </div>
                </div>
    
    <div class="row modal fade" id="modal-content">
        <div class ="center-block well hidden modal-dialog" id="fields">  
            <h3 id="modalHeader">Add a New Instance to </h3>
            <div class="controls" id="profs"> <br>
                <p id="updateBool" class="hidden">False</p>
                <form id="upload-logo" method="post" action="login.jsp" enctype="multipart/form-data">
                    <div id="field"><input autocomplete="off" class="input form-control" id="field2" name="prof2" type="text" placeholder="Instance Name" data-items="8"/></div>
                    <div id="field"><input autocomplete="off" class="input form-control" id="field3" name="prof3" type="text" placeholder="Description" data-items="8"/></div><br>
                    <label id="label4" for="field4">Select a logo:</label><input type="file" class="file" id="field4" name="prof4"/><button id="upload-button" type="submit" class="btn btn-default" style="display:none">Upload</button><br>
                    <div id="field5" /hidden><input autocomplete="off" class="input form-control" id="field5" name="conn5" type="text" placeholder="Connector(If applicable)" data-items="8"></div>
                    <div id="field6">
                        <p id="field6text">Select type of data </p><input type="radio" name="prof6" id="f6" value="none" checked="checked" /><label>None</label>
                        <input type="radio" name="prof6" id="f7" value="jdbc"/><label>Database(JDBC)</label>
                        <input type="radio" name="prof6" id="f8" value="rest"/><label>URL(REST)</label>
                        <input type="radio" name="prof6" id="f9" value="direct"/><label>Direct Link</label>
                        <input type="radio" name="prof6" id="f10" value="heat"/><label>Heat Map</label>
                    </div>
                </form>
                <input id="SubmitData" class="nav-buttons" style="width:80px; height:30px" type="button" value='Submit'/>
            <br>
            </div>
        </div>	
    </div>
    
	</body>
</html>

