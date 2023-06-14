// glScene = new THREE.Scene();
var modelList = {
    5: { //small factory
        tasksList: {
            "Task_crane_MoveToConveyorB": craneMoveToConveyorB,
            "Task_crane_PickupWhiteState": cranePickupWhiteState,
            "Task_crane_MoveToConveyorA": craneMoveToConveyorA,
            "Task_crane_DropState": craneDropState,
            "Task_crane_ResetState": craneResetState,
            "Task_conveyora_StartBeltA1": craneStartBeltA1,
            "Task_conveyora_PushAState": cranePushAState,
            "Task_conveyora_ResetAState": craneResetAState,
            "Task_conveyora_StartBeltA2": conveyoraStartBeltA2,
            "Task_conveyora_ToolAState": conveyoraToolAState,
            "Task_conveyora_SlowBeltA2": conveyoraSlowBeltA2,
            "Task_conveyorb_StartBeltB1": conveyorbStartBeltB1,
            "Task_conveyora_StopBeltA2": conveyoraStopBeltA2,
            "Task_conveyorb_ConveyorBPush": conveyorbConveyorBPush,
            "Task_conveyorb_ResetBState": conveyorbResetBState,
            "Task_conveyorb_StartBeltB2": conveyorbStartBeltB2
        },
        pathToJsonObj: "models/3DSmallFactory12.json",
        objName: "FTFactory",
        objPosision: {
            x: 0,
            y: 0.11,
            z: 0
        },
        objScale: {
            x: 0.1,
            y: 0.1,
            z: 0.1,
        },
        posMarkers: [
            "position_a1_start",
            "position_a1_end",
            "position_a2_start",
            "position_a2_end",
            "position_b1_start",
            "position_b1_end",
            "position_b2_start",
            "position_b2_end",
            "position_a1_contact",
            "position_b1_contact",
            "position_camera_start"
        ],
        callBackFunction: initFactory2Model
    },
    7: { //car
        tasksList: {
            "Task_car_MoveForward": carMoveToForward,
            "Task_car_MoveBackward": carMoveToBackward,
        },
        pathToJsonObj: "models/car_model.json",
        objName: "car_model",
        objPosision: {
            x: 0,
            y: 0.11,
            z: 0
        },
        objScale: {
            x: 0.1,
            y: 0.1,
            z: 0.1,
        },
        posMarkers: [],
        callBackFunction: null
    },
    8: {
        tasksList: {
            "Task_fl_moveToBx": forkLiftMoveToBox,
            "Task_fl_LiftUpTheCraneWithTheBox": liftUpTheCraneWithTheBox,
            "Task_fl_forkLiftRotateLeft": forkLiftRotateLeft,
            "Task_fl_moveToSecondPosision": moveToSecondPosision,
            "Task_fl_dropTheBox": dropTheBox,
            "Task_fl_comback": comback,
        },
        pathToJsonObj: "models/forklift.json",
        objName: "forklift_scene",
        objPosision: {
            x: 0,
            y: 0.11,
            z: 0
        },
        objScale: {
            x: 1,
            y: 1,
            z: 1,
        },
        posMarkers:["posision_forklift_start","possision_forklift_end_1","forklift_lift_pos","possision_fork_lift_ii"],
        callBackFunction: null
    }
}



//functions for the forklift 3D model.
function forkLiftMoveToBox() {
    var possision_forklift_end_1 = glScene.getObjectByName('possision_forklift_end_1');
    var status = objectMoveTo('forklift', possision_forklift_end_1.position.x, possision_forklift_end_1.position.y, possision_forklift_end_1.position.z);
    if(status){
        addBoxToTheCraneGroup()
    }
    return status
}

//Function to put the box on the crane
function addBoxToTheCraneGroup() {
    var craneGroup = glScene.getObjectByName('craneGorup');
    var wood_box = glScene.getObjectByName('wood_box');
    reparentObject3D(wood_box, craneGroup);

    //move box to zero
    var wood_box = glScene.getObjectByName("wood_box");
    wood_box.position.x = 0;
    wood_box.position.y = 0;
    wood_box.position.z = 0;
    return true;
}


//function to Lift up the crane
function liftUpTheCraneWithTheBox() {
    var forklift_lift_pos = glScene.getObjectByName('forklift_lift_pos');
    var craneGorup = glScene.getObjectByName('craneGorup');
    return objectMoveTo('craneGorup', craneGorup.position.x, forklift_lift_pos.position.y, craneGorup.position.z);
}

