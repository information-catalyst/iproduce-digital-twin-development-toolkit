  // animations wrttien for another 3D Object.
  
  var counterPos = [
    [-19.75, 0],
    [-10.75, 0],
    [-1.75, 0],
    [-19.75, -5.50],
    [-10.75, -5.50],
    [-1.75, -5.50],
    [-19.75, -11.50],
    [-10.75, -11.50],
    [-1.75, -11.50]
  ];


/// count 50 frames and exit
var countdowntime = 50;

function defaultAction(){
  countdowntime--;
  if(countdowntime<0){
    countdowntime = 50;
    return true;
  }
  return false;
}




var toggle = 1;
function Task_warehouse_Load01_function(){

  var retglobal = false;
  if (toggle == 1){
      retlocal =  Task_warehouse_Load01_function1();
  }else{
      retlocal = Task_warehouse_Load01_function2();
      retglobal = retlocal;
  }

  if (retlocal == true){
    toggle = (toggle - 1) * -1
  }
  return retglobal;

}


function TaskWarehouseReturn01(){

  var retglobal = false;
  if (toggle == 1){
      retlocal =  Task_warehouse_Load01_function1();
  }else{
      retlocal = Task_warehouse_Load01_function2();
      retglobal = retlocal;
  }

  if (retlocal == true){
    toggle = (toggle - 1) * -1
  }
  return retglobal;


}

function Task_warehouse_Load01_function1(){
  var counterCount = 1


  var collectionCrane = glScene.getObjectByName('collectionCrane');
  var collectionCraneArmElevation = glScene.getObjectByName('collectionCraneArmElevation');
  var collectionCraneArmExtension = glScene.getObjectByName('collectionCraneArmExtension');

  if( counterCount != -1){
    if (collectionCrane.position.x > counterPos[counterCount][0]){
      collectionCrane.position.x -= 0.25;
    } if (collectionCrane.position.x < counterPos[counterCount][0]){
        collectionCrane.position.x = counterPos[counterCount][0];
    }
  } 

  if (collectionCrane.position.x == counterPos[counterCount][0]){
    if (collectionCraneArmElevation.position.y > counterPos[counterCount][1]){
      collectionCraneArmElevation.position.y -= 0.250;
    } if (collectionCraneArmElevation.position.y < counterPos[counterCount][1]){
        collectionCraneArmElevation.position.y = counterPos[counterCount][1];
    }
  } 

  if (collectionCrane.position.x == counterPos[counterCount][0] && collectionCraneArmElevation.position.y == counterPos[counterCount][1]){
    if (collectionCraneArmExtension.position.z > -5.5){
      collectionCraneArmExtension.position.z -= 0.250;
    } if (collectionCraneArmExtension.position.z < -5.5){
        collectionCraneArmExtension.position.z = -5.5;
    }
  }

  if (collectionCrane.position.x == counterPos[counterCount][0] && 
      collectionCraneArmElevation.position.y == counterPos[counterCount][1] &&
      collectionCraneArmExtension.position.z  == -5.5){
        selectCounterState = false;
        //endSelectCounter();
        return true;
  }

  return false;
}



