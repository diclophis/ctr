var paused = false;

var tick = function(then, st, forward_angle, foward, car_one, forward_speed, camera, thingy) {
  var tm = (1000 / 22);

  var now = Date.now();
  var dt = (now - then) / 1000;
  then = now;

  if (dt < (tm * 1.1)) {

    if (paused == false) {
      forward_angle += ((thingy.leftVector.x * 0.005) * dt);
      if (thingy.speedUp) {
        forward_speed += ((60) * dt);
      } else {
        forward_speed -= ((100) * dt);
      }
      if (forward_speed < 0) {
        forward_speed = 0;
      }
      if (forward_speed > 350) {
        forward_speed = 350;
      }
      st += dt;
    }

    foward.x = Math.cos(forward_angle);
    foward.z = Math.sin(forward_angle);

    if (paused == false) {
      if (car_one != null) {
        moveObjectInDirectionAtSpeed(0, dt, car_one, foward, forward_speed);
        followObjectWithObjectAtSpeed(0, dt, car_one, camera, forward_speed);
      }
    }

    if (car_one != null) {
      var b = foward.clone();
      var bb = foward.clone();

      bb.multiplyScalar(200.0); //how far in front
      
      b.negate();

      var a = car_one.position.clone();
      a.addSelf(bb);

      var c = car_one.position.clone();
      c.addSelf(b);

      car_one.lookAt(c);
      camera.lookAt(a);
    }

    //camera.position.x = 25;
    camera.position.y = 20;
    //camera.position.z = 65;
  }

  //thingy.scene.updateMatrixWorld();
  setTimeout(tick, tm, then, st, forward_angle, foward, car_one, forward_speed, camera, thingy);

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
      this.leftVector.set(0,0); 
      continue;     
      } else {
    } 
  }
}

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
      this.leftVector.set(0,0); 
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
  var subDivide = 3;
  var r = {
    windowHalfX: Math.floor(window.innerWidth / subDivide),
    windowHalfY: Math.floor(window.innerHeight / subDivide),
    aspect: window.innerWidth / window.innerHeight,
    x: Math.floor(window.innerWidth / subDivide),
    y: Math.floor(window.innerHeight / subDivide)
  };
  return r;
};

var onWindowResize = function(cmra, rndr) {
  var wsa = windowSizeAndAspect();
  cmra.aspect = wsa.aspect;
  cmra.updateProjectionMatrix();
  rndr.setSize(wsa.x, wsa.y);
};

var animate = function(rndr, scne, cmra, sts) {
  requestAnimationFrame(animate.bind(this, rndr, scne, cmra, sts));
  rndr.render(scne, cmra);
  sts.update();

  /*
  for(var i=0; i<pointers.length; i++) {

    var pointer = pointers[i]; 

    if(pointer.identifier == leftPointerID){
      c.beginPath(); 
      c.strokeStyle = "cyan"; 
      c.lineWidth = 6; 
      c.arc(leftPointerStartPos.x, leftPointerStartPos.y, 40,0,Math.PI*2,true); 
      c.stroke();
      c.beginPath(); 
      c.strokeStyle = "cyan"; 
      c.lineWidth = 2; 
      c.arc(leftPointerStartPos.x, leftPointerStartPos.y, 60,0,Math.PI*2,true); 
      c.stroke();
      c.beginPath(); 
      c.strokeStyle = "cyan"; 
      c.arc(leftPointerPos.x, leftPointerPos.y, 40, 0,Math.PI*2, true); 
      c.stroke(); 

      } else {

      c.beginPath(); 
      c.fillStyle = "white";
      c.fillText(pointer.type + " id : "+pointer.identifier+" x:"+pointer.x+" y:"+pointer.y, pointer.x+30, pointer.y-30); 

      c.beginPath(); 
      c.strokeStyle = "red";
      c.lineWidth = "6";
      c.arc(pointer.x, pointer.y, 40, 0, Math.PI*2, true); 
      c.stroke();
    }
  }
  */
  //c.fillText("hello", 0,0); 

}

var createStats = function() {
  var sts = new Stats();
  sts.domElement.style.position = 'absolute';
  sts.domElement.style.top = '0px';
  sts.domElement.style.zIndex = 100;
  return sts;
};

