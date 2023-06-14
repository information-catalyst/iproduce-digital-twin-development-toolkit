//Function to change the parent of a 3D object.
function reparentObject3D(subject, newParent) {
    subject.matrix.copy(subject.matrixWorld);
    subject.applyMatrix(new THREE.Matrix4().getInverse(newParent.matrixWorld));
    newParent.add(subject);
}
  


//Function to Move a object to a another object
function objectMoveToObject(objectName, objectNameT) {
    var target = glScene.getObjectByName(objectNameT);
    var counter = glScene.getObjectByName(objectName);
    counter.position.x = target.position.x;
    counter.position.y = target.position.y;
    counter.position.z = target.position.z;
}

//Function to move a objects to a x,y,z
function objectMoveTo(objectName, x, y, z) {
    var counter = glScene.getObjectByName(objectName);
    var ox = counter.position.x;
    var oy = counter.position.y;
    var oz = counter.position.z;
  
    var toleranceP2 = 1;
    var delta = 0.1;
  
    var dx = (ox - x) * (ox - x);
    if (dx > toleranceP2) {
        if (ox < x) {
            counter.position.x += delta;
        } else {
            counter.position.x -= delta;
        }
        return false
    }
  
    var dy = (oy - y) * (oy - y);
    console.log("dy > toleranceP2",dy > toleranceP2)
    if (dy > toleranceP2) {
        if (oy < y) {
            counter.position.y += delta;
        } else {
            counter.position.y -= delta;
        }
        return false
    }
  
    var dz = (oz - z) * (oz - z);
    if (dz > toleranceP2) {
        if (oz < z) {
            counter.position.z += delta;
        } else {
            counter.position.z -= delta;
        }
        return false
    }
  
    return true;
  }