function Task_warehouse_Load01_function2(){
  var counterCount = 1
  var collectionCrane = glScene.getObjectByName('collectionCrane');
  var collectionCraneArmElevation = glScene.getObjectByName('collectionCraneArmElevation');
  var collectionCraneArmExtension = glScene.getObjectByName('collectionCraneArmExtension');
  var counterContainer = glScene.getObjectByName('counterContainer'+(counterCount+1));

  if (collectionCraneArmElevation.position.y < counterPos[counterCount][1] + 1.04 && collectionCrane.position.x != 9.25){
    if (collectionCraneArmElevation.position.y == counterPos[counterCount][1]){
      collectionCraneArmElevation.position.y = counterPos[counterCount][1] + 0.04;
    } 
    collectionCraneArmElevation.position.y += 0.250;
    counterContainer.position.y += 0.250
  } if (collectionCraneArmElevation.position.y > counterPos[counterCount][1] + 1.04){
      collectionCraneArmElevation.position.y = counterPos[counterCount][1] + 1.04;
  }

  if (collectionCraneArmElevation.position.y == counterPos[counterCount][1] + 1.04 && collectionCrane.position.x != 9.25){
    if (collectionCraneArmExtension.position.z < 0){
      collectionCraneArmExtension.position.z += 0.250;
      counterContainer.position.x -= 0.250;
    } if (collectionCraneArmExtension.position.z > 0){
        collectionCraneArmExtension.position.z = 0;
    }

    if (collectionCraneArmExtension.position.z == 0 && collectionCraneArmElevation.position.y == counterPos[counterCount][1] + 1.04 ){
      if (collectionCrane.position.x < 9.25){
        collectionCrane.position.x += 0.25;
        counterContainer.position.z += 0.25;
      } if (collectionCrane.position.x > 9.25){
          collectionCrane.position.x = 9.25;
      }
    }
  }

  if (collectionCrane.position.x == 9.25 && collectionCraneArmElevation.position.y == counterPos[counterCount][1] + 1.04){
    if (collectionCraneArmExtension.position.z > -5){
      collectionCraneArmExtension.position.z -= 0.25;
      counterContainer.position.x += 0.25;
    } if (collectionCraneArmExtension.position.z < -5){
        collectionCraneArmExtension.position.z = -5;
    }
  }

  if (collectionCraneArmExtension.position.z == -5){
    if (collectionCraneArmElevation.position.y > -8.75){
      collectionCraneArmElevation.position.y -= 0.25
      counterContainer.position.y -= 0.25
      if (collectionCraneArmElevation.position.y <= -8.75 && collectionCraneArmElevation.position.y > -9.5){
        collectionCraneArmElevation.position.y -= 0.25;
      }
    }
  }

  if ((collectionCrane.position.x == 9.25) && 
      (collectionCraneArmExtension.position.z == -5) && 
      (collectionCraneArmElevation.position.y <= -9.2)){
        returnCounterState = false;
        ///endReturnCounter();    

        return true;
  }

  return false;
} 


////////// -------------------------------------------------------------------------

function movetowarehouse1(){
  var counterCount =1 ;
  var counterContainer = glScene.getObjectByName('counterContainer' + (counterCount+1));
  var crane = glScene.getObjectByName('crane');
  var craneCap2 = glScene.getObjectByName('craneCap2');
  var craneElevation = glScene.getObjectByName('craneArmElevation');
  var craneExtension = glScene.getObjectByName('craneArmExtension');


  /*
  var cookingPlatform = glScene.getObjectByName('cookingPlatform');
  var counterCooking = glScene.getObjectByName('counterCookingPlatform');
  var craneElevation = glScene.getObjectByName('craneArmElevation');
  var craneExtension = glScene.getObjectByName('craneArmExtension');
  var ovenDoor = glScene.getObjectByName('ovenDoorElevation');
  */
  var counter = glScene.getObjectByName('whiteCounter' + counterCount);

  if (counterContainer.position.x < 9.75){
    counterContainer.position.x += 0.25;
  } if (counterContainer.position.x > 9.75){
    counterContainer.position.x = 9.75;
  }


  if (crane.rotation.y < 4.7577675 && counterContainer.position.x == 9.75 && craneCap2.children.length == 0 ){
    crane.rotation.y += 0.05;
  } if (crane.rotation.y > 4.7577675 && counterContainer.position.x == 9.75 && craneCap2.children.length == 0){
    crane.rotation.y = 4.7577675;
  }

  if (craneExtension.position.x < 1.525 && crane.rotation.y == 4.7577675 && craneCap2.children.length == 0 ){
    craneExtension.position.x += 0.25;
  } if (craneExtension.position.x > 1.525 && crane.rotation.y == 4.7577675 && craneCap2.children.length == 0){
    craneExtension.position.x = 1.525;
  }

  if (craneElevation.position.y > -5.05 && craneExtension.position.x == 1.525 && craneCap2.children.length == 0){
    craneElevation.position.y -= 0.25;
  } if (craneElevation.position.y < -5.05 && craneExtension.position.x == 1.525 && craneCap2.children.length == 0 ){
    craneElevation.position.y = -5.05
  } 


  if (crane.rotation.y == 4.7577675 && craneElevation.position.y == -5.05 && craneExtension.position.x == 1.525 ){
    return true;
  }
  return false;



}


