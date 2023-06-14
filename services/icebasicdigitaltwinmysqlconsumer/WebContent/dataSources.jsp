
<!DOCTYPE html>
<html>
<head>
<%@ page import="java.io.*,java.util.*,java.sql.*"%>
<%@ page import="javax.servlet.http.*,javax.servlet.*" %>

 <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>ICE Data Platform</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css" />
    <link rel="stylesheet" type="text/css" href="css/font-awesome.min.css" />

    <script type="text/javascript" src="js/jquery-3.2.1.min.js"></script>
    <script type="text/javascript" src="js/bootstrap.min.js"></script>
    
    <link rel="shortcut icon" href="resources/ice.png">
</head>
<body>
    <div style=" position: absolute; top: 0px; right: 0px;">
    <img src="resources/ice.png"/>
</div>
    <div class="container">
        
        <%
         String parent = request.getParameter("name"); 
         parent.replaceAll("%20", " ");
         String hierarchy = request.getParameter("topLevel") + parent + " > "; 
         String[] parts = hierarchy.split(">");
         String[] links = new String[parts.length];
         links[0] = "";
         String DBID = request.getParameter("id");
         DBID.replaceAll("%20", "");
         %>    
         <div class="page-header">
         <h1><%=parent%> Data Sources <br></h1> <small style=font-size:140%;> <a href="index.html">Map</a> </small>
              
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
            <small style="font-size:140%;"> < <a href="dataSources.jsp?name=<%=parts[i-1]%>&id=<%=DBID%>&topLevel=<%=links[i-1]%>"><%=parts[i-1]%></a></small>     
            <%
            }
         }
         %>
</div>
<!-- Gallery - START -->
<div class="container">
    <div class="row">
        
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
//java.sql.Connection con = DriverManager.getConnection("jdbc:mysql://192.168.99.100:3306/formsubmit","root","FWv!Bv%}>+ySt[9xaq8"); //connection string for local docker
//java.sql.Connection con = DriverManager.getConnection("jdbc:mysql://192.168.0.11:3306/formsubmit","admin","FWv!Bv%}>+ySt[9xaq8"); //connection string for local machine mine
//java.sql.Connection con = DriverManager.getConnection("jdbc:mysql://192.168.1.9:3306/formsubmit","admin","FWv!Bv%}>+ySt[9xaq8"); //connection string for local machine zara
java.sql.Connection con = DriverManager.getConnection("jdbc:mysql://"+System.getenv("ICE_MYSQL"),"root","FWv!Bv%}>+ySt[9xaq8"); //connection string for ICE server
Statement st= con.createStatement(); //creates connection string statement
Statement st2= con.createStatement(); //creates connection string statement
ResultSet rs = st.executeQuery("SELECT * FROM formsubmit.form where id = '"+DBID+"' AND Link = '"+links[links.length-1]+"';");
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
            pic = picPath[picPath.length -1]; // get: Filename
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
            String imageMap = rs.getString(11);
            String linkChild = hierarchy + iName+">"; //This section checks to see if current element has any children and if it does displays a link to children
            linkChild = linkChild.replaceAll("\\s","");
            ResultSet checkChildren = st2.executeQuery("SELECT * FROM formsubmit.form where id = '"+DBID+"' AND Link = '"+linkChild+"';");
            boolean isEmpty = ! checkChildren.first();
            
   %>
   
            <div class="col-md-4">
                <div class="well" style="height:400px;">
                    <img class="thumbnail" alt="Bootstrap template" height="240" width="320" src="<%=pictPath%>">	
                    <%
                       if(!isEmpty)
                       {
                     %>
                    <p class="text-center"><a href="dataSources.jsp?name=<%= iName %>&id=<%=DBID%>&topLevel=<%=hierarchy%>"><%= iName %></a></p>
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
   <% }%>
        </div> <!-- row - END -->
    </div><!-- container - END -->
</div><!-- Gallery - END -->

<p> &nbsp </p>
<p> &nbsp </p>
<p class="text-center">
    ICE Data Platform<br>
    <a href="www.informationcatalyst.com" target="_blank">www.informationcatalyst.com</a><br>
    2017
</p>
</body>
</html>
