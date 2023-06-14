# ICE Basic Digital Twin
The docker setup for the first digital twin project ICE produced.

## Table of content
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Running the Digital Twin](#running-the-digital-twin)
    - [Adding processes](#adding-process)


## Getting Started

### Prerequisites
Make sure you have installed all of the following prerequisites:

* Docker - [Install Docker](https://docs.docker.com/get-docker/) 
* Docker Compose - [Install Docker Compose](https://docs.docker.com/compose/install/) 

### Running the Digital Twin
This section provides information on how to set up the local deployment using Docker.

Clone the Repository
`$ git clone https://icemain2.hopto.org:4443/digitaltwin/basicdigitaltwin/icebasicdigitaltwin.git`

Go to the cloned directory and start/run the docker-compose file. 
`$ docker-compose up`
The above command will take a few minutes to run, depending on the resources available.

Check `docker-compose.yml` to find Port mappings.
* [http://localhost:7080/flatzoom.html](http://localhost:7080/flatzoom.html) - Four panel demo page
* [http://localhost:7063/](http://localhost:7063/) - Kafka web dashboard

### Adding processes
At the moment, processes are not getting added automatically. You have to add them manually. We use [BaseX](https://basex.org/) XML database to store all the processes. 

* BaseX documentation - [https://docs.basex.org/wiki/Main_Page](https://docs.basex.org/wiki/Main_Page) 
* BaseX REST API documentation - [https://docs.basex.org/wiki/REST](https://docs.basex.org/wiki/REST) 

Bellow [Curl](https://curl.se/) command-line tool  is used to send the HTTP requests. You can use [postman](https://www.postman.com/) also.

Create the database `Factory_Processes` using rest APIs.

>BaseX Username: admin
>BaseX Password: admin

```curl -X POST \
  http://localhost:8984/rest \
  -H 'authorization: Basic YWRtaW46YWRtaW4=' \
  -H 'cache-control: no-cache' \
  -H 'content-type: text/xml' \
  -d '<commands>
  <create-db name='\''Factory_Processes'\''/>
  <info-db/>
</commands>'
```

Store the process in the database

>You can find a sample process in `/processes` directory

```curl -X PUT \
  http://localhost:8984/rest/Factory_Processes/<process-name> \
  -H 'authorization: Basic YWRtaW46YWRtaW4=' \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/xml' \
  -d '<xml body>'
```

Now reload the main page or go to this URL: [http://localhost:7080/flatzoom.html](http://localhost:7080/flatzoom.html)
Bottom of the page, you can see a dropdown with all the available processes. You can select one and click on start.

> If there is no process available or if the animation doesn't work when you click on start, check if you are running the [icebasicdigitaltwinanimator](https://git.icelab.cloud/digitaltwin/basicdigitaltwin/icebasicdigitaltwinanimator) project. If not, you have to start that project, and then the process should appear.
