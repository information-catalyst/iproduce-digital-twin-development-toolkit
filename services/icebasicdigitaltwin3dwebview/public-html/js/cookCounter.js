counterCooked = false;
counterCookedTimer = 0;

function cookCounter(counterCount, glScene) {

    var counterContainer = glScene.getObjectByName('counterContainer' + counterCount);
    var crane = glScene.getObjectByName('crane');
    var craneCap2 = glScene.getObjectByName('craneCap2');
    var cookingPlatform = glScene.getObjectByName('cookingPlatform');
    var counterCooking = glScene.getObjectByName('counterCookingPlatform');
    var craneElevation = glScene.getObjectByName('craneArmElevation');
    var craneExtension = glScene.getObjectByName('craneArmExtension');
    var ovenDoor = glScene.getObjectByName('ovenDoorElevation');

    if (counterCount > 0 && counterCount < 4) {
        var counter = glScene.getObjectByName('whiteCounter' + counterCount);
    }
    if (counterCount > 3 && counterCount < 7) {
        var counter = glScene.getObjectByName('redCounter' + counterCount);
    }
    if (counterCount > 6 && counterCount < 10) {
        var counter = glScene.getObjectByName('blueCounter' + counterCount);
    }

    if (counterContainer.position.x < 9.75) {
        counterContainer.position.x += 0.25;
    }
    if (counterContainer.position.x > 9.75) {
        counterContainer.position.x = 9.75;
    }

    if (crane.rotation.y < 4.7577675 && counterContainer.position.x == 9.75 && craneCap2.children.length == 0 && cookingPlatform.children.length == 0) {
        crane.rotation.y += 0.05;
    }
    if (crane.rotation.y > 4.7577675 && counterContainer.position.x == 9.75 && craneCap2.children.length == 0 && cookingPlatform.children.length == 0) {
        crane.rotation.y = 4.7577675;
    }

    if (craneExtension.position.x < 1.525 && crane.rotation.y == 4.7577675 && craneCap2.children.length == 0 && cookingPlatform.children.length == 0) {
        craneExtension.position.x += 0.25;
    }
    if (craneExtension.position.x > 1.525 && crane.rotation.y == 4.7577675 && craneCap2.children.length == 0 && cookingPlatform.children.length == 0) {
        craneExtension.position.x = 1.525;
    }

    if (craneElevation.position.y > -5.05 && craneExtension.position.x == 1.525 && craneCap2.children.length == 0 && cookingPlatform.children.length == 0) {
        craneElevation.position.y -= 0.25;
    }
    if (craneElevation.position.y < -5.05 && craneExtension.position.x == 1.525 && craneCap2.children.length == 0 && cookingPlatform.children.length == 0) {
        craneElevation.position.y = -5.05
    }

    if (craneElevation.position.y == -5.05 && craneExtension.position.x == 1.525 && craneCap2.children.length == 0) {
        if (counterCount > 0 && counterCount < 4 && counterContainer.children.length == 4) {
            var counter = glScene.getObjectByName('whiteCounter' + counterCount);
            craneCap2.add(counter);
            counter.scale.x = 1 / craneCap2.scale.x
            counter.scale.y = 1 / craneCap2.scale.y
            counter.scale.z = 1 / craneCap2.scale.z
            counter.position.set(1, -0.97, -0.025);
        }
        if (counterCount > 3 && counterCount < 7 && counterContainer.children.length == 4) {
            var counter = glScene.getObjectByName('redCounter' + counterCount);
            craneCap2.add(counter);
            counter.scale.x = 1 / craneCap2.scale.x
            counter.scale.y = 1 / craneCap2.scale.y
            counter.scale.z = 1 / craneCap2.scale.z
            counter.position.set(1, -0.97, -0.025);
        }
        if (counterCount > 6 && counterCount < 10 && counterContainer.children.length == 4) {
            var counter = glScene.getObjectByName('blueCounter' + counterCount);
            craneCap2.add(counter);
            counter.scale.x = 1 / craneCap2.scale.x
            counter.scale.y = 1 / craneCap2.scale.y
            counter.scale.z = 1 / craneCap2.scale.z
            counter.position.set(1, -0.97, -0.025);
        }
    }

    if (craneElevation.position.y < 0 && craneExtension.position.x == 1.525 && craneCap2.children.length == 1) {
        craneElevation.position.y += 0.25;
    }
    if (craneElevation.position.y > 0 && craneExtension.position.x == 1.525 && craneCap2.children.length == 1) {
        craneElevation.position.y = 0;
    }

    if (craneExtension.position.x > 0 && craneElevation.position.y == 0 && crane.rotation.y == 4.7577675 && craneCap2.children.length == 1) {
        craneExtension.position.x -= 0.25;
    }
    if (craneExtension.position.x < 0 && craneElevation.position.y == 0 && crane.rotation.y == 4.7577675 && craneCap2.children.length == 1) {
        craneExtension.position.x = 0;
    }

    if (crane.rotation.y > 3.14 && craneElevation.position.y == 0 && craneExtension.position.x == 0 && craneCap2.children.length == 1) {
        crane.rotation.y -= 0.05;
    }
    if (crane.rotation.y < 3.14 && craneElevation.position.y == 0 && craneExtension.position.x == 0 && craneCap2.children.length == 1) {
        crane.rotation.y = 3.14;
    }

    if (craneExtension.position.x < 12 && crane.rotation.y == 3.14 && craneElevation.position.y == 0 && craneCap2.children.length == 1) {
        craneExtension.position.x += 0.25;
    }
    if (craneExtension.position.x > 12 && crane.rotation.y == 3.14 && craneElevation.position.y == 0 && craneCap2.children.length == 1) {
        craneExtension.position.x = 12;
    }

    if (craneElevation.position.y > -10.9 && crane.rotation.y == 3.14 && craneExtension.position.x == 12 && craneCap2.children.length == 1) {
        craneElevation.position.y -= 0.25;
    }
    if (craneElevation.position.y < -10.9 && crane.rotation.y == 3.14 && craneExtension.position.x == 12 && craneCap2.children.length == 1) {
        craneElevation.position.y = -10.9;
    }

    if (crane.rotation.y == 3.14 && craneElevation.position.y == -10.9 && craneExtension.position.x == 12 && cookingPlatform.children.length == 0) {
        if (counterCount > 0 && counterCount < 4 && craneCap2.children.length == 1) {
            var counter = glScene.getObjectByName('whiteCounter' + counterCount);
            cookingPlatform.add(counter);
            counter.scale.x = 1 / cookingPlatform.scale.x
            counter.scale.y = 1 / cookingPlatform.scale.y
            counter.scale.z = 1 / cookingPlatform.scale.z
            counter.position.set(0.04, 3.75, 0);
        }
        if (counterCount > 3 && counterCount < 7 && craneCap2.children.length == 1) {
            var counter = glScene.getObjectByName('redCounter' + counterCount);
            craneCap2.add(counter);
            counter.scale.x = 1 / cookingPlatform.scale.x
            counter.scale.y = 1 / cookingPlatform.scale.y
            counter.scale.z = 1 / cookingPlatform.scale.z
            counter.position.set(0.04, 3.75, 0);
        }
        if (counterCount > 6 && counterCount < 10 && craneCap2.children.length == 1) {
            var counter = glScene.getObjectByName('blueCounter' + counterCount);
            craneCap2.add(counter);
            counter.scale.x = 1 / cookingPlatform.scale.x
            counter.scale.y = 1 / cookingPlatform.scale.y
            counter.scale.z = 1 / cookingPlatform.scale.z
            counter.position.set(0.04, 3.75, 0);
        }
    }

    if (craneElevation.position.y < 0 && crane.rotation.y == 3.14 && craneExtension.position.x == 12 && cookingPlatform.children.length == 1) {
        craneElevation.position.y += 0.25;
    }
    if (craneElevation.position.y > 0 && crane.rotation.y == 3.14 && craneExtension.position.x == 12 && cookingPlatform.children.length == 1) {
        craneElevation.position.y = 0;
    }

    if (ovenDoor.position.y < 1.80 && crane.rotation.y == 3.14 && craneExtension.position.x == 12 && counterCooking.position.x == 0.75 && cookingPlatform.children.length == 1) {
        ovenDoor.position.y += 0.1;
    }
    if (ovenDoor.position.y > 1.80 && crane.rotation.y == 3.14 && craneExtension.position.x == 12 && counterCooking.position.x == 0.75 && cookingPlatform.children.length == 1) {
        ovenDoor.position.y = 1.8;
    }

    if (counterCooking.position.x > -7.70 && ovenDoor.position.y == 1.8 && craneExtension.position.x == 12 && craneElevation.position.x == 0 && cookingPlatform.children.length == 1 && counterCooked == false) {
        counterCooking.position.x -= 0.25;
    }
    if (counterCooking.position.x < -7.7 && ovenDoor.position.y == 1.8 && craneExtension.position.x == 12 && craneElevation.position.x == 0 && cookingPlatform.children.length == 1 && counterCooked == false) {
        counterCooking.position.x = -7.70;
    }

    if (ovenDoor.position.y > 0 && crane.rotation.y == 3.14 && craneExtension.position.x == 12 && counterCooking.position.x == -7.70 && cookingPlatform.children.length == 1) {
        ovenDoor.position.y -= 0.1;
    }
    if (ovenDoor.position.y < 0 && crane.rotation.y == 3.14 && craneExtension.position.x == 12 && counterCooking.position.x == -7.70 && cookingPlatform.children.length == 1) {
        ovenDoor.position.y = 0;
    }

    if (ovenDoor.position.y == 0 && counterCooking.position.x == -7.70 && counterCooked == false) {
        if (counterCookedTimer > 500) {
            counterCooked = true;
        } else {
            counterCookedTimer++;
        }
    }

    if (ovenDoor.position.y < 1.80 && counterCooking.position.x == -7.70 && counterCooked == true) {
        ovenDoor.position.y += 0.20;
    }
    if (ovenDoor.position.y > 1.80 && counterCooking.position.x == -7.70 && counterCooked == true) {
        ovenDoor.position.y = 1.80;
    }

    if (counterCooking.position.x < 0.75 && ovenDoor.position.y == 1.80 && counterCooked == true) {
        counterCooking.position.x += 0.25;
    }
    if (counterCooking.position.x > 0.75 && ovenDoor.position.y == 1.80 && counterCooked == true) {
        counterCooking.position.x = 0.75;
    }

    if (ovenDoor.position.y > 0 && counterCooking.position.x == 0.75 && counterCooked == true) {
        ovenDoor.position.y -= 0.20;
    }
    if (ovenDoor.position.y < 0 && counterCooking.position.x == 0.75 && counterCooked == true) {
        ovenDoor.position.y = 0;
    }

    if (ovenDoor.position.y == 0 &&
        counterCooking.position.x == 0.75 &&
        counterCooked == true) {

        cookCounterState = false;
        endCookCounter();
    }
}

