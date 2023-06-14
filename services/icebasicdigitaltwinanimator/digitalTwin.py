import json
import time
import logging
import random

from kafkaCommandReceiver import commandReceiver

## set log level at some point reduce the noise
logging.getLogger().setLevel(logging.INFO)


timeVariation = 10.0	# + or - percentage
'''
#define behaviours
defaultBehaviour = {'Name': 'defaultBehaviour', 'averageTime': 7, 'silentFail': 5, 'completionFail': 5}
riskyBehaviour = {'Name': 'riskyBehaviour', 'averageTime': 3, 'silentFail': 45, 'completionFail': 45}
alwaysFailBehaviour = {'Name': 'riskyBehaviour', 'averageTime': 3, 'silentFail': 0, 'completionFail': 100}

# define tasks
tasks = {
"defaultTask" : {'Name': 'defaultTask', 'behaviour': defaultBehaviour},
"riskyTask"  : {'Name': 'riskyTask', 'behaviour': riskyBehaviour},
"namedTask"  : {'Name': 'namedTask', 'behaviour': defaultBehaviour},
"Task_thing2"  : {'Name': 'Task_thing2', 'behaviour': alwaysFailBehaviour}
}
'''
# COPY PASTE FROM HERE
# define behaviours
Task_StartBeltA1_behaviour = {'Name': 'Task_StartBeltA1_behaviour', 'averageTime': 7, 'silentFail': 5, 'completionFail': 5}
Task_ResetAState_behaviour = {'Name': 'Task_ResetAState_behaviour', 'averageTime': 7, 'silentFail': 5, 'completionFail': 5}
Task_PushAState_behaviour = {'Name': 'Task_PushAState_behaviour', 'averageTime': 7, 'silentFail': 5, 'completionFail': 5}
Task_StartBeltA2_behaviour = {'Name': 'Task_StartBeltA2_behaviour', 'averageTime': 7, 'silentFail': 5, 'completionFail': 5}
Task_ToolAState_behaviour = {'Name': 'Task_ToolAState_behaviour', 'averageTime': 7, 'silentFail': 5, 'completionFail': 5}
Task_SlowBeltA2_behaviour = {'Name': 'Task_SlowBeltA2_behaviour', 'averageTime': 7, 'silentFail': 5, 'completionFail': 5}
Task_StartBeltB1_behaviour = {'Name': 'Task_StartBeltB1_behaviour', 'averageTime': 7, 'silentFail': 5, 'completionFail': 5}
Task_StopBeltA2_behaviour = {'Name': 'Task_StopBeltA2_behaviour', 'averageTime': 7, 'silentFail': 5, 'completionFail': 5}
Task_ConveyorBPush_behaviour = {'Name': 'Task_ConveyorBPush_behaviour', 'averageTime': 7, 'silentFail': 5, 'completionFail': 5}
Task_ResetBState_behaviour = {'Name': 'Task_ResetBState_behaviour', 'averageTime': 7, 'silentFail': 5, 'completionFail': 5}
Task_StartBeltB2_behaviour = {'Name': 'Task_StartBeltB2_behaviour', 'averageTime': 7, 'silentFail': 5, 'completionFail': 5}
Task_MoveToConveyorB_behaviour = {'Name': 'Task_MoveToConveyorB_behaviour', 'averageTime': 7, 'silentFail': 5, 'completionFail': 5}
Task_PickupWhiteState_behaviour = {'Name': 'Task_PickupWhiteState_behaviour', 'averageTime': 7, 'silentFail': 5, 'completionFail': 5}
Task_MoveToConveyorA_behaviour = {'Name': 'Task_MoveToConveyorA_behaviour', 'averageTime': 7, 'silentFail': 5, 'completionFail': 5}
Task_DropState_behaviour = {'Name': 'Task_DropState_behaviour', 'averageTime': 7, 'silentFail': 5, 'completionFail': 5}
Task_ResetState_behaviour = {'Name': 'Task_ResetState_behaviour', 'averageTime': 7, 'silentFail': 5, 'completionFail': 5}
# define tasks
tasks = {
'Task_StartBeltA1' : {'Name': 'StartBeltA1', 'behaviour': Task_StartBeltA1_behaviour},
'Task_ResetAState' : {'Name': 'ResetAState', 'behaviour': Task_ResetAState_behaviour},
'Task_PushAState' : {'Name': 'PushAState', 'behaviour': Task_PushAState_behaviour},
'Task_StartBeltA2' : {'Name': 'StartBeltA2', 'behaviour': Task_StartBeltA2_behaviour},
'Task_ToolAState' : {'Name': 'ToolAState', 'behaviour': Task_ToolAState_behaviour},
'Task_SlowBeltA2' : {'Name': 'SlowBeltA2', 'behaviour': Task_SlowBeltA2_behaviour},
'Task_StartBeltB1' : {'Name': 'StartBeltB1', 'behaviour': Task_StartBeltB1_behaviour},
'Task_StopBeltA2' : {'Name': 'StopBeltA2', 'behaviour': Task_StopBeltA2_behaviour},
'Task_ConveyorBPush' : {'Name': 'ConveyorBPush', 'behaviour': Task_ConveyorBPush_behaviour},
'Task_ResetBState' : {'Name': 'ResetBState', 'behaviour': Task_ResetBState_behaviour},
'Task_StartBeltB2' : {'Name': 'StartBeltB2', 'behaviour': Task_StartBeltB2_behaviour},
'Task_MoveToConveyorB' : {'Name': 'MoveToConveyorB', 'behaviour': Task_MoveToConveyorB_behaviour},
'Task_PickupWhiteState' : {'Name': 'PickupWhiteState', 'behaviour': Task_PickupWhiteState_behaviour},
'Task_MoveToConveyorA' : {'Name': 'MoveToConveyorA', 'behaviour': Task_MoveToConveyorA_behaviour},
'Task_DropState' : {'Name': 'DropState', 'behaviour': Task_DropState_behaviour},
'Task_ResetState' : {'Name': 'ResetState', 'behaviour': Task_ResetState_behaviour},
}





