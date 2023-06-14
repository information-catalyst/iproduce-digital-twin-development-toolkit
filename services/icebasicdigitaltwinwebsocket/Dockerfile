FROM openjdk:10-jre-slim

#RUN apt-get update && apt-get install -y maven

#RUN apt-get install -y ca-certificates-java && update-ca-certificates -f

ADD ./target /opt/kafka-websocket
ADD ./conf /opt/kafka-websocket/conf

WORKDIR /opt/kafka-websocket

#compiled and packaged it in the host for now. (Failed to read artifact descriptor for org.apache.maven.plugins:maven-source-plugin:jar:2.4) this is i think incompetible maven versions to the JDK7
#RUN mvn clean package -e

CMD java -jar kafka-websocket-0.8.2-SNAPSHOT-shaded.jar
