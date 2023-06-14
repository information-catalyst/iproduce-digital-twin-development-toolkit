/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.main;

import static com.main.KafkaReaderCommands.loadXMLFromString;
import java.util.ArrayList;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 *
 * @author mitch
 */
public class test {
    
    
    public static void main(String [] args)
    {
        String xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
"<bpmn:definitions xmlns:bpmn=\"http://www.omg.org/spec/BPMN/20100524/MODEL\" xmlns:bpmndi=\"http://www.omg.org/spec/BPMN/20100524/DI\" xmlns:di=\"http://www.omg.org/spec/DD/20100524/DI\" xmlns:dc=\"http://www.omg.org/spec/DD/20100524/DC\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:crema=\"http://crema.project.eu\" id=\"Definitions_1\" targetNamespace=\"http://bpmn.io/schema/bpmn\">\n" +
"  <bpmn:process id=\"Process_1\" isExecutable=\"true\">\n" +
"    <bpmn:startEvent id=\"StartEvent_1\">\n" +
"      <bpmn:outgoing>SequenceFlow_0q28ipl</bpmn:outgoing>\n" +
"    </bpmn:startEvent>\n" +
"    <bpmn:task id=\"Task_0d13xs6\" name=\"Test Process 1\">\n" +
"      <bpmn:incoming>SequenceFlow_0q28ipl</bpmn:incoming>\n" +
"      <bpmn:outgoing>SequenceFlow_1js3cj9</bpmn:outgoing>\n" +
"    </bpmn:task>\n" +
"    <bpmn:sequenceFlow id=\"SequenceFlow_0q28ipl\" sourceRef=\"StartEvent_1\" targetRef=\"Task_0d13xs6\" />\n" +
"    <bpmn:task id=\"Task_1gcmo6m\" name=\"Another process\">\n" +
"      <bpmn:incoming>SequenceFlow_1js3cj9</bpmn:incoming>\n" +
"      <bpmn:outgoing>SequenceFlow_1spds3a</bpmn:outgoing>\n" +
"    </bpmn:task>\n" +
"    <bpmn:sequenceFlow id=\"SequenceFlow_1js3cj9\" sourceRef=\"Task_0d13xs6\" targetRef=\"Task_1gcmo6m\" />\n" +
"    <bpmn:task id=\"Task_1fu8woh\" name=\"Last Process\">\n" +
"      <bpmn:incoming>SequenceFlow_1spds3a</bpmn:incoming>\n" +
"      <bpmn:outgoing>SequenceFlow_0q9tt7o</bpmn:outgoing>\n" +
"    </bpmn:task>\n" +
"    <bpmn:sequenceFlow id=\"SequenceFlow_1spds3a\" sourceRef=\"Task_1gcmo6m\" targetRef=\"Task_1fu8woh\" />\n" +
"    <bpmn:endEvent id=\"EndEvent_1xppolz\">\n" +
"      <bpmn:incoming>SequenceFlow_0q9tt7o</bpmn:incoming>\n" +
"    </bpmn:endEvent>\n" +
"    <bpmn:sequenceFlow id=\"SequenceFlow_0q9tt7o\" sourceRef=\"Task_1fu8woh\" targetRef=\"EndEvent_1xppolz\" />\n" +
"  </bpmn:process>\n" +
"  <bpmndi:BPMNDiagram id=\"BPMNDiagram_1\">\n" +
"    <bpmndi:BPMNPlane id=\"BPMNPlane_1\" bpmnElement=\"Process_1\">\n" +
"      <bpmndi:BPMNShape id=\"_BPMNShape_StartEvent_2\" bpmnElement=\"StartEvent_1\">\n" +
"        <dc:Bounds x=\"170\" y=\"67\" width=\"36\" height=\"36\" />\n" +
"        <bpmndi:BPMNLabel>\n" +
"          <dc:Bounds x=\"143\" y=\"103\" width=\"90\" height=\"20\" />\n" +
"        </bpmndi:BPMNLabel>\n" +
"      </bpmndi:BPMNShape>\n" +
"      <bpmndi:BPMNShape id=\"Task_0d13xs6_di\" bpmnElement=\"Task_0d13xs6\">\n" +
"        <dc:Bounds x=\"255\" y=\"69\" width=\"100\" height=\"80\" />\n" +
"      </bpmndi:BPMNShape>\n" +
"      <bpmndi:BPMNEdge id=\"SequenceFlow_0q28ipl_di\" bpmnElement=\"SequenceFlow_0q28ipl\">\n" +
"        <di:waypoint xsi:type=\"dc:Point\" x=\"206\" y=\"85\" />\n" +
"        <di:waypoint xsi:type=\"dc:Point\" x=\"231\" y=\"85\" />\n" +
"        <di:waypoint xsi:type=\"dc:Point\" x=\"231\" y=\"109\" />\n" +
"        <di:waypoint xsi:type=\"dc:Point\" x=\"255\" y=\"109\" />\n" +
"        <bpmndi:BPMNLabel>\n" +
"          <dc:Bounds x=\"201\" y=\"91\" width=\"90\" height=\"12\" />\n" +
"        </bpmndi:BPMNLabel>\n" +
"      </bpmndi:BPMNEdge>\n" +
"      <bpmndi:BPMNShape id=\"Task_1gcmo6m_di\" bpmnElement=\"Task_1gcmo6m\">\n" +
"        <dc:Bounds x=\"443\" y=\"80\" width=\"100\" height=\"80\" />\n" +
"      </bpmndi:BPMNShape>\n" +
"      <bpmndi:BPMNEdge id=\"SequenceFlow_1js3cj9_di\" bpmnElement=\"SequenceFlow_1js3cj9\">\n" +
"        <di:waypoint xsi:type=\"dc:Point\" x=\"355\" y=\"109\" />\n" +
"        <di:waypoint xsi:type=\"dc:Point\" x=\"399\" y=\"109\" />\n" +
"        <di:waypoint xsi:type=\"dc:Point\" x=\"399\" y=\"120\" />\n" +
"        <di:waypoint xsi:type=\"dc:Point\" x=\"443\" y=\"120\" />\n" +
"        <bpmndi:BPMNLabel>\n" +
"          <dc:Bounds x=\"414\" y=\"108.5\" width=\"0\" height=\"12\" />\n" +
"        </bpmndi:BPMNLabel>\n" +
"      </bpmndi:BPMNEdge>\n" +
"      <bpmndi:BPMNShape id=\"Task_1fu8woh_di\" bpmnElement=\"Task_1fu8woh\">\n" +
"        <dc:Bounds x=\"663\" y=\"122\" width=\"100\" height=\"80\" />\n" +
"      </bpmndi:BPMNShape>\n" +
"      <bpmndi:BPMNEdge id=\"SequenceFlow_1spds3a_di\" bpmnElement=\"SequenceFlow_1spds3a\">\n" +
"        <di:waypoint xsi:type=\"dc:Point\" x=\"543\" y=\"120\" />\n" +
"        <di:waypoint xsi:type=\"dc:Point\" x=\"592\" y=\"120\" />\n" +
"        <di:waypoint xsi:type=\"dc:Point\" x=\"592\" y=\"162\" />\n" +
"        <di:waypoint xsi:type=\"dc:Point\" x=\"663\" y=\"162\" />\n" +
"        <bpmndi:BPMNLabel>\n" +
"          <dc:Bounds x=\"562\" y=\"135\" width=\"90\" height=\"12\" />\n" +
"        </bpmndi:BPMNLabel>\n" +
"      </bpmndi:BPMNEdge>\n" +
"      <bpmndi:BPMNShape id=\"EndEvent_1xppolz_di\" bpmnElement=\"EndEvent_1xppolz\">\n" +
"        <dc:Bounds x=\"863\" y=\"172\" width=\"36\" height=\"36\" />\n" +
"        <bpmndi:BPMNLabel>\n" +
"          <dc:Bounds x=\"836\" y=\"212\" width=\"90\" height=\"12\" />\n" +
"        </bpmndi:BPMNLabel>\n" +
"      </bpmndi:BPMNShape>\n" +
"      <bpmndi:BPMNEdge id=\"SequenceFlow_0q9tt7o_di\" bpmnElement=\"SequenceFlow_0q9tt7o\">\n" +
"        <di:waypoint xsi:type=\"dc:Point\" x=\"763\" y=\"162\" />\n" +
"        <di:waypoint xsi:type=\"dc:Point\" x=\"793\" y=\"162\" />\n" +
"        <di:waypoint xsi:type=\"dc:Point\" x=\"793\" y=\"190\" />\n" +
"        <di:waypoint xsi:type=\"dc:Point\" x=\"863\" y=\"190\" />\n" +
"        <bpmndi:BPMNLabel>\n" +
"          <dc:Bounds x=\"763\" y=\"170\" width=\"90\" height=\"12\" />\n" +
"        </bpmndi:BPMNLabel>\n" +
"      </bpmndi:BPMNEdge>\n" +
"    </bpmndi:BPMNPlane>\n" +
"  </bpmndi:BPMNDiagram>\n" +
"</bpmn:definitions>";
        
         try{
                    Document doc = loadXMLFromString(xml);
                    
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
                                if(tasksOrdered.contains(nextTask))
                                {
                                    run = false;
                                }
                            }
                        }
                    }
                    MySQL mysql = new MySQL();
                    int ProcessID = Integer.parseInt(mysql.GetData("select * from factory.ProcessTemplate order by processID desc limit 1").split("\\r?\\n")[0].split(",")[0])+1;
                    
                    }
                    catch(java.lang.Exception e){
                        System.out.println("ERROR: "+e);
                    }
        
    }
    
}
