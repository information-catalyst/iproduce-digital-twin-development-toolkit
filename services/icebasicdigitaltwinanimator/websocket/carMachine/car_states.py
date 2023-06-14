# crane_states.py
"""
The states the conveyor belt can be in, inherited from the basic State class

"""

import urllib.request


from state import State


from car_interface import *


# Register our logger
logging.setLoggerClass(iceLogger.iceLogger)
icelog = logging.getLogger("iceLogger")




# Start of our states
class IdleState(State):
    """
    do any machine initialisation
    """
    def __init__(self,machine):
        super().__init__(machine)
        machine.running = True

    def on_event(self, event):
        logging.info("IdleState"+event)
        super().on_event(event)
        if event == 'StartUpState':
            return StartUpState(self.machine)
        elif event == 'CarForward':
            return CarForward(self.machine)
        elif event == 'CarForward1':
            return CarForward1(self.machine)
        elif event == 'CarForward2':
            return CarForward2(self.machine)
        elif event == 'CarForward3':
            return CarForward3(self.machine)
        elif event == 'CarBack':
            return CarBack(self.machine)
        elif event == 'CarRight':
            return CarRight(self.machine)
        elif event == 'CarLeft':
            return CarLeft(self.machine)
        elif event == 'CarLeft1':
            return CarLeft1(self.machine)
        return self                                     

    def run(self):
        pass




class StartUpState(State):
    """
    do any machine initialisation
    """
    def __init__(self,machine):
        super().__init__(machine)
        machine.running = True

    def on_event(self, event):
        super().on_event(event)
        if event == 'StartUpState:done':
            #thread stop
            return IdleState(self.machine)            # change state

        return self                                     

    def run(self):
        #time.sleep(1)
        init_car_interface() 
        time.sleep(1)
        resetCar()
        self.machine.send_event("StartUpState:done")



class ShutDownState(State):
    """"
    shut the machine down
    """  
    def __init__(self,machine):
        machine.running = False

class CarForward(State):
    def on_event(self, event):
        super().on_event(event)
        if event == 'CarForward:done':
            return IdleState(self.machine)            # change state
        return self

    def test(self):
        pass

    def run(self):
        rightMotor_setSpeed(512)
        leftMotor_setSpeed(512)
        time.sleep(0.5)               # machine for 3 seconds
        rightMotor_setSpeed(0)
        leftMotor_setSpeed(0)
        self.machine.send_event("CarForward:done")

class CarForward1(State):
    def on_event(self, event):
        super().on_event(event)
        if event == 'CarForward1:done':
            return IdleState(self.machine)            # change state
        return self

    def test(self):
        pass

    def run(self):
        rightMotor_setSpeed(512)
        leftMotor_setSpeed(512)
        time.sleep(2.2)               # machine for 3 seconds
        rightMotor_setSpeed(0)
        leftMotor_setSpeed(0)
        self.machine.send_event("CarForward1:done")

class CarForward2(State):
    def on_event(self, event):
        super().on_event(event)
        if event == 'CarForward2:done':
            return IdleState(self.machine)            # change state
        return self

    def test(self):
        pass

    def run(self):
        rightMotor_setSpeed(512)
        leftMotor_setSpeed(512)
        time.sleep(1.2)               # machine for 3 seconds
        rightMotor_setSpeed(0)
        leftMotor_setSpeed(0)
        self.machine.send_event("CarForward2:done")

class CarForward3(State):
    def on_event(self, event):
        super().on_event(event)
        if event == 'CarForward3:done':
            return IdleState(self.machine)            # change state
        return self

    def test(self):
        pass

    def run(self):
        rightMotor_setSpeed(512)
        leftMotor_setSpeed(512)
        time.sleep(3)               # machine for 3 seconds
        rightMotor_setSpeed(0)
        leftMotor_setSpeed(0)
        self.machine.send_event("CarForward3:done")

class CarBack(State):
    def on_event(self, event):
        super().on_event(event)
        if event == 'CarBack:done':
            return IdleState(self.machine)            # change state
        return self

    def test(self):
        pass

    def run(self):
        rightMotor_setSpeed(-512)
        leftMotor_setSpeed(-512)
        time.sleep(0.5)               # machine for 3 seconds
        rightMotor_setSpeed(0)
        leftMotor_setSpeed(0)
        self.machine.send_event("CarBack:done")


class CarRight(State):
    def on_event(self, event):
        super().on_event(event)
        if event == 'CarRight:done':
            return IdleState(self.machine)            # change state
        return self

    def test(self):
        pass

    def run(self):
        rightMotor_setSpeed(512)
        time.sleep(1)               # machine for 3 seconds
        rightMotor_setSpeed(0)
        self.machine.send_event("CarRight:done")

class CarLeft(State):
    def on_event(self, event):
        super().on_event(event)
        if event == 'CarLeft:done':
            return IdleState(self.machine)            # change state
        return self

    def test(self):
        pass

    def run(self):
        leftMotor_setSpeed(512)
        time.sleep(1)               # machine for 3 seconds
        leftMotor_setSpeed(0)
        self.machine.send_event("CarLeft:done")

class CarLeft1(State):
    def on_event(self, event):
        super().on_event(event)
        if event == 'CarLeft1:done':
            return IdleState(self.machine)            # change state
        return self

    def test(self):
        pass

    def run(self):
        leftMotor_setSpeed(512)
        time.sleep(2.2)               # machine for 3 seconds
        leftMotor_setSpeed(0)
        self.machine.send_event("CarLeft1:done")

class ResetCarState(State):
    def on_event(self, event):
        super().on_event(event)
        if event == 'ResetCarState:done':
            return IdleState(self.machine)            # change state
        return self

    def test(self):
        pass

    def run(self):
        logging.info(">>>>>> RESETING<<<<<<<<<")
        self.machine.send_event("ResetCarState:done")



# End of our states.