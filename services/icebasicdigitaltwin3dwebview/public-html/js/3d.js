// <!-- 3D STUFF FROM HEREDOWN -->  
var selectObjects = [];
var selectGraphs = [];

var turnTableSpeed = 1.0;

var clock = new THREE.Clock();

// set up a timer or two

var pollDataFor3D = true;
var platform = null;

// renderer set up
var shadows = getParameterByName('shadows');
var graphOnWall = getParameterByName('graphOnWall');
var showFPS = getParameterByName('ShowFPS');
glRenderer = createGlRenderer3(shadows);
cssRenderer = createCssRenderer3();

document.body.appendChild(cssRenderer.domElement);
cssRenderer.domElement.appendChild(glRenderer.domElement);

// gl scene (object to hold scene)
glScene = new THREE.Scene();

cssScene = new THREE.Scene();

// camera
//      var aspectRatio = 800.0/600.0;
var aspectRatio = 1880.0 / 850.0;
var camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1500);
glScene.add(camera);

//Predefining counterCount a variable that stores the increment value for counters
predefineChangingCounter();
createWareHouse(place);

// set initial camera position
camera.lookAt(new THREE.Vector3(0, 5, 0));



//Removing power resize error message
glScene.minFilter = THREE.LinearFilter

// select graph controls

var toggleGraphView = true

var selectGraphControls = new THREE.SelectControls(selectGraphs, camera, glRenderer.domElement);
selectGraphControls.addEventListener('selectstart', function(event) {
    selectGraphControls.enabled = false;

    if (toggleGraphView) {
        var position = new THREE.Vector3();
        position.setFromMatrixPosition(event.object.matrixWorld);
        var cposition = new THREE.Vector3();
        cposition.setFromMatrixPosition(event.object.children[0].matrixWorld);
        setCameraTarget(cposition, position);
        toggleGraphView = false;
    } else {
        if (place == 2) {
            var position = new THREE.Vector3(0, 2, 0);
            var cposition = new THREE.Vector3(0, 5, 8);
            setCameraTarget(cposition, position);
        }

        if ((place == 1) || (place == 5)) {
            if (direction == 0) {
                var position = new THREE.Vector3(0, 1, 0);
                var cposition = new THREE.Vector3(0, 6, 6);
                setCameraTarget(cposition, position);
            }
            if (direction == 1) {
                var position = new THREE.Vector3(0, 1, 0);
                var cposition = new THREE.Vector3(-6, 6, 0);
                setCameraTarget(cposition, position);
            }
            if (direction == 2) {
                var position = new THREE.Vector3(0, 1, 0);
                var cposition = new THREE.Vector3(0, 6, -6);
                setCameraTarget(cposition, position);
            }
            if (direction == 3) {
                var position = new THREE.Vector3(0, 1, 0);
                var cposition = new THREE.Vector3(6, 6, 0);
                setCameraTarget(cposition, position);
            }
        } else {
            var position = new THREE.Vector3(0, 1, 0);
            var cposition = new THREE.Vector3(0, 6, 6);
            setCameraTarget(cposition, position);
        }

        toggleGraphView = true;

    }

});


controls = new THREE.OrbitControls(camera);
controls.maxDistance = 15;
controls.maxPolarAngle = Math.PI / 2;
controls.target.set(0, 1, 0);


// multiple view points
var viewpoint1 = function() {
    controls.target.set(0, 1.1, 0);
}

var viewpoint2 = function() {
    controls.target.set(2, 1.1, -2);
}

var viewpoint3 = function() {
    controls.target.set(2, 1.1, 2);
}

var viewpoint4 = function() {
    controls.target.set(-2, 1.1, -2);
}

var viewpoint5 = function() {
    controls.target.set(0, 4.5, 0);
}




if (place == 5) {
    //controls.target.set(12,5,-27);
    controls.target.set(0, 1, -5);
    //controls.target.set(getcameraTarget());
}

//Array storing object names
var beltParts = [
    "belt1part1",
    "belt1part2"
];

cameraPositionUpdate = false;

//Variable to store value for belt wrap
beltWrapping = 0;
containerBayDowel = 0;
containerBayDowelState = false;
counterLoad = 0;

selectCounterState = 100;
returnCounterState = 100;
cookCounterState = 100;
drillCounterState = 100;

motorOnState = new THREE.TextureLoader().load('img/motorOn.png')
motorOffState = new THREE.TextureLoader().load('img/motorOff.png')




if (showFPS == 1) {
    var array = [];

    var stats = new Stats();
    stats.dom.style.position = 'relative';
    stats.dom.style.float = 'left';
    document.body.appendChild(stats.dom);

    array.push(stats);
}

var render = function() {

    var time = clock.getElapsedTime();
    var delta = clock.getDelta();

    controls.update();

    if (showFPS == 1) {
        var stats = array[0];
        stats.update();
    }


    // Fagor
    if (glScene.getObjectByName('pressHead')) {
        glScene.getObjectByName('pressHead').position.y = -15 + (30 * Math.sin(time));
    }


    if (glScene.getObjectByName('FTFactory', document.getElementById('birdMap'))) {
        factoryMaterialWrapping();
        newAnimateFunction();
        positionFactoryCamera();
    }


    //added here for now need to change later once i figure out where to add this.
    newAnimateFunction();

    if (glScene.getObjectByName('crane') != undefined) {
        if (rotationMotorBackward != 0 || rotationMotorForward != 0) {
            glScene.getObjectByName('craneRotationMotor').material.map = motorOnState
        } else {
            glScene.getObjectByName('craneRotationMotor').material.map = motorOffState
        }

        if (elevationMotorBackward != 0 || elevationMotorForward != 0) {
            glScene.getObjectByName('craneElevationMotor').material.map = motorOnState
        } else {
            glScene.getObjectByName('craneElevationMotor').material.map = motorOffState
        }

        if (extensionMotorBackward != 0 || extensionMotorForward != 0) {
            glScene.getObjectByName('armExtensionMotor').material.map = motorOnState
        } else {
            glScene.getObjectByName('armExtensionMotor').material.map = motorOffState
        }
    }


    // general animating camera
    moveToTarget();

    glRenderer.render(glScene, camera);
    cssRenderer.render(cssScene, camera);

    if (glScene.getObjectByName('FTFactory') && cameraPositionUpdate == true) {
        positionViewPointMarkers();
    }

    requestAnimationFrame(render);
};

window.addEventListener('resize', onWindowResize, false);

render();

function onWindowResize() {

    //camera.aspect = 800 / 600;
    camera.aspect = 1880 / 850;
    camera.updateProjectionMatrix();
    //glRenderer.setSize( 800, 600 );
    glRenderer.setSize(1880, 850);

}