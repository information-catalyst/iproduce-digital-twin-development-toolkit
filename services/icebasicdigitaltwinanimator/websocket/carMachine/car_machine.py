# car_machine.py
import json
import logging
import iceLogger
import time

from kafkaCommandReceiver import commandReceiver

from car_states import StartUpState

# Register our logger
logging.setLoggerClass(iceLogger.iceLogger)
icelog = logging.getLogger("iceLogger")

class CarMachine(object):
    """ 
    A simple state machine that mimics the functionality of a device from a 
    high level.
    """

    def __init__(self,factory):
        """ Initialize the components. """
        # Start with a default state.
        self.factory = factory
        self.state = StartUpState(self)
        self.state.runThread()
        icelog.warning('Machine:carMachine, method:__init__')


        self.mycmds = commandReceiver(self)
        
    def on_event(self, event):
        """
        This is the bread and butter of the state machine. Incoming events are
        delegated to the given states which then handle the event. The result is
        then assigned as the new state.
        """

        # The next state will be the result of the on_event function.
        
        self.state = self.state.on_event(event)
        self.state.runThread()
        newevent = event.replace(":","_")
        icelog.warning("Machine: car, on_event:%s" % newevent)

    def send_event(self, event):
        """
        send out a kafka message then locally process the event
        """
        icelog.info ("send_event entering")
        self.on_event(event)        

        #todo this should check what it is triming
        taskname = event[:-5]
        taskname = "Task_" + taskname

        timestampmsg = '%.0f' % ((time.time()*1000))


        payload = "{\"task\":\"Task_"+taskname+"\",\"action\":\"done\"}"
        payload="dummy"
        payloadjs = {}
        payloadjs["Factory"] = self.factory
        payloadjs["Machine"] = str(self)
        payloadjs["task"] = taskname
        payloadjs["action"] = "done"
        payloadjs["timestamp"] = timestampmsg
        payload = json.dumps(payloadjs)

        icelog.info(payload)
        #self.mycmds.directSend("Task_"+event,"commands")
        #self.mycmds.directSend(payload,"commands")
        self.mycmds.directSend(payload,"carnav")
        #self.on_event(event)        
        icelog.warning("Machine: car, send_event:%s" % taskname)

    def receive_event(self, event):
        """
        send out a kafka message then locally process the event
        """
        eventShort = event
        if event.startswith("Task_"):
            eventShort = event[5:]

        self.on_event(eventShort)        
        icelog.warning("Machine: car, receive_event:%s" % eventShort)


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