import json
import time
import logging
import ftrobopy
import iceLogger

def logIO(messageString):
    #icelog.io("machine:Car,%s" % messageString)
    pass

def inittxt():
    global txt
    global leftMotor
    global rightMotor

    global leftMotorSpeed
    global rightMotorSpeed

    leftMotorSpeed = 0
    rightMotorSpeed = 0


    #txt=ftrobopy.ftrobopy('192.168.7.2  ', 65000)      # default USB connection IP
    txt=ftrobopy.ftrobopy('192.168.0.8  ', 65000)

    #all the variables for driving and positioning the crane
    leftMotor = txt.motor(1)
    rightMotor = txt.motor(2)

    time.sleep(1)
    txt.updateConfig()

    #thread.start_new_thread(self.robocomms, ())
    time.sleep(1)

def resetCar():
    leftMotor.setSpeed(0)
    leftMotor.setDistance(0)
    rightMotor.setSpeed(0)
    rightMotor.setDistance(0)        

def leftMotor_setSpeed(speed):
    leftMotor.setSpeed(speed)
    logIO("output:leftMotor_speed,value:%d" % speed)
    

def leftMotor_setDistance(distance):
    leftMotor.setDistance(distance)
    logIO("output:leftMotor_distance,value:%d" % distance)
    
def rightMotor_setSpeed(speed):
    rightMotor.setSpeed(speed)
    logIO("output:rightMotor_speed,value:%d" % speed)
    

def rightMotor_setDistance(distance):
    rightMotor.setDistance(distance)
    logIO("output:rightMotor_distance,value:%d" % distance)

inittxt()

leftMotor_setSpeed(512)
time.sleep(1)

resetCar()