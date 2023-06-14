# Simple Java Framework for Kafka message handling
Simple  framework for a CLI JAR to consume and produce Kafka messages  

##Create   
Visit       
https://start.spring.io/
Create a new maven spring boot project that includes kafka

Bring in the Java Classes from this project
Update the pom.xml to include
~~~
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
    </dependency>
~~~

Update the tests as the default tests will fail due to not running in a Docker network with Kafka  



##Build    
Project my build inside an IDE, but to run you will need to access a bash shell
~~~
mvn clean install 
~~~

Or VIA docker terminal:

mvn clean install docker:build

This will create a JAR file in the folder ~target~  

##Run    

You could just run the JAR
~~~
java -jar <jar-file-name> 
~~~

BUT this will FAIL being on the same Docker network as the Kafka cluster  
So...  
~~~
./docker-run.sh
~~~

This will do 
* Docker stop of any running instance
* Docker build to incorporate changes
* Docker run of the created image attaching to the Kafka Docker Network



##References

###Quick project builder   
https://start.spring.io/#


https://www.baeldung.com/deployable-fat-jar-spring-boot

https://www.baeldung.com/spring-kafka

https://www.codenotfound.com/spring-kafka-consumer-producer-example.html


###Dockerise     
https://thepracticaldeveloper.com/2017/12/11/dockerize-spring-boot/

###JSON deserialisation try using   
https://www.baeldung.com/jackson-deserialization
Also
https://www.baeldung.com/jackson-deserialization


###Consume Restful webservice    
https://spring.io/guides/gs/consuming-rest/


