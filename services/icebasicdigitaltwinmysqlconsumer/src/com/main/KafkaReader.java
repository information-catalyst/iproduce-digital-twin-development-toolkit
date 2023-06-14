 
package com.main;

import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.mongodb.MongoCredential;
import com.mongodb.ServerAddress;
import com.mongodb.util.JSON;
import java.io.FileNotFoundException;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.Collections;
import java.util.Properties;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.errors.WakeupException;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;


public class KafkaReader {

    
        public void Consume(String topic) throws FileNotFoundException, JSONException, ClassNotFoundException, SQLException{
            
        Properties consumerConfig = new Properties();
        consumerConfig.put("group.id", "my-gghgdfdgh");
        consumerConfig.put("bootstrap.servers","kafkanetwork_kafka_2:9092");
        consumerConfig.put("auto.offset.reset","earliest");
        consumerConfig.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.ByteArrayDeserializer");
        consumerConfig.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.ByteArrayDeserializer");
        KafkaConsumer<byte[], byte[]> consumer = new KafkaConsumer(consumerConfig);
        
        MySQL ms = new MySQL();
            
         try {

      consumer.subscribe(Collections.singletonList(topic));
        while (true) {
        ConsumerRecords<byte[], byte[]> records = consumer.poll(Long.MAX_VALUE);
        for (ConsumerRecord<byte[], byte[]> record : records) {
          
          String s = new String(record.value());
          System.out.println(s);
            JSONObject valueObj = new JSONObject(s);
            
      
//MongoClient mongoClient = new MongoClient(new ServerAddress("icemain.hopto.org", 27017), new MongoClientOptions.Builder().connectTimeout(300000).socketTimeout(300000).build());
////MongoClient mongoClient = new MongoClient(new ServerAddress("172.17.0.6", 27017), new MongoClientOptions.Builder().connectTimeout(300000).socketTimeout(300000).build());
////MongoClient mongoClient = new MongoClient(new ServerAddress("192.168.99.100", 27017), new MongoClientOptions.Builder().connectTimeout(300000).socketTimeout(300000).build());
//
//  DB db = mongoClient.getDB("test");
//DBCollection collection = db.getCollection("status");
//            
//            collection = db.getCollection("data");
//            DBObject dbObject = (DBObject)(valueObj);
//            collection.insert(dbObject);
            
            String time = "";
            String machine = "";
            String output = "";
            String input = "";
            String value = "";
            String valueSpace= "";
            
            boolean machineBool = valueObj.has("machine");
            if(machineBool)
            {
                machine = valueObj.getString("machine");
                System.out.println(machine);
            }   
            boolean inputBool = valueObj.has("input");
            if(inputBool)
            {
                input = valueObj.getString("input");
                System.out.println(input);
            }
                

            boolean outputBool = valueObj.has("output");
            if(outputBool)
            {
                output = valueObj.getString("output");
                System.out.println(output);
            }

            boolean timeBool = valueObj.has("timestamp");
            if(timeBool)
            {
                time = valueObj.getString("timestamp");
                System.out.println(time);
            } 
            boolean valueBool = valueObj.has("value");
            if(valueBool)
            {
                value = valueObj.getString("value");
                System.out.println(value);
            } 
            boolean valueSpaceBool = valueObj.has(" value");
            if(valueSpaceBool)
            {
                valueSpace = valueObj.getString(" value");
                System.out.println(valueSpace);
            }
            
            if(timeBool && machineBool && valueBool && inputBool)
            {
                ms.InsertData("INSERT INTO chrisfactory.Reading VALUES ("+time+","+value+",'"+machine+input+"')");
            }
            
            if(timeBool && machineBool && valueBool && outputBool)
            {
                ms.InsertData("INSERT INTO chrisfactory.Reading VALUES ("+time+","+value+",'"+machine+output+"')");
            }
            
        }
      }
    } catch (WakeupException e) {
      // ignore for shutdown 
    } finally {
              
      consumer.close();
    }
}
        
        
        
}