var paused = false;

var tick = function() {
  //then, st, forward_angle, foward, car_one, forward_speed, camera, thingy) {
  var tm = (1000 / 26);

  var now = Date.now();
  var dt = (now - this.then) / 1000;
  this.then = now;

  if (true || dt < (tm * 1.1)) {

    if (this.paused == false) {
      this.forward_angle += ((this.leftVector.x * 0.00345) * dt);
      if (this.speedUp) {
        this.forward_speed += ((60) * dt);
      } else {
        this.leftVector.x -= ((2.0 * this.leftVector.x) * dt);
        this.forward_speed -= ((200) * dt);
      }
      if (this.forward_speed < 0) {
        this.forward_speed = 0;
      }
      if (this.forward_speed > 350) {
        this.forward_speed = 350;
      }
      this.st += dt;
    }

    var skid = (this.leftVector.x * 0.001);
    var drift = this.foward.clone();
    drift.x = Math.cos(this.forward_angle + skid);
    drift.z = Math.sin(this.forward_angle + skid);
    this.foward.x = Math.cos(this.forward_angle);
    this.foward.z = Math.sin(this.forward_angle);

    if (this.paused == false) {
      if (this.car_one != null) {
        moveObjectInDirectionAtSpeed(0, dt, this.car_one, this.foward, this.forward_speed);
        followObjectWithObjectAtSpeed(0, dt, this.car_one, this.camera, this.forward_speed);
      }
    }

    if (this.car_one != null) {

      var farForward = this.foward.clone().multiplyScalar(100.0); //how far in front
      var farBack = this.foward.clone().negate().multiplyScalar(50.0); //how far in back

      var reallyFarOut = this.car_one.position.clone().addSelf(farForward);
      var reallyFarBack = this.car_one.position.clone().addSelf(farBack);

      //
      var whereCarIsPointing = this.car_one.position.clone().addSelf(drift);
      this.car_one.lookAt(whereCarIsPointing);

      //b.multiplyScalar(10.0);

      this.camera.lookAt(reallyFarOut);
      this.camera.position.set(0 + reallyFarBack.x, 10.0, 0 + reallyFarBack.z);
      //console.log(this.car_one.position.x, this.camera.position.x);
    }

    //this.camera.position.x = this.car_one.position.x;
    //this.camera.position.y = 5;
    //this.camera.position.z = this.car_one.position.z;
    this.camera.updateProjectionMatrix();
    this.dirty = true;
  }

  //thingy.scene.updateMatrixWorld();
  //setTimeout(tick.bind(this), tm); //, tm, then, st, forward_angle, foward, car_one, forward_speed, camera, thingy);

};

var onPointerDown = function(e) {
  this.speedUp = true;
  this.pointers = e.getPointerList();
  for(var i = 0; i<this.pointers.length; i++){
    var pointer = this.pointers[i]; 
    if((this.leftPointerID<0)) // && (pointer.x<this.wsa.windowHalfX))
    {
      this.leftPointerID = pointer.identifier; 
      this.leftPointerStartPos.set(pointer.x, pointer.y);  
      this.leftPointerPos.copy(this.leftPointerStartPos); 
      //this.leftVector.set(0,0); 
      continue;     
      } else {
    } 
  }
}

/*
var fs = null;

var onContClick = function(e) {
  //paused = true;
  e.preventDefault();
  if (fs == null) {
    fs = true;
    var cnt = document.getElementById("canvas-container");
    //if (cnt.mozRequestFullScreen) {
    //  cnt.mozRequestFullScreen();
    //}
    var fullscreenForm = document.getElementById("fullscreen-form");
    fullscreenForm.parentNode.removeChild(fullscreenForm);
  }
}
*/

var onPointerMove = function(e) {
  this.pointers = e.getPointerList();
  for(var i = 0; i<this.pointers.length; i++){
    var pointer = this.pointers[i]; 
    if(this.leftPointerID == pointer.identifier)
    {
      this.leftPointerPos.set(pointer.x, pointer.y); 
      this.leftVector.copy(this.leftPointerPos); 
      this.leftVector.subSelf(this.leftPointerStartPos);  
      break;    
    }   
  }
} 

var onPointerUp = function(e) { 
  this.pointers = e.getPointerList(); 
  if (this.pointers.length == 0) {
    this.leftPointerID = -1; 
    //if (e.pointerType == PointerTypes.pointer) {
      //this.leftVector.set(0,0); 
    //}
  }
  this.speedUp = false;
}

