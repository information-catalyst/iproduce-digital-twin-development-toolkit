////////////////////////////////////////////////////////////////////////////////
//
//wraps the material around objects and fakes animation
//
////////////////////////////////////////////////////////////////////////////////
function factoryMaterialWrapping(){
  
  //If statement that starts the animation of the belt if conditions are met
  if (document.getElementById('buttonAnimate1').innerHTML == "Stop Belt"){
  		if (glScene.getObjectByName('belt1part1')  ){
    		glScene.getObjectByName('belt1part1').material.map.offset.x -= 0.1;
  		}

  		if (glScene.getObjectByName('belt1part2')  ){
    		glScene.getObjectByName('belt1part2').material.map.offset.x += 0.1;
  		}		
  }

  if (glScene.getObjectByName("containerBayDowel") && containerBayDowelState != 10){
      if (containerBayDowelState == true){
        glScene.getObjectByName('containerBayDowel').material.map.offset.x -= 0.01;
      }
      if (containerBayDowelState == false){
        glScene.getObjectByName('containerBayDowel').material.map.offset.x += 0.01;
      }
  }

  // Conveyor Belt
  if (beltWrapping < 2 && glScene.getObjectByName("belt1part1")) {
    var box1 = glScene.getObjectByName(beltParts[beltWrapping ]);
    var texture = box1.material.map;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 2, 2 + beltWrapping * 2 );
    texture.needsUpdate = true;
    beltWrapping = beltWrapping + 1;
  }

  //Container Bay
  if (containerBayDowel < 1 && glScene.getObjectByName("containerBayDowel")) {
    var rod = glScene.getObjectByName("containerBayDowel");
    var texture = rod.material.map;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 2, 40 );
    texture.needsUpdate = true;
    containerBayDowel = 1;
  }
}


////////////////////////////////////////////////////////////////////////////////
//
//checks the counter state
//
////////////////////////////////////////////////////////////////////////////////
function counterStates(){
  //If statement that checks for condition and starts selecting or returning a counter
  if (selectCounterState == true){
    selectCounter(counterCount);
  } 
  if (returnCounterState == true){
    returnCounter(counterCount);
  }
}

////////////////////////////////////////////////////////////////////////////////
//
//checks the cooking state
//s
////////////////////////////////////////////////////////////////////////////////
function cookingState(cookCounterState, counterCount, glScene){
  if (cookCounterState == true){
    cookCounter(counterCount + 1, glScene);
  }
}

function drillingState(drillCounterState, counterCount, glScene){
  if (drillCounterState == true){
    drillCounter(counterCount + 1, glScene);
  }
}
////////////////////////////////////////////////////////////////////////////////
//
//checks conditions for markers and hides or makes visible
//
////////////////////////////////////////////////////////////////////////////////

//this function is used only in warehouse101.html file. not sure if needed.

////////////////////////////////////////////////////////////////////////////////
//
//positions factory camera is marker is clicked
//
////////////////////////////////////////////////////////////////////////////////
function positionFactoryCamera(){
  //Checking if variables = true and calling function
  if (birdEyeMapState == true){
    state = true;
    cameraPosition(cameraPositions[0]);
    birdEyeMapState = state;
  } if (viewPoint1State == true){
    state = true;
    cameraPosition(cameraPositions[1]);
    viewPoint1State = state;
  } if (viewPoint2State == true){
    state = true;
    cameraPosition(cameraPositions[2]);
    viewPoint2State = state;
  } if (viewPoint3State == true){
    state = true;
    cameraPosition(cameraPositions[3]);
    viewPoint3State = state;
  } if (viewPoint4State == true){
    state = true;
    cameraPosition(cameraPositions[4]);
    viewPoint4State = state;
  } if (viewPoint5State == true){
    state = true;
    cameraPosition(cameraPositions[5]);
    viewPoint5State = state;
  } if (viewPoint6State == true){
    state = true;
    cameraPosition(cameraPositions[6]);
    viewPoint6State = state;
  }
}

//CODE TO POSITION CAMERA POSITIONS
function findOffset(element) { 
  var pos = new Object();
  pos.left = pos.top = 0;        
  if (element.offsetParent)  
  { 
    do  
    { 
      pos.left += element.offsetLeft; 
      pos.top += element.offsetTop; 
    } while (element = element.offsetParent); 
  } 
  return pos;
}

// removed camera as parameter for testing because it is avaialble globally
function screenXY(obj, xxxcamera, div){

  var vector = new THREE.Vector3(0,0,0);
  var windowWidth = 800;
  var minWidth = 800;

  if(windowWidth < minWidth) {
    windowWidth = minWidth;
  }

  var widthHalf = (windowWidth/2);
  var heightHalf = 300;

  matrix = new THREE.Matrix4();
  vector.applyMatrix4(obj.matrixWorld);
  vector.applyMatrix4(matrix.getInverse( camera.matrixWorld ));
  vector.applyMatrix4(camera.projectionMatrix);

  vector.x = ( vector.x * widthHalf ) + widthHalf;
  vector.y = - ( vector.y * heightHalf ) + heightHalf;
  vector.z = 0;

  vector.x =  vector.x-16;
  vector.y =  vector.y-50;
  vector.z = 0;

  return vector;

};

function positionViewPointMarkers(){

  // Position icons over 3D scene
  if (glScene.getObjectByName('drillCompressionChamber')){
    var screenThing =  screenXY( glScene.getObjectByName('drillCompressionChamber'), camera, document.getElementById('mycanvas') );
    $("#viewPoint1").parent().css({position: 'relative'});
    $("#viewPoint1").css({top: screenThing.y, left: screenThing.x, position:'absolute'});
  }

  if (glScene.getObjectByName('redContainerCollectionFloor')){
    var screenThing =  screenXY( glScene.getObjectByName('redContainerCollectionFloor'), camera, document.getElementById('mycanvas') );
    $("#viewPoint2").parent().css({position: 'relative'});
    $("#viewPoint2").css({top: screenThing.y, left: screenThing.x, position:'absolute'});
  }

  if (glScene.getObjectByName('ovenSupport4')){
    var screenThing =  screenXY( glScene.getObjectByName('ovenSupport4'), camera, document.getElementById('mycanvas') );
    $("#viewPoint3").parent().css({position: 'relative'});
    $("#viewPoint3").css({top: screenThing.y, left: screenThing.x, position:'absolute'});
  }

  if (glScene.getObjectByName('crane')){
    var screenThing =  screenXY( glScene.getObjectByName('crane'), camera, document.getElementById('mycanvas') );
    $("#viewPoint4").parent().css({position: 'relative'});
    $("#viewPoint4").css({top: screenThing.y, left: screenThing.x, position:'absolute'});
  }

  if (glScene.getObjectByName('containerBay')){
    var screenThing =  screenXY( glScene.getObjectByName('containerBay'), camera, document.getElementById('mycanvas') );
    $("#viewPoint5").parent().css({position: 'relative'});
    $("#viewPoint5").css({top: screenThing.y, left: screenThing.x, position:'absolute'});
  }

  if (glScene.getObjectByName('positionTest')){
    var screenThing =  screenXY( glScene.getObjectByName('positionTest'), camera, document.getElementById('mycanvas') );
    $("#viewPoint6").parent().css({position: 'relative'});
    $("#viewPoint6").css({top: screenThing.y, left: screenThing.x, position:'absolute'});
  }

}