"""
	Interface to Fischertechnik hardware for the conveyor
"""
import logging
import iceLogger


# Register our logger
logging.setLoggerClass(iceLogger.iceLogger)
icelog = logging.getLogger("iceLogger")

import ftrobopy
import time


# this must be changed to your needs


def logIO(messageString):
	icelog.io("machine:Car,%s" % messageString)




def init_car_interface():


	global txt
	global leftMotor
	global rightMotor



	txt=ftrobopy.ftrobopy('localhost', 65000)

	#all the variables for driving and positioning the crane
	leftMotor = txt.motor(1)
	rightMotor = txt.motor(2)
	beltMotorab = txt.motor(2)


	time.sleep(1)
	txt.updateConfig()

#function to move to crane back into default position
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