var createCamera = function(wsa) {
  var cmra = new THREE.PerspectiveCamera(25, wsa.x / wsa.y, 1, 10000);
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


  var addGeometry = function(p, geometry, color, x, y, z, rx, ry, rz, s ) {
    material = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture("track.png") });

    var mesh = THREE.SceneUtils.createMultiMaterialObject(geometry, [
      //new THREE.MeshLambertMaterial( {color: color, opacity: 1.0, transparent: false }),
      //new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, opacity: 1.0 })
      material,
    ]);

    mesh.position.set(x, y, z);
    mesh.scale.set(s, s, s );
    //console.log(mesh);
    mesh.children[0].geometry.mergeVertices();

    //document.body.appendChild(THREE.UVsDebug(geometry));

    p.add(mesh);
  }

  function roundedRect(ctx, x, y, width, height, radius) {
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
  roundedRect(roundedRectShape, 0, 0, 2000, 2000, 100);

  var tightness = 6;
  var quality = 200;

  var foo = roundedRectShape.createSpacedPointsGeometry(tightness);

  var m = new THREE.Matrix4();
  var gamma = Math.PI/2;
  m.rotateX(gamma);
  foo.applyMatrix(m);

  var spine = new THREE.ClosedSplineCurve3(foo.vertices);

  //var g = spine.createPointsGeometry(1000);

  var s = spine.getPoints(quality);
  var g = new THREE.Geometry();
  //for (var i=0; i<s.length; i++) {
  //  s[i].y = Math.sin(i) * 1.0;
  //}
  //s[0].y = 0;
  //s[s.length - 1].y = 0;

  g.vertices = s;

  var lineObject = new THREE.Line(g); //new THREE.Geometry(spine.getPoints(100)));
  lineObject.position.y += 5;
  trackObject.add(lineObject);

  //var wang = new THREE.ClosedSplineCurve3(s);

  var extrudeSettings = { steps: quality }
  extrudeSettings.extrudePath = spine;
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
  trackGeometry.mergeVertices();

  addGeometry(trackObject, trackGeometry, 0x700000, 0, 0, 0, 0, 0, 0, 1 );

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

  var renderer = new THREE.WebGLRenderer({precision: "lowp", });
  renderer.setSize(wsa.x, wsa.y);
  renderer.setFaceCulling("back");
  //renderer.autoUpdateScene = false;
  container.appendChild(renderer.domElement);

  var stats = createStats();
  container.appendChild(stats.domElement);

  var raceTrack = createRaceTrack(scene);
  scene.add(raceTrack);

  var thingy = {
    leftPointerID: -1,
    leftPointerStartPos: new THREE.Vector2(0, 0),
    leftPointerPos: new THREE.Vector2(0, 0),
    leftVector: new THREE.Vector2(0, 0),
    wsa: wsa,
    pointers: [],
    fs: null,
    scene: scene,
    speedUp: false
  };

  var loader = new THREE.ColladaLoader();
  loader.load("F1.dae", function(geometry) {
    var car_one = createCarFromGeometry(geometry);
    car_one.position.set(31, 1.9, 97);
    scene.add(car_one);
    animate(renderer, scene, camera, stats);
    tick(Date.now(), 0, 0, new THREE.Vector3(0, 0, 0), car_one, 1, camera, thingy);
  });

  document.getElementById("fullscreen-form").addEventListener('submit', onContClick, false);

  // event listeners
  renderer.domElement.addEventListener('pointerdown', onPointerDown.bind(thingy), false);
  renderer.domElement.addEventListener('pointermove', onPointerMove.bind(thingy), false);
  renderer.domElement.addEventListener('pointerup', onPointerUp.bind(thingy), false);

  window.addEventListener('resize', onWindowResize.bind(thingy, camera, renderer), false);

};

    /*
    var material = new THREE.ShaderMaterial( {
      uniforms: uniforms1,
      vertexShader: document.getElementById( 'vertexShader' ).textContent,
      fragmentShader: document.getElementById('fragment_shader4').textContent
    });
    */
