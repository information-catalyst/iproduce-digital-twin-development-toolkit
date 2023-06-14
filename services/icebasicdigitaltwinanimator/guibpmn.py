'''
Python TKinter  app to run simulations of kafka triggered tasks
Allows PDE to run provides info for Analysis debugging

run from cli with
python guibpmn.py

useful TKinter links
TKinter widget reference
http://www.tutorialspoint.com/python/python_gui_programming.htm

adding parameterised commands to buttons etc
https://stackoverflow.com/questions/6920302/how-to-pass-arguments-to-a-button-command-in-tkinter

file dialogs
https://pythonspot.com/tk-file-dialogs/

message boxes
https://pythonspot.com/tk-message-box/

predefined colour names
https://wiki.tcl.tk/37701


Using elemtree to process XML in python
https://eli.thegreenplace.net/2012/03/15/processing-xml-in-python-with-elementtree

File menu and application class structure
https://stackoverflow.com/questions/22811808/tkinter-unknown-option-menu


NOTE written for Python 3 should port to Python 2
NOTE very rough error handling so don't be obtuse

'''

try:
    # for Python2
    from Tkinter import *   ## notice capitalized T in Tkinter 
except ImportError:
    # for Python3
    from tkinter import filedialog
    from tkinter import messagebox
    from tkinter import *   ## notice lowercase 't' in tkinter here

import os
import logging
import json
import time
import random


try:
    import xml.etree.cElementTree as ET
except ImportError:
    import xml.etree.ElementTree as ET

import sys



from kafkaCommandReceiver import commandReceiver

## set log level at some point reduce the noise
logging.getLogger().setLevel(logging.INFO)





# globals so sue me or more accurately next time the whole thing becomes an application class
timeVariation = 10.0		# + or - percentage
lastSuccessful = True   	# did the last task complete successfully or silently fail
tasks = {}					# tasks and attributes to process
taskToGui = {}				# map taskid to it's GUI label for highlight when task is running
simulationRunning = False	# is the simulation processing kafka command topic messages

# hook in kafka
# deal with kafka messages in the command topic







# Initialisation


