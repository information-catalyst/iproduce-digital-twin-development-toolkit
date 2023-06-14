 
package com.main;

import java.io.StringReader;
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
import org.xml.sax.InputSource;

public class KafkaReaderCommands {

    
        public void KafkaReaderCommands(){}
        

        public void consume()throws JSONException, InterruptedException{
            
        System.out.println("kafkaReaderCommands.java line 27 "+"Consumer started");
            
        
        Properties consumerConfig = new Properties();
        consumerConfig.put("group.id", "my-gghgdfdgh");
        consumerConfig.put("bootstrap.servers",System.getenv("KAFKA_NETWORK"));
        consumerConfig.put("auto.offset.reset","earliest");
        consumerConfig.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.ByteArrayDeserializer");
        consumerConfig.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.ByteArrayDeserializer");
        KafkaConsumer<byte[], byte[]> consumer = new KafkaConsumer(consumerConfig);
        
        MySQL ms = new MySQL();
            
         try {

      consumer.subscribe(Collections.singletonList("commands"));
      boolean loop = true;
        while (loop) {
            
            String statusfgfgfg = ms.GetData("SELECT * From factory.status WHERE name='commands'");
            if(statusfgfgfg.trim().contains("false"))
            {
                loop = false;
                break;
            }
            
        ConsumerRecords<byte[], byte[]> records = consumer.poll(10000);
        for (ConsumerRecord<byte[], byte[]> record : records) {
          
          String s = new String(record.value());
          System.out.println("kafkaReaderCommands.java line 57 "+s);
          JSONObject valueObj = new JSONObject();
          try{
            valueObj = new JSONObject(s);
             }
          catch (JSONException ex) {       
            System.out.println("kafkaReaderCommands.java line 63 "+"Not valid JSON");
            break;
          }
       
            long time = 0L;
            String machine = "";
            String action = "";
            String status = "";
            String task = "";
            long duration= 0L;
            int runningProcessID = 121;

            
            boolean timeBool = valueObj.has("timestamp");
            if(timeBool)
            {
                //time = Long.parseLong(valueObj.getString("timestamp"));
                time = System.currentTimeMillis();
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
            boolean sourceBool = valueObj.has("source");
            if(sourceBool)
            {
                String source = valueObj.getString("source");
                if(source.compareToIgnoreCase("failure")==0)
                {
                    System.out.println("kafkaReaderCommands.java line 116 "+"FAILURE DETECTED!");
                    try{
                        machine = valueObj.getString("machine");
                        String processTemplateID = ms.GetData("SELECT * FROM factory.TaskTemplate WHERE machineIDFK="+machine+" AND name='"+task+"'").split("\\r?\\n")[0];
                        String taskIDFK = processTemplateID.split(",")[0];
                        String[] taskHist = ms.GetData("SELECT * FROM factory.TaskHistory WHERE runningProcessID='"+runningProcessID+"' AND taskIDFK='"+taskIDFK+"' AND status='Running'").split("\\r?\\n");
                        if(taskHist[0].compareTo("")!=0)
                        {
                            taskHist = taskHist[0].split(",");
                            long ts = Long.parseLong(taskHist[2]);
                            duration = time - ts;
                            ms.InsertData("INSERT INTO factory.TaskHistory (runningProcessID,taskIDFK,timestamp,status,duration) VALUES ('"+runningProcessID+"','"+taskIDFK+"',"+time+",'Failed',"+duration+")");
                            ms.InsertData("UPDATE factory.ProcessStatus SET status='Failed' WHERE pStatusID='"+runningProcessID+"'");
                            ms.InsertData("UPDATE factory.ProcessHistory SET status='Failed' WHERE runningProcessID='"+runningProcessID+"'");
                            ms.InsertData("UPDATE factory.Machine SET state='Ready', stateInt=0 WHERE machineID='"+machine+"'");
                        }
                    }
                    catch(ArrayIndexOutOfBoundsException e){
                        System.out.println("kafkaReaderCommands.java line 134 "+"ArrayIndexOutOfBoundsException: "+e);
                    }
                }
            }
            
            
            if(timeBool && taskBool && actionBool)
            {
                if(task.indexOf("_", task.indexOf("_") + 1) > -1)
                {
                    try{
                        machine = task.split("_")[1];
                        machine = ms.GetData("SELECT * FROM factory.Machine WHERE name='"+machine+"'").split("\\r?\\n")[0].split(",")[0];
                        task = task.split("_")[2];
                        String processTemplateID = ms.GetData("SELECT * FROM factory.TaskTemplate WHERE machineIDFK="+machine+" AND name='"+task+"'").split("\\r?\\n")[0];
                        String taskIDFK = processTemplateID.split(",")[0];
                        //processTemplateID = processTemplateID.split(",")[1];

                        if(action.compareToIgnoreCase("start")==0)
                        {
                            status = "Running"; 
                            duration = 0;
                        }
                        else{
                            //done
                            status = "Complete"; //Complete
                            String[] taskHist = ms.GetData("SELECT * FROM factory.TaskHistory WHERE runningProcessID='"+runningProcessID+"' AND taskIDFK='"+taskIDFK+"'").split("\\r?\\n");
                            if(taskHist[0].compareTo("")!=0)
                            {
                                long ts = Long.parseLong(taskHist[0].split(",")[2]);
                                duration = time - ts;
                            }
                            else
                            {
                                break;
                            }
                            //Checks to see if a failure message exists.
                            if(taskHist.length > 1)
                            {
                                if(taskHist[1].split(",")[3].compareToIgnoreCase("Failed")==0)
                                {
                                    //Need to rectify the incorrect failure
                                    ms.InsertData("UPDATE factory.TaskHistory SET status='Delayed', duration='"+duration+"' WHERE runningProcessID='"+runningProcessID+"' AND taskIDFK='"+taskIDFK+"' AND status='Failed'");
                                    ms.InsertData("UPDATE factory.ProcessStatus SET status='Start' WHERE pStatusID='"+runningProcessID+"'");
                                    ms.InsertData("UPDATE factory.ProcessHistory SET status='Start' WHERE runningProcessID='"+runningProcessID+"'");
                                }
                            }
                        }

                        ms.InsertData("INSERT INTO factory.TaskHistory (runningProcessID, taskIDFK, timestamp, status,duration)  VALUES ('"+runningProcessID+"','"+taskIDFK+"','"+time+"','"+status+"','"+duration+"')"); 
                        ms.InsertData("INSERT INTO factory.Reading (timestamp,value,machineIDFK,task) VALUES ("+time+",'"+action+"','"+machine+"','"+task+"')"); //Need to add processid when valid.
                    }
                    catch(ArrayIndexOutOfBoundsException e){
                        System.out.println("kafkaReaderCommands.java line 187 "+"ArrayIndexOutOfBoundsException: "+e);
                    }
                }
            }
            
            if(timeBool && startBool && actionBool)
            {
                machine = "0";
                String processTemplateID = ms.GetData("SELECT * FROM factory.TaskTemplate WHERE machineIDFK="+machine+" AND name='"+task+"'").split("\\r?\\n")[0];
                String taskIDFK = processTemplateID.split(",")[0];
                //processTemplateID = processTemplateID.split(",")[1];
                
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
            }
        }
      }
    } 
    catch (WakeupException e) {
      System.out.println("kafkaReaderCommands.java line 219 "+"WakeupException: "+e);
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