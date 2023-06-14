birdEyeMapState = false;
viewPoint1State = false;
viewPoint2State = false;
viewPoint3State = false;
viewPoint4State = false;
viewPoint5State = false;
viewPoint6State = false;
//controls.enabled=false;

cameraPositions = [
[0, 10, 0, 0, 1, 0, birdEyeMapState],
[-1.325, 5, -2.485, -1.325, 1, -2.5],
[2.375, 2.5, -2.6, 2.375, 1, -2.6],
[-2, 3.775, -0.772, -2, 1, -0.772],
[1.778, 5, -0.337, 1.778, 1, -0.337],
[-0.198, 5, 2.295, -0.198, 1, 2.295],
[1.81, 3.75, 1.873, 1.81, 1, 1.873]
]

///////////////////////////////////////////////////////////////////
// Moves the camera to a birdeye view
//
///////////////////////////////////////////////////////////////////
function cameraPosition(position){
	//Checking cameras x positions
	if (camera.position.x > position[0]){
		camera.position.x -= 0.1
		if (camera.position.x - 0.1 < position[0]){
			camera.position.x = position[0]
		}
	}
	if (camera.position.x < position[0]){
		camera.position.x += 0.1
		if (camera.position.x + 0.1 > position[0]){
			camera.position.x = position[0]
		}
	}
	//checking cameras y positions
	if (camera.position.y > position[1]){
		camera.position.y -= 0.1
		if (camera.position.y - 0.1 < position[1]){
			camera.position.y = position[1]
		}
	}
	if (camera.position.y < position[1]){
		camera.position.y += 0.1
		if (camera.position.y + 0.1 > position[1]){
			camera.position.y = position[1]
		}
	}
	//checking cameras z positions
	if (camera.position.z > position[2]){
		camera.position.z -= 0.1
		if (camera.position.z - 0.1 < position[2]){
			camera.position.z = position[2]
		}
	}
	if (camera.position.z < position[2]){
		camera.position.z += 0.1
		if (camera.position.z + 0.1 > position[2]){
			camera.position.z = position[2]
		}
	}

	//checking the controls target x co-ord
	if (controls.target.x > position[3]){
		controls.target.x -= 0.1
		if (controls.target.x - 0.1 < position[3]){
			controls.target.x = position[3]
		}
	}
	if (controls.target.x < position[3]){
		controls.target.x += 0.1
		if (controls.target.x + 0.1 > position[3]){
			controls.target.x = position[3]
		}
	}
	//checking the controls target y co-ord
	if (controls.target.y > position[4]){
		controls.target.y -= 0.1
		if (controls.target.y - 0.1 < position[4]){
			controls.target.y = position[4]
		}
	}
	if (controls.target.y < position[4]){
		controls.target.y += 0.1
		if (controls.target.y + 0.1 > position[4]){
			controls.target.y = position[4]
		}
	}
	//checking the controls target z co-ord
	if (controls.target.z > position[5]){
		controls.target.z -= 0.1
		if (controls.target.z - 0.1 < position[5]){
			controls.target.z = position[5]
		}
	}
	if (controls.target.z < position[5]){
		controls.target.z += 0.1
		if (controls.target.z + 0.1 > position[5]){
			controls.target.z = position[5]
		}
	}

	if (camera.position.x == position[0] &&
		camera.position.y == position[1] &&
		camera.position.z == position[2] &&
		controls.target.x == position[3] &&
		controls.target.y == position[4] &&
		controls.target.z == position[5]
		){
		state = false;
		return state;
	}
}


_postion = null;
_target = null;

///////////////////////////////////////////////////////////////////
// Moves the camera to a generaal target
// parameters
//		position = new camera position as THREE.Vector3()
//		target = new target position as THREE.Vector3()
//
///////////////////////////////////////////////////////////////////
function setCameraTarget(position,target){
	_postion = position;
	_target = target;

}

///////////////////////////////////////////////////////////////////
// Moves the camera to a generaal target call in eender function
//
///////////////////////////////////////////////////////////////////
function moveToTarget(){

	if( _postion !=null ){

		var positionDelta = new THREE.Vector3();
		positionDelta.subVectors ( camera.position, _postion );				// delta = cameraPos - _position

		var positionDeltaLength = positionDelta.length();
		if ((positionDeltaLength<0.1) && (positionDeltaLength>-0.1)){
			_postion = null;
		}else{
			camera.position.lerp ( _postion, 0.2 );								// lerp(target , alpha) moves alpha amount towards the vector. 0.2 == 20%
		}
	}

	if( _target !=null){

		var targetDelta = new THREE.Vector3();
		targetDelta.subVectors ( controls.target, _target );				// delta = cameraPos - _position

		var targetDeltaLength = targetDelta.length();
		if ((targetDeltaLength<0.1) && (targetDeltaLength>-0.1)){
			_target = null;
		}else{
			controls.target.lerp ( _target, 0.1 );								// lerp(target , alpha) moves alpha amount towards the vector. 0.2 == 20%
		}
	}
}

function toScreenPosition(obj, camera, glRenderer){

	var vector = new THREE.Vector3();

    var widthHalf = 300;
    var heightHalf = 400;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);

    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;

	document.getElementById('viewPoint1').style.left = vector.x + 'px';
	document.getElementById('viewPoint1').style.top = vector.y + 'px';

    return { 
        x: vector.x,
        y: vector.y
    };

};