# GUI wizardry don't use tkroot directly but do this stuff instead
# todo next time we code in the application class
class Application(Tk):

	def commandProcessor(self, payloadObject):
		global lastSuccessful

		logging.info("commandProcessor")
		print(payloadObject)

		if simulationRunning == False:
			return

		if ('task' in payloadObject) == False:
			# bail if there isn't a task for use to execute
			return

		#{'source': 'PDE', 'timestamp': 1527255807999, 'task': 'Task_1kuhjw5', 'action': 'start'}
		# find task
		logging.info("commandProcessor:task:%s" % payloadObject['task'])
		if payloadObject['task'] in tasks:
			task = tasks[payloadObject['task']]
			taskToGui[payloadObject['task']]
		else:
			return		# ignore stuff not meant for us

		# run task
		logging.info("commandProcessor:selected task:%s" % task)
		#locallineframe = taskToGui[payloadObject['task']]
		#locallineframe.config(highlightbackground="Green",highlightthickness=4,highlightcolor="Green", bd=4)
		locallable = taskToGui[payloadObject['task']]
		locallable.config(bg="Green")
		completed, success, timetaken = self.runtask(task,lastSuccessful)
		print(task['Name'])
		print(completed)
		print(success)
		print(timetaken)

		if completed==True and success==False :
			# silent fail
			locallable.config(bg="Yellow")
		if success==False and completed==False:
			# fail
			locallable.config(bg="Red")
		if completed==True and success==True :
			# successful task
			locallable.config(bg="blue")



		# send response or not
		if(completed==True and lastSuccessful==True):
			responseObject= payloadObject
			timestampmsg = '%.0f' % ((time.time()*1000))
			responseObject["factory"] = "testFactory"
			responseObject["machine"] = "testMachine"
			responseObject["source"] = "testMachine"
			responseObject["action"] = "done"
			responseObject["timestamp"] = timestampmsg
			payload = json.dumps(responseObject)

			self.mycmds.directSend(payload,"commands")
		# if this task was unsuccessful
		lastSuccessful = success


	# simulate a task running on the physical factory (or elsewhere)
	def runtask(self, task, lastSuccessful):
		logging.info("runTask" )
		# how long will it take
		taskRunTime = task['averageTime']
		variation = random.uniform(-timeVariation/10.0,timeVariation/10.0)
		taskRunTime = taskRunTime + variation
		logging.info("runTask:taskRunTime %d" % taskRunTime )

		time.sleep(taskRunTime)

		# if the last task failed this will fail
		if lastSuccessful==False:
			return False, False, taskRunTime

		# but does it actually finish
		appearsToComplete = True
		successfullTask = True
		chanceOfFinishing = 100 - (task['silentFail'] + task['completionFail'])
		logging.info("runTask:chanceOfFinishing %d" % chanceOfFinishing )
		if chanceOfFinishing < 0:
			logging.warning("runTask: no chance of finishing" )
			chanceOfFinishing = 0
		chanceThisTime = random.randint(0,100) 
		logging.info("runTask:chanceThisTime %d" % chanceThisTime )
		## check highest chance first
		if chanceThisTime > chanceOfFinishing + task['silentFail']:
			# completion fail such as stuck motor
			logging.info("runTask: completion fail" )
			appearsToComplete = False
			successfullTask = False
			pass
		elif chanceThisTime > chanceOfFinishing:
			# silent fail such as counter drop
			logging.info("runTask: silent fail" )
			appearsToComplete = True
			successfullTask = False
			pass
		else:
			# succends
			logging.info("runTask: task completes" )
			appearsToComplete = True
			successfullTask = True
			pass

		return appearsToComplete, successfullTask, taskRunTime







	def extendTreeProperties(self):
		global tree
		for elem in tree.iter(tag='{http://www.omg.org/spec/BPMN/20100524/MODEL}task'):	
			taskID = elem.attrib['id']
			behaviourName = taskID+"_behaviour"

			
			#add behaviour element
			if 'behaviour' not in elem.attrib:
				elem.set('behaviour',behaviourName)
			# add time
			if 'averageTime' not in elem.attrib:
				elem.set('averageTime',"7")

			# add compltion chances
			if 'silentFail' not in elem.attrib:
				elem.set('silentFail',"5")
			if 'completionFail' not in elem.attrib:
				elem.set('completionFail',"4")
			

	def loadTreeFile(self):
		global tree
		# nice and crude force aa  file load
		self.filename =  filedialog.askopenfilename(initialdir = os.getcwd(),title = "Select file",filetypes = (("bpmn files","*.bpmn"),("all files","*.*")))
		print (self.filename)


		# read file
		try:
			#tree = ET.ElementTree(file='bpmn/new.bpmn')
			tree = ET.ElementTree(file=self.filename)
		except Exception as e:
			logging.error("Error:File not found"+str(e))
			exit()




	def clearSimulation(self):
		global lastSuccessful
		global simulationRunning

		# clear outstanding  status's
		lastSuccessful = True
		# clear all tasks to show not executing
		for key, guiItem in taskToGui.items():
			guiItem.config(bg="SystemButtonFace")

		# clear and reset the run simulation button
		self.runButton.config(bg="SystemButtonFace")
		simulationRunning = False

	def runSimulation(self):
		global tasks
		global simulationRunning

		# only hit the run button once
		if simulationRunning == True:
			return

		# fill in task list, needed to copy latest values form XML tree
		for elem in tree.iter(tag='{http://www.omg.org/spec/BPMN/20100524/MODEL}task'):	
			taskName = elem.attrib['name']
			taskID = elem.attrib['id']
			taskaverageTime = float(elem.attrib['averageTime'])
			tasksilentFail = int(elem.attrib['silentFail'])
			taskcompletionFail = int(elem.attrib['completionFail'])
			tasks[taskID]={'Name': taskName, 'averageTime': taskaverageTime, 'silentFail': tasksilentFail, 'completionFail': taskcompletionFail}
		#print(tasks)
		#mycmds = commandReceiver(commandProcessor)
		simulationRunning = True
		self.runButton.config(bg="Grey")


	def saveFileXML(self):
		self.outfilename =  filedialog.asksaveasfilename(initialdir = os.getcwd(),title = "Save file",filetypes = (("bpmn files","*.bpmn"),("all files","*.*")))
		# note wb is required write to sys.stdout will fail
		tree.write(open(self.outfilename, 'wb'))
		#tree.write(sys.stdout)
		pass

	def buildDisplayFrame(self):
	# load and display file
	# map the GUI to taskIDs so we can highlight at run time
	# todo again code an application class and make this as a method to clean up reloads
	# set up GUI elements one line per task
			global taskToGui
			taskToGui = {}
			# empty 	
			self.mainframe.destroy()
			self.mainframe = Frame(self)
			self.mainframe.pack()
			
			for elem in tree.iter(tag='{http://www.omg.org/spec/BPMN/20100524/MODEL}task'):	
				taskID = elem.attrib['id']




				# frame to hold a tasks row in the interface
				lineframe = Frame(self.mainframe)
				lineframe.pack( side = TOP )

				# task ID
				var = StringVar()
				label = Label( lineframe, textvariable=var, relief=RAISED )
				var.set(taskID)
				label.pack(side = LEFT)
				#label.pack(side = LEFT,expand=YES, fill=BOTH)		### todo investigate these options
				# add to a list of gui items so we can highlight running tasks
				taskToGui[taskID] = label
				
				# average time
				var = StringVar()
				label = Label( lineframe, textvariable=var, relief=RAISED )
				var.set('averageTime')
				label.pack(side = LEFT)
				averageTimeSpinvar = StringVar()
				averageTimeSpinvar.set(elem.attrib['averageTime'])
				x = Spinbox(lineframe, from_=1, to=60, justify = RIGHT, width = 3,textvariable=averageTimeSpinvar, command= lambda arg1=averageTimeSpinvar, arg2=elem : arg2.set('averageTime',arg1.get()))
				x.pack(side = LEFT)
				
				var = StringVar()
				label = Label( lineframe, textvariable=var, relief=RAISED )
				var.set('silentFail')
				label.pack(side = LEFT)
				silentFailSpinvar = StringVar()
				silentFailSpinvar.set(elem.attrib['silentFail'])
				y = Spinbox(lineframe, from_=0, to=100, justify = RIGHT, width = 3,textvariable=silentFailSpinvar, command= lambda arg1=silentFailSpinvar, arg2=elem : arg2.set('silentFail',arg1.get()))
				y.pack(side = LEFT)

				var = StringVar()
				label = Label( lineframe, textvariable=var, relief=RAISED )
				var.set('completionFail')
				label.pack(side = LEFT)
				completionFailSpinvar = StringVar()
				completionFailSpinvar.set(elem.attrib['completionFail'])
				z = Spinbox(lineframe, from_=0, to=100, justify = RIGHT, width = 3,textvariable=completionFailSpinvar, command= lambda arg1=completionFailSpinvar, arg2=elem : arg2.set('completionFail',arg1.get()))
				z.pack(side = LEFT)		


	# force labels to fixed width
	def evenUpGUI(self):
		# 
		global taskToGui
		self.update_idletasks()
		maxwidth =-1
		for key, guiItem in taskToGui.items():
			print (guiItem.winfo_width())
			if guiItem.winfo_width() > maxwidth:
				maxwidth = guiItem.winfo_width()
		maxwidth = maxwidth /6
		maxwidth = int(maxwidth)
		for key, guiItem in taskToGui.items():
			guiItem.config(width=maxwidth)

	def loadAndProcessBPMN(self):
		self.loadTreeFile()
		self.extendTreeProperties()
		self.buildDisplayFrame()
		self.evenUpGUI()		


	# handy code for message and dialog boxes
	def boomButton_click(self):
		messagebox.showerror("Error", "Don't press the red button")
		#messagebox.showwarning("Warning","Warning message")
		#messagebox.showinfo("Information","Informative message")
		#result = messagebox.askokcancel("Title","The application will be closed")
		#print (result)
		#result = messagebox.askyesno("Title","Do you want to save?")
		#print (result)
		#result = messagebox.askretrycancel("Title","Installation failed, try again?")
		#print (result)

	def createWidgets(self):
		self.winfo_toplevel().title("DigitalTwin - kafka process simulator")
		# menu
		self.menuBar = Menu(master=self)
		self.filemenu = Menu(self.menuBar, tearoff=0)
		self.filemenu.add_command(label="Load", command=self.loadAndProcessBPMN)
		self.filemenu.add_command(label="Save", command=self.saveFileXML)
		self.filemenu.add_command(label="Quit!", command=self.quit)
		self.menuBar.add_cascade(label="File", menu=self.filemenu)
		# frames
		self.mainframe = Frame(self)
		self.mainframe.pack()
		# bottom frame holds function buttons
		self.bottomframe = Frame(self)
		self.bottomframe.pack( side = BOTTOM )

		# command buttons
		self.runButton = Button(self.bottomframe, text="RUN", command = self.runSimulation)
		self.runButton.pack( side = LEFT)

		self.clearButton = Button(self.bottomframe, text="Clear", command = self.clearSimulation)
		self.clearButton.pack( side = LEFT )

		self.bluebutton = Button(self.bottomframe, text="RED", fg="red", command = self.boomButton_click)
		self.bluebutton.pack( side = LEFT )

		self.saveButton = Button(self.bottomframe, text="SaveAs", command=self.saveFileXML)
		self.saveButton.pack( side = LEFT)


	def __init__(self):
		Tk.__init__(self)
		self.createWidgets()
		self.config(menu=self.menuBar)
		self.loadAndProcessBPMN()
		# hook into kafka command topic
		self.mycmds = commandReceiver(self.commandProcessor)


tkroot = Application()






# also set up kick things off





# run as gui application
tkroot.mainloop()