# available tasks
#tasks = [defaultTask, namedTask, riskyTask,alwaysFailTask]


# hook in kafka
def commandProcessor(payloadObject):
	logging.info("commandProcessor")
	print(payloadObject)
	#{'source': 'PDE', 'timestamp': 1527255807999, 'task': 'Task_1kuhjw5', 'action': 'start'}
	# find task
	logging.info("commandProcessor:task:%s" % payloadObject['task'])
	if payloadObject['task'] in tasks:
		task = tasks[payloadObject['task']]
	else:
		task = tasks["defaultTask"]
	# run task
	logging.info("commandProcessor:selected task:%s" % task)
	completed, success, timetaken = runtask(task)
	print(task['Name'])
	print(completed)
	print(success)
	print(timetaken)
	# send response or not
	if(completed==True):
		responseObject= payloadObject
		timestampmsg = '%.0f' % ((time.time()*1000))
		responseObject["Factory"] = "testFactory"
		responseObject["Machine"] = "testMachine"
		#responseObject["task"] = taskname
		responseObject["action"] = "done"
		responseObject["timestamp"] = timestampmsg
		payload = json.dumps(responseObject)

		mycmds.directSend(payload,"commands")


mycmds = commandReceiver(commandProcessor)

def runtask(task):
	logging.info("runTask" )
	# how long will it take
	taskRunTime = task['behaviour']['averageTime']
	variation = random.uniform(-timeVariation/10.0,timeVariation/10.0)
	taskRunTime = taskRunTime + variation
	logging.info("runTask:taskRunTime %d" % taskRunTime )

	time.sleep(taskRunTime)


	# but does it actually finish
	appearsToComplete = True
	successfullTask = True
	chanceOfFinishing = 100 - (task['behaviour']['silentFail'] + task['behaviour']['completionFail'])
	logging.info("runTask:chanceOfFinishing %d" % chanceOfFinishing )
	if chanceOfFinishing < 0:
		logging.warning("runTask: no chance of finishing" )
		chanceOfFinishing = 0
	chanceThisTime = random.randint(0,101) 
	logging.info("runTask:chanceThisTime %d" % chanceThisTime )
	## check highest chance first
	if chanceThisTime > chanceOfFinishing + task['behaviour']['silentFail']:
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

def testTasks():
	for task in tasks:
		completed, success, timetaken = runtask(task)
		print(task['Name'])
		print(completed)
		print(success)
		print(timetaken)

def runForEver():
	input("Press Enter to continue...")



#testTasks()
runForEver()