 
package com.main;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Properties;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.errors.WakeupException;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

public class KafkaReaderBpmndata {

    
        public void KafkaReaderBpmndata(){}
        
        public void consume() throws JSONException, InterruptedException{
            
        Properties consumerConfig = new Properties();
        consumerConfig.put("group.id", "my-dfddddd");
        consumerConfig.put("bootstrap.servers",System.getenv("KAFKA_NETWORK"));
        consumerConfig.put("auto.offset.reset","earliest");
        consumerConfig.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.ByteArrayDeserializer");
        consumerConfig.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.ByteArrayDeserializer");
        KafkaConsumer<byte[], byte[]> consumer = new KafkaConsumer(consumerConfig);
        
        MySQL ms = new MySQL();
            
         try {

      consumer.subscribe(Collections.singletonList("bpmndata"));
      boolean loop = true;
        while (loop) {
            
            String statusfgfgfg = ms.GetData("SELECT * From factory.status WHERE name='bpmndata'");
            if(statusfgfgfg.trim().contains("false"))
            {
                loop = false;
                break;
            }
            
        ConsumerRecords<byte[], byte[]> records = consumer.poll(10000);
        for (ConsumerRecord<byte[], byte[]> record : records) {
          
          String s = new String(record.value());
          System.out.println("kafkaReaderBpmndata.java line 56"+s);
          JSONObject valueObj;
          try{
            valueObj = new JSONObject(s);
             }
          catch (JSONException ex) {
//              JSONArray jsonArr = new JSONArray();
//              jsonArr.add(s);         
            System.out.println("kafkaReaderBpmndata.java line 64 "+"Not valid JSON");
            break;
          }
            
            long time = 0L;
            String machine = "";
            String action = "";
            String status = "";
            String task = "";
            long duration= 0L;
            
            //TEMP CODE WHILST WAITING FOR PROCESSID/TASKID
            //int processTemplateID = 1;
            int runningProcessID = 121;

            
            boolean timeBool = valueObj.has("timestamp");
            if(timeBool)
            {
                time = Long.parseLong(valueObj.getString("timestamp"));
            } 
            boolean taskBool = valueObj.has("task");
            boolean startBool = valueObj.has("event");
            boolean actionBool = valueObj.has("action");
            if(actionBool)
            {
                action = valueObj.getString("action");
            }
            boolean processBool = valueObj.has("processid");
            if(processBool)
            {
                runningProcessID = Integer.parseInt(valueObj.getString("processid"));
                System.out.println(runningProcessID);
                
                String processes = ms.GetData("SELECT * FROM factory.ProcessStatus WHERE pStatusID='"+runningProcessID+"'").split("\\r?\\n")[0];
                if (processes.compareToIgnoreCase("")==0)
                {
                    timeBool = false;
                }
            }
            if(taskBool)
            {
                task = valueObj.getString("task");
            }
            else{
                if(startBool)
                {
                    task = valueObj.getString("event");
                    task = task.split("_")[0];
                }
            }
            
            boolean messageBool = valueObj.has("rawxml");
            if(messageBool)
                {
                    String message = valueObj.getString("rawxml");
                    try{
                    String processName = valueObj.getString("processname");
                    boolean processExists = false;
                    int processID = 0;
                    ms.InsertData("UPDATE factory.Machine SET state='Ready', stateInt=0");
                    if(ms.GetData("SELECT * FROM factory.ProcessTemplate WHERE name = '"+processName+"'").split("\\r?\\n")[0].compareTo("")!=0)
                    {
                        System.out.println("kafkaReaderBpmndata.java line 126 Process already exists in ProcessTemplate");
                        processID = Integer.parseInt(ms.GetData("select * from factory.ProcessTemplate where name='"+processName+"'").split("\\r?\\n")[0].split(",")[0]);
                        processExists = true;
                    }
                    
                    String processes = ms.GetData("SELECT * FROM factory.ProcessStatus WHERE pStatusID='"+runningProcessID+"'").split("\\r?\\n")[0];
                    if (processes.compareToIgnoreCase("")==0)
                    {
                        ms.InsertData("INSERT INTO factory.ProcessStatus VALUES ('"+runningProcessID+"','Start')");
                        if(processExists)
                        {
                        ms.InsertData("INSERT INTO factory.ProcessHistory (runningProcessID,timestamp,status,duration, processIDFK) VALUES ("+runningProcessID+",'"+time+"',"+"'Start',0,'"+processID+"')");
                        }
                        timeBool = true;
                    }
                    
                    Document doc = loadXMLFromString(message);
                    
                    NodeList sequences = doc.getElementsByTagName("bpmn:sequenceFlow");
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
                        }
                    }
                    
                    boolean run = true;
                    while(run)
                    {
                        for(int i =0; i < sources.size(); i++)
                        {
                            if(sources.get(i).compareTo(nextTask)==0)
                            {
                                tasksOrdered.add(sources.get(i));
                                nextTask = targets.get(i);
                                System.out.println("kafkaReaderBpmndata.java line 173 "+targets.get(i));
                                if(tasksOrdered.contains(nextTask) || targets.get(i).contains("EndEvent"))
                                {
                                    tasksOrdered.add(targets.get(i));
                                    run = false;
                                }
                            }
                        }
                    }
                    
                    boolean processIsDifferent = false;
                    
                    if(processExists)
                    {
                        String[] tasks = ms.GetData("SELECT * FROM factory.TaskTemplate WHERE processIDFK="+processID+" order by taskID").split("\\r?\\n");   
                        if(tasks[0].trim().compareToIgnoreCase("")==0)
                        {
                            processIsDifferent = true;
                        }
                        else
                        {
                            if(tasksOrdered.size() == tasks.length)
                            {
                                for(int i=0;i<tasksOrdered.size();i++)
                                {
                                    if(!tasksOrdered.get(i).contains(tasks[i].split(",")[3]))
                                    {
                                        processIsDifferent = true;
                                    }
                                }
                                if(processIsDifferent)
                                {
                                    ms.InsertData("DELETE FROM factory.ProcessTemplate WHERE processID="+processID+"");
                                    ms.InsertData("DELETE FROM factory.TaskTemplate WHERE processIDFK="+processID+"");
                                }
                            }
                            else
                            {
                                processIsDifferent = true;
                                ms.InsertData("DELETE FROM factory.ProcessTemplate WHERE processID="+processID+"");
                                ms.InsertData("DELETE FROM factory.TaskTemplate WHERE processIDFK="+processID+"");
                            }
                        }
                    }
                    
                    if(processIsDifferent || !processExists)
                    {
                        int processId = 0;
                        String ProcessT = ms.GetData("select * from factory.ProcessTemplate order by processID desc limit 1").split("\\r?\\n")[0];
                        if(ProcessT.compareToIgnoreCase("")!=0)
                        {
                        processId = Integer.parseInt(ProcessT.split(",")[0])+1;
                        }
                        ms.InsertData("INSERT INTO factory.ProcessTemplate (processID,name) VALUES ("+processId+",'"+processName+"')");
                        ms.InsertData("INSERT INTO factory.ProcessHistory (runningProcessID,timestamp,status,duration, processIDFK) VALUES ("+runningProcessID+",'"+time+"',"+"'Start',0,'"+processID+"')");
                        
                        int taskID = 0;
                        String TaskT = ms.GetData("select * from factory.TaskTemplate order by taskID desc limit 1").split("\\r?\\n")[0];
                        if(TaskT.compareToIgnoreCase("")!=0)
                        {
                        taskID = Integer.parseInt(TaskT.split(",")[0])+1;
                        }
                        for(int i =0;i<tasksOrdered.size();i++)
                        {
                            if(tasksOrdered.get(i).contains("StartEvent"))
                            {
                                message = tasksOrdered.get(i).split("_")[0];
                                machine = "0";
                                ms.InsertData("INSERT INTO factory.TaskTemplate VALUES ("+taskID+","+processId+","+machine+",'"+message+"','XOR','XOR')");
                            }
                            else if(tasksOrdered.get(i).contains("EndEvent"))
                            {
                                message = tasksOrdered.get(i).split("_")[0];
                                machine = "0";
                                ms.InsertData("INSERT INTO factory.TaskTemplate VALUES ("+taskID+","+processId+","+machine+",'"+message+"','XOR','XOR')");
                            }
                            else
                            {
                                machine = tasksOrdered.get(i).split("_")[1];
                                machine = ms.GetData("SELECT * FROM factory.Machine WHERE name='"+machine+"'").split("\\r?\\n")[0].split(",")[0];
                                message = tasksOrdered.get(i).split("_")[2];
                                ms.InsertData("INSERT INTO factory.TaskTemplate VALUES ("+taskID+","+processId+","+machine+",'"+message+"','XOR','XOR')");
                            }
                            taskID++;
                        }
                    }
                    }
                    catch(java.lang.Exception e){
                        System.out.println("kafkaReaderBpmndata.java line 261"+"ERROR: "+e);
                    }
                        timeBool = false; //Do not process xml message as already processed here.
                }

            
            
            if(timeBool && taskBool && actionBool)
            {
                if(task.indexOf("_", task.indexOf("_") + 1) > -1)
                {
                    machine = task.split("_")[1];
                    machine = ms.GetData("SELECT * FROM factory.Machine WHERE name='"+machine+"'").split("\\r?\\n")[0].split(",")[0];
                    task = task.split("_")[2];
                    String processTemplateID = ms.GetData("SELECT * FROM factory.TaskTemplate WHERE machineIDFK="+machine+" AND name='"+task+"'").split("\\r?\\n")[0];
                    String taskIDFK = processTemplateID.split(",")[0];
                    processTemplateID = processTemplateID.split(",")[1];

                    if(action.compareToIgnoreCase("start")==0)
                    {
                        status = "Running"; 
                        duration = 0;
                    }
                    else{
                        //done
                        status = "Complete"; //Complete
                        String[] taskHist = ms.GetData("SELECT * FROM factory.TaskHistory WHERE runningProcessID='"+runningProcessID+"' AND taskIDFK='"+taskIDFK+"'").split("\\r?\\n")[0].split(",");
                        if(taskHist[0].compareTo("")!=0)
                        {
                        long ts = Long.parseLong(taskHist[2]);
                        duration = time - ts;
                        }
                        else
                        {
                            break;
                        }
                    }

                    ms.InsertData("INSERT INTO factory.TaskHistory (runningProcessID, taskIDFK, timestamp, status,duration)  VALUES ('"+runningProcessID+"','"+taskIDFK+"','"+time+"','"+status+"','"+duration+"')"); 

                    ms.InsertData("INSERT INTO factory.Reading (timestamp,value,machineIDFK,task) VALUES ("+time+",'"+action+"','"+machine+"','"+task+"')"); //Need to add processid when valid.
                }
                //Execution Ex = new Execution();
            }
            
            if(timeBool && startBool && actionBool)
            {
                //if(task.indexOf("_", task.indexOf("_") + 1) > -1)
                //{
                
                machine = "0";
                String processTemplateID = ms.GetData("SELECT * FROM factory.TaskTemplate WHERE machineIDFK="+machine+" AND name='"+task+"'").split("\\r?\\n")[0];
                String taskIDFK = processTemplateID.split(",")[0];
                processTemplateID = processTemplateID.split(",")[1];
                
                if(action.compareToIgnoreCase("start")==0)
                {
                    status = "Running"; 
                    duration = 0;
                }
                else{
                    //done
                    status = "Complete"; //Complete
                    String[] taskHist = ms.GetData("SELECT * FROM factory.TaskHistory WHERE runningProcessID='"+runningProcessID+"' AND taskIDFK='"+taskIDFK+"'").split("\\r?\\n")[0].split(",");
                    long ts = Long.parseLong(taskHist[2]);
                    duration = time - ts;
                }
                
                ms.InsertData("INSERT INTO factory.TaskHistory (runningProcessID, taskIDFK, timestamp, status,duration)  VALUES ('"+runningProcessID+"','"+taskIDFK+"','"+time+"','"+status+"','"+duration+"')"); 
                
                ms.InsertData("INSERT INTO factory.Reading (timestamp,value,machineIDFK,task) VALUES ("+time+",'"+action+"','"+machine+"','"+task+"')"); //Need to add processid when valid.
            //}
            //Execution Ex = new Execution();
            }
        }
      }
    } 
    catch (WakeupException e) {
      System.out.println("kafkaReaderBpmndata.java line 339 "+"WakeupException: "+e);
    } 
    finally {
      consumer.close();
    }
}
        
public static Document loadXMLFromString(String xml) throws Exception
{
    DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
    DocumentBuilder builder = factory.newDocumentBuilder();
    InputSource is = new InputSource(new StringReader(xml));
    return builder.parse(is);
}
        
        
        
}