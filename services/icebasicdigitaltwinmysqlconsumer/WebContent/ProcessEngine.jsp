<%-- 
    Document   : ProcessEngine
    Created on : 7 Aug 2018, 17:09:55
    Author     : mitch
--%>

<%@page import="java.io.BufferedReader"%>
<%@page import="java.io.InputStreamReader"%>
<%@page import="java.net.HttpURLConnection"%>
<%@page import="java.net.URL"%>
<%@page import="org.codehaus.jettison.json.JSONException"%>
<%@page import="org.codehaus.jettison.json.JSONObject"%>
<%@page import="java.util.Collections"%>
<%@page import="java.util.Random"%>
<%@page import="org.w3c.dom.Document"%>
<%@page import="org.w3c.dom.Node"%>
<%@page import="org.w3c.dom.NodeList"%>
<%@page import="org.xml.sax.InputSource"%>
<%@page import="java.util.ArrayList"%>
<%@page import="java.io.File"%>
<%@page import="javax.xml.parsers.DocumentBuilderFactory"%>
<%@page import="javax.xml.parsers.DocumentBuilder"%>
<%@page import="org.apache.kafka.clients.consumer.ConsumerConfig"%>
<%@page import="org.apache.kafka.clients.consumer.ConsumerRecord"%>
<%@page import="org.apache.kafka.clients.consumer.ConsumerRecords"%>
<%@page import="org.apache.kafka.clients.consumer.KafkaConsumer"%>
<%@page import="org.apache.kafka.clients.producer.KafkaProducer"%>
<%@page import="org.apache.kafka.clients.producer.ProducerConfig"%>
<%@page import="org.apache.kafka.clients.producer.ProducerRecord"%>
<%@page import="org.apache.kafka.common.errors.WakeupException"%>
<%@page import="org.apache.kafka.common.serialization.LongSerializer"%>
<%@page import="org.apache.kafka.common.serialization.StringSerializer"%>
<%@page import="java.util.Properties"%>
<%@page import="java.util.Date"%>


