var tick = function() {
this.controls.update();

  var cameraHeight = 80;

  if (!this.paused) {
    requestAnimationFrame(tick.bind(this));
  }

  var dt = createDeltaTime.apply(this) / 1000;
  //console.log(dt);

  if (this.paused == false) {
    var inc = ((((this.leftVector.x * 3.0)) / this.wsa.windowHalfX) * 4.0 * dt) * (this.forward_speed / 500.0);

    this.forward_angle += inc;

    //if (Math.abs(this.forward_angle) > 0.5) {
    //  this.forward_angle -= inc;
    //}
    if (this.speedUp) {
      this.forward_speed += ((100) * dt);
    } else {
      /*
      var backToZero = (((this.forward_speed) / 500.0) * (1.0) * dt) * this.wsa.windowHalfX;
      if (this.leftVector.x > (backToZero)) {
        //console.log("make it smaller", this.forward_angle, this.leftVector.x);
        this.leftVector.x -= (backToZero);
      } else if (this.leftVector.x < -backToZero) {
        //console.log("make it bigger", this.forward_angle, this.leftVector.x);
        this.leftVector.x += (backToZero);
      }
      */

      this.forward_speed -= ((200) * dt);
    }
    if (this.forward_speed < 0) {
      this.forward_speed = 0;
    }
    if (this.forward_speed > 500) {
      this.forward_speed = 500;
    }
    //console.log(this.forward_angle, this.leftVector.x, this.forward_speed);
    this.st += dt;
  }

  var skid = (this.leftVector.x * 0.5 * (this.forward_speed * 0.000001));
  var drift = this.foward.clone();
  drift.x = Math.cos(this.forward_angle + skid);
  drift.z = Math.sin(this.forward_angle + skid);
  this.foward.x = Math.cos(this.forward_angle);
  this.foward.z = Math.sin(this.forward_angle);

  if (this.paused == false) {
    if (this.car_one != null) {
      moveObjectInDirectionAtSpeed(0, dt, this.car_one, this.foward, this.forward_speed);
      //moveObjectInDirectionAtSpeed(0, dt, this.camera, this.foward, this.forward_speed);
      followObjectWithObjectAtSpeed(0, dt, this.car_one, this.camera, this.forward_speed * 0.999);
    }
  }

  if (this.car_one != null) {
    var farForward = this.foward.clone().multiplyScalar(100.0 + (0.01 * this.forward_speed)); //how far in front
    var farBack = this.foward.clone().negate().multiplyScalar(400.0); //how far in back

    var reallyFarBack = this.car_one.position.clone().add(farBack);

    var whereCarIsPointing = this.car_one.position.clone().add(drift);
    this.car_one.lookAt(whereCarIsPointing);

    if (this.dirty) {
      this.dirty = false;
      //var reallyFarOut = this.car_one.position.clone().add(farForward).multiplyScalar(10.0);
      //this.camera.lookAt(reallyFarOut);
      var reallyFarOut = this.car_one.position.clone().add(farForward);
      this.camera.lookAt(reallyFarOut);
      this.camera.position.set(0 + reallyFarBack.x, cameraHeight, 0 + reallyFarBack.z);
    } else {
      //var reallyFarOut = this.car_one.position.clone().add(farForward);
      //this.camera.lookAt(reallyFarOut);
    }
  }

  this.camera.updateProjectionMatrix();
  this.skyBoxCamera.rotation.copy(this.camera.rotation);

  this.renderer.clear(true, true, true);
  this.renderer.render(this.skyBoxScene, this.skyBoxCamera);
  this.renderer.render(this.scene, this.camera);
};

var createCarFromGeometry = function(geometry) {
  //var car = THREE.SceneUtils.cloneObject(geometry.scene);
  var car = geometry.scene;
  car.scale.set(20, 20, 20);
  car.position.set(0, 0, 0);
  car.updateMatrix();
  car.children[0].material = new THREE.MeshLambertMaterial({color: 0xffaa00 });
  return car;
}

// logic of racing game
// http://www.youtube.com/watch?v=NUU_F9TvXco

var moveObjectInDirectionAtSpeed = function(st, dt, obj, dir, spd) {

  // copy the input
  var inp = dir.clone();

  // clean up the input
  inp.normalize();

  // calculate the distance traveled over time in that direction
  inp.multiplyScalar(spd * dt);

  // move object that much distance
  //obj.position.addSelf(inp);
  obj.position.x += inp.x;
  obj.position.z += inp.z;

};

