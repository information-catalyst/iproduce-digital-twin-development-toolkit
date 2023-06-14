import json
import time
import logging
import iceLogger


# Register our logger
logging.setLoggerClass(iceLogger.iceLogger)
icelog = logging.getLogger("iceLogger")


def logIO(messageString):
    #icelog.io("machine:Car,%s" % messageString)
    pass

from navMachine import navMachine


class navMachineRoboPY(navMachine):
    def __init__(self, xNavCommand):
        super().__init__(xNavCommand)

    def stop(self):
        pass

    def rotateLeft(self):
        pass

    def rotateRight(self):
        pass

    def moveForward(self):
        pass

    def moveBackward(self):
        pass


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