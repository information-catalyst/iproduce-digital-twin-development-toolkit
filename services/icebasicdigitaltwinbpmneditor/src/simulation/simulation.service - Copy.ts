import * as angular from "angular";

import { IManagerService, IProcessModeler } from "_core";
import { IProcessMessagesService, ProcessMessageType } from "../process-manager";
import { ICommentService, Comment } from "../_common/services/comment/comment.svc";
import { IUtilService } from "../_common";

import {
  IBpmnTypesService,
  ICanvasService,
  IOverlayService,
  ISelectionService
} from "process-modeler";


export enum SimulationState {
  Stopped,
  Running
}


export enum SimulationThreadState {
  Running,
  Waiting,
  Finished,
}


export interface IThreadChoice {
  element: IModdleElement;
  text: string;
}


/**
 * We use this class to describe a single simulation thread.
 * When process execution reaches to a parallel gateway, two threads are created
 */
export interface ISimulationThread {
  color: string;
  status: SimulationThreadState;
  element: IModdleElement;
  following: boolean;
}



export interface ISimulationService {

  canSimulate(): boolean;

  getThreads(): ISimulationThread[];
  getState(): SimulationState;

  stopSimulation(): void;

  toggleFollowThread(thread: ISimulationThread): void;
  toggleSimulation(): void;
  isSimulating(): boolean;

  hasWaitingThreads(): boolean;
  getWaitingThreads(): ISimulationThread[];
  getWaitingThreadChoices(): IThreadChoice[];
  setThreadChoice(choice: IThreadChoice): void;

}


const FOCUS_CSS = "simulation-focus";


class SimulationService implements ISimulationService {


  static $inject = [
    "$timeout",
    "managerService",
    "bpmnTypesService",
    "canvasService",
    "processMessagesService",
    "selectionService",
    "commentService",
    "utilService",
    "$http"
  ];


  private _threads: ISimulationThread[];
  private _waitingThreads: ISimulationThread[];
  private _waitingThreadChoices: IThreadChoice[];


  private _timerHnd: ng.IPromise<any>;

  private _state: SimulationState;

  private _stateChanged: () => void;

  // list of colors for threads, note it should equal array in .less file
  private _colors: string[];

  private returningId;
  private ws: WebSocket;
  private sendFn;


  constructor(
    private $timeout: ng.ITimeoutService,
    private _managerService: IManagerService,
    private _bpmnTypesService: IBpmnTypesService,
    private _canvasService: ICanvasService,
    private _processMessagesService: IProcessMessagesService,
    private _selectionService: ISelectionService,
    private _commentService: ICommentService,
    private _utilService: IUtilService,
    private $http: ng.IHttpService
  ) {

    this._colors = [
      "blue",
      "green",
      "yellow",
      "red",
    ];

    this._threads = [];
    this._waitingThreads = [];
    this._waitingThreadChoices = [];
    this._managerService.onSelectedChanged(this.stopSimulation.bind(this));
    this.connect ();
  }


  private addInfoMessage(): void {
    this._processMessagesService.addMessage({
      id: "simulation",
      type: ProcessMessageType.Information,
      title: "Process simulation is running"
    });
  }


  private removeInfoMessage(): void {
    this._processMessagesService.removeMessage("simulation");
  }


  private stopTimer(): void {
    if (this._timerHnd) {
      this.$timeout.cancel(this._timerHnd);
      this._timerHnd = null;
    }
  }


  private resumeTimer(): void {
    if (!this._timerHnd) {
      this._timerHnd = this.$timeout(this.processThreads.bind(this), 1000);
    }
  }


  private setState(state: SimulationState): void {
    this._state = state;
    if (this._stateChanged) {
      this._stateChanged();
    }
  }


  private addThread(element: IModdleElement): ISimulationThread {

    const thread: ISimulationThread = {
      element: element,
      color: this._colors[this._threads.length], // TODO: find a color not in use
      status: SimulationThreadState.Running,
      following: false
    };

    this._threads.push(thread);
    return thread;
  }


  private clearThreads(): void {
    this._threads.forEach((t) => this.removeMarker(t));
    this._threads.length = 0;
    this._waitingThreads.length = 0;
  }


  private startSimulation(): void {

    // this.addInfoMessage();
    this.setState(SimulationState.Running);

    const selection: IRegistryElement[] = this._selectionService.get();
    let element: IRegistryElement = selection.length ? selection[0] : null;

    // if nothing selected, start from root
    if (!element) {
      element = this._canvasService.getRootElement();
    }

    const thread: ISimulationThread = this.addThread(element.businessObject);
    this.resumeTimer();
  }