//Function to rotate the forkliftBack
function forkLiftRotateLeft() {
    var wheel_front = glScene.getObjectByName('front_wheels_group');
    var rotation = -90 * Math.PI / 180;
    var wheelRotation = -14 * Math.PI / 180;
    var forklift = glScene.getObjectByName('forklift');

    //rotate wheel
    if (wheel_front.rotation.y > wheelRotation) {
        wheel_front.rotation.y -= 0.02;
        return false;
    }
    wheel_front.rotation.y = wheelRotation;


    //rotate forklift
    if (forklift.rotation.y > rotation) {
        forklift.rotation.y -= 0.02;
        return false;
    }
    forklift.rotation.y = rotation;

    //setting the wheels forward
    wheel_front.rotation.y = 0;
    return true;
}

function moveToSecondPosision(){
    var possision_fork_lift_ii = glScene.getObjectByName('possision_fork_lift_ii');
    return objectMoveTo('forklift', possision_fork_lift_ii.position.x, possision_fork_lift_ii.position.y, possision_fork_lift_ii.position.z);
}

function dropTheBox(){
    var craneGorup = glScene.getObjectByName('craneGorup');
    var oy = 0
    if (oy < craneGorup.position.y) {
        craneGorup.position.y -= 0.02;
        return false;
    }
    craneGorup.position.y = 0;
    
    
    //reparent to the world
    var forklift_scene = glScene.getObjectByName('forklift_scene');
    var wood_box = glScene.getObjectByName('wood_box');
    reparentObject3D(wood_box, forklift_scene);

    return true;

}

function comback(){
    var possision_forklift_end_1 = glScene.getObjectByName('possision_forklift_end_1');
    return objectMoveTo('forklift', possision_forklift_end_1.position.x, possision_forklift_end_1.position.y, possision_forklift_end_1.position.z);
}

//functions to create the 3D models
//car Animations
//function to move the car forward
function carMoveToForward() {
    var car = glScene.getObjectByName('car_model');
    return objectMoveTo("car_model", car.position.x, car.position.y, (car.position.x + 10))

}



//function to move the car backword
function carMoveToBackward() {
    var car = glScene.getObjectByName('car_model');
    return objectMoveTo("car_model", car.position.x, car.position.y, 0)
}
// small factory animations
//function to rotate the crane
//TODO:- make this a comman function. pass the object as a parameter.
function craneRotateTo(rotation, extension, elevation) {
    var crane = glScene.getObjectByName('crane');
    var craneElevation = glScene.getObjectByName('craneArmElevation');
    var craneExtension = glScene.getObjectByName('craneArmExtension');
    if (crane.rotation.y < rotation) {
        crane.rotation.y += 0.02;
        return false;
    }
    crane.rotation.y = rotation;
    if (craneExtension.position.x < extension) {
        craneExtension.position.x += 0.15;
        return false;
    }
    craneExtension.position.x = extension;
    if (craneElevation.position.y > elevation) {
        craneElevation.position.y -= 0.15;
        return false;
    }
    craneElevation.position.y = elevation
    return true;
}
//function to rotate the crane to the conveyorB
function craneMoveToConveyorB() {
    return craneRotateTo(0.9, 10, -12);
}
//function to crane to pickup cap
function cranePickupWhiteState() {
    var craneCap2 = glScene.getObjectByName('craneCap2');
    var craneElevation = glScene.getObjectByName('craneArmElevation');
    var counter = glScene.getObjectByName('product_counter');
    reparentObject3D(counter, craneCap2);
    if (craneElevation.position.y < -9) {
        craneElevation.position.y += 0.15;
        return false;
    }
    craneElevation.position.y = -9;
    return true;
}
//function to move crane to conveyour A
function craneMoveToConveyorA() {
    return craneRotateTo(2.4, 15, -9);
}
//function to crane to drop the cap
function craneDropState() {
    var counter = glScene.getObjectByName('product_counter');
    var craneElevation = glScene.getObjectByName('craneArmElevation');
    var conveyorGroup = glScene.getObjectByName('ConveyorGroup');
    //reparentObject3D(counter, glScene);
    if (craneElevation.position.y > -12) {
        craneElevation.position.y -= 0.15;
        return false;
    }
    craneElevation.position.y = -12;
    reparentObject3D(counter, conveyorGroup);
    var position_a1_start = glScene.getObjectByName('position_a1_start');
    return objectMoveTo('product_counter', position_a1_start.position.x, position_a1_start.position.y, position_a1_start.position.z);
}

function craneResetState() {
    var crane = glScene.getObjectByName('crane');
    var craneElevation = glScene.getObjectByName('craneArmElevation');
    var craneExtension = glScene.getObjectByName('craneArmExtension');
    // -5.05
    if (craneElevation.position.y < -5.05) {
        craneElevation.position.y += 0.25;
        return false;
    }
    craneElevation.position.y = -5.05
    //1.525
    if (craneExtension.position.x > 0) {
        craneExtension.position.x -= 0.25;
        return false;
    }
    craneExtension.position.x = 0;
    if (crane.rotation.y > 0) {
        crane.rotation.y -= 0.05;
        return false;
    }
    crane.rotation.y = 0;
    return true;
}

