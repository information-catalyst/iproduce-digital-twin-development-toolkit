FROM tomcat:9.0.8-jre10


COPY tomcat-users.xml /usr/local/tomcat/conf/tomcat-users.xml
#COPY server.xml /usr/local/tomcat/conf/server.xml
COPY context.xml /usr/local/tomcat/webapps/manager/META-INF/context.xml
COPY target/factory.war /usr/local/tomcat/webapps/factory.war
COPY setenv.sh /usr/local/tomcat/bin/setenv.sh

ENV MALLOC_ARENA_MAX=2
ENV CATALINA_OPTS: "Xmx10000m -XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap"

#Added 'jpda' option for debugging purposes
CMD ["catalina.sh", "jpda", "run"]

#Usual tomcat port
EXPOSE 8080