  private processThreads(): void {
    // get only live threads
    const liveThreads: ISimulationThread[] = this._threads.filter((t) => t.status === SimulationThreadState.Running);
    for (const thread of liveThreads) {
      this.processThread(thread);
    }

    // if there are threads running, resume timer
    this._timerHnd = null;

    if (this._threads.filter((t) => t.status === SimulationThreadState.Running).length) {
      this.resumeTimer();
    } else if (this._threads.filter((t) => t.status === SimulationThreadState.Finished).length === this._threads.length) {
      this.stopSimulation();
    }

  }

  private deliberateReconnect(){
    // starts as a stub but we may do more than connect e.g.
    // count reconencts over time
    console.log("deliberate reconect")
    this.connect();
  }

  private connect () {
    // because javascript is different from grown up languages
    var that = this;

// Find local IP
    var ip = require("ip");
    console.log ("creating connection to locally hosted kafka web interface" );    
    var ipaddr = ip.address();
    console.log ("ipaddr"+ipaddr );    
    var wsurl = "ws://"+ ipaddr +":7061/v2/broker/?topics=commands";
    console.log ("wsurl"+wsurl );    

// Direct to ICEMAIN
//    console.log ("WebSocket connection:ws://icemain.hopto.org:7061/v2/broker/?topics=commands" );
//    this.ws = new WebSocket ("ws://icemain.hopto.org:7061/v2/broker/?topics=commands");

// Connect to KafkaNetwork from within network internal so use internal port
//    console.log ("WebSocket connection:ws://kafkanetwork_websocket_1:7080/v2/broker/?topics=commands" );
//    this.ws = new WebSocket ("ws://kafkanetwork_websocket_1:7080/v2/broker/?topics=commands");

// connect based on local url
    this.ws = new WebSocket (wsurl);
    this.ws.onopen = function(evt) {
      console.log ("WebSocket connection made " );
    };


    this.sendFn = function (data) {
//      const msg = {"topic": "commands", "message": data};
      const timenow = Date.now();
      const payload = JSON.stringify({"source":"PDE","task":data,"action":"start","timestamp":timenow});
      const msg = {"topic": "commands", "message": payload};
      console.log ("Sending " + JSON.stringify(msg));

      this.ws.send (JSON.stringify(msg));
//      msg.message = "";
    };


    this.ws.onerror = function (evt) {
        console.log("An error occured while connecting... " + evt);
    };
    this.ws.onclose = function () {
        console.log("hello.. The coonection has been closed");
        // assume server time out so reconnect
        that.deliberateReconnect ();
    };
  }