var followObjectWithObjectAtSpeed = function(st, dt, car, camera, speed) {
  // there is a distance between the two objects
  var distance = new THREE.Vector3(0, 0, 0);
  distance.subVectors(car.position, camera.position);
  //distance.y = 0;

  // move the camera towards the car at speed
  // in the direction of the distance
  moveObjectInDirectionAtSpeed(st, dt, camera, distance, speed); 

};

var flyBannerOverStartPoint = function(st, dt) {
  // for the first 3 seconds of a race
  // there is a banner object
  // that has text "prepare to qualify"
  // and is first positioned off to the right and above the StartPoint
  // and it moves from right to left over time
};

var countDownUntilRaceStarts = function(st, dt) {
  // after 3s the countdown starts
  // there is a countdown object
  // it has 4 lights (3 red, 1 green)
  // for each second before 6s starting at 3s, light a red light
  // after 6s turn off the red lights
  // and light up the green light
  // start the race
}

var avoidOtherCarsOnRaceTrack = function(st, dt) {
  // the player should steer their car away from other cars
  // if the players car is too close to another car it should bump away
};

var avoidBillboard = function(st, dt) {
  // a player should steer their car to avoid billboards
  // if a player is too close to a billboar they should crash
};

var replaceCarOnRaceTrack = function() {
  // sometime the car needs to be place near the track
  // if the car is replaced, it should be replaced near where it crashed
  // the speed should be set to zero as well
  // if car not off track, replace where it exploded
};

var playSoundWhenCarIsNearOtherCar = function() {
  // if the players car is near another car
  // a sound should be played that increases in volume
  // to the loudest when they are the closest
};

var playSoundOfCarBasedOnSpeed = function() {
  // the sound of a car is based on its speed
};

var finishRaceWhenPlayerCrossesFinishPoint = function() {
  // when the player cross the finish point, win the game
};

var presentLapTime = function() {
  // show the total lap time spent by the player
};

var presentPosition = function() {
};

// objects

var createBillboard = function() {
  // billboards are flat objects
  // that have text and images on them
  // they are positioned randomly around a race track
  // they can be on the left or right
  // they are angled somewhat towards the road
  // they are not close to any other billboards
};

var createTurnIndicators = function() {
  // turn indicators are placed before turns on the race track
  // they are yellow with black arrows
  // they show what direction the player should turn the car
};

var createCountdownObject = function() {
  // the countdown is 4 objects
  // these objects are things that can be lit
  // 3 red lights
  // that can glow with red when lit
  // and a green light
  // that glows green when lit
};

var createBannerObject = function() {
  // a banner is a flat white object
  // with text that is textured black
  // there is also a blimp objecet
  // that pulls the flat object
      /*
      var text = i.toString();

      var textGeo = new THREE.TextGeometry( text, {
        size: 50,
        height: 5,
      });

      var textMesh = new THREE.Mesh(textGeo, textMat);
      textMesh.position.set(foo.vertices[i].x, foo.vertices[i].y + 10, foo.vertices[i].z);
      trackObject.add(textMesh);
      */
};

var createCar = function() {
  // the car is an object
  // with shiny materials
  // and wheels that turn
};

var createCarCage = function() {
  var createLineGeometry = function() {
    var linGeo = new THREE.Geometry();
    lineGeo.vertices.push(new THREE.Vector3(0, 0, 0));
    lineGeo.vertices.push(new THREE.Vector3(0, 0, 0));
    return lineGeo;
  }

  createLine = function() {
    var line = THREE.Line(createLineGeometry());
    return line;
  }
  return {
    n: createLine(),
    e: createLine(),
    s: createLine(),
    w: createLine()
  };
};

