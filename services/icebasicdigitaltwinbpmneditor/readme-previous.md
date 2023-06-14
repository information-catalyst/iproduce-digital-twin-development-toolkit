## CREMA Process Designer (a.k.a PDE) v0.2.1

### Overview
PDE is a web application based on BpmnJS Library, written in TypeScript and AngularJS, leveraging component based arquitecture.

## Installation instructions
* Clone this repository
* Run 'npm install'
* Run 'npm run start'
* Enjoy :+1:

## Deployment to kafka cluster
* From shell - npm run prod
* From the Docker prompt - ./docker-build.sh
* Push it to Docker hub - docker push informationcatalyst/kafkapde
* Assuming on icemain - /home/admin/kafkanetworklite/ docker pull informationcatalyst/kafkapde
* Stop pde image on kafka cluster - ./kafka-cluster.sh stop kafkapde
* Start pde image on kafka cluster - ./kafka-cluster.sh up kafkapde


## Upgrade instructions (after we publish a new release)
* Run 'npm install'
* If you get any critical error, just delete node_modules folder and run 'npm install' again
* Run 'npm run start'
* Enjoy :+1:

## Install/Upgrade node
You will need NodeJS to run PDE.
For Windows users, just download the MSI installer and run, from https://nodejs.org/en/download/, the process is the same if you're upgrading
Check version installed by running on a command prompt:
node -v

## Configure endpoints
You can setup the desired endpoints for PDE, if you edit the file src/config.ts
For example, if you want to setup the connection to DHS, just replace
`DHS_ENDPOINT: "",`
with
`DHS_ENDPOINT: "http://address_to_dhs"`

## Known endpoints
*CRI*   `https://clip.ascora.eu:8443`
*DLP*   `http://icemain.hopto.org:8041`
*DHS*   `http://icemain.hopto.org:8042`
*MPM*   `https://mpm-backend.crema-project.eu`
*ODERU* `https://oderu.crema-project.eu`
