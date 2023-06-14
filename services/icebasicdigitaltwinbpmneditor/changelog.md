# Change Log
List of changes to CREMA PDE


#### Version 0.2.1

### Added
- Add global delete tool
- Improve service plan variable visualization
- CRUD constant values as service inputs

### Fixes
- Fixed search in service plan XML
- Fixed issues in optimisation


#### Version 0.2.0

### Changed
- Updated all dependent libraries to their latest versions
- Add color manager
- Add multi language support
- Switched from gulp to webpack
- Complete refactoring
- Add unit tests support


#### Version 0.1.9 - 2017-06-01

### Changed
- Updated all dependent libraries to their latest versions
- Process simulation - support for multiple threads, follow single thread
- Added minimap visual helper
- Support for copy/paste between multiple diagrams
- Fixed Firefox scrolling issues in tables
- Integration of the SPC
- Added possibility to open process model directly by url parameter (openProcess={processId})
- trigger user to optimize process by providing blinking effect on optimisation button when url param action=optimisation
- Improved XML Editor, instant update when changing property values, search and line wrap
- Draw marketplace icons in diagram
- Tools panel custom resize, visibility stored at user storage level
- Improve open process on file drop


#### Version 0.1.81 - 2017-04-27

### Added
- Added UUIds for new process models, replaced by CRI Id after save
- Support for multiple process models tabs overflowing
- Toggle tools panel visibility
- Basic process simulation
- Add/Remove preconditions and effects within the annotations editor in properties panel
- Add/Remove preconditions and effects by providing raw input data

### Fixes
- Fixed set LastModifiedDate when saving process
- Set default sort to LastModifiedDate descending in model store
- Fixed process manager, close document 2 when there are 3
- Fixed service plan parser when bindings and assignments are empty
- Fixed precondition/effect service annotations, when switching from multiple to single annotation


## [0.1.7] - 2017-02-15
### Added

- Improved script editor, Javascript syntax check and highlight
- Added camunda support properties for services
- Added COP (constraint optimisation problem) editor at process level
- Semantic editor, show preconditions/effects
- Improved visual presentation of service QoS
- Improved visual presentation of service inputs, outputs, preconditions and effects
- BPMN Annotations for abstract and concrete marketplace services
- Fixed marketplace service drag&drop coordinates, if application is used inside CREMA Dashboard
- Add full screen feature
- Added <crema:expr> support for preconditions and effects
- <crema:service> implementation will now removed as expected, when a service will be removed in the designer
- Added service matching and the consequential replacement of a service (replace abstract with concrete service)
- Add XML view for PSP in optimisation window
- Integration with DHS
- Integration with ODERU
- Added service default functionality (concrete service as a default for an abstract service)
- Added service default manager (accessible from marketplace panel)


## [0.1.6] - Intermediate release


## [0.1.5] - 2017-01-20
### Added
- Allow user to change bpmn colors
- New custom palette
- New process isExecutable = true for camunda support
- Process becomes readonly when service plan is approved
- MPM services with preconditions and effects
- Script editor for bpmn:script tasks in properties panel
- XML Viewer, syntax highlight support

### Fixed
- Set zoom to 100%


## [0.1.4] - 2016-12-27
### Added
- Semantic annotations wizard
- Ontology graph
- Open a process by drag and drop file
- Sequence flow condition editor
- Gateway editor
- Drag and drop marketplace service to diagram
- Properties for main process
- Validation for gateways
- Align and distribute elements

### Changed
- Improved marketplace
- Improved process store
- Improved service plan detail
- Improved undo/redo support


## [0.1.3] - 2016-10-06
### Added
- About dialog
- Loading/Saving indicators
- Display import warnings
- Display * at process tab title for unsaved processes
- Marketplace panel
- Properties panel - extension elements
- Semantic Annotations - mockup
- Optimization panel - integration with ODERU - step 2
- DHS integration - mockup


## [0.1.2] - 2015-08-19
### Added
- Improved look & feel
- New component to group tool panels at the right
- New properties panel that will allow us to have more control over property editing
- New optimization panel that mockups calls to ODERU
- Added Karma/Jasmine support for unit testing


## [0.1.1] - 2015-07-22
### Added
- Improved separation between Process Manager/Modeler components
- Improved sync between toolbars and process status
- Show Design/Xml View
- Full interaction with CRI API, now you can open/store/delete processes in CRI storage
- Ask for save changes when closing process tab
- Custom renderer test, abstract services are rendered in red, concrete in yellow

### Fixed
- Trying to open the same file from disk, did nothing, now it opens a new tab
- Other minor bugs and style fixes


## [0.1.0] - 2015-07-15
### Added
- AngularJS 1.5.x component based architecture
- Typescript and BPMNJS annotations
- Bootstrap, Gulp
- Multiple tab interface, ability to open multiple process models
- Open and save process from/to disk
- Retrieve list of processes from public CRI API
- Basic validation errors
- Basic tooling support with search, undo, redo, copy, paste, fit to window
- Crema Bpmn XML extensions
- Properties panel skeleton