var createRaceTrack = function(scene) {
  // there is a race track
  // that follows a spline curve of points
  // it has a road that is an object
  // that is extruded over the spline
  // this road as two edges
  // this road as lines painted on it
  // inside line is dashed white
  // inner ring is white/yellow 70%
  // outer ring is red white 50/50

  /*
  function roundedRect(ctx, x, y, width, height, radius) {
    ctx.moveTo( x, y + radius );
    ctx.lineTo( x, y + height - radius );
    ctx.lineTo( x + width - radius, y + height) ;
    ctx.lineTo( x + width, y + radius );
    //ctx.quadraticCurveTo( x, y, x, y + radius );
    ctx.quadraticCurveTo( x, y, x, y + radius );
  }
  */

    function roundedRect( ctx, x, y, width, height, radius ){
      ctx.moveTo( x, y + radius );
      ctx.lineTo( x, y + height - radius );
      ctx.quadraticCurveTo( x, y + height, x + radius, y + height );
      ctx.lineTo( x + width - radius, y + height) ;
      ctx.quadraticCurveTo( x + width, y + height, x + width, y + height - radius );
      ctx.lineTo( x + width, y + radius );
      ctx.quadraticCurveTo( x + width, y, x + width - radius, y );
      ctx.lineTo( x + radius, y );
      ctx.quadraticCurveTo( x, y, x, y + radius );
    }


  trackObject = new THREE.Object3D();
  trackObject.position.y = 0;

  var roundedRectShape = new THREE.Shape();
  roundedRect(roundedRectShape, 0, 0, 2500, 2500, 320);

  var tightness = 128;
  var tightnessTwo = 128;
  var extrudeQuality = (4 * 4);
  //var quality2 = 64;

  var foo = roundedRectShape.createSpacedPointsGeometry(tightness);

  var gamma = Math.PI/2;
  var m = new THREE.Matrix4().makeRotationX(gamma);
  foo.applyMatrix(m);
  var textMat = new THREE.MeshBasicMaterial({color: 0xffaa00, wireframe: false});

  if (true) {
    //var textMat = new THREE.MeshBasicMaterial( { wireframe: true } );

    for (var i=0; i<foo.vertices.length; i+=1) {
      var radius = 5;
      var trackPointGeo = new THREE.SphereGeometry(radius, 2, 2); //, segmentsWidth, segmentsHeight, phiStart, phiLength, thetaStart, thetaLength )
      var trackPointMesh = new THREE.Mesh(trackPointGeo, textMat);
      trackPointMesh.position.set(foo.vertices[i].x, foo.vertices[i].y + 5, foo.vertices[i].z);
      trackObject.add(trackPointMesh);
    }
  }

  var spine = new THREE.ClosedSplineCurve3(foo.vertices);

  var g = new THREE.Geometry();

  var spineCurvePath = new THREE.CurvePath();
  spineCurvePath.add(spine);
  var spineGeom = spineCurvePath.createSpacedPointsGeometry(tightnessTwo);
  
  var lineObject = new THREE.Line(spineGeom);
  lineObject.position.y += 5;
  trackObject.add(lineObject);

  var extrudeSettings = {steps: extrudeQuality};
  extrudeSettings.extrudePath = spineCurvePath;
  //extrudeSettings.UVGenerator = new THREE.UVsUtils.CylinderUVGenerator();
  //extrudeSettings.material = 1;

  // lower qual
  var rectLength = 60.0;
  var rectWidth = 0.000001;
  var rectShape = new THREE.Shape();

  rectShape.moveTo(0, -rectLength);
  rectShape.lineTo(0, rectLength);
  //rectShape.lineTo(rectWidth, 0);
  rectShape.lineTo(rectWidth, rectLength);
  rectShape.lineTo(0, -rectLength);

  var trackGeometry = rectShape.extrude(extrudeSettings);
  var removed = trackGeometry.mergeVertices(true);
  trackGeometry.computeFaceNormals();

  //material = new THREE.MeshLambertMaterial({ wireframe: false, map: THREE.ImageUtils.loadTexture("track.png") });
  material = new THREE.MeshBasicMaterial( { wireframe: true } );
  var mesh = new THREE.Mesh(trackGeometry, material);

  //rectLength = 40.0;
  rectWidth = 2.00000;
  rectShape = new THREE.Shape();

  rectShape.moveTo(0, -rectLength);

  //across top
  rectShape.lineTo(0, rectLength);

  //down right side
  rectShape.lineTo(rectWidth, rectLength);

  //left on bottom
  rectShape.lineTo(rectWidth, -rectLength);

  // up left side
  rectShape.lineTo(0, -rectLength);

  extrudeSettings.steps = extrudeQuality * 4;

  var trackGeometry2 = rectShape.extrude(extrudeSettings);
  var removed = trackGeometry2.mergeVertices(true);
  console.log(removed);
  trackGeometry2.computeFaceNormals();

  //material = new THREE.MeshLambertMaterial({ wireframe: false, map: THREE.ImageUtils.loadTexture("track.png") });
  //var material2 = new THREE.MeshBasicMaterial( { wireframe: true } );
  var nomMat = new THREE.MeshNormalMaterial({wireframe: false});
  var mesh2 = new THREE.Mesh(trackGeometry2, nomMat);
  mesh2.position.set(mesh2.position.x, mesh2.position.y + 2.0, mesh2.position.z);
  trackObject.add(mesh2);

  mesh.position.set(mesh.position.x, mesh2.position.y + 2.0, mesh.position.z);
  trackObject.add(mesh);

 
  // do supports/bottom trusses
  var lastTrackV = null;

  for (var i=0; i<(trackGeometry.vertices.length - 2); i++) {
    var trackVertice = trackGeometry.vertices[i];
    if (((i + 1) % 2) == 0) {
      var csg = createCrossCsg(nomMat);
      csg.position.set(trackVertice.x, trackVertice.y, trackVertice.z);
      var foov = new THREE.Vector3().subVectors(trackVertice, lastTrackV);
      var roy = 0;
      roy = Math.atan2(foov.x, foov.z);
      csg.rotateY(roy + (-0.25 * Math.PI * 2.0));
      trackObject.add(csg);
    }

    lastTrackV = trackVertice;
  }

  trackObject.specialSpineCurve = spineCurvePath;

  return trackObject;
};

