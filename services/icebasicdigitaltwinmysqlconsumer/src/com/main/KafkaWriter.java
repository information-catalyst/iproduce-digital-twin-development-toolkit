/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.main;

/**
 *
 * @author mitch
 */


import java.io.FileReader;
import org.apache.kafka.clients.producer.*;
import org.apache.kafka.common.serialization.LongSerializer;
import org.apache.kafka.common.serialization.StringSerializer;
import java.util.Properties;
import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;
import net.minidev.json.parser.JSONParser;




public class KafkaWriter {
    
    
    private final static String TOPIC = "test";
    private final static String BOOTSTRAP_SERVERS ="kafkanetwork_kafka_2:9092";
    
      public static Producer<Long, String> createProducer() {
        Properties props = new Properties();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG,BOOTSTRAP_SERVERS);
        props.put(ProducerConfig.CLIENT_ID_CONFIG, "Mitch");
//        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG,
//                                        LongSerializer.class.getName());
//        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,
//                                    StringSerializer.class.getName());
        return new KafkaProducer(props);
    
}
      
       public static void runProducer(final int sendMessageCount) throws Exception {
           
      final Producer<Long, String> producer = createProducer();
//      JSONParser parser = new JSONParser();
//      JSONArray jsonArr = (JSONArray) parser.parse(new FileReader(".resources\\newdata.json"));

    String json = "";



      try {
//        for(int i=0;i<jsonArr.size();i++)
//        {
//        long time = System.currentTimeMillis();
//
//                final ProducerRecord<Long, String> record =
//                new ProducerRecord(TOPIC, i, jsonArr.get(i));
//                RecordMetadata metadata = producer.send(record).get();
//                long elapsedTime = System.currentTimeMillis() - time;
//                System.out.printf("sent record(key=%s value=%s) " +
//                                "meta(partition=%d, offset=%d) time=%d\n",
//                        record.key(), record.value(), metadata.partition(),
//                        metadata.offset(), elapsedTime);
//        }
      }
      finally {
          producer.flush();
          producer.close();
      }
  }
       
       
//public static void main(String... args) throws Exception {
//    if (args.length == 0) {
//        runProducer(1);
//    } else {
//        runProducer(Integer.parseInt(args[0]));
//    }
//}
      
}