var createCarFromGeometry = function(geometry) {
  var car = THREE.SceneUtils.cloneObject(geometry.scene);
  car.scale.set(20, 20, 20);
  car.position.set(0, 0, 0);
  car.updateMatrix();
  car.children[0].material = new THREE.MeshLambertMaterial({color: 0xffaa00 }); // wheels chrome
  //car.children[0].children[1].material = new THREE.MeshLambertMaterial({color: 0x0000ff }); // wheels chrome
  //car.children[0].children[2].material = new THREE.MeshLambertMaterial({color: 0xe0e0e0 }); // wheels chrome
  return car;
}

var windowSizeAndAspect = function() {
  var subDivide = 2.33;
  var r = {
    windowHalfX: Math.floor(window.innerWidth / subDivide),
    windowHalfY: Math.floor(window.innerHeight / subDivide),
    aspect: window.innerWidth / window.innerHeight,
    x: Math.floor(window.innerWidth / subDivide),
    y: Math.floor(window.innerHeight / subDivide)
  };
  return r;
};

var onWindowResize = function() {
  var wsa = windowSizeAndAspect();
  this.camera.aspect = wsa.aspect;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(wsa.x, wsa.y);
};

var animate = function() {
  //rndr, scne, cmra, sts) {
  //, rndr, scne, cmra, sts));
  //requestAnimationFrame(animate.bind(this));
  if (this.dirty) { 
    this.renderer.render(this.scene, this.camera);
    this.stats.update();
    this.dirty = false;
  }
}

var createStats = function() {
  var sts = new Stats();
  sts.domElement.style.position = 'absolute';
  sts.domElement.style.top = '0px';
  sts.domElement.style.zIndex = 100;
  return sts;
};

var createCamera = function(wsa) {
  var cmra = new THREE.PerspectiveCamera(25, wsa.x / wsa.y, 1, 1000);
  //var cmra = new THREE.OrthographicCamera(wsa.x / - 2, wsa.x / 2, wsa.y / 2, wsa.y / - 2, -10000, 10000);
  return cmra;
};

var createScene = function() {
  scne = new THREE.Scene();
  return scne;
};

var createContainer = function() {
  var cntr = document.createElement('div');
  cntr.id = "canvas-container";

  return cntr;
};

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
  
  //var abc = obj.clone();
  //console.log(obj);
  //two.addSelf(inp);

  //obj.x = two.x;
  //obj.z = two.z;
  
  //console.log(inp);

};

var followObjectWithObjectAtSpeed = function(st, dt, car, camera, speed) {
  // there is a distance between the two objects
  var distance = new THREE.Vector3(0, 0, 0);
  distance.sub(car.position, camera.position);
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


  function roundedRect(ctx, x, y, width, height, radius) {
    ctx.moveTo( x, y + radius );
    ctx.lineTo( x, y + height - radius );
    //ctx.quadraticCurveTo( x, y + height, x + radius, y + height );
    ctx.lineTo( x + width - radius, y + height) ;
    //ctx.quadraticCurveTo( x + width, y + height, x + width, y + height - radius );
    ctx.lineTo( x + width, y + radius );
    //ctx.quadraticCurveTo( x + width, y, x + width - radius, y );
    //ctx.lineTo( x + radius, y );
    ctx.quadraticCurveTo( x, y, x, y + radius );
  }

  trackObject = new THREE.Object3D();
  trackObject.position.y = 0;

  var roundedRectShape = new THREE.Shape();
  roundedRect(roundedRectShape, 0, 0, 5000, 5000, 500);

  var tightness = 10;
  var quality = 1000;

  var foo = roundedRectShape.createSpacedPointsGeometry(tightness);

  var m = new THREE.Matrix4();
  var gamma = Math.PI/2;
  m.rotateX(gamma);
  foo.applyMatrix(m);

  if (true) {
    var textMat = new THREE.MeshBasicMaterial({color: 0xffaa00 });
    for (var i=0; i<foo.vertices.length; i++) {

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
    
      var radius = 5;
      var trackPointGeo = new THREE.SphereGeometry(radius); //, segmentsWidth, segmentsHeight, phiStart, phiLength, thetaStart, thetaLength )
      var trackPointMesh = new THREE.Mesh(trackPointGeo, textMat);
      trackPointMesh.position.set(foo.vertices[i].x, foo.vertices[i].y + 5, foo.vertices[i].z);
      trackObject.add(trackPointMesh);
    }
  }

  var spine = new THREE.ClosedSplineCurve3(foo.vertices);

  var s = spine.getPoints(quality);
  var g = new THREE.Geometry();

  var spineCurvePath = new THREE.CurvePath();
  spineCurvePath.add(spine);
  var spineGeom = spineCurvePath.createSpacedPointsGeometry(quality);
  
  var lineObject = new THREE.Line(spineGeom);
  lineObject.position.y += 5;
  trackObject.add(lineObject);

  var extrudeSettings = { steps: quality }
  extrudeSettings.extrudePath = spineCurvePath;
  extrudeSettings.UVGenerator = new THREE.UVsUtils.CylinderUVGenerator();
  extrudeSettings.material = 1;

  var rectLength = 40.0;
  var rectWidth = 1.0;
  var rectShape = new THREE.Shape();

  rectShape.moveTo(0, -rectLength);
  rectShape.lineTo(0, rectLength);
  rectShape.lineTo(rectWidth, 0);
  rectShape.lineTo(0, -rectLength);

  var trackGeometry = rectShape.extrude(extrudeSettings);

  material = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture("track.png") });

  var mesh = new THREE.Mesh(trackGeometry, material);

  trackObject.add(mesh);

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
};

