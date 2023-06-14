<%-- 
    Document   : upload
    Created on : 01-Nov-2016, 10:48:41
    Author     : mitch
    Purpose    : Saves the picture in a local directory, no database connection here
--%>
<%@ page import="java.io.*,java.sql.*,java.util.zip.*" %>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
    </head>
    <body>
        
        
<!--        DATA IS SENT TO THIS FILE LIKE SO:
        var myFormData = new FormData();
        myFormData.append('image', $('input[type=file]')[i].files[0]);    
         $.ajax({
         url: 'upload.jsp',
         type: 'POST',
         processData: false, // important
         contentType: false, // important
         data: myFormData,
         
            success: function(msg) {
                //alert("Success:  " +msg);
            },
            error: function(request,error){
                //alert("Request"+ request+" Error:  "+error);
            }});-->
        
        <%
String saveFile="";
String contentType = request.getContentType();
if((contentType != null)&&(contentType.indexOf("multipart/form-data") >= 0)){
DataInputStream in = new DataInputStream(request.getInputStream()); //input stream
int formDataLength = request.getContentLength();
out.println("Form Data Length: " +formDataLength);
byte dataBytes[] = new byte[formDataLength];
int byteRead = 0;
int totalBytesRead = 0;
while(totalBytesRead < formDataLength){
byteRead = in.read(dataBytes, totalBytesRead,formDataLength);
totalBytesRead += byteRead;
}
String file = new String(dataBytes,"CP1256");
saveFile = file.substring(file.indexOf("filename=\"") + 10);
out.println("Save File: " +saveFile);
saveFile = saveFile.substring(0, saveFile.indexOf("\n"));
out.println("Save File: " +saveFile);
saveFile = saveFile.substring(saveFile.lastIndexOf("\\") + 1,saveFile.indexOf("\""));
out.println("Save File: " +saveFile);
int lastIndex = contentType.lastIndexOf("=");
String boundary = contentType.substring(lastIndex + 1,contentType.length());
int pos;
pos = file.indexOf("filename=\"");
pos = file.indexOf("\n", pos) + 1;
pos = file.indexOf("\n", pos) + 1;
pos = file.indexOf("\n", pos) + 1;
int boundaryLocation = file.indexOf(boundary, pos) - 4;
int startPos = ((file.substring(0, pos)).getBytes("CP1256")).length;
int endPos = ((file.substring(0, boundaryLocation)).getBytes("CP1256")).length;
//File ff = new File("C:/Users/mitch/Documents/iceDashboard/WebContent/resources/pictures/"+saveFile);
File ff = new File("/ice/images/"+saveFile);
FileOutputStream fileOut = new FileOutputStream(ff);
fileOut.write(dataBytes, startPos, (endPos - startPos));
fileOut.flush();
fileOut.close();
}
%>
You have successfully uploaded the file.
<%out.println(saveFile);%>

        
    </body>
</html>
