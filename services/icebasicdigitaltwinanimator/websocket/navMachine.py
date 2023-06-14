import json
import time
import logging

from kafkaCommandReceiver import commandReceiver

class navMachine(object):
    def __init__(self, mNavCommand):
       self.factory = "navigator"
       self.mycmds = commandReceiver(self)
       self.t=time.time()
       self.doSend = True
       self.machineNavCommand = mNavCommand

    def sendComand(self, command, topic):
        payloadjs = {}
        payloadjs["task"] = command
        payloadjs["action"] = "start"
        payloadjs["timestamp"] = time.time()*1000
        wspayload = json.dumps(payloadjs)
        #if time.time()-self.t>10:
        if self.doSend ==  True:
            self.doSend = False
            #self.mycmds.directSend(wspayload, topic)
            self.t=time.time()

    def sendComandDone(self, command, topic):
        payloadjs = {}
        payloadjs["task"] = command
        payloadjs["action"] = "done"
        payloadjs["timestamp"] = time.time()*1000
        wspayload = json.dumps(payloadjs)
        #if time.time()-self.t>10:
        if self.doSend ==  True:
            self.doSend = False
            self.mycmds.directSend(wspayload, topic)
            self.t=time.time()


    def rotateLeft(self):
       self.sendComand("Task_CarLeft", "carnav")

    def rotateRight(self):
       self.sendComand("Task_CarRight", "carnav")

    def moveForward(self):
       self.sendComand("Task_CarForward", "carnav")

    def moveBackward(self):
       self.sendComand("Task_CarBack", "carnav")


    def receive_event(self, event):
        newevent = event.replace(":","_")
        self.doSend = True
        logging.warning("Machine: carnav, on_event:%s" % newevent)       

    def getNavCommand(self, command):
        logging.warning("navmachine.py: getNavCommand, on_event:%s" % command)
        self.machineNavCommand(command)
        '''
        global moveMode
        global targetCounter
        logging.warning("Machine: carnav, getNavCommand:%s" % command)
        getNavCommand(command)
        if command =="Task_CarForward10":
            logging.warning("Machine: carnav, getNavCommand: START" )
            targetCounter = 0
            moveMode = moveModeForward
        '''


    def __repr__(self):
        """
        Leverages the __str__ method to describe the State.
        """
        return self.__str__()

    def __str__(self):
        """
        Returns the name of the State.
        """
        return self.__class__.__name__