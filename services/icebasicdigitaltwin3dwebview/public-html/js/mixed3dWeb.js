  ///////////////////////////////////////////////////////////////////
  // CSS3DRenderer Demo
  // By Philippe Leefsma, July 2015
  ///////////////////////////////////////////////////////////////////
  //References:
  //http://codereply.com/answer/83pofc/threejs-properly-blending-css3d-webgl.html
  //http://learningthreejs.com/blog/2013/04/30/closing-the-gap-between-html-and-webgl/
  var controls, camera, glScene, cssScene, glRenderer, cssRenderer;
  console.log("modelList in mix3dweb", modelList)
  function createGlRenderer3(shadows) {
      var glRenderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true
      });
      glRenderer.setClearColor(0x000000);
      glRenderer.setPixelRatio(window.devicePixelRatio);
      //glRenderer.setSize(window.innerWidth, window.innerHeight);

      //    glRenderer.setSize( 800, 600 );
      glRenderer.setSize(1880, 850);

      glRenderer.domElement.style.position = 'absolute';
      glRenderer.domElement.style.zIndex = 1;
      //    glRenderer.domElement.style.top = '50px';
      glRenderer.domElement.style.top = 0;

      if (shadows == "1") {
          glRenderer.shadowMap.enabled = true;
      } else {
          glRenderer.shadowMap.enabled = false;
      }

      glRenderer.shadowMap.type = THREE.PCFShadowMap;
      //glRenderer.setSize( 800, 600 );


      return glRenderer;
  }

  ///////////////////////////////////////////////////////////////////
  // Creates CSS Renderer
  //
  ///////////////////////////////////////////////////////////////////
  function createCssRenderer3() {
      var cssRenderer = new THREE.CSS3DRenderer();
      //    cssRenderer.setSize(window.innerWidth, window.innerHeight);
      //      cssRenderer.setSize( 800, 600 );
      cssRenderer.setSize(1880, 850);
      cssRenderer.domElement.style.position = 'absolute';
      glRenderer.domElement.style.zIndex = 0;

      var newTop = $("#mycanvas").position().top;
      var newLeft = $("#mycanvas").position().left;

      cssRenderer.domElement.style.top = newTop; // '45px';
      cssRenderer.domElement.style.left = newLeft; // '45px';
      return cssRenderer;
  }


  ///////////////////////////////////////////////////////////////////
  // Creates Lights
  //
  ///////////////////////////////////////////////////////////////////
  function createLights() {

      //directional light for shading 
      var light = new THREE.DirectionalLight(0xffffff, 1, 100);
      light.position.set(0, 40, 40);
      light.target.position.set(0, 0, 0);
      light.castShadow = true;
      // adjusts volume of space where shadows register
      light.shadow.camera.right = 15;
      light.shadow.camera.left = -15;
      light.shadow.camera.top = 15;
      light.shadow.camera.bottom = -15;
      glScene.add(light);



      // add some ambient to make nonilluminated areas non black
      var ambientLight = new THREE.AmbientLight(0x404040); // soft white light
      glScene.add(ambientLight);
  }



  ///////////////////////////////////////////////////////////////////
  // Creates plane mesh
  //
  ///////////////////////////////////////////////////////////////////
  function createPlane(w, h, position, rotation) {
      var material = new THREE.MeshBasicMaterial({
          color: 0x000000,
          opacity: 0.0,
          side: THREE.DoubleSide
      });
      var geometry = new THREE.PlaneGeometry(w, h);
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = position.x;
      mesh.position.y = position.y;
      mesh.position.z = position.z;
      mesh.rotation.x = rotation.x;
      mesh.rotation.y = rotation.y;
      mesh.rotation.z = rotation.z;

      mesh.scale.set(0.01, 0.01, 0.01);


      return mesh;
  }
  ///////////////////////////////////////////////////////////////////
  // Creates CSS object
  //
  ///////////////////////////////////////////////////////////////////
  function createCssObject(w, h, position, rotation, url) {
      var html = [
          '<div style="width:' + w + 'px; height:' + h + 'px;">',
          '<iframe scrolling="no" src="' + url + '" width="' + w + '" height="' + h + '">',
          '</iframe>',
          '</div>'
      ].join('\n');
      var div = document.createElement('div');
      $(div).html(html);
      var cssObject = new THREE.CSS3DObject(div);
      cssObject.position.x = position.x;
      cssObject.position.y = position.y;
      cssObject.position.z = position.z;
      cssObject.rotation.x = rotation.x;
      cssObject.rotation.y = rotation.y;
      cssObject.rotation.z = rotation.z;

      cssObject.scale.set(0.01, 0.01, 0.01);

      return cssObject;
  }
  ///////////////////////////////////////////////////////////////////
  // Creates 3d webpage object
  //
  ///////////////////////////////////////////////////////////////////
  function create3dPage(w, h, position, rotation, url, name) {
      var plane = createPlane(
          w, h,
          position,
          rotation);

      plane.name = name;


      var material1 = new THREE.MeshLambertMaterial({
          color: 0xFFFF000
      });
      var geometry = new THREE.BoxGeometry(2, 2, 2);
      var oneCube = new THREE.Mesh(geometry, material1);



      //var cameraPos = new Object3D();
      oneCube.name = "CameraHere";
      oneCube.position.x = 0;
      oneCube.position.y = 0;
      oneCube.position.z = 400;
      oneCube.visible = false;

      //plane.appendChild(oneCube);
      plane.add(oneCube);


      glScene.add(plane);
      var cssObject = createCssObject(
          w, h,
          position,
          rotation,
          url);


      cssObject.name = name;

      cssScene.add(cssObject);
  }

  ///////////////////////////////////////////////////////////////////
  // Creates 3d webpage object
  //
  ///////////////////////////////////////////////////////////////////
  function createFake3dPage(w, h, position, rotation, url, name) {
      var plane = createPlane(
          w, h,
          position,
          rotation);

      plane.name = name;


      var material1 = new THREE.MeshLambertMaterial({
          color: 0xFFFF000
      });
      var geometry = new THREE.BoxGeometry(2, 2, 2);
      var oneCube = new THREE.Mesh(geometry, material1);



      //var cameraPos = new Object3D();
      oneCube.name = "CameraHere";
      oneCube.position.x = 0;
      oneCube.position.y = 0;
      oneCube.position.z = 400;
      oneCube.visible = false;

      //plane.appendChild(oneCube);
      plane.add(oneCube);


      glScene.add(plane);
      var cssObject = createCssObject(
          w, h,
          position,
          rotation,
          url);


      cssObject.name = name;

      cssScene.add(cssObject);
  }



  ///////////////////////////////////////////////////////////////////
  // Creates 3d webpage object
  //
  ///////////////////////////////////////////////////////////////////
  function remove3dPage(name) {
      if (glScene.getObjectByName(name)) {
          glScene.remove(glScene.getObjectByName(name));
      }
      if (cssScene.getObjectByName(name)) {
          cssScene.remove(cssScene.getObjectByName(name));
      }
  }




  ///////////////////////////////////////////////////////////////////
  // Create a robot at each  point  on the work station platform
  //
  ///////////////////////////////////////////////////////////////////
  function createStations() {

      var myPI = 22.0 / 7.0;
      var my2PI = myPI * 2.0;

      for (var i = 0; i < stationNames.length; i++) {

          var x = Math.sin((i / 8) * my2PI) * 5.7;
          var z = Math.cos((i / 8) * my2PI) * 5.7;
          //oneCube.rotation.y = (i/8) * my2PI;

          createStation(x, z, stationNames[i]);

      }

  }

  ///////////////////////////////////////////////////////////////////
  // Load a staion and set up the  sensors
  //
  ///////////////////////////////////////////////////////////////////
  function createStation(x, z, station) {
      // BEGIN Clara.io JSON loader code
      //var robotObj = null;
      var objectLoader = new THREE.ObjectLoader();
      objectLoader.load("models/stations.json", function(obj) {
          glScene.add(obj);
          // add shadows 
          obj.traverse(function(child) { // find the inner hierachy elements and pre-animate so it looks okay static
              if (child instanceof THREE.Mesh) {
                  child.castShadow = true;
                  child.receiveShadow = true;
              }
          });



          var i = 0;
          obj.traverse(function(child) { // find the inner hierachy elements and pre-animate so it looks okay static
              if (child.name.startsWith("Sensor")) {

                  //child.url = "http://www.google.com";                  // use this to  find the object for later updates
                  if (i < station.sensors.length) {
                      child.name = station.sensors[i].title;
                      child.url = station.sensors[i].href;
                      child.database = "test";
                      child.collection = "rangedData";
                      selectObjects.push(child); //for select controller

                  } else {
                      child.visible = false;

                  }
                  i++;
              }
          });

          obj.name = station.name; // use this to  find the object for later updates
          obj.position.x = x;
          obj.position.y = 1;
          obj.position.z = z;
          obj.lookAt(platform.position);


          var spritey = makeTextSprite(station.name, {
              fontsize: 48,
              borderColor: {
                  r: 255,
                  g: 0,
                  b: 0,
                  a: 1.0
              },
              backgroundColor: {
                  r: 255,
                  g: 100,
                  b: 100,
                  a: 0.8
              }
          });

          spritey.position.x = x;
          spritey.position.y = 1.7;
          spritey.position.z = z;
          glScene.add(spritey);

      });
      // END Clara.io JSON loader code
  }




  ///////////////////////////////////////////////////////////////////
  // Create a robot at each  point  on the work station platform
  //
  ///////////////////////////////////////////////////////////////////
  function createPlatformSensors() {

      // multiple sides       
      var material1 = new THREE.MeshLambertMaterial({
          color: 0xFFFF000
      });
      var geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
      var myPI = 22.0 / 7.0;
      var my2PI = myPI * 2.0;

      for (var i = 0; i < tableNames[0].sensors.length; i++) {
          var oneCube = new THREE.Mesh(geometry, material1);
          oneCube.castShadow = true;
          oneCube.receiveShadow = true;

          oneCube.position.x = Math.sin((i / tableNames[0].sensors.length) * my2PI) * 2.7;
          oneCube.position.y = 1;
          oneCube.position.z = Math.cos((i / tableNames[0].sensors.length) * my2PI) * 2.7;
          // rotate to face table
          oneCube.rotation.y = (i / tableNames[0].sensors.length) * my2PI;

          oneCube.name = tableNames[0].sensors[i].title;
          oneCube.url = tableNames[0].sensors[i].href;
          oneCube.database = "test";
          oneCube.collection = "rangedData";

          selectObjects.push(oneCube); //for select controller
          glScene.add(oneCube);
      }
  }

  function createFactorySensors() {
      for (var x = 0; x < factorySensors.length; x++) {
          var obj = glScene.getObjectByName(factorySensors[x].sensors[0].title);
          console.log(obj);
          console.log(factorySensors[0].sensors.length)
          selectObjects.push(obj);
      }
  }



  //used only in warehouse
  function billBoardHTML() {
      var element = document.createElement('div');
      element.className = 'element';
      element.style.backgroundColor = 'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')';

      //          element.width =400;
      //          element.height=400;

      var number = document.createElement('div');
      number.className = 'number';
      number.textContent = 1;
      element.appendChild(number);

      var symbol = document.createElement('div');
      symbol.className = 'symbol';
      symbol.textContent = "xws";
      element.appendChild(symbol);

      var details = document.createElement('div');
      details.className = 'details';
      details.innerHTML = "details nirn" + '<br>' + "(444)";
      element.appendChild(details);
      /*
                var object = new THREE.CSS3DObject( element );
                object.position.x = 0; // Math.random() * 4000 - 2000;
                object.position.y = 0; //Math.random() * 4000 - 2000;
                object.position.z = 0;//Math.random() * 4000 - 2000;
                //glScene.add( object );


                return  object;
      */

      var texture = new THREE.Texture(element)
      texture.needsUpdate = true;

      var spriteMaterial = new THREE.SpriteMaterial({
          map: texture
      });
      var sprite = new THREE.Sprite(spriteMaterial);
      //sprite.scale.set(1.5,.5,1.0);
      return sprite;

      ////// objects.push( object );

  }


  ///////////////////////////////////////////////////////////////////
  // put an  object on the  platform for the robot arm to follow
  //
  ///////////////////////////////////////////////////////////////////
  function makeTextSprite(message, parameters) {
      if (parameters === undefined) parameters = {};

      var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";

      var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 18;

      var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;

      var borderColor = parameters.hasOwnProperty("borderColor") ? parameters["borderColor"] : {
          r: 0,
          g: 0,
          b: 0,
          a: 1.0
      };

      var backgroundColor = parameters.hasOwnProperty("backgroundColor") ? parameters["backgroundColor"] : {
          r: 255,
          g: 255,
          b: 255,
          a: 1.0
      };



      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      context.font = "Bold " + fontsize + "px " + fontface;

      // get size data (height depends only on font size)
      var metrics = context.measureText(message);
      var textWidth = metrics.width;


      var iwidth = Math.round(textWidth + borderThickness + borderThickness);

      if (iwidth > 300) {
          // default canvas size is 300 apparently
          canvas.width = iwidth;
          canvas.height = iwidth * 150 / 300; // ratio width height should be 1/2
          // grab context again because changing canvas dimensions stuffs it
          context = canvas.getContext('2d');
          context.font = "Bold " + fontsize + "px " + fontface;
      }


      // background color
      context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
      // border color
      context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";

      context.lineWidth = borderThickness;
      roundRect(context, borderThickness / 2, borderThickness / 2, textWidth + borderThickness, fontsize + borderThickness + 4, 6);
      // 1.4 is extra height factor for text below baseline: g,j,p,q.

      // text color
      context.fillStyle = "rgba(0, 0, 0, 1.0)";

      context.fillText(message, borderThickness, fontsize + borderThickness);

      // canvas contents will be used for a texture
      var texture = new THREE.Texture(canvas)
      texture.needsUpdate = true;

      var spriteMaterial = new THREE.SpriteMaterial({
          map: texture
      });
      var sprite = new THREE.Sprite(spriteMaterial);
      //sprite.scale.set(1.5,.5,1.0);
      return sprite;
  }

  // function for drawing rounded rectangles
  function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
  }




  function createWallTileFromObj(filepath, ymaterial, x, y, z) {


      var loader = new THREE.OBJLoader();

      // load a resource
      loader.load(
          // resource URL
          filepath,
          // Function when resource is loaded
          function(object) {

              //object.material = material;
              object.traverse(function(child) {
                  if (child instanceof THREE.Mesh) {
                      child.material = ymaterial;
                      child.castShadow = true;
                      child.receiveShadow = true;
                  }
              });
              object.scale.set(0.1, 0.1, 0.1);
              object.position.set(x, y, z);
              //object.rotation.set(rotation.x,rotation.y,rotation.z);
              glScene.add(object);
          }
      );
  }


  function createWallTileFromObj2(parent, filepath, ymaterial, position, rotation) {


      var loader = new THREE.OBJLoader();
      var scale = 3.0 / 256.0; // taking a moudlar section as 3m but comes in units 256

      // load a resource
      loader.load(
          // resource URL
          filepath,
          // Function when resource is loaded
          function(object) {

              //object.material = material;
              object.traverse(function(child) {
                  if (child instanceof THREE.Mesh) {
                      child.material = ymaterial;
                      child.castShadow = true;
                      child.receiveShadow = true;
                  }
              });
              object.scale.set(scale, scale, scale);
              object.position.set(position.x, position.y, position.z);
              object.rotation.set(rotation.x, rotation.y, rotation.z);
              parent.add(object);
          }
      );
  }



  ///////////////////////////////////////////////////////////////////
  // Creates plane mesh
  //
  ///////////////////////////////////////////////////////////////////
  function createTile(material, w, h, position, rotation) {
      var geometry = new THREE.PlaneGeometry(w, h);
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = position.x;
      mesh.position.y = position.y;
      mesh.position.z = position.z;
      mesh.rotation.x = rotation.x;
      mesh.rotation.y = rotation.y;
      mesh.rotation.z = rotation.z;


      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
  }

  function createFloorTile() {


  }

  /*function createFloor(material,widthX,widthZ){
      var pos = new THREE.Vector3( );      
      var rot = new THREE.Vector3( );      
      rot.x = -1.55 ;

      var floor = new THREE.Object3D()
      for (z = -widthZ; z<widthZ; z++){
          for(x= -widthX; x<widthZ; x++){
              floor.add(createTile(material,1,1, pos, rot));
              pos.x += 1;
          }
          pos.x = 0;
          pos.z += 1;
      }
      return floor;
  }*/

  function createFloor2(material, tileWidth, count) {

      var pos = new THREE.Vector3();
      var rot = new THREE.Vector3();
      rot.x = -11.0 / 7.0;
      pos.x = tileWidth / 2; // offset as these are centered on 0 and eerythings else corner is at 0
      pos.z = tileWidth / 2;

      var floor = new THREE.Object3D()
      var geometry = new THREE.PlaneGeometry(tileWidth * count, tileWidth * count);
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = pos.x + tileWidth * count / 2 - tileWidth / 2;
      mesh.position.y = pos.y;
      mesh.position.z = pos.z + tileWidth * count / 2 - tileWidth / 2;
      mesh.rotation.x = rot.x;
      mesh.rotation.y = rot.y;
      mesh.rotation.z = rot.z;
      floor.add(mesh);

      var texture = mesh.material.map;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(count, count);
      material.needsUpdate = true;

      floor.castShadow = true;
      floor.receiveShadow = true;

      //console.log('here');  
      //console.log(count);
      //console.log(tileWidth);

      return floor;

  }

  function createRoof2(material, tileWidth, wallLengthTiles, wallHeightTiles) {
      var pos = new THREE.Vector3();
      var rot = new THREE.Vector3();
      rot.x = 11.0 / 7.0;
      pos.x = tileWidth / 2; // offset as these are centered on 0 and eerythings else corner is at 0
      pos.y = tileWidth * wallHeightTiles;
      pos.z = tileWidth / 2;

      var floor = new THREE.Object3D()
      var geometry = new THREE.PlaneGeometry(tileWidth * wallLengthTiles, tileWidth * wallLengthTiles);
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = pos.x + tileWidth * wallLengthTiles / 2 - tileWidth / 2;
      mesh.position.y = pos.y;
      mesh.position.z = pos.z + tileWidth * wallLengthTiles / 2 - tileWidth / 2;
      mesh.rotation.x = rot.x;
      mesh.rotation.y = rot.y;
      mesh.rotation.z = rot.z;
      floor.add(mesh);

      var texture = mesh.material.map;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(wallLengthTiles, wallLengthTiles);
      material.needsUpdate = true;

      floor.castShadow = true;
      floor.receiveShadow = true;
      return floor;
  }



  var Things = [
      'modularWarehouseShapes/wall_brick_1.obj',
      'modularWarehouseShapes/wall_concrete_1.obj',
      'modularWarehouseShapes/concrete_window_1.obj',
      'modularWarehouseShapes/wall_concrete_1.obj',
      'modularWarehouseShapes/concrete_door.obj',
      'modularWarehouseShapes/concrete_window_1.obj',

      'modularWarehouseShapes/concrete_window_1.obj',
      'modularWarehouseShapes/concrete_window_1.obj',
      'modularWarehouseShapes/wall_brick_1.obj',
  ];

  var Things2 = [
      'modularWarehouseShapes/wall_brick_1.obj',
      'modularWarehouseShapes/wall_concrete_1.obj',
      'modularWarehouseShapes/wall_concrete_1.obj',
      'modularWarehouseShapes/wall_concrete_1.obj',
      'modularWarehouseShapes/wall_concrete_1.obj',
      'modularWarehouseShapes/wall_concrete_1.obj',

      'modularWarehouseShapes/wall_concrete_1.obj',
      'modularWarehouseShapes/wall_concrete_1.obj',
      'modularWarehouseShapes/wall_brick_1.obj',
  ];

  var sThings = [
      'modularWarehouseShapes/wall_brick_1.obj',
      'modularWarehouseShapes/wall_concrete_1.obj',
      'modularWarehouseShapes/wall_concrete_1.obj',
      'modularWarehouseShapes/concrete_door.obj',
      'modularWarehouseShapes/concrete_window_1.obj',
      'modularWarehouseShapes/wall_brick_1.obj',
  ];

  var sThings2 = [
      'modularWarehouseShapes/wall_brick_1.obj',
      'modularWarehouseShapes/wall_concrete_1.obj',
      'modularWarehouseShapes/wall_concrete_1.obj',
      'modularWarehouseShapes/wall_concrete_1.obj',
      'modularWarehouseShapes/wall_concrete_1.obj',
      'modularWarehouseShapes/wall_brick_1.obj',
  ];



  function createMaterialFromImageFile(filepath) {
      var diffuseTexture = new THREE.Texture();

      var manager = new THREE.LoadingManager();

      var textureLoader = new THREE.ImageLoader(manager);
      textureLoader.load(filepath, function(image) {
          diffuseTexture.image = image;
          diffuseTexture.needsUpdate = true;
      });

      return new THREE.MeshLambertMaterial({
          map: diffuseTexture
      });


  }



  function createModularMaterial() {
      var diffuseTexture = new THREE.Texture();
      var normalTexture = new THREE.Texture();
      var specularTexture = new THREE.Texture();

      var manager = new THREE.LoadingManager();

      abimaterial = new THREE.MeshPhongMaterial({
          map: diffuseTexture,
          normalMap: normalTexture,
          specularMap: specularTexture
      });

      var textureLoader = new THREE.ImageLoader(manager);
      textureLoader.load('modularWarehouseShapes/diffuseb.png', function(image) {
          diffuseTexture.image = image;
          diffuseTexture.needsUpdate = true;
          textureLoader.load('modularWarehouseShapes/normal.png', function(image) {
              normalTexture.image = image;
              normalTexture.needsUpdate = true;
              textureLoader.load('modularWarehouseShapes/specular.png', function(image) {
                  specularTexture.image = image;
                  specularTexture.needsUpdate = true;

              });
          });
      });

      return abimaterial;
  }




  ///////////////////////////////////////////////////////////////////
  // Creates Lights
  //
  ///////////////////////////////////////////////////////////////////
  function createWarehouseLights(sectionWidth, sectionLengthTiles, sectionHeightTiles) {
      var color = 0xffffff;
      var intensity = 0.8;
      //      var distance = sectionWidth * 5;
      var distance = sectionHeightTiles * 7;
      var decay = 2;
      //      var lightSpacing = sectionWidth *2;
      var lightSpacing = sectionLengthTiles;
      var lightHeight = (sectionWidth * sectionHeightTiles) - (sectionWidth / 2);



      //var i =1; var j = 1;
      for (var i = -1; i <= 1; i += 2) {
          for (var j = -1; j <= 1; j++) {
              //test color = 0x00ff00;
              var newLight = new THREE.PointLight(color, intensity, distance, decay);
              //var newLight = new THREE.PointLight(color, intensity, distance); 
              // offet around +/- 0
              newLight.position.x = j * lightSpacing * .75;
              newLight.position.y = lightHeight;
              newLight.position.z = i * lightSpacing;

              /**/
              newLight.castShadow = true;
              // adjusts volume of space where shadows register
              newLight.shadow.camera.right = 15;
              newLight.shadow.camera.left = -15;
              newLight.shadow.camera.top = 15;
              newLight.shadow.camera.bottom = -15;
              /**/
              glScene.add(newLight);
          }
      }

      // add some ambient to make nonilluminated areas non black
      var ambientLight = new THREE.AmbientLight(0x202020); // soft white light
      glScene.add(ambientLight);
  }



  ///////////////////////////////////////////////////////////////////
  // Creates Lights
  //
  ///////////////////////////////////////////////////////////////////
  function createFagorLights(sectionWidth, sectionLength) {

      //directional light for shading 
      /*
      var light = new THREE.DirectionalLight(0xffffff,1,100);
      light.position.set(0, 40, 40);
      light.target.position.set(0, 0, 0);
      light.castShadow = true;
      // adjusts volume of space where shadows register
      light.shadow.camera.right     =  15;
      light.shadow.camera.left     = -15;
      light.shadow.camera.top      =  15;
      light.shadow.camera.bottom   = -15;
      glScene.add(light);
      */

      var color = 0xffffff;
      var intensity = 1;
      var distance = sectionWidth * 5;
      var decay = 2;
      var lightSpacing = sectionWidth * 3;
      var lightHeight = sectionWidth * 2;



      //var i =1; var j = 1;
      for (var i = -1; i <= 1; i += 2) {
          for (var j = -1; j <= 1; j++) {
              //test color = 0x00ff00;
              var newLight = new THREE.PointLight(color, intensity, distance, decay);
              //var newLight = new THREE.PointLight(color, intensity, distance); 
              // offet around +/- 0
              newLight.position.x = j * lightSpacing * .75;
              newLight.position.y = lightHeight;
              newLight.position.z = i * lightSpacing;

              /**/
              newLight.castShadow = true;
              // adjusts volume of space where shadows register
              newLight.shadow.camera.right = 15;
              newLight.shadow.camera.left = -15;
              newLight.shadow.camera.top = 15;
              newLight.shadow.camera.bottom = -15;
              /**/
              glScene.add(newLight);
          }
      }

      // add some ambient to make nonilluminated areas non black
      var ambientLight = new THREE.AmbientLight(0x202020); // soft white light
      glScene.add(ambientLight);
  }



  ///////////////////////////////////////////////////////////////////
  // Robot Arm object to test hierachical animations
  //
  ///////////////////////////////////////////////////////////////////
  function createFTFactory() {
      var objectLoader = new THREE.ObjectLoader();
      //objectLoader.load("models/3DSmallFactory06.json", function ( obj ) {
      objectLoader.load("models/3DFactory19.json", function(obj) {

          glScene.add(obj);


          // add shadows 
          obj.traverse(function(child) { // find the inner hierachy elements and pre-animate so it looks okay static
              if (child instanceof THREE.Mesh) {
                  child.castShadow = true;
                  child.receiveShadow = true;
              }
          });


          obj.name = "FTFactory"; // use this to  find the object for later updates
          obj.position.x = 0;
          //obj.position.y = 1.05;
          obj.position.y = 0.11;
          obj.position.z = 0;
          //obj.scale.set(0.01,0.01,0.01);
          obj.scale.set(0.1, 0.1, 0.1);

          createFactorySensors();
      });

      // END Clara.io JSON loader code
  }




  //Function to place the 3D object in the Factory
  function create3dObject(pathToJsonObj, objName, objPosision, objScale,callBackFunction) {
      var objectLoader = new THREE.ObjectLoader();
      objectLoader.load(pathToJsonObj, function(obj) {
          glScene.add(obj);
          // add shadows 
          obj.traverse(function(child) { // find the inner hierachy elements and pre-animate so it looks okay static
              if (child instanceof THREE.Mesh) {
                  child.castShadow = true;
                  child.receiveShadow = true;
              }
          });
          obj.name = objName; // use this to  find the object for later updates
          obj.position.x = objPosision.x;
          obj.position.y = objPosision.y;
          obj.position.z = objPosision.z;
          obj.scale.set(objScale.x, objScale.y, objScale.z);
          createFactorySensors();
          if(callBackFunction){
            callBackFunction();
          }
          hideAllPosMarkers(place);
      });
  }


  ///////////////////////////////////////////////////////////////////
  // Robot Arm object to test hierachical animations
  //
  ///////////////////////////////////////////////////////////////////
  function createSmallFTFactory() {

      var objectLoader = new THREE.ObjectLoader();
      objectLoader.load("models/3DSmallFactory12.json", function(obj) {
          glScene.add(obj);
          obj.traverse(function(child) { // find the inner hierachy elements and pre-animate so it looks okay static
              if (child instanceof THREE.Mesh) {
                  child.castShadow = true;
                  child.receiveShadow = true;
              }
          });
          obj.name = "FTFactory"; // use this to  find the object for later updates
          obj.position.x = 0;
          obj.position.y = 0.11;
          obj.position.z = 0;
          obj.scale.set(0.1, 0.1, 0.1);
          createFactorySensors();
          initFactory2Model();
      });

  }

  ///////////////////////////////////////////////////////////////////
  // Robot Arm object to test hierachical animations
  //
  ///////////////////////////////////////////////////////////////////
  function createFagorPress() {
      // BEGIN Clara.io JSON loader code
      //var robotObj = null;
      var objectLoader = new THREE.ObjectLoader();
      //      objectLoader.load("models/scene.json", function ( obj ) {
      //      objectLoader.load("models/3DFactory2.json", function ( obj ) {
      objectLoader.load("models/fagorPress6.json", function(obj) {
          glScene.add(obj);


          // add shadows 
          obj.traverse(function(child) { // find the inner hierachy elements and pre-animate so it looks okay static
              if (child instanceof THREE.Mesh) {
                  child.castShadow = true;
                  child.receiveShadow = true;
              }
          });


          // add the sensor links
          var i = 0;
          obj.traverse(function(child) { // find the inner hierachy elements and pre-animate so it looks okay static
              if (child.name.startsWith("sensor")) {

                  //child.url = "http://www.google.com";                  // use this to  find the object for later updates
                  if (i < pressNames.sensors.length) {
                      child.name = child.name.substring(7); // pressNames.sensors[i].title;
                      child.url = pressNames.sensors[i].href;
                      child.database = "factory";
                      child.collection = "fagorLive";
                      selectObjects.push(child); //for select controller

                  } else {
                      //child.visible = false;

                  }
                  //i++;
              }
          });


          obj.name = "FagorPress"; // use this to  find the object for later updates
          obj.position.x = 0;
          //obj.position.y = 1.05;
          obj.position.y = 0.11;
          obj.position.z = 0;
          //obj.scale.set(0.01,0.01,0.01);
          //        obj.scale.set(0.1,0.1,0.1);
          obj.scale.set(0.006, 0.006, 0.006);
      });
      // END Clara.io JSON loader code
  }


  ///////////////////////////////////////////////////////////////////
  // Robot Arm object to test hierachical animations
  //
  ///////////////////////////////////////////////////////////////////
  function createTurnTable() {

      // add a baseplate, the platform
      platform = createPlatform();

      createStations();

      createPlatformSensors();


  }

  ///////////////////////////////////////////////////////////////////
  // monitors where the mouse is on the screen to cross reference
  // if it's hovering over an objects
  ///////////////////////////////////////////////////////////////////
  function onDocumentMouseMove(event) {

      event.preventDefault();
      mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
      raycaster.setFromCamera(mouse, camera);
      var intersects = raycaster.intersectObjects(sceneObjects, true, sceneObjects.children);

  };

  ///////////////////////////////////////////////////////////////////
  // if the mouse is over an object that exists inside objects var
  // then it will complete an action on that object
  ///////////////////////////////////////////////////////////////////
  function onDocumentMouseDown(event) {
      event.preventDefault();

      raycaster.setFromCamera(mouse, camera);

      var intersects = raycaster.intersectObjects(sceneObjects, true, sceneObjects.children);

      if (intersects.length > 0) {

          var intersect = intersects[0];

          elevationMotorState = 0;

          (intersect.object).material.map = motorOnState;
          (intersect.object).material.map.needsUpdate = true;

      }

  };

  ///////////////////////////////////////////////////////////////////
  // array to store objects that are going to change on click
  // GLOBAL VARIABLE
  ///////////////////////////////////////////////////////////////////
  function predefineChangingObjects() {

      sceneObjects = [];

  };

  ///////////////////////////////////////////////////////////////////
  // array to store counter values that are going to change on click
  // GLOBAL VARIABLE
  ///////////////////////////////////////////////////////////////////
  function predefineChangingCounter() {
      counterCount = -1;
  }

  ///////////////////////////////////////////////////////////////////
  // create table, load from file
  //
  ///////////////////////////////////////////////////////////////////
  function createTable2(parent) {
      // try loading a file
      // instantiate a loader
      /**/
      var loader = new THREE.ColladaLoader();

      loader.load(
          // resource URL
          'models/ma-table.dae',
          // Function when resource is loaded
          function(collada) {
              collada.scene.scale.set(1, 1, 1);


              // add shadows 
              collada.scene.traverse(function(child) { // find the inner hierachy elements and pre-animate so it looks okay static
                  if (child instanceof THREE.Mesh) {
                      child.castShadow = true;
                      child.receiveShadow = true;
                  }
              });
              parent.add(collada.scene);
          },
      );
  }




  //  function createWareHouseFromJSONModels(){
  function createWareHouse(location) {
      var modularMaterial = createModularMaterial();
      var roofMaterial = createMaterialFromImageFile('img/warehouse_roof.jpg');
      var floorMaterial = createMaterialFromImageFile('modularWarehouse/concrete_wall_2b.jpg');
      var wareHouse = new THREE.Object3D()
      var sectionWidth = 3; // approximate section width in metres
      var sectionLengthTiles = Things.length; // number of tiles long
      var sectionHeightTiles = 3; // number of tiles high
      var tileList = Things;
      var tileList2 = Things2;
      
     console.log("modelList",modelList)   

      var objName = modelList[location].objName;
      var pathToJsonObj = modelList[location].pathToJsonObj;
      var objPosision = modelList[location].objPosision;
      var objScale = modelList[location].objScale;
      var callBackFunction = modelList[location].callBackFunction

      // walls
      for (var y = 0; y < sectionHeightTiles; y++) {
          for (var i = 0; i < sectionLengthTiles; i++) {
              createWallTileFromObj2(wareHouse, tileList[i], modularMaterial, new THREE.Vector3(i * sectionWidth, y * sectionWidth, 0), new THREE.Vector3(0, 0, 0));
              createWallTileFromObj2(wareHouse, tileList[i], modularMaterial, new THREE.Vector3(i * sectionWidth, y * sectionWidth, sectionWidth * sectionLengthTiles), new THREE.Vector3(0, 0, 0));
              createWallTileFromObj2(wareHouse, tileList[i], modularMaterial, new THREE.Vector3(0, y * sectionWidth, (i * sectionWidth) + sectionWidth), new THREE.Vector3(0, 11 / 7, 0));
              createWallTileFromObj2(wareHouse, tileList[i], modularMaterial, new THREE.Vector3(sectionWidth * sectionLengthTiles, y * sectionWidth, i * sectionWidth), new THREE.Vector3(0, -11 / 7, 0));
          }
          tileList = tileList2; // use  different list for higher levels (no doors !!!!)
      }
      // FLOOR
      wareHouse.add(createFloor2(floorMaterial, sectionWidth, sectionLengthTiles));
      wareHouse.add(createRoof2(roofMaterial, sectionWidth, sectionLengthTiles, sectionHeightTiles));
      // offet around +/- 0
      wareHouse.position.x = -sectionWidth * sectionLengthTiles / 2;
      wareHouse.position.z = -sectionWidth * sectionLengthTiles / 2;
      createWarehouseLights(sectionWidth, sectionLengthTiles, sectionHeightTiles);
      create3dObject(pathToJsonObj, objName, objPosision, objScale,callBackFunction)
      glScene.add(wareHouse);
      section = [(sectionWidth), (sectionLengthTiles), (sectionHeightTiles)];
      return section;
  }




  ///////////////////////////////////////////////////////////////////
  // create a platform
  //
  ///////////////////////////////////////////////////////////////////
  function createPlatform() {
      var plateMaterial = new THREE.MeshLambertMaterial({
          map: THREE.TextureLoader('img/diamond-plate.jpg')
      });
      platform = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 0.1, 8), plateMaterial);
      platform.castShadow = true;
      platform.receiveShadow = true;
      platform.position.y = 0.5;
      glScene.add(platform);
      return platform;
  }



  ///////////////////////////////////////////////////////////////////
  // create table, load from file
  //
  ///////////////////////////////////////////////////////////////////
  function createTable() {
      // try loading a file
      // instantiate a loader
      /**/
      var loader = new THREE.ColladaLoader();

      loader.load(
          // resource URL
          'models/ma-table.dae',
          // Function when resource is loaded
          function(collada) {
              collada.scene.scale.set(10, 4, 15);
              collada.scene.position.y -= 4.7;

              // add shadows 
              collada.scene.traverse(function(child) { // find the inner hierachy elements and pre-animate so it looks okay static
                  if (child instanceof THREE.Mesh) {
                      child.castShadow = true;
                      child.receiveShadow = true;
                  }
              });
              glScene.add(collada.scene);
          },
      );
  }

