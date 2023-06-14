

  //function to get query params
  function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

//Function to hide all the possision markers
function hideAllPosMarkers(place) {
  console.log("Place is - "+place)
  console.log("posMarkers",modelList[place]?.posMarkers)
  modelList[place]?.posMarkers.forEach((objectName) => {
    glScene.getObjectByName(objectName).visible = false;
  });
}






 

function rollTextCoord(value, incr) {
  value += incr;
  if (value > 1)
      value = 0;
  if (value < 0)
      value = 1;
  return value
}






function animateConveyorA1(argument) {
  var myObject = glScene.getObjectByName("TrackPlaneA1");
  x = myObject.material.map.offset.x;
  y = myObject.material.map.offset.y;
  y = rollTextCoord(y, -0.1);
  myObject.material.map.offset.set(x, y);
}

function animateConveyorA2(argument) {
  var myObject = glScene.getObjectByName("TrackPlaneA2");
  x = myObject.material.map.offset.x;
  y = myObject.material.map.offset.y;
  y = rollTextCoord(y, 0.1);
  myObject.material.map.offset.set(x, y);
}

function animateConveyorB1(argument) {
  var myObject = glScene.getObjectByName("TrackPlaneB1");
  x = myObject.material.map.offset.x;
  y = myObject.material.map.offset.y;
  y = rollTextCoord(y, 0.1);
  myObject.material.map.offset.set(x, y);
}

function animateConveyorB2(argument) {
  var myObject = glScene.getObjectByName("TrackPlaneB2");
  x = myObject.material.map.offset.x;
  y = myObject.material.map.offset.y;
  y = rollTextCoord(y, 0.1);
  myObject.material.map.offset.set(x, y);
}

function craneRotateToNamedObject(ObjectName) {
  var crane = glScene.getObjectByName('crane');
  var target = glScene.getObjectByName(ObjectName);
  var dx = target.position.x - crane.position.x;
  var dz = target.position.z - crane.position.z;
  var a2t = Math.atan2(dz, dx);
  var dif = a2t - crane.rotation.y;
  dif = dif * dif;
  if (dif > 0.1) {
      if (crane.rotation.y > a2t) {
          crane.rotation.y -= 0.01;
          return false;
      }
      if (crane.rotation.y < a2t) {
          crane.rotation.y += 0.01;
          return false;
      }
  }
  return true;
}





function counterMoveTo(x, y, z) {
  return objectMoveTo('product_counter', x, y, z);
}

function counterMoveToV(posVector) {
  return counterMoveTo(posVector.x, posVector.y, posVector.z)
}

function objectMoveToV(name, posVector) {
  return objectMoveTo(name, posVector.x, posVector.y, posVector.z)
}


