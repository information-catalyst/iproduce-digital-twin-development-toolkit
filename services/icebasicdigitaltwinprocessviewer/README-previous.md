# Process Viewer

This program uses [bpmn-js](https://github.com/bpmn-io/bpmn-js) to implement a modeler for BPMN 2.0 process diagrams. It shows the current status of the Process after loading it via a Kafka message.

## About

This example is a node-style web application that builds a user interface around the bpmn-js BPMN 2.0 modeler.
On receiving a kafka message it updates the current active task.


## Building

You need a [NodeJS](http://nodejs.org) development stack with [npm](https://npmjs.org) installed to build the project.

To install all project dependencies execute

```
npm install
```

```
npm run mydev
```

Both tasks generate the distribution ready client-side modeler application into the `public` folder.

Serve the application locally or via a web server (nginx, apache, embedded).