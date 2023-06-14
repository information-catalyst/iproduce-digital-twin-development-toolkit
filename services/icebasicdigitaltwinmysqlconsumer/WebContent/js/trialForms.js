var count; //Count number of fields
var max; //Number of questions
var questionWidth; //Get questions width of div

$(document).ready(function (e) {
	//global vars
	var next = 6; //number of fields, resets to 6
	count = 1; //set coutn to 1
	var level = 1; // Level starts at 1 
	var headings = []; //Stack of elements for the tree
        var notVisitedHeadings = []; //stack of unvisited elements for the tree
	var startBool = true; //bool for start used to see when at finish
	var output = ""; //string which holds insert statementa
	var levelAmount = []; //array which for each level holds the amount of elements in the level which is used for displaying the correct hierarchy
	levelAmount[0]= 0;
	levelAmount[1]=1;
        var id= 0; //id for database
        var hierarchy = "";
	max = jQuery("div.question").length; //Number of questions
        questionWidth = jQuery("div.question").first().width(); //Get questions width of div
        
         $('#profs').on('click', 'input', function() {
        var type = $(this).val();
        var id = $(this).parent().attr('id');
        var num = 0;
        var num = id.split("field")[1];
        if(type == "none")
        {
            $("#field"+(num-1)).hide();
            $("#"+id+"text").show();
        }
        if(type == "jdbc")
        {
            $("#field"+(num-1)+"").show();
            $("input[name=conn"+(num-1)+"]").attr("placeholder", "jdbc:mysql://IP:Port/Database,User,Pass");
            $("#"+id+"text").hide();
        }
        if(type == "rest")
        {
             $("#field"+(num-1)+"").show();
            $("input[name=conn"+(num-1)+"]").attr("placeholder", "Format = http://IP:PORT");
            $("#"+id+"text").hide();
        }
        if(type == "direct")
        {
             $("#field"+(num-1)+"").show();
            $("input[name=conn"+(num-1)+"]").attr("placeholder", "Format = http://google.co.uk");
            $("#"+id+"text").hide();
        }
         if(type == "heat")
        {
            $("#field"+(num-1)+"").show();
            $("input[name=conn"+(num-1)+"]").attr("placeholder", "Format = http://google.co.uk");
            $("#"+id+"text").hide();
        }
         });
         
         $("#OpenData").click(function()
         {
             if($("#fields").hasClass("hidden"))
             {
                 //$("#OpenData").attr("value","Close New Instance");
                  $("#fields").removeClass("hidden"); 
             }
//             else{
//                 $("#OpenData").attr("value","Add Another Instance");
//                 $("#fields").addClass("hidden"); 
//             }
//             $('#modal-content').modal({
//            show: true
//        });
           
         });
        
                    //Delete Instance
        $(".close").click(function(){
            if(window.confirm("Are you sure you want to delete this instance and all of it's children?"))
            {
           var values = $(this).parent().children(".hidden").text();
           //0 = id  1= instance name 2= link
           var vals = values.split(",");
                   var statement = "DELETE FROM formsubmit.form WHERE id='"+vals[0]+"' AND Instance_Name ='"+vals[1]+"';";
                  //  alert(statement);
                    $.ajax({
                    url: 'insertData.jsp',
                    type: 'POST',
                    data: {"data" : statement},
                      success: function(msg) {
                //alert("Success:  " +msg);
            },
            error: function(request,error){
                //alert("Error:  "+error);
                }});
            
                    var statement = "DELETE FROM formsubmit.form WHERE id='"+vals[0]+"' AND link LIKE '"+vals[2]+"%';";
                    // alert(statement);
                    $.ajax({
                    url: 'insertData.jsp',
                    type: 'POST',
                    data: {"data" : statement},
                      success: function(msg) {
                //alert("Success:  " +msg);
            },
            error: function(request,error){
                //alert("Error:  "+error);
                }});
            location.reload();
        }
        });  
        
            //Edit button
          $(".edit").click(function(){
            
           var values = $(this).parent().children(".hidden").text();
           //0 = Uid  1=id  2=level   3=instance name  4=description  5=pic  6=connector  7=link  8=dataType  9=user
           var vals = values.split(",");
             if($("#fields").hasClass("hidden"))
             {
                  $("#fields").removeClass("hidden"); 
             }
          $("#field2").val(vals[3]);
          $("#field2").prop('readonly', true);
          $("#field3").val(vals[4]);
         
          if(vals[8]=="jdbc")
          {
              $("#f7").attr("checked","checked");
              $("#field5").show();
              $("input[name=conn5").val(vals[6]);
          }
          if(vals[8]=="rest")
          {
              $("#f8").attr("checked","checked");
              $("#field5").show();
              $("input[name=conn5").val(vals[6]);
          }
             $("#updateBool").text("True");
             $('#modal-content').modal({
            show: true
        });
        $("#modalHeader").text("Edit "+vals[3]);
           
        });
        
                var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

  var uname = getUrlParameter('uname'); 
  var pass = getUrlParameter('pass'); 
  
          $('#btn-accept-logo').on('click',(function(e) {
         e.preventDefault();
  
         var myFormData = new FormData();
         myFormData.append('image', $('input[type=file]')[0].files[0]);
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
                //alert("Error:  "+error);
            }});
        var splitPic = $('input[type=file]').val().split("\\");
        var picPath = "/ice/images/"+splitPic[2];
        var output ="UPDATE formsubmit.users SET Pic='"+picPath+"' WHERE Username='"+uname+"' AND Password='"+pass+"';"
    
            $.ajax({
         url: 'insertData.jsp',
         type: 'POST',
         data: {"data" : output},
         
            success: function(msg) {
                //alert("Success:  " +msg);
            },
            error: function(request,error){
                //alert("Error:  "+error);
            }});
      }));
        
        
      $('#upload-logo').on('submit',(function(e) {
        e.preventDefault();
        //var myFormData = new FormData(this);
        
        var i =0;
        for(var j = 5;j<next;j=j+5)
        {
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
                //alert("Error:  "+error);
            }});
        i++;
    }
      }));
      

        //Adds the name parameter to the add another instance box
      $("#modalHeader").text("Add a New Instance to "+getUrlParameter('name'));
      
	
		//SubmitData button
	    $("#SubmitData").click(function(){
                
  
     var id = getUrlParameter('id');           
		    //Collect field data	
			var i = 6;
				if($("#field2").val() != "")
				{
                             //"INSERT INTO form (id,Level_Name,Instance_Name,Description,Picture,Link) VALUES ('2','test','test','test','test','test')"
                                if($("#updateBool").text()=="True")
                                {
                                var connector = $("input[name=conn5]").val();
                                  if(connector != "")
                                    {          
                                       if( $('input[name=prof6]:checked').val() == "none")
                                       {
                                           connector = "No Connector"
                                       }
                                    }
                                    else
                                    {
                                        connector = "No Connector";
                                    }
                                    var filePath = $("#field4").val().split('\\'); //Change file path to location from fakepath

                                    if(filePath != "")
                                    {
                                    var file = "/ice/images/"+filePath[2];
                                    }
                                    else
                                    {
                                        file = "No file";
                                    }
                                output += "UPDATE formsubmit.form SET Connector='"+connector + "', Picture='"+ file+"', Description='"+$("#field3").val()+"', Type='"+$('input[name=prof6]:checked').val()+"' WHERE id='"+id+"' AND Instance_Name='"+$("#field2").val()+"'";
                                $("#updateBool").text("False");
                                $("#modalHeader").text("Add a New Instance to "+getUrlParameter('name'));
                                }
                                    else
                                    {
                                    output += "INSERT INTO form (id,Level_Name,Instance_Name,Description,Picture,Connector,Link,Type,User) VALUES ('"; 
                                    output += id +"','"; //id
                                    output += $("#field1").val() +"','"; //level name
                                    output +=  $("#field"+(i-4)).val() +"','"; //instance name
                                    output += $("#field"+(i-3)).val() +"','"; //description
                                    var filePath = $("#field"+(i-2)).val().split('\\'); //Change file path to location from fakepath

                                    if(filePath != "")
                                    {
                                    filePath[1] = "/resources/pictures/";
                                    output +=  filePath[1] + filePath[2] +"','"; //file upload path - Removed filePath[0]
                                    }
                                    else{
                                        output += "No file','";
                                    }
                                    var connector = $("input[name=conn"+(i-1)+"]").val();
                                    if(connector != "")
                                    {         
                                        if( $('input[name=prof6]:checked').val() == "none")
                                       {
                                           connector = "No Connector"
                                       }
                                       else{
                                    output +=  connector+"','";
                                           }
                                    }
                                    else{
                                        connector = "No Connector";
                                        output += "No Connector','";
                                    }
                                    var str = getUrlParameter('topLevel').replace(/\s/g, '')+getUrlParameter('name').replace(/\s/g, '')+">";
                                    output +=  str +"','"; //link
                                    output += $('input[name=prof'+i+']:checked').val()+"','"; //make dynamic based on rest/jdbc etc
                                    output += getUrlParameter('uname')+"');";
                                    }//end else
                                }//end if
			
                        
                   //Upload data to DB
                   if($("#field2").val() != "")
		    $("#upload-logo").submit;

                    //Send string of Insert statement to login.jsp Page to go into database
                    $.ajax({
                    type: "post",
                    url: "insertData.jsp",
                    data: {"data" : output},
                    success: function(msg) {
                        //alert(msg);
                    },
                    error: function(request,error){
                        //alert(error);
                    }
                    }); 
                    
         //Upload new image
         var myFormData = new FormData();
         myFormData.append('image', $('input[type=file]')[0].files[0]);
         $.ajax({
         url: 'upload.jsp',
         type: 'POST',
         processData: false, // important
         contentType: false, // important
         data: myFormData,
         
            success: function(msg) {
                //refresh page
                location.reload();
                  //Reset Fields
		   $("#field2").val("");
		   $("#field2").placeholder="Instance Name";
		   $("#field3").val("");
		   $("#field3").placeholder="Description";
		   $("#field4").val("");
		   $("#field4").placeholder="Image";
                   $("#field5").val("");
		   $("#field5").placeholder="Connector(If applicable)";
                   $("#f6").prop("checked", true);
            },
            error: function(request,error){
                  //refresh page
                //location.reload();
                  //Reset Fields
		   $("#field2").val("");
		   $("#field2").placeholder="Instance Name";
		   $("#field3").val("");
		   $("#field3").placeholder="Description";
		   $("#field4").val("");
		   $("#field4").placeholder="Image";
                   $("#field5").val("");
		   $("#field5").placeholder="Connector(If applicable)";
                   $("#f6").prop("checked", true);
            }});
     
        });
});