# custom logger class to add kafka message passing as a function of loggging
import json
import websocket
import logging
import configparser
import time
try:
    import thread
except ImportError:  # TODO use Threading instead of _thread in python3
    import _thread as thread
 

class iceLogger(logging.getLoggerClass()):
#class iceLogger(logging.logger()):
	"""
	def __init__(self):
		super().__init__()
		# Register our logger
		print("initrasb")
		logging.setLoggerClass(iceLogger)
		print("einitras")
	"""
	def someFunc(self, payload):
		ws = websocket.create_connection(self.websocketaddress)
		ws.send(payload)
		ws.close()
		logging.info("Sent")


	def directSend(self,  messageString):
	    logging.info("iceLogger Sending:"+messageString)
	    ws = websocket.create_connection(self.websocketaddress)
	    topic = "test"

	    payloadjs = {}
	    payloadjs["topic"] = topic
	    payloadjs["message"] = messageString
	    wspayload = json.dumps(payloadjs)

	    ws.send(wspayload)
	    ws.close()
	    logging.info("Sent")

	def sendIO(self,  messageString):
	    logging.info("iceLogger Sending:"+messageString)
	    #ws = websocket.create_connection(self.websocketaddress)
	    topic = "io"

	    payloadjs = {}
	    payloadjs["topic"] = topic
	    payloadjs["message"] = messageString
	    wspayload = json.dumps(payloadjs)

	    #ws.send(wspayload)
	    #ws.close()
	    thread.start_new_thread(self.someFunc, (wspayload,))

	    logging.info("Sent")

	# ... override behaviour here
	
	def __init__(self,  name, level= logging.NOTSET):
		#global ws
		super().__init__( name, level)
		logging.getLogger().setLevel(logging.INFO)

		config = configparser.RawConfigParser()
		config.read('default.cfg')
		self.websocketaddress = config.get("Main","websocketaddress")
		self.Logging = config.get("Main", "Logging")
		#websocketaddress = "ws://localhost:7061/v2/broker/"
		#ws = websocket.create_connection(websocketaddress)
		#print("Logging:Initialised")
	
	def warning(self, msg, *args, **kwargs):
		# do a basic logging type warning

		super().warning(msg, *args, **kwargs)

		# use ws interface to kafka to send on 

		# pre pend a time stamp
		# we are using a CSV attribute:value, Attribute2:value2... sort of format
		timestampmsg = 'timestamp:%.0f,%s' % ((time.time()*1000),msg)
		a = timestampmsg.split(',') 
		d = dict(s.split(':') for s in a)

		wspayload = json.dumps(d)

		logging.info("Logging:WS Send, %s" %timestampmsg)
		if self.Logging == "On":
			self.directSend(wspayload)
		else:
			logging.info("Not Sent")


	def io(self, msg, *args, **kwargs):
		# do a basic logging type warning

		super().warning(msg, *args, **kwargs)

		# use ws interface to kafka to send on 

		# pre pend a time stamp
		# we are using a CSV attribute:value, Attribute2:value2... sort of format
		timestampmsg = 'messagetype:io,timestamp:%.0f,%s' % ((time.time()*1000),msg)
		a = timestampmsg.split(',') 
		d = dict(s.split(':') for s in a)

		wspayload = json.dumps(d)

		logging.info("Logging:WS Send, %s" %timestampmsg)
		if self.Logging == "On":
			self.sendIO(wspayload)
		else:
			logging.info("Not Sent")