var createTerrain = function() {
  // there is a big flat terrain object
  // the flat terrain object is textured green
  // there is a ring wrapped around the terrain
  // the ring is textured with trees and mountains

  /*
  // http://frontier.lincoln.ac.uk/3d/development/Stage2/tQuery/plugins/checkerboard/tquery.checkerboard.js
  opts  = tQuery.extend(opts, {
    width   : 1,    
    height    : 1,
    segmentsW : 8,
    segmentsH : 8,
    materialEven  : new THREE.MeshBasicMaterial({ color: 0xcccccc }),
    materialOdd : new THREE.MeshBasicMaterial({ color: 0x444444 })
  });
  // create the geometry  
  var geometry    = new THREE.PlaneGeometry( opts.width, opts.height, opts.segmentsW, opts.segmentsH );
  // set materials per faces
  geometry.materials  = [opts.materialEven, opts.materialOdd];
  geometry.faces.forEach(function(face, idx){
    var y = Math.floor(idx / opts.segmentsW);
    var x = idx - (y*opts.segmentsW);
    face.materialIndex  = (y % 2 + x%2 ) %2;
  });
  // create the mesh
  var material  = new THREE.MeshFaceMaterial();
  var mesh  = new THREE.Mesh(geometry, material);
  // return the tQuery
  return tQuery(mesh);
  */
  return null;

};

var createDebugCsg = function(mat) {
  var cube = new THREE.BoxGeometry(4, 4, 4);
  var cube_bsp = new ThreeBSP( cube );

  var sphere = new THREE.SphereGeometry(3, 16, 16);
  var sphere_bsp = new ThreeBSP( sphere, {offset: {x: 1, y:2, z: 1}} );

  //console.time('operation');
  var union = cube_bsp.subtract( sphere_bsp );
  //console.timeEnd('operation');

  //console.time('mesh');
  var mesh = new THREE.Mesh(union.toGeometry(), mat);
  //console.timeEnd('mesh');

  mesh.geometry.computeFaceNormals(); // highly recommended...

  terrainObject = new THREE.Object3D();
  terrainObject.add(mesh);
  terrainObject.scale.set(5, 5, 5);

  return terrainObject;
};

