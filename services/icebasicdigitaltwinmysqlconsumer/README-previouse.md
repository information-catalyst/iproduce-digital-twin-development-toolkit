The iceDashboard project exposes the Analytic and Visualisation functionality of ice Data Platform.  
The project exposes a number of endpoints to retrieve the data and push it to the underlying datawarehouse for persistent storage.

-------------------------------------------------------------------------------------------------
index.html is the main JS based dashboard with all operational widgets and tabs
-----------------------------------------------------------------------------------------

index2.html is the java based dashboard, with RangeFinder graph but without tabs
index3.html is the java based dashboard with RangeFinder and Tom's graph but without tabs

To run the project on local docker execute the following on terminal
@FOR /f "tokens=*" %i IN ('docker-machine env default') DO %i
mvn clean install docker:build & docker run -it -p 8033:8080 usmanwajid/dashboard:1.1

 
 
To run the project on docker execute the following commands on terminal
1- @FOR /f "tokens=*" %i IN ('docker-machine env default') DO %i
	//if you have made changes in the code the go to #2, 3, 4, 5 - otherwise go to #6
2- docker login
	//increment the version number
3- docker push usmanwajid/dashboard:1.1
    //Run Locally - on PC:
4- docker run -d -p 8033:8080 usmanwajid/dashboard:1.1
	//Run On Server:
5- docker pull usmanwajid/dashboard:1.1
    //run the docker container on specific port i.e. 8033
6a- docker run -d -e "HOST_IP=192.168.0.7:3306" -p 8033:8080 --name ice usmanwajid/dashboard:1.1
6b- docker run -d -p 8033:8080 usmanwajid/dashboard:1.1

In the above command use -d to run service deamon
In the above command use -it for development on local host


My SQL on server details:
mysql -u admin -p
Pass: adminmysql

//new docker create -v C:/Users/mitch/Documents/iceDashboard/WebContent/resources/pictures --name data_container ubuntu
//new docker run -d -p 8033:8080 --volumes-from data_container usmanwajid/dashboard:1.1
>>>>>>> 57a779ff1a5e0a61bd08dc31b76a315f16979c61

