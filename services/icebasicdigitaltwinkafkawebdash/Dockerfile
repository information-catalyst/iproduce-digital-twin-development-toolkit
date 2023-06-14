# Kafka and Zookeeper Image
# Kafka version 0.10.0.0 
FROM nginx:latest

COPY ./public-html /3DModelMaster
COPY ./site.conf /etc/nginx/conf.d/default.conf

# Define working directory.
WORKDIR /etc/nginx


# Expose ports.
EXPOSE 80
#EXPOSE 443

# Define default command. "-g daemon off" causes nginx to foreground to keep container alive
CMD ["nginx", "-g", "daemon off;"]
