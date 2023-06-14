# ICE Basic Digital Twin Mysql Consumer
The iceDashboard project exposes the Analytic and Visualisation functionality of ice Data Platform.The project exposes a number of endpoints to retrieve the data and push it to the underlying data warehouse for persistent storage

## Table of Content
- [ICE Basic Digital Twin Mysql Consumer](#ice-basic-digital-twin-mysql-consumer)
  - [Table of Content](#table-of-content)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Project Configurations](#project-configurations)
    - [Maven Build](#maven-build)
    - [Docker](#docker)



## Getting Started
### Prerequisites
Make sure you have installed and started all of the following prerequisites:

- Java - [Install Java](https://www.oracle.com/java/technologies/javase-downloads.html)
-  Maven - [Install Maven](https://maven.apache.org/download.cgi)
- Docker -  [Install Docker](https://docs.docker.com/get-docker/)
- Docker Compose - [Install docker compose file](https://docs.docker.com/compose/install/)
- ICEBasicDigitalTwin  - [Run the docker compose file](https://git.icelab.cloud/digitaltwin/basicdigitaltwin/icebasicdigitaltwin)

### Project Configurations
1. MYSQL database configurations - src\com\main\MySQL.java
2. KAFKA_MYSQL env variable - kafkamysql:3306/factory  (Check the host name in the docker compose file)

### Maven Build
Once you have configured your project in your [IDE](https://www.lagomframework.com/documentation/1.6.x/java/EclipseMavenInt.html) you can build it from there. However if you prefer you can use maven from the command line.

1. Make sure to be in the root directory
2. Run the comman `mvn clean install` to build the project. This will delete the target folder and then run the install command to build the war file
3. You can then copy the `./target/factory.war` file to a server such as tomcat

### Docker
Build the Docker image using the source code in the working directory:

-  Run `docker build -t <tag> .`


Once the project is up and runing go to this page - `http://localhost:7073/factory/StatusPage.html` and click on the 3 buttons

1. Start Processing Readings
2. Consume BPMNDATA topic
3. Consume COMMANDS topic