var createCrossCsg = function(mat) {
  var crossWidth = 120;
  var downLength = 50;
  var colHeight = 50;

  var cross = new THREE.BoxGeometry(crossWidth, 4, 4);
  var crossPos = new THREE.Matrix4().makeTranslation(-crossWidth / 2, 0, 0);
  cross.applyMatrix(crossPos);

  var down = new THREE.BoxGeometry(4, 4, downLength);
  var downPos = new THREE.Matrix4().makeTranslation(0, 0, 0);
  down.applyMatrix(downPos);
  
  var col = new THREE.BoxGeometry(4, colHeight, 4);
  var colPos = new THREE.Matrix4().makeTranslation(0, -(colHeight / 2), 0);
  col.applyMatrix(colPos);

  var cross_bsp = new ThreeBSP(cross);
  var col_bsp = new ThreeBSP(col);
  var down_bsp = new ThreeBSP(down);

  var union = cross_bsp.union(col_bsp);
  union = union.union(down_bsp);

  colPos = new THREE.Matrix4().makeTranslation(-crossWidth, 0, 0);
  col.applyMatrix(colPos);
  col_bsp = new ThreeBSP(col);
  union = union.union(col_bsp);

  var mesh = new THREE.Mesh(union.toGeometry(), mat);
  mesh.position.set(0, 0, 0);

  mesh.geometry.computeFaceNormals(); // highly recommended...

  terrainObject = new THREE.Object3D();
  terrainObject.add(mesh);
  terrainObject.scale.set(1, 1, 1);

  return terrainObject;
};

var createAlongCsg = function(mat) {
  var alongLength = 180;
  var colHeight = 50;

  var along = new THREE.BoxGeometry(4, 4, alongLength);
  var alongPos = new THREE.Matrix4().makeTranslation(0, 0, 0);
  along.applyMatrix(alongPos);
  
  var col = new THREE.BoxGeometry(4, colHeight, 4);
  var colPos = new THREE.Matrix4().makeTranslation(0, -(colHeight / 2), 0);
  col.applyMatrix(colPos);

  var along_bsp = new ThreeBSP(along);
  var col_bsp = new ThreeBSP(col);

  var union = along_bsp.union(col_bsp);

  var mesh = new THREE.Mesh(union.toGeometry(), mat); //new THREE.MeshNormalMaterial({wireframe: false}));
  mesh.position.set(0, 0, 0);

  mesh.geometry.computeFaceNormals(); // highly recommended...

  terrainObject = new THREE.Object3D();
  //terrainObject.add(mesh);
  terrainObject.scale.set(1, 1, 1);

  return terrainObject;
};


var raceForPolePosition = function() {
  // reset car to the Start Point
  // reset race timer
  // present banner
  // countdown
  // start race
};

var raceForReal = function() {
};

var placeCarsOnRaceTrackAccordingToPolePosition = function() {
  // there are 10 pole positions
  // pole position alternates left and right side of the road
  // what would be left or right for row back
};

var directionRequiredToFollowSpine = function() {
  // do the maths to calculate what direction
  // an object would need to follow that spline
  // perfectly
  /*
  var spline = new THREE.SplineCurve3([
    new THREE.Vector3(-20,  0, 0),
    new THREE.Vector3(  0, 20, 0),
    new THREE.Vector3( 20,  0, 0)
  ]);

  //(spline.getPoint(0.5));
  //(spline.getTangent(0.5));
  */
};

var avoidHittingSideOfTrackTooHard = function() {
  // if went off track too fast
  // explode
  // bounce back in
};

var avoidHittingWaterOnRoad = function() {
  // if your car is near water on the road
  // then the car should slip in whatever direction it was going
};

var avoidRunningOutOfTime = function() {
  // if the total time of the race has run out, stop the race
};

var incrementScoreWhileRacing = function() {
  // score increments more if your car is moving faster
};

var presentGameOver = function() {
  // each letter of the words game over spin in place
};

var presentDistanceFromStartPoint = function() {
};

var presentSpeed = function() {
};

var presentRaceTime = function() {
};

var progressRaceTime = function() {
};

var calculatePassingBonus = function() {
};

var showOverHeadViewOfRaceTrack = function() {
};

var panCameraFromOverHeadToStartPoint = function() {
};

var playPrepareToQualify = function() {
};

var playRaceCountdownMusic = function() {
};

var presentGearRate = function() {
};

var simulatePlayerPuttingPetalToTheMetal = function() {
};

// behaviour

var turnCarRight = function(st, dt, car) {
};

var turnCarLeft = function(st, dt, car) {
};

var onError = function(e) {
  console.log(e);
  this.paused = true;
};