function pickupWhite(){
  var counterCount =1 ;
  var counterContainer = glScene.getObjectByName('counterContainer' + (counterCount+1));
  var crane = glScene.getObjectByName('crane');
  var craneCap2 = glScene.getObjectByName('craneCap2');
  var craneElevation = glScene.getObjectByName('craneArmElevation');
  var craneExtension = glScene.getObjectByName('craneArmExtension');


  var counter = glScene.getObjectByName('whiteCounter' + counterCount);
  craneCap2.add(counter);
  counter.scale.x = 1 / craneCap2.scale.x
  counter.scale.y = 1 / craneCap2.scale.y
  counter.scale.z = 1 / craneCap2.scale.z
  counter.position.set(1, -0.97, -0.025);


  return true;
}


function MoveToOven(){

  var counterCount =1 ;
  var counterContainer = glScene.getObjectByName('counterContainer' + (counterCount+1));
  var crane = glScene.getObjectByName('crane');
  var craneCap2 = glScene.getObjectByName('craneCap2');
  var craneElevation = glScene.getObjectByName('craneArmElevation');
  var craneExtension = glScene.getObjectByName('craneArmExtension');


  var counter = glScene.getObjectByName('whiteCounter' + counterCount);

  if (craneElevation.position.y < 0 && craneExtension.position.x == 1.525 && craneCap2.children.length == 1){
    craneElevation.position.y += 0.25;
  } if (craneElevation.position.y > 0 && craneExtension.position.x == 1.525 && craneCap2.children.length == 1){
    craneElevation.position.y = 0;
  }

  if (craneExtension.position.x > 0 && craneElevation.position.y == 0 && crane.rotation.y == 4.7577675 && craneCap2.children.length == 1){
    craneExtension.position.x -= 0.25;
  } if (craneExtension.position.x < 0 && craneElevation.position.y == 0 && crane.rotation.y == 4.7577675 && craneCap2.children.length == 1){
    craneExtension.position.x = 0;
  }

  if (crane.rotation.y > 3.14 && craneElevation.position.y == 0 && craneExtension.position.x == 0 && craneCap2.children.length == 1){
    crane.rotation.y -= 0.05;
  } if (crane.rotation.y < 3.14 && craneElevation.position.y == 0 && craneExtension.position.x == 0 && craneCap2.children.length == 1){
    crane.rotation.y = 3.14;
  }

  if (craneExtension.position.x < 12 && crane.rotation.y == 3.14 && craneElevation.position.y == 0 && craneCap2.children.length == 1){
    craneExtension.position.x += 0.25;
  } if (craneExtension.position.x > 12 && crane.rotation.y == 3.14 && craneElevation.position.y == 0 && craneCap2.children.length == 1){
    craneExtension.position.x = 12;
  }

  if (craneElevation.position.y > -10.9 && crane.rotation.y == 3.14 && craneExtension.position.x == 12 && craneCap2.children.length == 1){
    craneElevation.position.y -= 0.25;
  } if (craneElevation.position.y < -10.9 && crane.rotation.y == 3.14 && craneExtension.position.x == 12 && craneCap2.children.length == 1){
    craneElevation.position.y = -10.9;
  }

  if (crane.rotation.y == 3.14 && craneElevation.position.y == -10.9 && craneExtension.position.x == 12 ){
      return true;
  }
  return false
}


