package com.informationcatalyst.kafkaJavaFrame;

import org.springframework.kafka.support.serializer.JsonDeserializer;


public class ErrorHandlingJsonDeserializer extends JsonDeserializer {

    @Override
    public Object deserialize(String topic, byte[] data) {
        try {
            return super.deserialize(topic, data);
        } catch (Exception e) {
            //log.error("Problem deserializing data " + new String(data) + " on topic " + topic, e);
            return null;
        }
    }
}