package com.informationcatalyst.kafkaJavaFrame;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.Date;
import java.util.Random;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

@SpringBootApplication
public class KafkaJavaFrameApplication {

        // logging class also reveals logging in components
	//private static final Logger log = LoggerFactory.getLogger(KafkaJavaFrameApplication .class);

         ArrayList<String> tasksOrdered = new ArrayList<String>();
         int count = 1;
         int processid;
         BaseX baseX = new BaseX();
         
	@Autowired
	private KafkaTemplate<String, String> kafkaTemplate;
	@Autowired
	private KafkaTemplate<String, JSONMessage> kafkaTemplateJSONMessage;


	public void sendMessage(String topicName, String msg) 
         {
            System.out.println("sendMessage:topicName: "+topicName +" msg: "+ msg);
            kafkaTemplate.send(topicName, msg);
         }


	public void sendMessage(String topicName, JSONMessage msg) 
         {
            System.out.println("Sending Message in topic: " + msg.toString());
            kafkaTemplateJSONMessage.send(topicName, msg);
	}


	public static void main(String[] args) 
         {
            SpringApplication.run(KafkaJavaFrameApplication .class, args).close();
            System.out.println("So done");
	}
        
        
        @KafkaListener(topics = "execution",
            containerFactory = "kafkaListenerContainerFactory")
        public void executeListen(String message) throws JSONException 
        {
            System.out.println("Received Message in topics:execution: " + message);
            JSONObject valueObj = new JSONObject(message);
            if(valueObj.has("commands"))
            {
                String commands = valueObj.getString("commands");
                if(commands.compareTo("start")==0)
                {
                    String process = valueObj.getString("process");
                    System.out.println("Fetch process: " + process);
                    String lines = baseX.LoadXML(process);
                    ParseXML(lines);
                    count = 1;
                    Random rn = new Random();
                    processid = rn.nextInt((99999) + 1);
                    String TOPIC = "commands";
                    Date d = new Date();
                    
                    if(count == 1)
                    {
                        lines = lines.replace("\"","\\\"");
                        String BPMNJSON = "{\"source\": \"PDE\","+
                        "\"rawxml\": \"<?xml version=\\\"1.0\\\" encoding=\\\"UTF-8\\\"?>\\n"+lines+"\","+
                        "\"timestamp\": "+d.getTime()+","+
                        "\"processname\": \""+process+"\","+
                        "\"processid\":"+processid+"}";
                        sendMessage("bpmndata",BPMNJSON);
                    }
                    
                    if(tasksOrdered.get(count).contains("EndEvent"))
                    {
                        System.out.println(tasksOrdered.get(count));
                        String json = "{\"source\":\"PDE\",\"event\":\""+tasksOrdered.get(count)+"\",\"action\":\"start\",\"timestamp\":"+d.getTime()+",\"processid\":"+processid+"}";
                        sendMessage(TOPIC, json);
                        json = "{\"commands\" : \"done\", \"process\" : \"Full_Process_Single\"}";
                        System.out.println("execution Message Sent");
                        sendMessage("execution",json);
                    }
                    else
                    {
                        String json = "{\"source\":\"PDE\",\"task\":\""+tasksOrdered.get(count)+"\",\"action\":\"start\",\"timestamp\":"+d.getTime()+",\"processid\":"+processid+"}";
                        System.out.println("Sending: "+json);
                        sendMessage(TOPIC,json);
                    }
                }
            }
        }


	@KafkaListener(topics = "commands",
            containerFactory = "kafkaListenerContainerFactory")
        public void cmdListen(String message) throws JSONException
        {
            System.out.println("Received Message in topics:commands: " + message);
            JSONObject valueObj = new JSONObject();
            try
            {
                valueObj = new JSONObject(message);
            }
            catch (JSONException ex)
            {
                System.out.println(ex);
            }

            //Check for kafka message from WatchDog:
            boolean sourceBool = valueObj.has("source");
            String source;
            if(sourceBool)
            {
                source = valueObj.getString("source");
                if(source.compareToIgnoreCase("failure")==0)
                {
                    //Failure message, Close page.
                    String json = "{\"commands\" : \"done\", \"process\" : \"Full_Process_Single\"}";
                    sendMessage("execution",json);
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
                if(task.contains("StartUpState"))
                {
                    taskBool = false;
                }
            }
            if(startBool)
            {
                task = valueObj.getString("event");
                task = task.split("_")[0];
            }
            Date d = new Date();
            if((startBool || taskBool) && actionBool)
            {
                if(action.contains("done") && task.contains(tasksOrdered.get(count)))
                {
                    System.out.println("Received the Done message");
                    if(count < tasksOrdered.size()-2)
                    {
                        count++;
                        String json = "{\"source\":\"PDE\",\"task\":\""+tasksOrdered.get(count)+"\",\"action\":\"start\",\"timestamp\":"+d.getTime()+",\"processid\":"+processid+"}";
                        System.out.println("Sending: "+json);
                        sendMessage("commands",json);
                    }
                    else if(count < tasksOrdered.size()-1)
                    {
                        System.out.println("ENDEVENT");
                        count++;
                        System.out.println(tasksOrdered.get(count));
                        String json = "{\"source\":\"PDE\",\"event\":\""+tasksOrdered.get(count)+"\",\"action\":\"start\",\"timestamp\":"+d.getTime()+",\"processid\":"+processid+"}";
                        sendMessage("commands", json);
                        json = "{\"commands\" : \"done\", \"process\" : \"Full_Process_Single\"}";
                        System.out.println("execution Message Sent");
                        sendMessage("execution",json);
                    }
                }
            }
        }
        

        private void ParseXML(String lines)
        {
            //Parses the BaseX XML into arrays.
            System.out.println("ParseXML");
            DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder dBuilder;
            NodeList sequences = null;

            try {
                dBuilder = dbFactory.newDocumentBuilder();
                InputSource is = new InputSource(new StringReader(lines));
                Document doc=null;
                try {
                    doc = dBuilder.parse(is);
                } catch (SAXException | IOException ex) {
                    Logger.getLogger(KafkaJavaFrameApplication.class.getName()).log(Level.SEVERE, null, ex);
                }
                sequences = doc.getElementsByTagName("bpmn:sequenceFlow");
                System.out.print(sequences);
            } catch (ParserConfigurationException ex) {
                Logger.getLogger(KafkaJavaFrameApplication.class.getName()).log(Level.SEVERE, null, ex);
            }


            ArrayList<String> sources = new ArrayList<String>();
            ArrayList<String> targets = new ArrayList<String>();
            tasksOrdered = new ArrayList<String>();
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
                    if(sources.get(i).compareTo(nextTask)==0 || nextTask.contains("EndEvent"))
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
        }




	@Bean
	public CommandLineRunner run() throws Exception {
             return args -> {

                boolean done  = false;
                BufferedReader br= new BufferedReader(new InputStreamReader(System.in));
                //while (System.in.available() == 0) {

                while (!done) 
                {
                    String s = null;
                    try {
                        s = br.readLine();
                        //System.out.printf("Assigned done%s%n", s);

                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    if( s != null &&   s.length() == 0){
                        System.out.println("Exiting...");
                        done = true;
                        System.out.println("Assigned done");
                    }
                    TimeUnit.SECONDS.sleep(1);
                }
             };
	}


}
