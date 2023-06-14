import logging
import iceLogger

# Register our logger
logging.setLoggerClass(iceLogger.iceLogger)
icelog = logging.getLogger("iceLogger")

from car_machine import CarMachine





icelog.warning('Car:start up')

car = CarMachine("Car")

## not needed I believe self starts friom __init__ #s conveyor.on_event("startup_event")


# for now chuck in a run forever
while car.running:
	pass