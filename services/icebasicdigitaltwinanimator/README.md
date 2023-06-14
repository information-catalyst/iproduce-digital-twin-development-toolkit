# ICE Basic Digital Twin Animator
This is the project which animates the model running in the ICEBasicDigitalTwin project.

## Table of Content
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Running the Digital Twin Animator](#running-the-digital-twin-animator)

## Getting Started

### Prerequisites
Make sure you have installed and started all of the following prerequisites:

* Python - [Install Python](https://www.python.org/downloads/) 
* Tkinter - [Tkinter documentation](https://docs.python.org/3/library/tkinter.html)
* Start the [ICE Basic Digital Twin](https://git.icelab.cloud/digitaltwin/basicdigitaltwin/icebasicdigitaltwin) docker-compose file.

### Running the Digital Twin Animator

* Clone the Repository - `$ git clone https://icemain2.hopto.org:4443/digitaltwin/basicdigitaltwin/icebasicdigitaltwinanimator.git`
* Edit default.cfg to point towards your relevant Kafka cluster WebSocket interface
* Run the guibpmn.py - `python3 guibpmn.py`

Once the GUI appears, you have to load the correct BPMN file for the selected process in the ICE basic digital Twin. Then click the RUN button. Now the simulation should work once you start the process from the ICE basic digital twin.


> The Bellow sections are some old documentation written by previous developers. 


# Simulators for running PDE commands locally

## All
edit default.cfg to point towards your local kafka cluster websocket interface


## GUI
Python TKinter  app to run simulations of kafka triggered tasks
Allows PDE to run provides info for Analysis debugging

Run from cli with
python guibpmn.py

You will need a locally saved bpmn file or files
load the bpmn file when prompted

The program should now display a list of task ids

Next to each task there are numeric values for runtime, silentfail, and completionfail.
Numeric values can be adjusted by the spinners but NOT by editing the fields directly

runtime is in seconds, and a task will run for this time plus or minus 10%

silent fail is the percentage chance of the task failing silently, 
i.e. a crane drops a counter but completes it's task

completion failure is the % chance of a task failing to complete,
i.e. a conveyor jams,
in this case no completion messaage is sent,
also a completion fail is triggered if the last task produced a silent fail

Buttons at the bottom control the simulator

RUN starts the sumulator accepting command messages with the current values

Save saves a modified bpmn file with the run time and failure values embedded

Clear cancels RUN and clear any status

Red button, Don't press the red button

### Note
is module six is missing
py -m pip install six
or 
pip install six

When 

### Useful TKinter links
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

File menu and application class structure
https://stackoverflow.com/questions/22811808/tkinter-unknown-option-menu

### Using elemtree to process XML in python
https://eli.thegreenplace.net/2012/03/15/processing-xml-in-python-with-elementtree

### NOTES
NOTE written for Python 3 should port to Python 2
NOTE very rough error handling so don't be obtuse
NOTE CLI version now out of date



## Old Command line only
edit digitalTwin.py to add tasks, change failure chances and run times etc


percentage chance of success is 100 minus chance of silentfail and chance of completion fail, make these 100 to force one or other


run by
python digitalTwin.py

python 3

TODO
simulate behavour affter completion fail
