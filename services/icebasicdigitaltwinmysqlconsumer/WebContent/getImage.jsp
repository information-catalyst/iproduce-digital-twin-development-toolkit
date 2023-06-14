<%-- 
    Document   : getImage
    Created on : 20-Jan-2017, 17:06:26
    Author     : mitch
--%>

<%@page contentType="text/html" pageEncoding="windows-1252"%>
<!DOCTYPE html>
<html>
    <head>
        <%@page import="java.io.File, org.apache.commons.codec.binary.Base64,org.apache.commons.io.FileUtils, java.io.IOException, java.nio.file.Files"%>
       
        <meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
        <title>JSP Page</title>
    </head>
    <body>
        <%
String imageId = request.getParameter("imageId");
String imageType = "";
if (imageId.length() > 3) {
  imageType =  imageId.substring(imageId.length() - 3);
}
else {
  throw new IllegalArgumentException("word has less than 3 characters!");
}

File f = new File("/ice/images/"+imageId);
//File f = new File("C:\\Users\\mitch\\Pictures\\icePie\\"+imageId);
//out.println(f.isFile());
try{
//byte[] pictureBytes = Base64.encodeBase64(FileUtils.readFileToByteArray(f));
byte[] pictureBytes = Files.readAllBytes(f.toPath());
out.println(pictureBytes.toString());
if(imageType.equals("jpg"))
{
response.setContentType("image/jpeg");
}
if(imageType.equals("png"))
{
   response.setContentType("image/png"); 
}
if(imageType.equals("gif"))
{
   response.setContentType("image/gif"); 
}
response.setContentLength(pictureBytes.length); // imageBytes - image in bytes
response.getOutputStream().write(pictureBytes);
response.getOutputStream().flush();
response.getOutputStream().close();
}
catch (IOException e) {
    System.err.println("Caught IOException: " + e.getMessage());
    out.println("error");
}   
            
     %>
    </body>
</html>
