# ICEBasicDigitalTwinProcessEngine

A back-end Process Engine that sends the BPMN file to the Process Engine when the user clicks start from the web page. 

Project Description: A back-end Process Engine that sends the BPMN file to the Process Engine when the user clicks start from the web page. The engine then gets the tasks from that process and put’s them into a simple data format. The engine sends a Kafka message to start the first task, then waits for a done message on the same Kafka topic before moving on to the next task. (copied from the documentation document given to me by Mitch)
Repo URL: https://icemain2.hopto.org:4443/mitchhanks/KafkaSpringProcessEngine.git