// drop at cooking
function dropAtOven(){

  var counterCount =1 ;
  var counterContainer = glScene.getObjectByName('counterContainer' + (counterCount+1));
  var crane = glScene.getObjectByName('crane');
  var craneCap2 = glScene.getObjectByName('craneCap2');
  var cookingPlatform = glScene.getObjectByName('cookingPlatform');
  var craneElevation = glScene.getObjectByName('craneArmElevation');
  var craneExtension = glScene.getObjectByName('craneArmExtension');

      var counter = glScene.getObjectByName('whiteCounter' + counterCount);
      cookingPlatform.add(counter);
      counter.scale.x = 1 / cookingPlatform.scale.x
      counter.scale.y = 1 / cookingPlatform.scale.y
      counter.scale.z = 1 / cookingPlatform.scale.z
      counter.position.set(0.04, 3.75, 0);

      return true;  
}

function resetCentralCraneNew(){

  var counterCount =1 ;
  var counterContainer = glScene.getObjectByName('counterContainer' + (counterCount+1));
  var crane = glScene.getObjectByName('crane');
  var craneCap2 = glScene.getObjectByName('craneCap2');
  var craneElevation = glScene.getObjectByName('craneArmElevation');
  var craneExtension = glScene.getObjectByName('craneArmExtension');

  var cookingPlatform = glScene.getObjectByName('cookingPlatform');


  if (craneExtension.position.x > 2){
    craneExtension.position.x -= 0.25;

  }
  craneExtension.position.x = 2;

  if(crane.rotation.y>0){
    crane.rotation.y -= 0.25;
    return false;
  }
  crane.rotation.y = 0;


  if (craneElevation.position.y < 0){
    craneElevation.position.y += 0.25;
  } if (craneElevation.position.y > 0){
    craneElevation.position.y = 0;
    return true;
  }
  return false;

}

function drillRunMotor() {
  // body...c


      return true;  
}



function newCookInOven(){
  var counterCount =1 ;

  var counterContainer = glScene.getObjectByName('counterContainer' + counterCount);
  var crane = glScene.getObjectByName('crane');
  var craneCap2 = glScene.getObjectByName('craneCap2');
  
  var cookingPlatform = glScene.getObjectByName('cookingPlatform');
  var counterCooking = glScene.getObjectByName('counterCookingPlatform');
  var craneElevation = glScene.getObjectByName('craneArmElevation');
  var craneExtension = glScene.getObjectByName('craneArmExtension');
  var ovenDoor = glScene.getObjectByName('ovenDoorElevation');



  if (ovenDoor.position.y < 1.80  && counterCooking.position.x == 0.75 && cookingPlatform.children.length == 1){
    ovenDoor.position.y += 0.1;
  } if (ovenDoor.position.y > 1.80  && counterCooking.position.x == 0.75 && cookingPlatform.children.length == 1){
    ovenDoor.position.y = 1.8;
  }

  if (counterCooking.position.x > -7.70 && ovenDoor.position.y == 1.8  && cookingPlatform.children.length == 1 && counterCooked == false){
    counterCooking.position.x -= 0.25;
  } if (counterCooking.position.x < -7.7 && ovenDoor.position.y == 1.8  && cookingPlatform.children.length == 1 && counterCooked == false){
    counterCooking.position.x = -7.70;
  }

  if (ovenDoor.position.y > 0 && counterCooking.position.x == -7.70 && cookingPlatform.children.length == 1){
    ovenDoor.position.y -= 0.1;
  } if (ovenDoor.position.y < 0 && counterCooking.position.x == -7.70 && cookingPlatform.children.length == 1){
    ovenDoor.position.y = 0;
  }

  if (ovenDoor.position.y == 0 && counterCooking.position.x == -7.70 && counterCooked == false){
    if (counterCookedTimer > 500){
      counterCooked = true;
    } else {
      counterCookedTimer++;
    }
  }

  if (ovenDoor.position.y < 1.80 && counterCooking.position.x == -7.70 && counterCooked == true){
    ovenDoor.position.y += 0.20;
  } if (ovenDoor.position.y > 1.80 && counterCooking.position.x == -7.70 && counterCooked == true){
    ovenDoor.position.y = 1.80;
  }

  if (counterCooking.position.x < 0.75 && ovenDoor.position.y == 1.80 && counterCooked == true){
    counterCooking.position.x += 0.25;
  } if (counterCooking.position.x > 0.75 && ovenDoor.position.y == 1.80 && counterCooked == true){
    counterCooking.position.x = 0.75;
  }

  if (ovenDoor.position.y > 0 && counterCooking.position.x == 0.75 && counterCooked == true){
    ovenDoor.position.y -= 0.20;
  } if (ovenDoor.position.y < 0 && counterCooking.position.x == 0.75 && counterCooked == true){
    ovenDoor.position.y = 0;
  }

  if (ovenDoor.position.y == 0 && 
    counterCooking.position.x == 0.75 && 
    counterCooked == true){

      cookCounterState = false;
      return true;
  }

  return false;


}



