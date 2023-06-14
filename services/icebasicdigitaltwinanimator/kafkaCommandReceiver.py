# custom logger class to add kafka message passing as a function of loggging
import websocket
import json
import logging
import configparser
import time
try:
    import thread
except ImportError:  # TODO use Threading instead of _thread in python3
    import _thread as thread

class commandReceiver():


	def directSend(self,  messageString):
	    #print("Sending 'Hello, World'...")
	    logging.info("### kafka command direct sending other  ###")
	    #ws = websocket.create_connection(self.websocketaddress)
	    #self.ws.send("{ \"topic\" : \"other\", \"message\" :\""+messageString+"\"  }")
	    payloadjs = {}
	    payloadjs["topic"] = "test"
	    payloadjs["message"] = messageString
	    wspayload = json.dumps(payloadjs)

	    self.ws.send(wspayload)

	    logging.info("### kafka command direct Sent other ###")


	def directSend(self,  messageString, topic):
	    #print("Sending 'Hello, World'...")
	    logging.info("### kafka command direct sending ###")
	    #wspayload = "{ \"topic\" : \""+topic+"\", \"message\" :\""+messageString+"\"  }"
	    payloadjs = {}
	    payloadjs["topic"] = topic
	    payloadjs["message"] = messageString
	    wspayload = json.dumps(payloadjs)

	    self.ws.send(wspayload)
	    logging.info("### kafka command direct Sent ### topic:"+topic)


	def on_message(self,ws, message):
		logging.info("### kafka command on_message:"+message)
		try:
			j = json.loads(message)
		except:
		    logging.error("### kafka message on_message:Not JSON")
		try:
			payload = json.loads(j['message'])
			topic = j['topic']
		except:
		    # handle this
		    logging.error("### kafka command on_message:NOT JSON")
		    logging.error("%s" % j['message'])
		#if (payload['action']=="start"):
		#	self.machine.receive_event(payload['task'])
		if (topic=='commands' and payload['action']=="done"):
			# ignore our own responses
			pass
		elif (topic=='commands'):
			# deal with command from PDEmessage
			logging.info("###kafkaCommandReceiver:on_message  ### topic:commands message :"+message)
			self.commandHandler(payload)
			pass

	def on_error(self,ws, error):
		logging.error("### kafka command error ###")
		logging.error(error)

	def on_close(self,ws):
		logging.info("### kafka command websocket closed ###")
		def bootstrapws(*args):
			print("### bootstrap2 ###")
			websocket.enableTrace(False)
			# self.ws = websocket.WebSocketApp("ws://192.168.0.10:7061/v2/broker/?topics=commands",
			#self.ws = websocket.WebSocketApp(self.websocketaddress+"?topics=commands",
			self.ws = websocket.WebSocketApp(self.websocketaddress+"?topics=carnav,commands",
			on_message = self.on_message,
			on_error = self.on_error,
			on_close = self.on_close,
			on_open = self.on_open)
			self.ws.run_forever()

		logging.info("### bootstrap2 thread ###")
		thread.start_new_thread(bootstrapws, ())


	def on_open(self,ws):
		logging.info("### kafka command opened ###")
		self.directSend("Hello kafka python up", "other")


	def __init__(self, commandHandler):
		config = configparser.RawConfigParser()
		config.read('default.cfg')
		self.websocketaddress = config.get("Main","websocketaddress")
		self.commandHandler = commandHandler
		logging.getLogger().setLevel(logging.INFO)


		def bootstrapws(*args):
			websocket.enableTrace(False)
			# self.ws = websocket.WebSocketApp("ws://192.168.0.10:7061/v2/broker/?topics=commands",
			#self.ws = websocket.WebSocketApp(self.websocketaddress+"?topics=commands",
			self.ws = websocket.WebSocketApp(self.websocketaddress+"?topics=carnav,commands",
			on_message = self.on_message,
			on_error = self.on_error,
			on_close = self.on_close,
			on_open = self.on_open)
			self.ws.run_forever()

		thread.start_new_thread(bootstrapws, ())
		logging.info("### kafka command receiver inited ###")
	





