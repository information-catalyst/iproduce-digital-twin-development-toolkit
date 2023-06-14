import json
import time
import logging
import ftrobopy
import iceLogger


# Register our logger
logging.setLoggerClass(iceLogger.iceLogger)
icelog = logging.getLogger("iceLogger")


def logIO(messageString):
    #icelog.io("machine:Car,%s" % messageString)
    pass

from navMachine import navMachine

from kafkaCommandReceiver import commandReceiver

class navMachineRoboPY(navMachine):
    def __init__(self, xNavCommand,txtip):
        super().__init__(xNavCommand)
        global txt
        global leftMotor
        global rightMotor

        global leftMotorSpeed
        global rightMotorSpeed

        leftMotorSpeed = 0
        rightMotorSpeed = 0


        #txt=ftrobopy.ftrobopy('192.168.7.2  ', 65000)      # default USB connection IP
        #txt=ftrobopy.ftrobopy('192.168.0.8', 65000)
        txt=ftrobopy.ftrobopy(txtip, 65000)




        #all the variables for driving and positioning the crane
        leftMotor = txt.motor(1)
        rightMotor = txt.motor(2)
    
        time.sleep(1)
        txt.updateConfig()

        #thread.start_new_thread(self.robocomms, ())
        time.sleep(1)

    def robocomms(self):
        while True:
            leftMotor.setSpeed(leftMotorSpeed)
            rightMotor.setSpeed(rightMotorSpeed)
            time.sleep(0.1)               # machine for .1 seconds

    def resetCar(self):
        leftMotor.setSpeed(0)
        leftMotor.setDistance(0)
        rightMotor.setSpeed(0)
        rightMotor.setDistance(0)


    def leftMotor_setSpeed(self, speed):
        leftMotor.setSpeed(speed)
        logIO("output:leftMotor_speed,value:%d" % speed)
        

    def leftMotor_setDistance(self, distance):
        leftMotor.setDistance(distance)
        logIO("output:leftMotor_distance,value:%d" % distance)
        
    def rightMotor_setSpeed(self, speed):
        rightMotor.setSpeed(speed)
        logIO("output:rightMotor_speed,value:%d" % speed)
        

    def rightMotor_setDistance(self, distance):
        rightMotor.setDistance(distance)
        logIO("output:rightMotor_distance,value:%d" % distance)


    def stop(self):
        self.leftMotor_setSpeed(0)
        self.rightMotor_setSpeed(0)


    def rotateLeft(self):
        self.rightMotor_setSpeed(0)
        self.leftMotor_setSpeed(512)
        #time.sleep(0.5)               # machine for 3 seconds

    def rotateRight(self):
        self.rightMotor_setSpeed(512)
        self.leftMotor_setSpeed(0)
        #time.sleep(0.5)               # machine for 3 seconds

    def moveForward(self):
        self.rightMotor_setSpeed(512)
        self.leftMotor_setSpeed(512)
        #time.sleep(0.5)               # machine for 3 seconds

    def moveBackward(self):
        self.rightMotor_setSpeed(-512)
        self.leftMotor_setSpeed(-512)


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