function movetodrill(){

  var counterCount =1 ;


  var counterContainer = glScene.getObjectByName('counterContainer' + counterCount);
  var crane = glScene.getObjectByName('crane');
  var craneCap2 = glScene.getObjectByName('craneCap2');
  var cookingPlatform = glScene.getObjectByName('cookingPlatform');
  var counterCooking = glScene.getObjectByName('counterCookingPlatform');
  var craneElevation = glScene.getObjectByName('craneArmElevation');
  var craneExtension = glScene.getObjectByName('craneArmExtension');
  var ovenDoor = glScene.getObjectByName('ovenDoorElevation');
  var drill = glScene.getObjectByName('drillTurnTable');
  var drillingPlatform = glScene.getObjectByName('drillingPlatform');

  if (counterCount > 0 && counterCount < 4){
    var counter = glScene.getObjectByName('whiteCounter' + counterCount);
  } if (counterCount > 3 && counterCount < 7){
    var counter = glScene.getObjectByName('redCounter' + counterCount);
  } if (counterCount > 6 && counterCount < 10){
    var counter = glScene.getObjectByName('blueCounter' + counterCount);
  }

  if (counter.position.y < 15 && counter.position.z == 0 && ovenDoor.position.y == 0 && counterCooking.position.x == 0.75 && counter.parent.name == 'cookingPlatform' && counterCooked == true){
    counter.position.y += 0.25;
  } if (counter.position.y > 15 && counter.position.z == 0 && ovenDoor.position.y == 0 && counterCooking.position.x == 0.75 && counter.parent.name == 'cookingPlatform' && counterCooked == true){
    counter.position.y = 15;
  }

  if (counter.position.z > -6.325 && counter.position.y == 15 && ovenDoor.position.y == 0 && counterCooking.position.x == 0.75 && counter.parent.name == 'cookingPlatform' && counterCooked == true){
    counter.position.z -= 0.1;
  } if (counter.position.z < -6.325 && counter.position.y == 15 && ovenDoor.position.y == 0 && counterCooking.position.x == 0.75 && counter.parent.name == 'cookingPlatform' && counterCooked == true) {
    counter.position.z = -6.325;
  }

  if (counter.position.y > 5.5 && counter.position.z == -6.325 && counter.parent.name == 'cookingPlatform' && counterCooked == true){
    counter.position.y -= 0.1;
  } if (counter.position.y < 5.5 && counter.position.z == -6.325 && counter.parent.name == 'cookingPlatform' && counterCooked == true){
    counter.position.y = 5.5
  }

  if (counter.position.y == 5.5 && counter.position.z == -6.325 && counter.parent.name == 'cookingPlatform' && counterCooked == true){
      var counter = glScene.getObjectByName('whiteCounter' + counterCount);
      drillingPlatform.add(counter);
      counter.scale.x = 1 / drillingPlatform.scale.x
      counter.scale.y = 1 / drillingPlatform.scale.y
      counter.scale.z = 1 / drillingPlatform.scale.z
      counter.position.set(0.04, 3.75, 0);
      return true;
  }
  return false;
}



