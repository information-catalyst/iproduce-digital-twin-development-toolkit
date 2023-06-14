try:
    # for Python2
    from Tkinter import *   ## notice capitalized T in Tkinter 
except ImportError:
    # for Python3
    from tkinter import filedialog
    from tkinter import *   ## notice lowercase 't' in tkinter here

import os
import logging

try:
    import xml.etree.cElementTree as ET
except ImportError:
    import xml.etree.ElementTree as ET

import sys

'''
try:
	fileName = sys.argv[1]
except Exception as e:
	logging.error("Usage:python xmltest filename")
	exit()
'''



tkroot = Tk()


tkroot.filename =  filedialog.askopenfilename(initialdir = os.getcwd(),title = "Select file",filetypes = (("bpmn files","*.bpmn"),("all files","*.*")))
print (tkroot.filename)


# read file
try:
	#tree = ET.ElementTree(file='bpmn/new.bpmn')
	tree = ET.ElementTree(file=tkroot.filename)
except Exception as e:
	logging.error("Error:File not found"+str(e))
	exit()


# set up gui
frame = Frame(tkroot)
frame.pack()

bottomframe = Frame(tkroot)
bottomframe.pack( side = BOTTOM )


def saveFileXML():
	global tkroot
	tkroot.outfilename =  filedialog.asksaveasfilename(initialdir = os.getcwd(),title = "Save file",filetypes = (("bpmn files","*.bpmn"),("all files","*.*")))
	# note wb is required write to sys.stdout wil fail
	tree.write(open(tkroot.outfilename, 'wb'))
	#tree.write(sys.stdout)
	pass

# load and display file
for elem in tree.iter(tag='{http://www.omg.org/spec/BPMN/20100524/MODEL}task'):	
	taskName = elem.attrib['name']
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
	
	lineframe = Frame(tkroot)
	lineframe.pack( side = TOP )



	var = StringVar()
	label = Label( lineframe, textvariable=var, relief=RAISED )
	var.set(taskID)
	label.pack(side = LEFT)

	

	var = StringVar()
	label = Label( lineframe, textvariable=var, relief=RAISED )
	var.set('averageTime')
	label.pack(side = LEFT)
	averageTimeSpinvar = StringVar()
	averageTimeSpinvar.set(elem.attrib['averageTime'])
	x = Spinbox(lineframe, from_=1, to=10, justify = RIGHT, width = 3,textvariable=averageTimeSpinvar, command= lambda arg1=averageTimeSpinvar, arg2=elem : arg2.set('averageTime',arg1.get()))
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
	


redbutton = Button(bottomframe, text="Red", fg="red")
redbutton.pack( side = LEFT)

greenbutton = Button(bottomframe, text="Brown", fg="brown")
greenbutton.pack( side = LEFT )

bluebutton = Button(bottomframe, text="Blue", fg="blue")
bluebutton.pack( side = LEFT )


blackbutton = Button(bottomframe, text="SaveAs", fg="black",command=saveFileXML)
blackbutton.pack( side = LEFT)



tkroot.mainloop()