function drillCounter(counterCount, glScene) {

    var cookingPlatform = glScene.getObjectByName('cookingPlatform');
    var counterCooking = glScene.getObjectByName('counterCookingPlatform');

    var ovenDoor = glScene.getObjectByName('ovenDoorElevation');
    var drill = glScene.getObjectByName('drillTurnTable');
    var drillingPlatform = glScene.getObjectByName('drillingPlatform');

    if (counterCount > 0 && counterCount < 4) {
        var counter = glScene.getObjectByName('whiteCounter' + counterCount);
    }
    if (counterCount > 3 && counterCount < 7) {
        var counter = glScene.getObjectByName('redCounter' + counterCount);
    }
    if (counterCount > 6 && counterCount < 10) {
        var counter = glScene.getObjectByName('blueCounter' + counterCount);
    }

    if (counter.position.y < 15 && counter.position.z == 0 && ovenDoor.position.y == 0 && counterCooking.position.x == 0.75 && counter.parent.name == 'cookingPlatform' && counterCooked == true) {
        counter.position.y += 0.25;
    }
    if (counter.position.y > 15 && counter.position.z == 0 && ovenDoor.position.y == 0 && counterCooking.position.x == 0.75 && counter.parent.name == 'cookingPlatform' && counterCooked == true) {
        counter.position.y = 15;
    }

    if (counter.position.z > -6.325 && counter.position.y == 15 && ovenDoor.position.y == 0 && counterCooking.position.x == 0.75 && counter.parent.name == 'cookingPlatform' && counterCooked == true) {
        counter.position.z -= 0.1;
    }
    if (counter.position.z < -6.325 && counter.position.y == 15 && ovenDoor.position.y == 0 && counterCooking.position.x == 0.75 && counter.parent.name == 'cookingPlatform' && counterCooked == true) {
        counter.position.z = -6.325;
    }

    if (counter.position.y > 5.5 && counter.position.z == -6.325 && counter.parent.name == 'cookingPlatform' && counterCooked == true) {
        counter.position.y -= 0.1;
    }
    if (counter.position.y < 5.5 && counter.position.z == -6.325 && counter.parent.name == 'cookingPlatform' && counterCooked == true) {
        counter.position.y = 5.5
    }

    if (counter.position.y == 5.5 && counter.position.z == -6.325 && counter.parent.name == 'cookingPlatform' && counterCooked == true) {
        if (counterCount > 0 && counterCount < 4 && cookingPlatform.children.length == 1) {
            var counter = glScene.getObjectByName('whiteCounter' + counterCount);
            drillingPlatform.add(counter);
            counter.scale.x = 1 / drillingPlatform.scale.x
            counter.scale.y = 1 / drillingPlatform.scale.y
            counter.scale.z = 1 / drillingPlatform.scale.z
            counter.position.set(0.04, 3.75, 0);
        }
        if (counterCount > 3 && counterCount < 7 && cookingPlatform.children.length == 1) {
            var counter = glScene.getObjectByName('redCounter' + counterCount);
            drillingPlatform.add(counter);
            counter.scale.x = 1 / drillingPlatform.scale.x
            counter.scale.y = 1 / drillingPlatform.scale.y
            counter.scale.z = 1 / drillingPlatform.scale.z
            counter.position.set(0.04, 3.75, 0);
        }
        if (counterCount > 6 && counterCount < 10 && cookingPlatform.children.length == 1) {
            var counter = glScene.getObjectByName('blueCounter' + counterCount);
            drillingPlatform.add(counter);
            counter.scale.x = 1 / drillingPlatform.scale.x
            counter.scale.y = 1 / drillingPlatform.scale.y
            counter.scale.z = 1 / drillingPlatform.scale.z
            counter.position.set(0.04, 3.75, 0);
        }
    }

    if (drill.rotation.y > -3.14159 && counter.position.y == 3.75 && counter.position.z == 0 && counterCookedTimer < 1000 && counter.parent.name == 'drillingPlatform' && counterCooked == true) {
        drill.rotation.y -= 0.05;
    }
    if (drill.rotation.y < -3.14159 && counter.position.y == 3.75 && counter.position.z == 0 && counterCookedTimer < 1000 && counter.parent.name == 'drillingPlatform' && counterCooked == true) {
        drill.rotation.y = -3.14159;
    }

    if (drill.rotation.y == -3.14159 && counter.position.y == 3.75 && counter.position.z == 0 && counter.parent.name == 'drillingPlatform' && counterCooked == true) {
        if (counterCookedTimer > 1000) {
            counterCooked = true;
        } else {
            counterCookedTimer++;
        }
    }

    if (drill.rotation.y > -4.71239 && counter.position.y == 3.75 && counter.position.z == 0 && counterCookedTimer > 1000 && counter.parent.name == 'drillingPlatform' && counterCooked == true) {
        drill.rotation.y -= 0.05;
    }
    if (drill.rotation.y < -4.71239 && counter.position.y == 3.75 && counter.position.z == 0 && counterCookedTimer > 1000 && counter.parent.name == 'drillingPlatform' && counterCooked == true) {
        drill.rotation.y = -4.71239;
    }


    if (drill.rotation.y == -4.71239 &&
        counter.position.y == 3.75 &&
        counter.position.z == 0 &&
        counterCookedTimer > 1000 &&
        counter.parent.name == 'drillingPlatform' &&
        counterCooked == true) {

        drillCounterState = false;
        endDrillCounter();
    }
}