var createWorld = function() {
  // there is a world with blue sky

/*
  // http://learningthreejs.com/blog/2011/08/15/lets-do-a-sky/
  var urlPrefix = "textures/cube/skybox/";
  var urls = [ urlPrefix + "px.jpg", urlPrefix + "nx.jpg",
               urlPrefix + "py.jpg", urlPrefix + "ny.jpg",
               urlPrefix + "pz.jpg", urlPrefix + "nz.jpg" ];
  var textureCube = THREE.ImageUtils.loadTextureCube(urls);

  var shader  = THREE.ShaderUtils.lib["cube"];
  shader.uniforms["tCube"].texture = textureCube;
  var material = new THREE.MeshShaderMaterial({
    fragmentShader  : shader.fragmentShader,
    vertexShader  : shader.vertexShader,
    uniforms  : shader.uniforms
  });

  skyboxMesh  = new THREE.Mesh( new THREE.CubeGeometry( 100000, 100000, 100000, 1, 1, 1, null, true ), material );

  scene.add(skyboxMesh);
*/

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

var createDirectionalLight = function() {
  dl = new THREE.DirectionalLight( 0xffffff );
  dl.position.set(0.0, 1.0, 0.0);
  return dl;
};

var createPointLight = function() {
  pl = new THREE.PointLight(0xffffff, 1.0, 30.0);
  pl.position.set(0, 10, 0);
  return pl;
};

var run = function(body) {

  var wsa = windowSizeAndAspect();

  var container = createContainer();
  body.appendChild(container);

  var camera = createCamera(wsa);
  var scene = createScene();

  var directionalLight = createDirectionalLight();
  scene.add(directionalLight);

  var pointLight = createPointLight();
  scene.add(pointLight);

  //var renderer = new THREE.WebGLRenderer({
  //  precision: "lowp",
  //  alpha: false,
  //  maxLights: 2,
  //  stencil: false
  //});
  var renderer = new THREE.WebGLRenderer({
  });

  renderer.setFaceCulling("back");
  renderer.setSize(wsa.x, wsa.y);
  container.appendChild(renderer.domElement);

  var stats = createStats();
  container.appendChild(stats.domElement);

  var raceTrack = createRaceTrack(scene);
  scene.add(raceTrack);

  var loader = new THREE.ColladaLoader();
  loader.load("F1.dae", function(geometry) {

    var car_one = createCarFromGeometry(geometry);
    car_one.position.set(31, 1.9, 97);
    scene.add(car_one);

    var thingy = {
      then: Date.now(),
      st: 0,
      foward: new THREE.Vector3(0, 0, 0),
      car_one: car_one,
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
      forward_angle: 0,
      renderer: renderer,
      scene: scene,
      stats: stats,
      dirty: false
    };

    // event listeners
    renderer.domElement.addEventListener('pointerdown', onPointerDown.bind(thingy), false);
    renderer.domElement.addEventListener('pointermove', onPointerMove.bind(thingy), false);
    renderer.domElement.addEventListener('pointerup', onPointerUp.bind(thingy), false);
    window.addEventListener('resize', onWindowResize.bind(thingy), false);
    //document.getElementById("fullscreen-form").addEventListener('submit', onContClick, false);
    //animate.apply(thingy)
    window.cheese = animate.bind(thingy);
    window.puffs = tick.bind(thingy);
    tick.apply(thingy);
  });

//var sink = Sink(function(buffer, channelCount){
//    var i;
//    for (i=0; i<buffer.length; i++){
//        buffer[i] = Math.random() - 0.5;
//    }
//});

};

var createShaderMaterial = function() {
  var material = new THREE.ShaderMaterial( {
    uniforms: uniforms1,
    vertexShader: document.getElementById( 'vertexShader' ).textContent,
    fragmentShader: document.getElementById('fragment_shader4').textContent
  });
};
