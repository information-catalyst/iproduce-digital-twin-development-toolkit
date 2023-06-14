function selectCounter(counterCount) {

  counterPos = [
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

  collectionCrane = glScene.getObjectByName('collectionCrane');
  collectionCraneArmElevation = glScene.getObjectByName('collectionCraneArmElevation');
  collectionCraneArmExtension = glScene.getObjectByName('collectionCraneArmExtension');

  if (counterCount != -1) {
      if (collectionCrane.position.x > counterPos[counterCount][0]) {
          collectionCrane.position.x -= 0.25;
      }
      if (collectionCrane.position.x < counterPos[counterCount][0]) {
          collectionCrane.position.x = counterPos[counterCount][0];
      }
  }

  if (collectionCrane.position.x == counterPos[counterCount][0]) {
      if (collectionCraneArmElevation.position.y > counterPos[counterCount][1]) {
          collectionCraneArmElevation.position.y -= 0.250;
      }
      if (collectionCraneArmElevation.position.y < counterPos[counterCount][1]) {
          collectionCraneArmElevation.position.y = counterPos[counterCount][1];
      }
  }

  if (collectionCrane.position.x == counterPos[counterCount][0] && collectionCraneArmElevation.position.y == counterPos[counterCount][1]) {
      if (collectionCraneArmExtension.position.z > -5.5) {
          collectionCraneArmExtension.position.z -= 0.250;
      }
      if (collectionCraneArmExtension.position.z < -5.5) {
          collectionCraneArmExtension.position.z = -5.5;
      }
  }

  if (collectionCrane.position.x == counterPos[counterCount][0] &&
      collectionCraneArmElevation.position.y == counterPos[counterCount][1] &&
      collectionCraneArmExtension.position.z == -5.5) {
      selectCounterState = false;
      endSelectCounter();
  }
}

function returnCounter(counterCount) {

  collectionCrane = glScene.getObjectByName('collectionCrane');
  collectionCraneArmElevation = glScene.getObjectByName('collectionCraneArmElevation');
  collectionCraneArmExtension = glScene.getObjectByName('collectionCraneArmExtension');
  counterContainer = glScene.getObjectByName('counterContainer' + (counterCount + 1));

  if (collectionCraneArmElevation.position.y < counterPos[counterCount][1] + 1.04 && collectionCrane.position.x != 9.25) {
      if (collectionCraneArmElevation.position.y == counterPos[counterCount][1]) {
          collectionCraneArmElevation.position.y = counterPos[counterCount][1] + 0.04;
      }
      collectionCraneArmElevation.position.y += 0.250;
      counterContainer.position.y += 0.250
  }
  if (collectionCraneArmElevation.position.y > counterPos[counterCount][1] + 1.04) {
      collectionCraneArmElevation.position.y = counterPos[counterCount][1] + 1.04;
  }

  if (collectionCraneArmElevation.position.y == counterPos[counterCount][1] + 1.04 && collectionCrane.position.x != 9.25) {
      if (collectionCraneArmExtension.position.z < 0) {
          collectionCraneArmExtension.position.z += 0.250;
          counterContainer.position.x -= 0.250;
      }
      if (collectionCraneArmExtension.position.z > 0) {
          collectionCraneArmExtension.position.z = 0;
      }

      if (collectionCraneArmExtension.position.z == 0 && collectionCraneArmElevation.position.y == counterPos[counterCount][1] + 1.04) {
          if (collectionCrane.position.x < 9.25) {
              collectionCrane.position.x += 0.25;
              counterContainer.position.z += 0.25;
          }
          if (collectionCrane.position.x > 9.25) {
              collectionCrane.position.x = 9.25;
          }
      }
  }

  if (collectionCrane.position.x == 9.25 && collectionCraneArmElevation.position.y == counterPos[counterCount][1] + 1.04) {
      if (collectionCraneArmExtension.position.z > -5) {
          collectionCraneArmExtension.position.z -= 0.25;
          counterContainer.position.x += 0.25;
      }
      if (collectionCraneArmExtension.position.z < -5) {
          collectionCraneArmExtension.position.z = -5;
      }
  }

  if (collectionCraneArmExtension.position.z == -5) {
      if (collectionCraneArmElevation.position.y > -8.75) {
          collectionCraneArmElevation.position.y -= 0.25
          counterContainer.position.y -= 0.25
          if (collectionCraneArmElevation.position.y <= -8.75 && collectionCraneArmElevation.position.y > -9.5) {
              collectionCraneArmElevation.position.y -= 0.25;
          }
      }
  }

  if ((collectionCrane.position.x == 9.25) &&
      (collectionCraneArmExtension.position.z == -5) &&
      (collectionCraneArmElevation.position.y <= -9.2)) {
      returnCounterState = false;
      endReturnCounter();
  }

}