function craneStartBeltA1() {
    animateConveyorA1();
    return counterMoveToV(glScene.getObjectByName('position_a1_end').position);
}
var pushOnceA = false;

function cranePushAState() {
    var PusherA = glScene.getObjectByName('PusherA');
    var counter = glScene.getObjectByName('product_counter');
    if (pushOnceA) {
        reparentObject3D(PusherA, counter);
        //counter.position.set(1, -0.97, -0.025);  
        if (counterMoveToV(glScene.getObjectByName('position_a2_start').position)) {
            pushOnceA = false;
            return true;
        } else {
            return false;
        }
    } else {
        if (objectMoveToV('PusherA', glScene.getObjectByName('position_a1_contact').position)) {
            pushOnceA = true;
        }
        return false;
    }
}


// objectMoveToV('PusherA', glScene.getObjectByName('position_a1_end').position);

function craneResetAState() {
    var PusherA = glScene.getObjectByName('PusherA');
    var counter = glScene.getObjectByName('product_counter');
    var conveyorGroup = glScene.getObjectByName('ConveyorGroup');
    reparentObject3D(counter, conveyorGroup);
    reparentObject3D(PusherA, conveyorGroup);
    return objectMoveToV('PusherA', glScene.getObjectByName('position_a1_end').position);
}

function conveyoraStartBeltA2() {
    animateConveyorA2();
    return counterMoveToV(glScene.getObjectByName('position_a2_end').position);
}

function conveyoraToolAState() {
    return true;
}

function conveyoraSlowBeltA2() {
    animateConveyorA2();
    return counterMoveToV(glScene.getObjectByName('position_b1_start').position);
}

function conveyorbStartBeltB1() {
    animateConveyorB1();
    return counterMoveToV(glScene.getObjectByName('position_b1_end').position);
}

function conveyoraStopBeltA2() {
    return true;
}
var pushOnceB = false;

function conveyorbConveyorBPush() {
    var PusherB = glScene.getObjectByName('PusherB');
    var counter = glScene.getObjectByName('product_counter');
    if (pushOnceB) {
        reparentObject3D(PusherB, counter);
        if (counterMoveToV(glScene.getObjectByName('position_b2_start').position)) {
            pushOnceB = false;
            return true;
        } else {
            return false;
        }
    } else {
        if (objectMoveToV('PusherB', glScene.getObjectByName('position_b1_contact').position)) {
            pushOnceB = true;
        }
        return false;
    }
}

function conveyorbResetBState() {
    var Pusher = glScene.getObjectByName('PusherB');
    var counter = glScene.getObjectByName('product_counter');
    var conveyorGroup = glScene.getObjectByName('ConveyorGroup');
    reparentObject3D(counter, conveyorGroup);
    reparentObject3D(Pusher, conveyorGroup);
    return objectMoveToV('PusherB', glScene.getObjectByName('position_b1_end').position);
}

function conveyorbStartBeltB2() {
    animateConveyorB2();
    return counterMoveToV(glScene.getObjectByName('position_b2_end').position);
}




//function to get the camera target. there is a posision marker set for the start posision of the camera - position_camera_start
function getcameraTarget() {
    var cameraStart = glScene.getObjectByName("position_camera_start");
    var factory = glScene.getObjectByName('FTFactory');
    var conveyorGroup = glScene.getObjectByName('ConveyorGroup');
    //reparentObject3D(counter, glScene);
    reparentObject3D(cameraStart, factory);
    var posV = cameraStart.position;
    return posV;
}

//call back function to get excuted after the 3D model loads to the warehouse
function initFactory2Model() {
    //this is to add stripes on the conveyor belts..
    // To access scene material we pick it's parent object
    var myObject = glScene.getObjectByName("TrackPlaneA1");
    // We need to set the Wrappers like THREE.RepeatWrapping in order to make it happen.
    myObject.material.map.wrapS = myObject.material.map.wrapT = THREE.RepeatWrapping;
    // Now we only need to set a new map.repeat
    myObject.material.map.repeat.set(1, 12);
    myObject = glScene.getObjectByName("TrackPlaneA2");
    myObject.material.map.wrapS = myObject.material.map.wrapT = THREE.RepeatWrapping;
    myObject.material.map.repeat.set(1, 12);
    myObject = glScene.getObjectByName("TrackPlaneB1");
    myObject.material.map.wrapS = myObject.material.map.wrapT = THREE.RepeatWrapping;
    myObject.material.map.repeat.set(1, 12);
    myObject = glScene.getObjectByName("TrackPlaneB2");
    myObject.material.map.wrapS = myObject.material.map.wrapT = THREE.RepeatWrapping;
    myObject.material.map.repeat.set(1, 12);
}