function movetodrilltool(){

  var counterCount =1 ;
var counter = glScene.getObjectByName('whiteCounter' + counterCount);

  var counterContainer = glScene.getObjectByName('counterContainer' + counterCount);
  var crane = glScene.getObjectByName('crane');
  var craneCap2 = glScene.getObjectByName('craneCap2');
  var cookingPlatform = glScene.getObjectByName('cookingPlatform');
  var counterCooking = glScene.getObjectByName('counterCookingPlatform');
  var craneElevation = glScene.getObjectByName('craneArmElevation');
  var craneExtension = glScene.getObjectByName('craneArmExtension');
  var ovenDoor = glScene.getObjectByName('ovenDoorElevation');
  var drill = glScene.getObjectByName('drillTurnTable');
  var drillingPlatform = glScene.getObjectByName('drillingPlatform');

  if (drill.rotation.y > -3.14159 && counter.position.y == 3.75 && counter.position.z == 0 && counterCookedTimer < 1000 && counter.parent.name == 'drillingPlatform' && counterCooked == true){
    drill.rotation.y -= 0.05;
  } if (drill.rotation.y < -3.14159 && counter.position.y == 3.75 && counter.position.z == 0 && counterCookedTimer < 1000 && counter.parent.name == 'drillingPlatform' && counterCooked == true){
    drill.rotation.y = -3.14159;
    return true;
  }
  return false;
  
}


function drillthecounter(){

  var counterCount =1 ;
var counter = glScene.getObjectByName('whiteCounter' + counterCount);

  var counterContainer = glScene.getObjectByName('counterContainer' + counterCount);
  var crane = glScene.getObjectByName('crane');
  var craneCap2 = glScene.getObjectByName('craneCap2');
  var cookingPlatform = glScene.getObjectByName('cookingPlatform');
  var counterCooking = glScene.getObjectByName('counterCookingPlatform');
  var craneElevation = glScene.getObjectByName('craneArmElevation');
  var craneExtension = glScene.getObjectByName('craneArmExtension');
  var ovenDoor = glScene.getObjectByName('ovenDoorElevation');
  var drill = glScene.getObjectByName('drillTurnTable');
  var drillingPlatform = glScene.getObjectByName('drillingPlatform');


  if (drill.rotation.y == -3.14159 && counter.position.y == 3.75 && counter.position.z == 0 && counter.parent.name == 'drillingPlatform' && counterCooked == true){
    if (counterCookedTimer > 1000){
      counterCooked = true;
      return true;
    } else {
      counterCookedTimer++;
    }
  }
  return false;
}


// roates platform to conveyor
function movefromdrilltool(){

  var counterCount =1 ;
var counter = glScene.getObjectByName('whiteCounter' + counterCount);

  var counterContainer = glScene.getObjectByName('counterContainer' + counterCount);
  var crane = glScene.getObjectByName('crane');
  var craneCap2 = glScene.getObjectByName('craneCap2');
  var cookingPlatform = glScene.getObjectByName('cookingPlatform');
  var counterCooking = glScene.getObjectByName('counterCookingPlatform');
  var craneElevation = glScene.getObjectByName('craneArmElevation');
  var craneExtension = glScene.getObjectByName('craneArmExtension');
  var ovenDoor = glScene.getObjectByName('ovenDoorElevation');
  var drill = glScene.getObjectByName('drillTurnTable');
  var drillingPlatform = glScene.getObjectByName('drillingPlatform');

  if (drill.rotation.y > -4.71239 && counter.position.y == 3.75 && counter.position.z == 0 && counterCookedTimer > 1000 && counter.parent.name == 'drillingPlatform' && counterCooked == true){
    drill.rotation.y -= 0.05;
  } if (drill.rotation.y < -4.71239 && counter.position.y == 3.75 && counter.position.z == 0 && counterCookedTimer > 1000 && counter.parent.name == 'drillingPlatform' && counterCooked == true){
    drill.rotation.y = -4.71239;
    return true;
  }
  return false;

}