var main = function(body) {

  var wsa = windowSizeAndAspect(1.0);

  var container = createContainer();
  body.appendChild(container);

  //var fullscreenButton = document.getElementById("fullscreen-button");

  //fullscreenButton.addEventListener('click', function(ev) {
  //  if (screenfull.enabled) {
  //    screenfull.onchange = function() {
  //      //console.log('Am I fullscreen? ' + screenfull.isFullscreen ? 'Yes' : 'No');
  //    };
  //    screenfull.toggle(container);
  //  }
  //}, false);


  var camera = createCamera(wsa, 10000);
  var scene = createScene();

  var directionalLight = createDirectionalLight();
  scene.add(directionalLight);

  var pointLight = createPointLight();
  scene.add(pointLight);

  var raceTrack = createRaceTrack(scene);
  scene.add(raceTrack);

  var skyBoxCamera = createCamera(wsa, 1000);
  var skyBoxScene = createScene();
  var skyBoxMaterial = createTextureCubeMaterial();
  var skyBox = createSkyBox(skyBoxMaterial);
  skyBoxScene.add(skyBox);

  //var terrain = createTerrain();
  //scene.add(terrain);

  //var renderer = new THREE.WebGLRenderer({
  //  precision: "lowp",
  //  alpha: false,
  //  maxLights: 2,
  //  stencil: false
  //});
  var renderer = new THREE.WebGLRenderer({
  });

  //renderer.setFaceCulling("front");
  renderer.setSize(wsa.x, wsa.y);
  renderer.autoClear = false;
  container.appendChild(renderer.domElement);

  var loader = new THREE.ColladaLoader();

  var foo = "cheese";

  loader.load("F1.dae", function(geometry) {

    var car_one = createCarFromGeometry(geometry);
    var ppp = (raceTrack.specialSpineCurve.getPoint(0));
    //debugger;
    console.log(ppp);
    //car_one.position.set(31, 1.9, 97);
    car_one.position.set(ppp.x, ppp.y, ppp.z);

      var tangent = (raceTrack.specialSpineCurve.getTangent(0));
      //debugger;
      //console.log(tangent);
      //var u = new THREE.Euler(tangent);
      //var ux = (new THREE.Matrix4()).makeRotionFromEuler(u);
      //csg.setRotationFromEuler(u);
      //debugger;
      tangent.y = 0.0;
      //var roy = ((new THREE.Vector3(0, 0, -1)).angleTo(tangent));
      var roy = Math.atan2(tangent.x, tangent.z);
      //tangent.dot(tangent));
      //car_one.rotateY(roy);
    scene.add(car_one);


    var thingy = {
      fps: 35.0,
      then: Date.now(),
      st: 0,
      foward: new THREE.Vector3(0, 0, 0),
      car_one: car_one,
      skyBoxCamera: skyBoxCamera,
      skyBoxScene: skyBoxScene,
      forward_speed: 0,
      camera: camera,
      leftPointerID: -1,
      leftPointerStartPos: new THREE.Vector2(0, 0),
      leftPointerPos: new THREE.Vector2(0, 0),
      leftVector: new THREE.Vector2(0, 0),
      wsa: wsa,
      pointers: [],
      fs: null,
      scene: scene,
      speedUp: false,
      paused: false,
      forward_angle: roy,
      renderer: renderer,
      scene: scene,
      dirty: true,
      container: container,
    };

        thingy.controls = new THREE.TrackballControls(camera);

        thingy.controls.rotateSpeed = 1.0;
        thingy.controls.zoomSpeed = 1.2;
        thingy.controls.panSpeed = 0.8;

        thingy.controls.noZoom = false;
        thingy.controls.noPan = false;

        thingy.controls.staticMoving = true;
        //thingy.controls.dynamicDampingFactor = 0.3;

        thingy.controls.keys = [ 65, 83, 68 ];

        //thingy.controls.addEventListener( 'change', render );

    

    //renderer.domElement.addEventListener('pointerdown', onPointerDown.bind(thingy), false);
    //renderer.domElement.addEventListener('pointermove', onPointerMove.bind(thingy), false);
    //renderer.domElement.addEventListener('pointerup', onPointerUp.bind(thingy), false);

    //window.addEventListener('resize', onWindowResize.bind(thingy), false);

    window.addEventListener('error', onError.bind(thingy), false);

    tick.apply(thingy);
  });
};