<%@page contentType="text/html" pageEncoding="windows-1252"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
        <title>JSP Page</title>
    </head>
    <body>
        <%
        
        //initiate consumer
        Properties consumerConfig = new Properties();
        consumerConfig.put("bootstrap.servers",System.getenv("KAFKA_NETWORK"));
        consumerConfig.put("group.id", "my-gghgdfdgfgfffffhghgh");
        consumerConfig.put("auto.offset.reset","latest");
        consumerConfig.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.ByteArrayDeserializer");
        consumerConfig.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.ByteArrayDeserializer");
        KafkaConsumer<byte[], byte[]> consumer = new KafkaConsumer(consumerConfig);
        
        Properties consumerConfig2 = new Properties();
        consumerConfig2.put("bootstrap.servers",System.getenv("KAFKA_NETWORK"));
        consumerConfig2.put("group.id", "my-ggg6666gh");
        consumerConfig2.put("auto.offset.reset","latest");
        consumerConfig2.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.ByteArrayDeserializer");
        consumerConfig2.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.ByteArrayDeserializer");
        
        KafkaConsumer<byte[], byte[]> consumer2 = new KafkaConsumer(consumerConfig2);
        
        //Initiate Producer
        KafkaProducer producer;
        String BOOTSTRAP_SERVERS = System.getenv("KAFKA_NETWORK");
        Properties props = new Properties();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG,BOOTSTRAP_SERVERS);
        props.put(ProducerConfig.CLIENT_ID_CONFIG, "ProcessEngine");
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG,LongSerializer.class.getName());
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,StringSerializer.class.getName());
        producer =  new KafkaProducer(props);
        
        File fXmlFile = new File("webapps/factory/resources/4_process_test.bpmn");
        //File fXmlFile = new File("webapps/factory/resources/"+bpmn+".bpmn");
        DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
        Document doc = dBuilder.parse(fXmlFile);
        
        NodeList sequences = doc.getElementsByTagName("bpmn:sequenceFlow");
        out.print(sequences);
        ArrayList<String> sources = new ArrayList<String>();
        ArrayList<String> targets = new ArrayList<String>();
        ArrayList<String> tasksOrdered = new ArrayList<String>();
        String nextTask = "";
        
        for(int i =0; i < sequences.getLength(); i++)
        {
            Node n = sequences.item(i);
            String source = n.getAttributes().getNamedItem("sourceRef").getTextContent();
            String target = n.getAttributes().getNamedItem("targetRef").getTextContent();
            sources.add(source);
            targets.add(target);
            if(source.contains("StartEvent"))
            {
                tasksOrdered.add(sources.get(i));
                nextTask = target;
                System.out.println(nextTask);
            }
        }
        
        boolean run = true;
        while(run)
        {
            for(int i =0; i < sources.size(); i++)
            {
                System.out.println("nextTask: "+nextTask+" sources:"+sources.get(i));
                if(sources.get(i).compareTo(nextTask)==0 || nextTask.contains("EndEvent")) //Added || nextTask.contains("EndEvent")
                {
                    tasksOrdered.add(sources.get(i));
                    nextTask = targets.get(i);
                    System.out.println(nextTask);
                    if(tasksOrdered.contains(nextTask) || targets.get(i).contains("EndEvent"))
                    {
                        tasksOrdered.add(targets.get(i));
                        System.out.println(tasksOrdered);
                        run = false;
                        break;
                    }
                }
            }
        }
        
        
        consumer.subscribe(Collections.singletonList("execution"));
        boolean forever = true;
        while (forever) 
            {
                ConsumerRecords<byte[], byte[]> docus = consumer.poll(1000000);
                for (ConsumerRecord<byte[], byte[]> docu : docus)
                {
 
                    String s = new String(docu.value());
                    System.out.println("Process engine 125: "+s);
                    JSONObject valueObj = new JSONObject(s);
                    if(valueObj.has("commands"))
                    {
                        String commands = valueObj.getString("commands");
                        if(commands.compareTo("start")==0)
                        {
                                                
                    
                            //NEW

                            String base = "http://basexhttp:8984/rest/Factory_Processes/";
                            String process = valueObj.getString("process");
                            URL url = new URL(base + process+".xml");

                             // Establish the connection to the URL
                            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                            
                            // Print the HTTP response code
                            int code = conn.getResponseCode();
                            System.out.println("\n* HTTP response: " + code +
                                " (" + conn.getResponseMessage() + ')');

                            // Check if request was successful
                            if(code == HttpURLConnection.HTTP_OK) {
                              // Print the received result to standard output
                              System.out.println("\n* Result:");
                              
                              // Get and cache input as UTF-8 encoded stream
                              try{
                                  BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
                                    // Print all lines of the result
                                    String lines = "";
                                    String line = "";
                                    boolean linesleft = true;
                                    while(linesleft)
                                    {
                                      if((line = br.readLine()) != null)
                                      {
                                        lines += line;
                                      }
                                      else{
                                          break;
                                      }
                                    }
                              }
                              catch (Exception e) {
                             System.out.println("Exception - " + e.getMessage());
                              }
                              
                            }
                              
                              // Close connection
                              conn.disconnect();
                              
                                dbFactory = DocumentBuilderFactory.newInstance();
                                dBuilder = dbFactory.newDocumentBuilder();
                                doc = dBuilder.parse(fXmlFile);

                                sequences = doc.getElementsByTagName("bpmn:sequenceFlow");
                                out.print(sequences);
                                sources = new ArrayList<String>();
                                targets = new ArrayList<String>();
                                tasksOrdered = new ArrayList<String>();
                                nextTask = "";

                                for(int i =0; i < sequences.getLength(); i++)
                                {
                                    Node n = sequences.item(i);
                                    String source = n.getAttributes().getNamedItem("sourceRef").getTextContent();
                                    String target = n.getAttributes().getNamedItem("targetRef").getTextContent();
                                    sources.add(source);
                                    targets.add(target);
                                    if(source.contains("StartEvent"))
                                    {
                                        tasksOrdered.add(sources.get(i));
                                        nextTask = target;
                                        System.out.println(nextTask);
                                    }
                                }

                                run = true;
                                while(run)
                                {
                                    for(int i =0; i < sources.size(); i++)
                                    {
                                        System.out.println("nextTask: "+nextTask+" sources:"+sources.get(i));
                                        if(sources.get(i).compareTo(nextTask)==0 || nextTask.contains("EndEvent")) //Added || nextTask.contains("EndEvent")
                                        {
                                            tasksOrdered.add(sources.get(i));
                                            nextTask = targets.get(i);
                                            System.out.println(nextTask);
                                            if(tasksOrdered.contains(nextTask) || targets.get(i).contains("EndEvent"))
                                            {
                                                tasksOrdered.add(targets.get(i));
                                                System.out.println(tasksOrdered);
                                                run = false;
                                                break;
                                            }
                                        }
                                    }
                                }
                            


                            //NEW END
                            
                            
                            int count = 1;
                            run = true;
                            Random rn = new Random();
                            int processid = rn.nextInt((99999) + 1);
                            while(run)
                            {
                                System.out.println("While: line 145");
                                String TOPIC = "commands";
                                Date d = new Date();
                                ProducerRecord<Long, String> pRecord;
                                if(count == 1)
                                {
                                    String BPMNJSON = "{\"source\": \"PDE\","+
                                    //"\"rawxml\": \"<?xml version=\\\"1.0\\\" encoding=\\\"UTF-8\\\"?>\\n<bpmn:definitions xmlns:bpmn=\\\"http://www.omg.org/spec/BPMN/20100524/MODEL\\\" xmlns:bpmndi=\\\"http://www.omg.org/spec/BPMN/20100524/DI\\\" xmlns:di=\\\"http://www.omg.org/spec/DD/20100524/DI\\\" xmlns:dc=\\\"http://www.omg.org/spec/DD/20100524/DC\\\" xmlns:xsi=\\\"http://www.w3.org/2001/XMLSchema-instance\\\" xmlns:crema=\\\"http://crema.project.eu\\\" id=\\\"Definitions_1\\\" targetNamespace=\\\"http://bpmn.io/schema/bpmn\\\">\\n  <bpmn:process id=\\\"Process_1\\\" isExecutable=\\\"true\\\">\\n    <bpmn:startEvent id=\\\"StartEvent_1\\\">\\n      <bpmn:outgoing>SequenceFlow_0lljdyg</bpmn:outgoing>\\n    </bpmn:startEvent>\\n    <bpmn:task id=\\\"Task_crane1_MoveToWarehouse\\\" name=\\\"crane1_MoveToWarehouse\\\">\\n      <bpmn:incoming>SequenceFlow_0lljdyg</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_08aw6n8</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:task id=\\\"Task_drill_runMotor\\\" name=\\\"drill_runMotor\\\">\\n      <bpmn:incoming>SequenceFlow_19zr5c0</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_06hht0q</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:task id=\\\"Task_crane1_PickupWhite\\\" name=\\\"crane1_PickupWhite\\\">\\n      <bpmn:incoming>SequenceFlow_08aw6n8</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_0k407en</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:task id=\\\"Task_crane1_MoveToOven\\\" name=\\\"crane1_MoveToOven\\\">\\n      <bpmn:incoming>SequenceFlow_0k407en</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_1n2mqvu</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:task id=\\\"Task_crane1_Drop\\\" name=\\\"crane1_Drop\\\">\\n      <bpmn:incoming>SequenceFlow_1n2mqvu</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_19oa0rw</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:task id=\\\"Task_crane1_Reset\\\" name=\\\"crane1_Reset\\\">\\n      <bpmn:incoming>SequenceFlow_19oa0rw</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_19zr5c0</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_08aw6n8\\\" sourceRef=\\\"Task_crane1_MoveToWarehouse\\\" targetRef=\\\"Task_crane1_PickupWhite\\\" />\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_0k407en\\\" sourceRef=\\\"Task_crane1_PickupWhite\\\" targetRef=\\\"Task_crane1_MoveToOven\\\" />\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_19oa0rw\\\" sourceRef=\\\"Task_crane1_Drop\\\" targetRef=\\\"Task_crane1_Reset\\\" />\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_0lljdyg\\\" sourceRef=\\\"StartEvent_1\\\" targetRef=\\\"Task_crane1_MoveToWarehouse\\\" />\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_19zr5c0\\\" sourceRef=\\\"Task_crane1_Reset\\\" targetRef=\\\"Task_drill_runMotor\\\" />\\n    <bpmn:task id=\\\"Task_oven_Cooking\\\" name=\\\"oven_Cooking\\\">\\n      <bpmn:incoming>SequenceFlow_06hht0q</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_0i7xu22</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:task id=\\\"Task_oven_MoveToOven\\\" name=\\\"oven_MoveToOven\\\">\\n      <bpmn:incoming>SequenceFlow_0i7xu22</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_002azj9</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:task id=\\\"Task_oven_PickupCounter\\\" name=\\\"oven_PickupCounter\\\">\\n      <bpmn:incoming>SequenceFlow_002azj9</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_17zrg6t</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:task id=\\\"Task_oven_MoveToDrilling\\\" name=\\\"oven_MoveToDrilling\\\">\\n      <bpmn:incoming>SequenceFlow_17zrg6t</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_0dw3s52</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:task id=\\\"Task_oven_Drop\\\" name=\\\"oven_Drop\\\">\\n      <bpmn:incoming>SequenceFlow_0dw3s52</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_18qbel2</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_0i7xu22\\\" sourceRef=\\\"Task_oven_Cooking\\\" targetRef=\\\"Task_oven_MoveToOven\\\" />\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_002azj9\\\" sourceRef=\\\"Task_oven_MoveToOven\\\" targetRef=\\\"Task_oven_PickupCounter\\\" />\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_17zrg6t\\\" sourceRef=\\\"Task_oven_PickupCounter\\\" targetRef=\\\"Task_oven_MoveToDrilling\\\" />\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_0dw3s52\\\" sourceRef=\\\"Task_oven_MoveToDrilling\\\" targetRef=\\\"Task_oven_Drop\\\" />\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_06hht0q\\\" sourceRef=\\\"Task_drill_runMotor\\\" targetRef=\\\"Task_oven_Cooking\\\" />\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_1n2mqvu\\\" sourceRef=\\\"Task_crane1_MoveToOven\\\" targetRef=\\\"Task_crane1_Drop\\\" />\\n    <bpmn:task id=\\\"Task_drill_stopMotor\\\" name=\\\"drill_stopMotor\\\">\\n      <bpmn:incoming>SequenceFlow_18qbel2</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_1vdreba</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:task id=\\\"Task_drill_drillCounter\\\" name=\\\"drill_drillCounter\\\">\\n      <bpmn:incoming>SequenceFlow_0wnvr0y</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_160tqi0</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:task id=\\\"Task_drill_moveToConveyor\\\" name=\\\"drill_moveToConveyor\\\">\\n      <bpmn:incoming>SequenceFlow_160tqi0</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_0rp0wwr</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:task id=\\\"Task_drill_deposit\\\" name=\\\"drill_deposit\\\">\\n      <bpmn:incoming>SequenceFlow_0rp0wwr</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_0qffdjt</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:task id=\\\"Task_drill_runConveyor\\\" name=\\\"drill_runConveyor\\\">\\n      <bpmn:incoming>SequenceFlow_0qffdjt</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_09qb9bk</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:task id=\\\"Task_drill_Reset\\\" name=\\\"drill_Reset\\\">\\n      <bpmn:incoming>SequenceFlow_09qb9bk</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_1p499jv</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_160tqi0\\\" sourceRef=\\\"Task_drill_drillCounter\\\" targetRef=\\\"Task_drill_moveToConveyor\\\" />\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_0rp0wwr\\\" sourceRef=\\\"Task_drill_moveToConveyor\\\" targetRef=\\\"Task_drill_deposit\\\" />\\n    <bpmn:task id=\\\"Task_drill_moveToDrill\\\" name=\\\"drill_moveToDrill\\\">\\n      <bpmn:incoming>SequenceFlow_1vdreba</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_0wnvr0y</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_09qb9bk\\\" sourceRef=\\\"Task_drill_runConveyor\\\" targetRef=\\\"Task_drill_Reset\\\" />\\n    <bpmn:task id=\\\"Task_conveyor_Waiting\\\" name=\\\"conveyor_Waiting\\\">\\n      <bpmn:incoming>SequenceFlow_1p499jv</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_0l06lth</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_0l06lth\\\" sourceRef=\\\"Task_conveyor_Waiting\\\" targetRef=\\\"Task_conveyor_Sort\\\" />\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_18qbel2\\\" sourceRef=\\\"Task_oven_Drop\\\" targetRef=\\\"Task_drill_stopMotor\\\" />\\n    <bpmn:task id=\\\"Task_conveyor_Sort\\\" name=\\\"conveyor_Sort\\\">\\n      <bpmn:incoming>SequenceFlow_0l06lth</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_0a01mzy</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:task id=\\\"Task_crane1_Move2\\\" name=\\\"crane1_Move2\\\">\\n      <bpmn:incoming>SequenceFlow_0a01mzy</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_0g3jeww</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:task id=\\\"Task_crane1_Pickup2\\\" name=\\\"crane1_Pickup2\\\">\\n      <bpmn:incoming>SequenceFlow_0g3jeww</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_11s6vfl</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:task id=\\\"Task_crane1_MoveToCar\\\" name=\\\"crane1_MoveToCar\\\">\\n      <bpmn:incoming>SequenceFlow_11s6vfl</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_0554eb7</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:task id=\\\"Task_crane1_Drop2\\\" name=\\\"crane1_Drop2\\\">\\n      <bpmn:incoming>SequenceFlow_0554eb7</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_09sgueu</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_0a01mzy\\\" sourceRef=\\\"Task_conveyor_Sort\\\" targetRef=\\\"Task_crane1_Move2\\\" />\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_0g3jeww\\\" sourceRef=\\\"Task_crane1_Move2\\\" targetRef=\\\"Task_crane1_Pickup2\\\" />\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_11s6vfl\\\" sourceRef=\\\"Task_crane1_Pickup2\\\" targetRef=\\\"Task_crane1_MoveToCar\\\" />\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_0554eb7\\\" sourceRef=\\\"Task_crane1_MoveToCar\\\" targetRef=\\\"Task_crane1_Drop2\\\" />\\n    <bpmn:task id=\\\"Task_crane1_Reset2\\\" name=\\\"crane1_Reset2\\\">\\n      <bpmn:incoming>SequenceFlow_09sgueu</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_1rukyl0</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:task id=\\\"Task_car_Forward10\\\" name=\\\"car_Forward10\\\">\\n      <bpmn:incoming>SequenceFlow_1rukyl0</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_0cuk62y</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_0cuk62y\\\" sourceRef=\\\"Task_car_Forward10\\\" targetRef=\\\"Task_crane_MoveToRover\\\" />\\n    <bpmn:task id=\\\"Task_conveyora_WaitingAState\\\" name=\\\"conveyora_WaitingAState\\\">\\n      <bpmn:incoming>SequenceFlow_0rpv0e9</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_0yol2um</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:task id=\\\"Task_conveyora_StartBeltA1\\\" name=\\\"conveyora_StartBeltA1\\\">\\n      <bpmn:incoming>SequenceFlow_0yol2um</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_1g5p6ng</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:task id=\\\"Task_conveyora_ResetAState\\\" name=\\\"conveyora_ResetAState\\\">\\n      <bpmn:incoming>SequenceFlow_0dj92k2</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_1630xqb</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:task id=\\\"Task_conveyora_PushAState\\\" name=\\\"conveyora_PushAState\\\">\\n      <bpmn:incoming>SequenceFlow_1g5p6ng</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_0dj92k2</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:task id=\\\"Task_conveyora_StartBeltA2\\\" name=\\\"conveyora_StartBeltA2\\\">\\n      <bpmn:incoming>SequenceFlow_1630xqb</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_19wg8uh</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:task id=\\\"Task_conveyora_ToolAState\\\" name=\\\"conveyora_ToolAState\\\">\\n      <bpmn:incoming>SequenceFlow_19wg8uh</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_0yyv6yx</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:task id=\\\"Task_conveyora_SlowBeltA2\\\" name=\\\"conveyora_SlowBeltA2\\\">\\n      <bpmn:incoming>SequenceFlow_0yyv6yx</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_14854da</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:task id=\\\"Task_conveyorb_StartBeltB1\\\" name=\\\"conveyorb_StartBeltB1\\\">\\n      <bpmn:incoming>SequenceFlow_14854da</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_0bi061m</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:task id=\\\"Task_conveyorb_StopBeltA2\\\" name=\\\"conveyorb_StopBeltA2\\\">\\n      <bpmn:incoming>SequenceFlow_0bi061m</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_16gl4qk</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:task id=\\\"Task_conveyorb_Push\\\" name=\\\"conveyorb_Push\\\">\\n      <bpmn:incoming>SequenceFlow_16gl4qk</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_0qcbp5f</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:task id=\\\"Task_conveyorb_ResetBState\\\" name=\\\"conveyorb_ResetBState\\\">\\n      <bpmn:incoming>SequenceFlow_0qcbp5f</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_0ylwv72</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:task id=\\\"Task_conveyorb_StartBeltB2\\\" name=\\\"conveyorb_StartBeltB2\\\">\\n      <bpmn:incoming>SequenceFlow_0ylwv72</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_0q0r7oi</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:task id=\\\"Task_crane_MoveToRover\\\" name=\\\"crane_MoveToRover\\\">\\n      <bpmn:incoming>SequenceFlow_0cuk62y</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_0aks0rq</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:task id=\\\"Task_crane_PickupWhiteState\\\" name=\\\"crane_PickupWhiteState\\\">\\n      <bpmn:incoming>SequenceFlow_0aks0rq</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_16xorvx</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:task id=\\\"Task_crane_MoveToConveyor\\\" name=\\\"crane_MoveToConveyor\\\">\\n      <bpmn:incoming>SequenceFlow_16xorvx</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_1gd69h9</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:task id=\\\"Task_crane_DropState\\\" name=\\\"crane_DropState\\\">\\n      <bpmn:incoming>SequenceFlow_1gd69h9</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_0w4vcvx</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:task id=\\\"Task_crane_ResetState\\\" name=\\\"crane_ResetState\\\">\\n      <bpmn:incoming>SequenceFlow_0w4vcvx</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_0rpv0e9</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_0yol2um\\\" sourceRef=\\\"Task_conveyora_WaitingAState\\\" targetRef=\\\"Task_conveyora_StartBeltA1\\\" />\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_1630xqb\\\" sourceRef=\\\"Task_conveyora_ResetAState\\\" targetRef=\\\"Task_conveyora_StartBeltA2\\\" />\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_14854da\\\" sourceRef=\\\"Task_conveyora_SlowBeltA2\\\" targetRef=\\\"Task_conveyorb_StartBeltB1\\\" />\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_0bi061m\\\" sourceRef=\\\"Task_conveyorb_StartBeltB1\\\" targetRef=\\\"Task_conveyorb_StopBeltA2\\\" />\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_16gl4qk\\\" sourceRef=\\\"Task_conveyorb_StopBeltA2\\\" targetRef=\\\"Task_conveyorb_Push\\\" />\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_0qcbp5f\\\" sourceRef=\\\"Task_conveyorb_Push\\\" targetRef=\\\"Task_conveyorb_ResetBState\\\" />\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_0ylwv72\\\" sourceRef=\\\"Task_conveyorb_ResetBState\\\" targetRef=\\\"Task_conveyorb_StartBeltB2\\\" />\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_0aks0rq\\\" sourceRef=\\\"Task_crane_MoveToRover\\\" targetRef=\\\"Task_crane_PickupWhiteState\\\" />\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_16xorvx\\\" sourceRef=\\\"Task_crane_PickupWhiteState\\\" targetRef=\\\"Task_crane_MoveToConveyor\\\" />\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_0w4vcvx\\\" sourceRef=\\\"Task_crane_DropState\\\" targetRef=\\\"Task_crane_ResetState\\\" />\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_1vdreba\\\" sourceRef=\\\"Task_drill_stopMotor\\\" targetRef=\\\"Task_drill_moveToDrill\\\" />\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_0wnvr0y\\\" sourceRef=\\\"Task_drill_moveToDrill\\\" targetRef=\\\"Task_drill_drillCounter\\\" />\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_1gd69h9\\\" sourceRef=\\\"Task_crane_MoveToConveyor\\\" targetRef=\\\"Task_crane_DropState\\\" />\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_0rpv0e9\\\" sourceRef=\\\"Task_crane_ResetState\\\" targetRef=\\\"Task_conveyora_WaitingAState\\\" />\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_1g5p6ng\\\" sourceRef=\\\"Task_conveyora_StartBeltA1\\\" targetRef=\\\"Task_conveyora_PushAState\\\" />\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_0dj92k2\\\" sourceRef=\\\"Task_conveyora_PushAState\\\" targetRef=\\\"Task_conveyora_ResetAState\\\" />\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_19wg8uh\\\" sourceRef=\\\"Task_conveyora_StartBeltA2\\\" targetRef=\\\"Task_conveyora_ToolAState\\\" />\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_0yyv6yx\\\" sourceRef=\\\"Task_conveyora_ToolAState\\\" targetRef=\\\"Task_conveyora_SlowBeltA2\\\" />\\n    <bpmn:endEvent id=\\\"EndEvent_1y0xbns\\\">\\n      <bpmn:incoming>SequenceFlow_0q0r7oi</bpmn:incoming>\\n    </bpmn:endEvent>\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_0q0r7oi\\\" sourceRef=\\\"Task_conveyorb_StartBeltB2\\\" targetRef=\\\"EndEvent_1y0xbns\\\" />\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_1p499jv\\\" sourceRef=\\\"Task_drill_Reset\\\" targetRef=\\\"Task_conveyor_Waiting\\\" />\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_09sgueu\\\" sourceRef=\\\"Task_crane1_Drop2\\\" targetRef=\\\"Task_crane1_Reset2\\\" />\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_0qffdjt\\\" sourceRef=\\\"Task_drill_deposit\\\" targetRef=\\\"Task_drill_runConveyor\\\" />\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_1rukyl0\\\" sourceRef=\\\"Task_crane1_Reset2\\\" targetRef=\\\"Task_car_Forward10\\\" />\\n  </bpmn:process>\\n  <bpmndi:BPMNDiagram id=\\\"BPMNDiagram_1\\\">\\n    <bpmndi:BPMNPlane id=\\\"BPMNPlane_1\\\" bpmnElement=\\\"Process_1\\\">\\n      <bpmndi:BPMNShape id=\\\"_BPMNShape_StartEvent_2\\\" bpmnElement=\\\"StartEvent_1\\\">\\n        <dc:Bounds x=\\\"165\\\" y=\\\"114\\\" width=\\\"36\\\" height=\\\"36\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"138\\\" y=\\\"150\\\" width=\\\"90\\\" height=\\\"20\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_1jhxhdi_di\\\" bpmnElement=\\\"Task_crane1_MoveToWarehouse\\\">\\n        <dc:Bounds x=\\\"299\\\" y=\\\"92\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_0wg9ztu_di\\\" bpmnElement=\\\"Task_drill_runMotor\\\">\\n        <dc:Bounds x=\\\"156\\\" y=\\\"310\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_1lcm22k_di\\\" bpmnElement=\\\"Task_crane1_PickupWhite\\\">\\n        <dc:Bounds x=\\\"492\\\" y=\\\"92\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_0ms81lm_di\\\" bpmnElement=\\\"Task_crane1_MoveToOven\\\">\\n        <dc:Bounds x=\\\"677\\\" y=\\\"92\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_0baw16z_di\\\" bpmnElement=\\\"Task_crane1_Drop\\\">\\n        <dc:Bounds x=\\\"889\\\" y=\\\"92\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_1pnm531_di\\\" bpmnElement=\\\"Task_crane1_Reset\\\">\\n        <dc:Bounds x=\\\"1120\\\" y=\\\"92\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_08aw6n8_di\\\" bpmnElement=\\\"SequenceFlow_08aw6n8\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"399\\\" y=\\\"132\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"492\\\" y=\\\"132\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"357\\\" y=\\\"111\\\" width=\\\"90\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_0k407en_di\\\" bpmnElement=\\\"SequenceFlow_0k407en\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"592\\\" y=\\\"132\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"629\\\" y=\\\"132\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"629\\\" y=\\\"132\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"677\\\" y=\\\"132\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"599\\\" y=\\\"125.5\\\" width=\\\"90\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_19oa0rw_di\\\" bpmnElement=\\\"SequenceFlow_19oa0rw\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"989\\\" y=\\\"132\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"1120\\\" y=\\\"132\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"1009.5\\\" y=\\\"110.5\\\" width=\\\"90\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_0lljdyg_di\\\" bpmnElement=\\\"SequenceFlow_0lljdyg\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"201\\\" y=\\\"132\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"299\\\" y=\\\"132\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"205\\\" y=\\\"110\\\" width=\\\"90\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_19zr5c0_di\\\" bpmnElement=\\\"SequenceFlow_19zr5c0\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"1120\\\" y=\\\"162\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"997\\\" y=\\\"237\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"414\\\" y=\\\"237\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"256\\\" y=\\\"323\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"660.5\\\" y=\\\"215.5\\\" width=\\\"90\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNShape id=\\\"Task_1q7v4z1_di\\\" bpmnElement=\\\"Task_oven_Cooking\\\">\\n        <dc:Bounds x=\\\"355\\\" y=\\\"310\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_0l3f3v3_di\\\" bpmnElement=\\\"Task_oven_MoveToOven\\\">\\n        <dc:Bounds x=\\\"533\\\" y=\\\"310\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_15098hs_di\\\" bpmnElement=\\\"Task_oven_PickupCounter\\\">\\n        <dc:Bounds x=\\\"703\\\" y=\\\"310\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_0yczre3_di\\\" bpmnElement=\\\"Task_oven_MoveToDrilling\\\">\\n        <dc:Bounds x=\\\"875\\\" y=\\\"310\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_13aanwj_di\\\" bpmnElement=\\\"Task_oven_Drop\\\">\\n        <dc:Bounds x=\\\"1066\\\" y=\\\"310\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_0i7xu22_di\\\" bpmnElement=\\\"SequenceFlow_0i7xu22\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"455\\\" y=\\\"350\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"486\\\" y=\\\"350\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"486\\\" y=\\\"350\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"533\\\" y=\\\"350\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"456\\\" y=\\\"343.5\\\" width=\\\"90\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_002azj9_di\\\" bpmnElement=\\\"SequenceFlow_002azj9\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"633\\\" y=\\\"350\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"703\\\" y=\\\"350\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"623\\\" y=\\\"328.5\\\" width=\\\"90\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_17zrg6t_di\\\" bpmnElement=\\\"SequenceFlow_17zrg6t\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"803\\\" y=\\\"350\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"875\\\" y=\\\"350\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"794\\\" y=\\\"328.5\\\" width=\\\"90\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_0dw3s52_di\\\" bpmnElement=\\\"SequenceFlow_0dw3s52\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"975\\\" y=\\\"350\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"1066\\\" y=\\\"350\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"975.5\\\" y=\\\"328.5\\\" width=\\\"90\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_06hht0q_di\\\" bpmnElement=\\\"SequenceFlow_06hht0q\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"256\\\" y=\\\"350\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"355\\\" y=\\\"350\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"305.5\\\" y=\\\"328\\\" width=\\\"0\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_1n2mqvu_di\\\" bpmnElement=\\\"SequenceFlow_1n2mqvu\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"777\\\" y=\\\"132\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"828\\\" y=\\\"132\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"828\\\" y=\\\"132\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"889\\\" y=\\\"132\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"798\\\" y=\\\"125.5\\\" width=\\\"90\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNShape id=\\\"Task_0qevrqq_di\\\" bpmnElement=\\\"Task_drill_stopMotor\\\">\\n        <dc:Bounds x=\\\"1258\\\" y=\\\"310\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_0i8udv1_di\\\" bpmnElement=\\\"Task_drill_drillCounter\\\">\\n        <dc:Bounds x=\\\"1066\\\" y=\\\"417\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_0a7brr0_di\\\" bpmnElement=\\\"Task_drill_moveToConveyor\\\">\\n        <dc:Bounds x=\\\"875\\\" y=\\\"417\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_0h4enax_di\\\" bpmnElement=\\\"Task_drill_deposit\\\">\\n        <dc:Bounds x=\\\"703\\\" y=\\\"427\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_1mknm8w_di\\\" bpmnElement=\\\"Task_drill_runConveyor\\\">\\n        <dc:Bounds x=\\\"533\\\" y=\\\"427\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_00nr083_di\\\" bpmnElement=\\\"Task_drill_Reset\\\">\\n        <dc:Bounds x=\\\"355\\\" y=\\\"427\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_160tqi0_di\\\" bpmnElement=\\\"SequenceFlow_160tqi0\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"1066\\\" y=\\\"457\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"975\\\" y=\\\"457\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"975.5\\\" y=\\\"435.5\\\" width=\\\"90\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_0rp0wwr_di\\\" bpmnElement=\\\"SequenceFlow_0rp0wwr\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"875\\\" y=\\\"460\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"803\\\" y=\\\"464\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"794\\\" y=\\\"440.5\\\" width=\\\"90\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNShape id=\\\"Task_04lo618_di\\\" bpmnElement=\\\"Task_drill_moveToDrill\\\">\\n        <dc:Bounds x=\\\"1258\\\" y=\\\"417\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_09qb9bk_di\\\" bpmnElement=\\\"SequenceFlow_09qb9bk\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"533\\\" y=\\\"467\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"455\\\" y=\\\"467\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"449\\\" y=\\\"445.5\\\" width=\\\"90\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNShape id=\\\"Task_1owebmw_di\\\" bpmnElement=\\\"Task_conveyor_Waiting\\\">\\n        <dc:Bounds x=\\\"355\\\" y=\\\"551\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_0l06lth_di\\\" bpmnElement=\\\"SequenceFlow_0l06lth\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"455\\\" y=\\\"591\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"533\\\" y=\\\"591\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"449\\\" y=\\\"569.5\\\" width=\\\"90\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_18qbel2_di\\\" bpmnElement=\\\"SequenceFlow_18qbel2\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"1166\\\" y=\\\"350\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"1258\\\" y=\\\"350\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"1212\\\" y=\\\"328\\\" width=\\\"0\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNShape id=\\\"Task_142wob6_di\\\" bpmnElement=\\\"Task_conveyor_Sort\\\">\\n        <dc:Bounds x=\\\"533\\\" y=\\\"551\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_0gbnkdm_di\\\" bpmnElement=\\\"Task_crane1_Move2\\\">\\n        <dc:Bounds x=\\\"1258\\\" y=\\\"668\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_09foave_di\\\" bpmnElement=\\\"Task_crane1_Pickup2\\\">\\n        <dc:Bounds x=\\\"1066\\\" y=\\\"668\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_1wwit28_di\\\" bpmnElement=\\\"Task_crane1_MoveToCar\\\">\\n        <dc:Bounds x=\\\"875\\\" y=\\\"668\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_0fzo8tk_di\\\" bpmnElement=\\\"Task_crane1_Drop2\\\">\\n        <dc:Bounds x=\\\"703\\\" y=\\\"668\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_0a01mzy_di\\\" bpmnElement=\\\"SequenceFlow_0a01mzy\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"633\\\" y=\\\"595\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"1306\\\" y=\\\"595\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"1307\\\" y=\\\"668\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"924.5\\\" y=\\\"573.5\\\" width=\\\"90\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_0g3jeww_di\\\" bpmnElement=\\\"SequenceFlow_0g3jeww\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"1258\\\" y=\\\"708\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"1166\\\" y=\\\"708\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"1167\\\" y=\\\"686.5\\\" width=\\\"90\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_11s6vfl_di\\\" bpmnElement=\\\"SequenceFlow_11s6vfl\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"1066\\\" y=\\\"708\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"975\\\" y=\\\"708\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"975.5\\\" y=\\\"686.5\\\" width=\\\"90\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_0554eb7_di\\\" bpmnElement=\\\"SequenceFlow_0554eb7\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"875\\\" y=\\\"708\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"845\\\" y=\\\"708\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"845\\\" y=\\\"708\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"803\\\" y=\\\"708\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"815\\\" y=\\\"701.5\\\" width=\\\"90\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNShape id=\\\"Task_00huy26_di\\\" bpmnElement=\\\"Task_crane1_Reset2\\\">\\n        <dc:Bounds x=\\\"533\\\" y=\\\"668\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_1543sz6_di\\\" bpmnElement=\\\"Task_car_Forward10\\\">\\n        <dc:Bounds x=\\\"533\\\" y=\\\"787\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_0cuk62y_di\\\" bpmnElement=\\\"SequenceFlow_0cuk62y\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"583\\\" y=\\\"871\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"583\\\" y=\\\"892\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"389\\\" y=\\\"892\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"389\\\" y=\\\"908\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"441\\\" y=\\\"870.5\\\" width=\\\"90\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNShape id=\\\"Task_0kwgysf_di\\\" bpmnElement=\\\"Task_conveyora_WaitingAState\\\">\\n        <dc:Bounds x=\\\"965\\\" y=\\\"1041\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_1o7s7bn_di\\\" bpmnElement=\\\"Task_conveyora_StartBeltA1\\\">\\n        <dc:Bounds x=\\\"825\\\" y=\\\"1041\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_0jdgth8_di\\\" bpmnElement=\\\"Task_conveyora_ResetAState\\\">\\n        <dc:Bounds x=\\\"517\\\" y=\\\"1041\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_1dan3pp_di\\\" bpmnElement=\\\"Task_conveyora_PushAState\\\">\\n        <dc:Bounds x=\\\"677\\\" y=\\\"1041\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_1me3mps_di\\\" bpmnElement=\\\"Task_conveyora_StartBeltA2\\\">\\n        <dc:Bounds x=\\\"356\\\" y=\\\"1041\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_0d1s4s9_di\\\" bpmnElement=\\\"Task_conveyora_ToolAState\\\">\\n        <dc:Bounds x=\\\"223\\\" y=\\\"1041\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_163x2lb_di\\\" bpmnElement=\\\"Task_conveyora_SlowBeltA2\\\">\\n        <dc:Bounds x=\\\"75\\\" y=\\\"1041\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_151cns7_di\\\" bpmnElement=\\\"Task_conveyorb_StartBeltB1\\\">\\n        <dc:Bounds x=\\\"75\\\" y=\\\"1217\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_0yl60yv_di\\\" bpmnElement=\\\"Task_conveyorb_StopBeltA2\\\">\\n        <dc:Bounds x=\\\"306\\\" y=\\\"1217\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_0qkmuhv_di\\\" bpmnElement=\\\"Task_conveyorb_Push\\\">\\n        <dc:Bounds x=\\\"483\\\" y=\\\"1217\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_12mxjau_di\\\" bpmnElement=\\\"Task_conveyorb_ResetBState\\\">\\n        <dc:Bounds x=\\\"643\\\" y=\\\"1217\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_0zc95m0_di\\\" bpmnElement=\\\"Task_conveyorb_StartBeltB2\\\">\\n        <dc:Bounds x=\\\"845\\\" y=\\\"1217\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_0jt26fj_di\\\" bpmnElement=\\\"Task_crane_MoveToRover\\\">\\n        <dc:Bounds x=\\\"339\\\" y=\\\"908\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_1cu2jga_di\\\" bpmnElement=\\\"Task_crane_PickupWhiteState\\\">\\n        <dc:Bounds x=\\\"492\\\" y=\\\"908\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_1liq826_di\\\" bpmnElement=\\\"Task_crane_MoveToConveyor\\\">\\n        <dc:Bounds x=\\\"677\\\" y=\\\"908\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_03o7sh6_di\\\" bpmnElement=\\\"Task_crane_DropState\\\">\\n        <dc:Bounds x=\\\"825\\\" y=\\\"908\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_02fuv92_di\\\" bpmnElement=\\\"Task_crane_ResetState\\\">\\n        <dc:Bounds x=\\\"965\\\" y=\\\"908\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_0yol2um_di\\\" bpmnElement=\\\"SequenceFlow_0yol2um\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"965\\\" y=\\\"1081\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"925\\\" y=\\\"1081\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"900\\\" y=\\\"1059.5\\\" width=\\\"90\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_1630xqb_di\\\" bpmnElement=\\\"SequenceFlow_1630xqb\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"517\\\" y=\\\"1081\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"456\\\" y=\\\"1081\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"441.5\\\" y=\\\"1059.5\\\" width=\\\"90\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_14854da_di\\\" bpmnElement=\\\"SequenceFlow_14854da\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"125\\\" y=\\\"1121\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"125\\\" y=\\\"1217\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"95\\\" y=\\\"1162.5\\\" width=\\\"90\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_0bi061m_di\\\" bpmnElement=\\\"SequenceFlow_0bi061m\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"175\\\" y=\\\"1257\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"262\\\" y=\\\"1257\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"262\\\" y=\\\"1257\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"306\\\" y=\\\"1257\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"232\\\" y=\\\"1250.5\\\" width=\\\"90\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_16gl4qk_di\\\" bpmnElement=\\\"SequenceFlow_16gl4qk\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"406\\\" y=\\\"1257\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"462\\\" y=\\\"1257\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"462\\\" y=\\\"1257\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"483\\\" y=\\\"1257\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"432\\\" y=\\\"1250.5\\\" width=\\\"90\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_0qcbp5f_di\\\" bpmnElement=\\\"SequenceFlow_0qcbp5f\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"583\\\" y=\\\"1257\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"643\\\" y=\\\"1257\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"568\\\" y=\\\"1235.5\\\" width=\\\"90\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_0ylwv72_di\\\" bpmnElement=\\\"SequenceFlow_0ylwv72\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"743\\\" y=\\\"1257\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"794\\\" y=\\\"1257\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"794\\\" y=\\\"1257\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"845\\\" y=\\\"1257\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"764\\\" y=\\\"1250.5\\\" width=\\\"90\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_0aks0rq_di\\\" bpmnElement=\\\"SequenceFlow_0aks0rq\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"439\\\" y=\\\"948\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"492\\\" y=\\\"948\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"420.5\\\" y=\\\"926.5\\\" width=\\\"90\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_16xorvx_di\\\" bpmnElement=\\\"SequenceFlow_16xorvx\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"592\\\" y=\\\"948\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"677\\\" y=\\\"948\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"589.5\\\" y=\\\"926.5\\\" width=\\\"90\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_0w4vcvx_di\\\" bpmnElement=\\\"SequenceFlow_0w4vcvx\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"925\\\" y=\\\"948\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"965\\\" y=\\\"948\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"900\\\" y=\\\"926.5\\\" width=\\\"90\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_1vdreba_di\\\" bpmnElement=\\\"SequenceFlow_1vdreba\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"1308\\\" y=\\\"390\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"1308\\\" y=\\\"417\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"1323\\\" y=\\\"397.5\\\" width=\\\"0\\\" height=\\\"12\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_0wnvr0y_di\\\" bpmnElement=\\\"SequenceFlow_0wnvr0y\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"1258\\\" y=\\\"457\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"1166\\\" y=\\\"457\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"1212\\\" y=\\\"436\\\" width=\\\"0\\\" height=\\\"12\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_1gd69h9_di\\\" bpmnElement=\\\"SequenceFlow_1gd69h9\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"777\\\" y=\\\"948\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"825\\\" y=\\\"948\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"801\\\" y=\\\"927\\\" width=\\\"0\\\" height=\\\"12\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_0rpv0e9_di\\\" bpmnElement=\\\"SequenceFlow_0rpv0e9\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"1015\\\" y=\\\"988\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"1015\\\" y=\\\"1041\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"1030\\\" y=\\\"1008.5\\\" width=\\\"0\\\" height=\\\"12\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_1g5p6ng_di\\\" bpmnElement=\\\"SequenceFlow_1g5p6ng\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"825\\\" y=\\\"1081\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"801\\\" y=\\\"1081\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"801\\\" y=\\\"1081\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"777\\\" y=\\\"1081\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"816\\\" y=\\\"1075\\\" width=\\\"0\\\" height=\\\"12\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_0dj92k2_di\\\" bpmnElement=\\\"SequenceFlow_0dj92k2\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"677\\\" y=\\\"1081\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"617\\\" y=\\\"1081\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"647\\\" y=\\\"1060\\\" width=\\\"0\\\" height=\\\"12\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_19wg8uh_di\\\" bpmnElement=\\\"SequenceFlow_19wg8uh\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"356\\\" y=\\\"1081\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"323\\\" y=\\\"1081\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"339.5\\\" y=\\\"1060\\\" width=\\\"0\\\" height=\\\"12\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_0yyv6yx_di\\\" bpmnElement=\\\"SequenceFlow_0yyv6yx\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"223\\\" y=\\\"1081\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"198\\\" y=\\\"1081\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"198\\\" y=\\\"1081\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"175\\\" y=\\\"1081\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"213\\\" y=\\\"1075\\\" width=\\\"0\\\" height=\\\"12\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNShape id=\\\"EndEvent_1y0xbns_di\\\" bpmnElement=\\\"EndEvent_1y0xbns\\\">\\n        <dc:Bounds x=\\\"1006.719489981785\\\" y=\\\"1239\\\" width=\\\"36\\\" height=\\\"36\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"1024.719489981785\\\" y=\\\"1279\\\" width=\\\"0\\\" height=\\\"12\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_0q0r7oi_di\\\" bpmnElement=\\\"SequenceFlow_0q0r7oi\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"945\\\" y=\\\"1257\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"1007\\\" y=\\\"1257\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"976\\\" y=\\\"1236\\\" width=\\\"0\\\" height=\\\"12\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_1p499jv_di\\\" bpmnElement=\\\"SequenceFlow_1p499jv\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"405\\\" y=\\\"507\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"405\\\" y=\\\"530\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"405\\\" y=\\\"530\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"405\\\" y=\\\"551\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"420\\\" y=\\\"524\\\" width=\\\"0\\\" height=\\\"12\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_09sgueu_di\\\" bpmnElement=\\\"SequenceFlow_09sgueu\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"703\\\" y=\\\"708\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"633\\\" y=\\\"708\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"668\\\" y=\\\"687\\\" width=\\\"0\\\" height=\\\"12\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_0qffdjt_di\\\" bpmnElement=\\\"SequenceFlow_0qffdjt\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"703\\\" y=\\\"467\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"633\\\" y=\\\"467\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"668\\\" y=\\\"446\\\" width=\\\"0\\\" height=\\\"12\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_1rukyl0_di\\\" bpmnElement=\\\"SequenceFlow_1rukyl0\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"583\\\" y=\\\"748\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"583\\\" y=\\\"787\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"598\\\" y=\\\"761.5\\\" width=\\\"0\\\" height=\\\"12\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n    </bpmndi:BPMNPlane>\\n  </bpmndi:BPMNDiagram>\\n</bpmn:definitions>\\n\","+
                                    "\"rawxml\": \"<?xml version=\\\"1.0\\\" encoding=\\\"UTF-8\\\"?>\\n<bpmn:definitions xmlns:bpmn=\\\"http://www.omg.org/spec/BPMN/20100524/MODEL\\\" xmlns:bpmndi=\\\"http://www.omg.org/spec/BPMN/20100524/DI\\\" xmlns:di=\\\"http://www.omg.org/spec/DD/20100524/DI\\\" xmlns:dc=\\\"http://www.omg.org/spec/DD/20100524/DC\\\" xmlns:xsi=\\\"http://www.w3.org/2001/XMLSchema-instance\\\" xmlns:crema=\\\"http://crema.project.eu\\\" id=\\\"Definitions_1\\\" targetNamespace=\\\"http://bpmn.io/schema/bpmn\\\">\\n  <bpmn:process id=\\\"Process_1\\\" isExecutable=\\\"true\\\">\\n    <bpmn:startEvent id=\\\"StartEvent_1\\\">\\n      <bpmn:outgoing>SequenceFlow_1ixl6sk</bpmn:outgoing>\\n    </bpmn:startEvent>\\n    <bpmn:task id=\\\"Task_crane1_MoveDaCounter\\\" name=\\\"crane1_MoveDaCounter\\\">\\n      <bpmn:incoming>SequenceFlow_1ixl6sk</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_1v5ag7j</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_1ixl6sk\\\" sourceRef=\\\"StartEvent_1\\\" targetRef=\\\"Task_crane1_MoveDaCounter\\\" />\\n    <bpmn:task id=\\\"Task_crane1_DropDaCounter\\\" name=\\\"crane1_DropDaCounter\\\">\\n      <bpmn:incoming>SequenceFlow_1v5ag7j</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_1au3x2m</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_1v5ag7j\\\" sourceRef=\\\"Task_crane1_MoveDaCounter\\\" targetRef=\\\"Task_crane1_DropDaCounter\\\" />\\n    <bpmn:task id=\\\"Task_oven_CookerIt\\\" name=\\\"oven_CookerIt\\\">\\n      <bpmn:incoming>SequenceFlow_1au3x2m</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_19egm7d</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_1au3x2m\\\" sourceRef=\\\"Task_crane1_DropDaCounter\\\" targetRef=\\\"Task_oven_CookerIt\\\" />\\n    <bpmn:task id=\\\"Task_drill__DestroyIt\\\" name=\\\"drill__DestroyIt\\\">\\n      <bpmn:incoming>SequenceFlow_19egm7d</bpmn:incoming>\\n      <bpmn:outgoing>SequenceFlow_1jmh26a</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_19egm7d\\\" sourceRef=\\\"Task_oven_CookerIt\\\" targetRef=\\\"Task_drill__DestroyIt\\\" />\\n    <bpmn:endEvent id=\\\"EndEvent_0gru5b8\\\">\\n      <bpmn:incoming>SequenceFlow_1jmh26a</bpmn:incoming>\\n    </bpmn:endEvent>\\n    <bpmn:sequenceFlow id=\\\"SequenceFlow_1jmh26a\\\" sourceRef=\\\"Task_drill__DestroyIt\\\" targetRef=\\\"EndEvent_0gru5b8\\\" />\\n  </bpmn:process>\\n  <bpmndi:BPMNDiagram id=\\\"BPMNDiagram_1\\\">\\n    <bpmndi:BPMNPlane id=\\\"BPMNPlane_1\\\" bpmnElement=\\\"Process_1\\\">\\n      <bpmndi:BPMNShape id=\\\"_BPMNShape_StartEvent_2\\\" bpmnElement=\\\"StartEvent_1\\\">\\n        <dc:Bounds x=\\\"173\\\" y=\\\"102\\\" width=\\\"36\\\" height=\\\"36\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\\"Task_15gfu3d_di\\\" bpmnElement=\\\"Task_crane1_MoveDaCounter\\\">\\n        <dc:Bounds x=\\\"327\\\" y=\\\"80\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_1ixl6sk_di\\\" bpmnElement=\\\"SequenceFlow_1ixl6sk\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"209\\\" y=\\\"120\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"327\\\" y=\\\"120\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"268\\\" y=\\\"98\\\" width=\\\"0\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNShape id=\\\"Task_00yu3ek_di\\\" bpmnElement=\\\"Task_crane1_DropDaCounter\\\">\\n        <dc:Bounds x=\\\"559\\\" y=\\\"80\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_1v5ag7j_di\\\" bpmnElement=\\\"SequenceFlow_1v5ag7j\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"427\\\" y=\\\"120\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"559\\\" y=\\\"120\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"493\\\" y=\\\"98\\\" width=\\\"0\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNShape id=\\\"Task_0saacyh_di\\\" bpmnElement=\\\"Task_oven_CookerIt\\\">\\n        <dc:Bounds x=\\\"729\\\" y=\\\"80\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_1au3x2m_di\\\" bpmnElement=\\\"SequenceFlow_1au3x2m\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"659\\\" y=\\\"120\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"729\\\" y=\\\"120\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"694\\\" y=\\\"98\\\" width=\\\"0\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNShape id=\\\"Task_1bxejzq_di\\\" bpmnElement=\\\"Task_drill__DestroyIt\\\">\\n        <dc:Bounds x=\\\"893\\\" y=\\\"80\\\" width=\\\"100\\\" height=\\\"80\\\" />\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_19egm7d_di\\\" bpmnElement=\\\"SequenceFlow_19egm7d\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"829\\\" y=\\\"120\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"893\\\" y=\\\"120\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"861\\\" y=\\\"98\\\" width=\\\"0\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNShape id=\\\"EndEvent_0gru5b8_di\\\" bpmnElement=\\\"EndEvent_0gru5b8\\\">\\n        <dc:Bounds x=\\\"1052\\\" y=\\\"102\\\" width=\\\"36\\\" height=\\\"36\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"1070\\\" y=\\\"141\\\" width=\\\"0\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNEdge id=\\\"SequenceFlow_1jmh26a_di\\\" bpmnElement=\\\"SequenceFlow_1jmh26a\\\">\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"993\\\" y=\\\"120\\\" />\\n        <di:waypoint xsi:type=\\\"dc:Point\\\" x=\\\"1052\\\" y=\\\"120\\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\\"1022.5\\\" y=\\\"98\\\" width=\\\"0\\\" height=\\\"13\\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNEdge>\\n    </bpmndi:BPMNPlane>\\n  </bpmndi:BPMNDiagram>\\n</bpmn:definitions>\\n\","+
       
                                    "\"timestamp\": "+d.getTime()+","+
                                    "\"processname\": \"4_process_test\","+
                                    "\"processid\":"+processid+"}";
                                    //BPMNJSON = BPMNJSON.replaceAll("\\s","");
                                    pRecord = new ProducerRecord("bpmndata",d.getTime(), BPMNJSON);
                                    producer.send(pRecord);
                                }

                                //IF TasksOrdered is the endEvent 
                                if(tasksOrdered.get(count).contains("EndEvent"))
                                {
                                    System.out.println(tasksOrdered.get(count));
                                    //build json string.
                                    String json = "{\"source\":\"PDE\",\"event\":\""+tasksOrdered.get(count)+"\",\"action\":\"start\",\"timestamp\":"+d.getTime()+",\"processid\":"+processid+"}";
                                    pRecord = new ProducerRecord(TOPIC,d.getTime(), json);
                                    producer.send(pRecord);
                                    json = "{\"commands\" : \"done\", \"process\" : \"Full_Process_Single\"}";
                                    System.out.println("execution Message Sent 170");
                                    pRecord = new ProducerRecord("execution",d.getTime(), json);
                                    producer.send(pRecord);
                                    run = false; //Stop the loop as finished the process.
                                    //break;
                                }
                                else
                                {
                                    //build json string.
                                    String json = "{\"source\":\"PDE\",\"task\":\""+tasksOrdered.get(count)+"\",\"action\":\"start\",\"timestamp\":"+d.getTime()+",\"processid\":"+processid+"}";
                                    pRecord = new ProducerRecord(TOPIC,d.getTime(), json);
                                    System.out.println("Sending: "+json);
                                    producer.send(pRecord);
                                    //Send kafka message
                                }

                                
                                
                                consumer2.subscribe(Collections.singletonList("commands"));
                                boolean loop = true;

                                while (loop)
                                {
                                    System.out.println("While: line 193");
                                    ConsumerRecords<byte[], byte[]> records = consumer2.poll(100000);
                                    for (ConsumerRecord<byte[], byte[]> record : records)
                                    {
                                        s = new String(record.value());
                                        valueObj = new JSONObject();
                                        System.out.println("Process engine 199: "+s+"  "+tasksOrdered.get(count));
                                        try
                                        {
                                            valueObj = new JSONObject(s);
                                        }
                                        catch (JSONException ex)
                                        {
                                            System.out.println("Process Engine 206: "+ex);
                                            break;
                                        }

                                        //Check for kafka message from WatchDog:
                                        boolean sourceBool = valueObj.has("source");
                                        String source = "";
                                        if(sourceBool)
                                        {
                                            source = valueObj.getString("source");
                                            if(source.compareToIgnoreCase("failure")==0)
                                            {
                                                //Failure message, Close page.
                                                String json = "{\"commands\" : \"done\", \"process\" : \"Full_Process_Single\"}";
                                                System.out.println("execution Message Sent 220");
                                                pRecord = new ProducerRecord("execution",d.getTime(), json);
                                                producer.send(pRecord);
                                                loop = false;
                                                run = false;
                                                break;
                                            }
                                        }

                                        boolean taskBool = valueObj.has("task");
                                        boolean actionBool = valueObj.has("action");
                                        boolean startBool = valueObj.has("event");
                                        String action = "";
                                        String task = "";
                                        if(actionBool)
                                        {
                                            action = valueObj.getString("action");
                                        }
                                        if(taskBool)
                                        {
                                            task = valueObj.getString("task");
                                        }
                                        if(startBool)
                                        {
                                            task = valueObj.getString("event");
                                            task = task.split("_")[0];
                                        }
                                        if((startBool || taskBool) && actionBool)
                                        {
                                            if(action.contains("done") && task.contains(tasksOrdered.get(count)))
                                            {
                                                System.out.println("Received the Done message");
                                                count++;
                                                loop = false;
                                                break;
                                            }
                                            if(task.contains("EndEvent"))
                                            {
                                                System.out.println("ENDEVENT");
                                                count++;
                                                loop = false;
                                                run = false;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }    
            }  
            producer.close();
            consumer.close();
            consumer2.close();
        %>
    </body>
</html>