function drilltoconveyor(){

  var counterCount =1 ;
var counter = glScene.getObjectByName('whiteCounter' + counterCount);

  var counterContainer = glScene.getObjectByName('counterContainer' + counterCount);
  var crane = glScene.getObjectByName('crane');
  var craneCap2 = glScene.getObjectByName('craneCap2');
  var cookingPlatform = glScene.getObjectByName('cookingPlatform');
  var counterCooking = glScene.getObjectByName('counterCookingPlatform');
  var craneElevation = glScene.getObjectByName('craneArmElevation');
  var craneExtension = glScene.getObjectByName('craneArmExtension');
  var ovenDoor = glScene.getObjectByName('ovenDoorElevation');
  var drill = glScene.getObjectByName('drillTurnTable');
  var drillingPlatform = glScene.getObjectByName('drillingPlatform');

  if(counter.parent.name == 'drillingPlatform'){
/*    
    counter.parent.updateMatrixWorld();
    var posv = new THREE.Vector3();
    var posvt = counter.getWorldPosition();
    posv.setFromMatrixPosition( counter.matrixWorld );
    drillingPlatform.remove(counter);
    counter.position = posvt;

    glScene.add( counter );
    return true;
*/
  }

  counter.position.x +=0.25;
  if (counter.position.x > 1.5){
    counter.position.x = 1.5;
    return true;
  }


  return false;


}


function runconveyor(){

  var counterCount =1 ;
  var counter = glScene.getObjectByName('whiteCounter' + counterCount);


  counter.position.z +=0.125;
  if (counter.position.z > 11.5){
    counter.position.z = 11.5;
    return true;
  }


  return false;


}


function sortconveyor(){

  var counterCount =1 ;
  var counter = glScene.getObjectByName('whiteCounter' + counterCount);


  counter.position.x -=0.125;
  counter.position.y -=0.3;
  if (counter.position.x < -1.0){
    counter.position.x = -1.0;
    return true;
  }


  return false;


}


function TaskCrane1Move2(){
//  var counterCount =1 ;
//  var counterContainer = glScene.getObjectByName('counterContainer' + (counterCount+1));
  var crane = glScene.getObjectByName('crane');
//  var craneCap2 = glScene.getObjectByName('craneCap2');
  var craneElevation = glScene.getObjectByName('craneArmElevation');
  var craneExtension = glScene.getObjectByName('craneArmExtension');

//  var cookingPlatform = glScene.getObjectByName('cookingPlatform');


  if (craneExtension.position.x < 7.5){
    craneExtension.position.x += 0.25;

  }
  craneExtension.position.x = 7.5;

  if(crane.rotation.y<1.32){
    crane.rotation.y += 0.125;
    return false;
  }
  crane.rotation.y = 1.32;


  if (craneElevation.position.y > 0){
    craneElevation.position.y -= 0.25;
  }
  craneElevation.position.y = 0;
  return true;


}


function TaskCrane1Pickup2(){
  var counterCount =1 ;
  var counterContainer = glScene.getObjectByName('counterContainer' + (counterCount+1));
  var crane = glScene.getObjectByName('crane');
  var craneCap2 = glScene.getObjectByName('craneCap2');

  var counter = glScene.getObjectByName('whiteCounter' + counterCount);
  craneCap2.add(counter);
  counter.scale.x = 1 / craneCap2.scale.x
  counter.scale.y = 1 / craneCap2.scale.y
  counter.scale.z = 1 / craneCap2.scale.z
  counter.position.set(1, -0.97, -0.025);  

  return true;

}



function TaskCrane1MoveToWarehouse2() {
  // body...
  var counterCount =1 ;
  var counterContainer = glScene.getObjectByName('counterContainer' + (counterCount+1));
  var crane = glScene.getObjectByName('crane');
  var craneCap2 = glScene.getObjectByName('craneCap2');
  var craneElevation = glScene.getObjectByName('craneArmElevation');
  var craneExtension = glScene.getObjectByName('craneArmExtension');


  var counter = glScene.getObjectByName('whiteCounter' + counterCount);

  if (crane.rotation.y < 4.7577675  ){
    crane.rotation.y += 0.05;
    return false;
  } 
  crane.rotation.y = 4.7577675;

  if (craneExtension.position.x < 1.525 ){
    craneExtension.position.x += 0.25;
    return false;
  } 
  craneExtension.position.x = 1.525;

  if (craneElevation.position.y > -5.05 ){
    craneElevation.position.y -= 0.25;
    return false;
  }
  craneElevation.position.y = -5.05
  return true;

}

