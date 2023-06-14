import logging

try:
    import xml.etree.cElementTree as ET
except ImportError:
    import xml.etree.ElementTree as ET

import sys

try:
	fileName = sys.argv[1]
except Exception as e:
	logging.error("Usage:python xmltest filename")
	exit()

# read file
try:
	#tree = ET.ElementTree(file='bpmn/new.bpmn')
	tree = ET.ElementTree(file=fileName)
	fileName
except Exception as e:
	logging.error("Error:File not found"+str(e))
	exit()

# root element
root = tree.getroot()

# Testing code
'''
# print everything
for elem in tree.iter():
	print ("TAG: %s ATTRIB: %s" % (elem.tag, elem.attrib))

# search for tasks
print (">>>>>>>>>>>>>>>>>>>>>>>>>>>> JUST TASKS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
for elem in tree.iter(tag='{http://www.omg.org/spec/BPMN/20100524/MODEL}task'):	
	taskName = elem.attrib['name']
	taskID = elem.attrib['id']
	behaviourName = taskID+"_behaviour"
	#add behaviour element
	elem.set('behaviour',behaviourName)
	print ("TAG: %s ATTRIB: %s" % (elem.tag, elem.attrib))
	print (elem.attrib['name'])
'''
# add behaviours
for elem in tree.iter(tag='{http://www.omg.org/spec/BPMN/20100524/MODEL}task'):	
	taskName = elem.attrib['name']
	taskID = elem.attrib['id']
	behaviourName = taskID+"_behaviour"
	#add behaviour element
	elem.set('behaviour',behaviourName)

	


print("# COPY PASTE FROM HERE")
print("# define behaviours")
for elem in tree.iter(tag='{http://www.omg.org/spec/BPMN/20100524/MODEL}task'):	
	print ("%s = {'Name': '%s', 'averageTime': 7, 'silentFail': 5, 'completionFail': 5}" % (elem.attrib['behaviour'], elem.attrib['behaviour']))

print("# define tasks")
print("tasks = {")
for elem in tree.iter(tag='{http://www.omg.org/spec/BPMN/20100524/MODEL}task'):	
	print ("'%s' : {'Name': '%s', 'behaviour': %s}," % (elem.attrib['id'], elem.attrib['name'], elem.attrib['behaviour']))

print("}")	