  private processThread(thread: ISimulationThread): void {

    const element: IModdleElement = thread.element;
    let nextElement: IModdleElement = null;

    // if it's a sequence flow, continue
    if (element.targetRef) {

      nextElement = element.targetRef;

    // if container element, look for start event
    } else if (element.flowElements) {

      for (const el of element.flowElements) {
        if (this._bpmnTypesService.isStartEvent(el)) {
          nextElement = el;
          break;
        }
      }

    // if element has multiple exits, create new threads and stop current thread
    } else if (element.outgoing && element.outgoing.length) {

      // if we just have one exit
      if (element.outgoing.length === 1) {

        nextElement = element.outgoing[0];

      // if gateway, set thread status to waiting
      } else if (this._bpmnTypesService.isGateway(element)) {

        // if parallel gateway, create new threads
        if (this._bpmnTypesService.isParallelGateway(element)) {

          element.outgoing.forEach((o) => {
            const thread: ISimulationThread = this.addThread(o);
            this.markAndCenter(thread);
          });

          // now set current thread to finished
          thread.status = SimulationThreadState.Finished;

        // if inclusive/exclusive gateway, pause thread waiting for user action
        } else {

          this._waitingThreads.push(thread);
          thread.status = SimulationThreadState.Waiting;

        }

      }

    // finally, if no other options, if element has parent, continue thru it
    } else if (element.$parent && element.$parent.outgoing) {
      nextElement =  element.$parent.outgoing[0];
    }

    // if we have next element, update thread and mark and center
    // console.log ( " thread following " + nextElement);
    if (nextElement || thread.element.id !== null) {
      const _self = this;
      const sentItem = thread.element.id;

      if (sentItem.startsWith("Startevent")){
        // we will handle start and stop here
            _self.resumeTimer ();
            _self.removeMarker(thread);
            thread.element = nextElement;
            _self.markAndCenter(thread);
      }else if (sentItem.startsWith("Sequence")){
        // deal with linking arrows
            _self.resumeTimer ();
            _self.removeMarker(thread);
            thread.element = nextElement;
            _self.markAndCenter(thread);
      }else if (sentItem.startsWith("Task")){
        // actual stuff we want to do message 
        this.sendFn (sentItem);
        console.log ("sending Item :" + sentItem);

        this.ws.onmessage = function (resp) {
          console.log("this.ws.onmessage");
          var payload = JSON.parse(JSON.parse(resp.data).message);
          var task = payload.task;
          var action = payload.action;

          console.log ("onmessage sent Item :" + sentItem + " response data " + JSON.parse(resp.data).message  );
          console.log ("onmessage task :" + task + " raction: " + action  );
          const completedMsg = sentItem+":done";
//          if (completedMsg === JSON.parse(resp.data).message) {
          if (  (task==sentItem) && (action == "done")) {
            console.log ("Received message from Server " + resp.data + ". Simulation resumed.");
            _self.resumeTimer ();
            _self.removeMarker(thread);
            thread.element = nextElement;
            _self.markAndCenter(thread);
          } else {
            _self.stopTimer ();
            console.log ("Holding off simulation didn't like message");
          }
        };

      }else{
        // dont recognise so ignore probably our command echoed back
            _self.resumeTimer ();
            _self.removeMarker(thread);
            thread.element = nextElement;
            _self.markAndCenter(thread);

      }


     /* const reply = function () {
        _self.$http.get("http://icemain.hopto.org:8056/api/pde/task/" + thread.element.id);
        // console.log ("Sending id " + thread.element.id);
      const inner = function inner () {
          _self._commentService.get("5a7874a654420a18fc62fb6b")
        .then ( (response) => {
            if  (nextElement !== null || nextElement !== undefined) {
              if (response.name === sentItem) {
                // console.log ("Recived " + response.name + " element id " + sentItem);
                _self.resumeTimer ();
                _self.removeMarker(thread);
                thread.element = nextElement;
                _self.markAndCenter(thread);
              } else {
                // console.log ("ELSE " + response.name + " element id " + sentItem);
                _self.stopTimer();
                /*setTimeout (() => {
                    reply ();
                }, 3000);
                inner ();
              }
            } else {
              _self.stopTimer();
              thread.status = SimulationThreadState.Finished;
              return;
            }
        });
       };
       return inner;
      };*/

    // const innerFn = reply ();
    // innerFn ();


    // if no next element, stop the thread
    } else if (thread.status === SimulationThreadState.Running) {
      thread.status = SimulationThreadState.Finished;
    }

  }

/*
  private removeMarker(thread: ISimulationThread): void {
    declare var Promise: any;
    let _self = this;
    let sentId = thread.element.id;
    console.log ("Sent id " + sentId);
    function getData() {
      return new Promise(function(resolve, reject) {
        _self.$http.get("http://icemain.hopto.org:8056/api/pde/task/" + sentId)
        .then ( (results) => {
          resolve({ data: results.data});
        })
        .catch ( (error) => {
          reject(new Error(status));
        });
      /*    if (status === 200 ) {
            resolve({ data: results});
          } else {
            reject(new Error(status));
          }
       // });
      });
    }

    const myData = getData();
    this.stopTimer ();
    myData.then ((response) => {
      console.log ("response " + response.data + " eleenmt id " + thread.element.id);
        if (response.data === thread.element.id) {
          this.resumeTimer();
          this._canvasService.removeMarker(thread.element.id, `${FOCUS_CSS}-${thread.color}`);
          console.log ("data returning witha delay");
        }
    });
  }*/

// THIS IS WORKING FOR VIDEOING ******************

  private removeMarker(thread: ISimulationThread): void {
    this._canvasService.removeMarker(thread.element.id, `${FOCUS_CSS}-${thread.color}`);

  }


     /*this.$http.get("http://icemain.hopto.org:8056/api/pde/task/" + thread.element.id)
     .then((response: any) => {
        if (response.status < 200 || response.status > 299) {
          console.log ("Error ");
          return "error";
        } else {
          console.log ("Response data " + response.data);
          if (response.data !== thread.element.id) {
              _self.stopTimer ();
          } else  {
            _self.resumeTimer();
          }
          return "success";
        }
      });*/
/*
    this._commentService.get(thread.element.id).catch (angular.noop);
    console.log ("Sending id " + thread.element.id);
    // setTimeout(() => {console.log ("waiting 3 seconds"); } , 3000);
    const _self = this;
    const createdId = thread.element.id;
    const reply = function () {
      return _self._commentService.get(thread.element.id)
      .then ( (c) => {
        console.log ("Printing what is returned " + c);
        if (c.toString() !== createdId || c === null || c.toString () === "undefined") {
          console.log ("Returning item in if " + c.toString () + "element id " + createdId );
            _self.stopTimer();
            /*setTimeout (() => {
                reply ();
            }, 5000);
            reply();
        }else {
          console.log ("ELSE " + c.toString () + " element id " + createdId );
          _self.resumeTimer ();
        }

      });
    };
    reply ();
    this._canvasService.removeMarker(thread.element.id, `${FOCUS_CSS}-${thread.color}`);
    */


/*  private removeMarker(thread: ISimulationThread): void {
    this._commentService.get(thread.element.id).catch (angular.noop);
    console.log ("Sending id " + thread.element.id);
    // setTimeout(() => {console.log ("waiting 3 seconds"); } , 3000);
    const _self = this;
    const createdId = thread.element.id;
    const reply = function () {
      return _self._commentService.get(thread.element.id)
      .then ( (c) => {
        console.log ("Printing what is returned " + c);
        if (c.toString() !== createdId || c === null || c.toString () === "undefined") {
          console.log ("Returning item in if " + c.toString () + "element id " + createdId );
            _self.stopTimer();
            /*setTimeout (() => {
                reply ();
            }, 5000);
            reply();
        }else {
          console.log ("ELSE " + c.toString () + " element id " + createdId );
          _self.resumeTimer ();
        }

      });
    };
    reply ();
    this._canvasService.removeMarker(thread.element.id, `${FOCUS_CSS}-${thread.color}`);
  } */


  /**
   * Adds a CSS marker to the element, and centers canvas to the thread, if set to follow
   */
  private markAndCenter(thread: ISimulationThread): void {
    this._canvasService.addMarker(thread.element.id, `${FOCUS_CSS}-${thread.color}`);

    if (thread.following) {
      this._canvasService.centerToId(thread.element.id);
    }
  }


  public canSimulate(): boolean {
    return this._managerService.getModeler() != null;
  }


  public stopSimulation(): void {

    this.stopTimer();
    this.setState(SimulationState.Stopped);
    this.removeInfoMessage();
    this.clearThreads();

  }


  public toggleSimulation(): void {

    if (this.isSimulating()) {
      this.stopSimulation();
    } else {
      this.startSimulation();
    }
  }


  public toggleFollowThread(thread: ISimulationThread): void {
    if (!thread.following) {
      const followThreads: ISimulationThread[] = this._threads.filter((t) => t.following);
      if (followThreads.length) {
        followThreads[0].following = false;
      }
      thread.following = true;
    } else {
      thread.following = false;
    }
  }


  public isSimulating(): boolean {
    return this._state === SimulationState.Running;
  }


  public getState(): SimulationState {
    return this._state;
  }


  public getThreads(): ISimulationThread[] {
    return this._threads;
  }


  public onStateChanged(fn: () => void): void {
    this._stateChanged = fn;
  }


  public hasWaitingThreads(): boolean {
    return this._waitingThreads.length ? true : false;
  }


  public getWaitingThreads(): ISimulationThread[] {
    return this._waitingThreads;
  }


  public getWaitingThreadChoices(): IThreadChoice[] {
    if (! this._waitingThreads.length) {
      return null;
    }

    if (!this._waitingThreadChoices.length) {

      const element: IModdleElement = this._waitingThreads[0].element;
      const choices: IThreadChoice[] = [];

      element.outgoing.forEach((o, index) => {
        this._waitingThreadChoices.push({ element: o, text: o.name || "Output " + (index + 1) });
      });

    }

    return this._waitingThreadChoices;
  }

  /**
   * User has selected desired output, resume thread
   */
  public setThreadChoice(choice: IThreadChoice): void {

    if (! this._waitingThreads.length) {
      return;
    }

    const thread: ISimulationThread = this._waitingThreads[0];
    this._waitingThreadChoices.length = 0;
    this._waitingThreads.splice(0, 1);

    this.removeMarker(thread);
    thread.element = choice.element;
    thread.status = SimulationThreadState.Running;
    this.markAndCenter(thread);

    if (!this._timerHnd) {
      this.resumeTimer();
    }

  }

}


angular
  .module("cremaPDE.simulation")
  .service("simulationService", SimulationService)
  ;
