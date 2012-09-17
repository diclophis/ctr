var paused = true;

var tick = function(then, st, forward_angle, foward, car_one, turning_dir, forward_speed, camera, thingy) {

  var now = Date.now();
  var dt = (now - then) / 1000;
  then = now;


  if (paused == false) {
    forward_angle += ((thingy.leftVector.x * 0.0095) * dt);
    if (thingy.leftVector.y < 0) {
      //forward_speed += ((-thingy.leftVector.y * 0.05) * dt);
    }
    st += dt;
  }

  foward.x = Math.cos(forward_angle);
  foward.z = Math.sin(forward_angle);

  if (paused == false) {
    if (car_one != null) {
      moveObjectInDirectionAtSpeed(0, dt, car_one, foward, forward_speed);
      followObjectWithObjectAtSpeed(0, dt, car_one, camera, forward_speed * 1.05);
    }
  }

  if (car_one != null) {
    var b = foward.clone();
    var bb = foward.clone();
    bb.multiplyScalar(30.0);
    
    b.negate();

    var a = car_one.position.clone();
    a.addSelf(bb);

    var c = car_one.position.clone();
    c.addSelf(b);

    car_one.lookAt(c);
    camera.lookAt(a);
  }

  camera.position.y = 16;

  setTimeout(tick, 1, then, st, forward_angle, foward, car_one, turning_dir, forward_speed, camera, thingy);
};

var onPointerDown = function(e) {
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
  paused = true;
  e.preventDefault();
  if (fs == null) {
    fs = true;
    var cnt = document.getElementById("canvas-container");
    if (cnt.mozRequestFullScreen) {
      cnt.mozRequestFullScreen();
    }
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
    if (e.pointerType == PointerTypes.pointer) {
      this.leftVector.set(0,0); 
    }
  }
}

var createCarFromGeometry = function(geometry) {
  var car = THREE.SceneUtils.cloneObject(geometry.scene);
  car.updateMatrix();
  car.children[0].children[0].material = new THREE.MeshLambertMaterial({color: 0xffaa00 }); // wheels chrome
  car.children[0].children[1].material = new THREE.MeshLambertMaterial({color: 0x0000ff }); // wheels chrome
  car.children[0].children[2].material = new THREE.MeshLambertMaterial({color: 0xe0e0e0 }); // wheels chrome
  car.position.set(0, 1.1, 0);
  return car;
}

var windowSizeAndAspect = function() {
  var subDivide = 3.0;
  return {
    windowHalfX: window.innerWidth / subDivide,
    windowHalfY: window.innerHeight / subDivide,
    aspect: window.innerWidth / window.innerHeight,
    x: (window.innerWidth / subDivide),
    y: (window.innerHeight / subDivide)
  };
};

var debounceResizeTimeout = null;
var onWindowResize = function(cmra, rndr) {
  paused = true;
  if (debounceResizeTimeout != null) {
    clearTimeout(debounceResizeTimeout);
  }
  debounceResizeTimeout = setTimeout(function(cmra2, rndr2) {
    var wsa = windowSizeAndAspect();
    cmra2.aspect = wsa.aspect;
    cmra2.updateProjectionMatrix();
    rndr2.setSize(wsa.x, wsa.y);
    if (fs == true) {
      paused = false;
    }
  }, 100, cmra, rndr);
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
  var cmra = new THREE.PerspectiveCamera(45, wsa.x / wsa.y, 1, 500);
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

var run = function() {

  var container = null;
  var stats = null;

  var camera = null;
  var scene = null;
  var renderer = null;

  var car_one = null;
  var car_two = null;
  var forward_angle = 0;
  var forward_speed = 250;
  
  var foward = new THREE.Vector3(0, 0, 0);
  var turning_dir = 0;
  var accel_dir = 0;

  var st = 0;
  var loader = new THREE.ColladaLoader();
  var then = Date.now();

  var leftPointerID = -1;
  var leftPointerPos = new THREE.Vector2(0,0);
  var leftPointerStartPos = new THREE.Vector2(0,0);
  var leftVector = new THREE.Vector2(0,0); 

  var wsa = windowSizeAndAspect();


  container = createContainer();
  document.body.appendChild(container);

  camera = createCamera(wsa);
  scene = createScene();

  directionalLight = new THREE.DirectionalLight( 0xffffff );
  directionalLight.position.set(0.0, 1.0, 0.0);
  scene.add(directionalLight);

  pointLight = new THREE.PointLight(0xffffff, 1.0, 30.0);
  pointLight.position.set(0, 10, 0);
  scene.add(pointLight);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(wsa.x, wsa.y);
  renderer.setFaceCulling(0);
  container.appendChild(renderer.domElement);

  stats = createStats();
  container.appendChild(stats.domElement);

  createRaceTrack(st, scene);

  loader.load("ferrari_f50.dae", function(geometry) {
    car_one = createCarFromGeometry(geometry);
    scene.add(car_one);
    animate(renderer, scene, camera, stats);
    tick(then, st, forward_angle, foward, car_one, turning_dir, forward_speed, camera, thingy);
  });
  var thingy = {
    leftPointerID: -1,
    leftPointerStartPos: new THREE.Vector2(0,0),
    leftPointerPos: new THREE.Vector2(0,0),
    leftVector: new THREE.Vector2(0,0),
    wsa: wsa,
    pointers: [], // array of touch vectors,
    fs: null
  };

  document.getElementById("fullscreen-form").addEventListener('submit', onContClick, false);

  // event listeners
  renderer.domElement.addEventListener('pointerdown', onPointerDown.bind(thingy), false);
  renderer.domElement.addEventListener('pointermove', onPointerMove.bind(thingy), false);
  renderer.domElement.addEventListener('pointerup', onPointerUp.bind(thingy), false);

  window.addEventListener('resize', onWindowResize.bind(thingy, camera, renderer), false);

  document.onkeydown = function(e) {
    if (e.keyCode == 37) { 
      // l
      turning_dir = -1;
    } else if (e.keyCode == 39) { 
      // r
      turning_dir = 1;
    } else if (e.keyCode == 38) { 
      // u
      accel_dir = 1;
    } else if (e.keyCode == 40) { 
      // u
      accel_dir = 0;
    }

    return true;
  };
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

var createRaceTrack = function(st, scene) {
  // there is a race track
  // that follows a spline curve of points
  // it has a road that is an object
  // that is extruded over the spline
  // this road as two edges
  // this road as lines painted on it
  // inside line is dashed white
  // inner ring is white/yellow 70%
  // outer ring is red white 50/50

  parent = new THREE.Object3D();
  parent.position.y = 0;
  scene.add(parent);

  var addGeometry = function(st, p, geometry, color, x, y, z, rx, ry, rz, s ) {
    var uniforms1 = {
      time: { type: "f", value: st },
      resolution: { type: "v2", value: new THREE.Vector2() }
    };

    /*
    var material = new THREE.ShaderMaterial( {
      uniforms: uniforms1,
      vertexShader: document.getElementById( 'vertexShader' ).textContent,
      fragmentShader: document.getElementById('fragment_shader4').textContent
    });
    */

    material = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture("track.jpg") });

    var mesh = THREE.SceneUtils.createMultiMaterialObject(geometry, [
      //new THREE.MeshLambertMaterial( {color: color, opacity: 1.0, transparent: false }),
      //new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, opacity: 1.0 })
      material,
    ]);

    mesh.position.set(x, y, z);
    mesh.scale.set(s, s, s );

    //document.body.appendChild(THREE.UVsDebug(geometry));

    p.add(mesh);
  }

  // should be closed
  var extrudeBend = new THREE.SplineCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, -1000),
    new THREE.Vector3(1000, 0, -1000),
    new THREE.Vector3(1000, 0, 0),
    new THREE.Vector3(0, 0, 0),
  ]);

BoundingUVGenerator = {
    generateTopUV: function( geometry, extrudedShape, extrudeOptions, indexA, indexB, indexC) {
        var ax = geometry.vertices[ indexA ].x,
            ay = geometry.vertices[ indexA ].y,

            bx = geometry.vertices[ indexB ].x,
            by = geometry.vertices[ indexB ].y,

            cx = geometry.vertices[ indexC ].x,
            cy = geometry.vertices[ indexC ].y,

            bb = extrudedShape.getBoundingBox(),
            bbx = bb.maxX - bb.minX,
            bby = bb.maxY - bb.minY;

        return [
            new THREE.UV( ( ax - bb.minX ) / bbx, 1 - ( ay - bb.minY ) / bby ),
            new THREE.UV( ( bx - bb.minX ) / bbx, 1 - ( by - bb.minY ) / bby ),
            new THREE.UV( ( cx - bb.minX ) / bbx, 1 - ( cy - bb.minY ) / bby )
        ];
    },

    generateBottomUV: function( geometry, extrudedShape, extrudeOptions, indexA, indexB, indexC) {
        return this.generateTopUV( geometry, extrudedShape, extrudeOptions, indexA, indexB, indexC );
    },

    generateSideWallUV: function( geometry, extrudedShape, wallContour, extrudeOptions,
                                  indexA, indexB, indexC, indexD, stepIndex, stepsLength,
                                  contourIndex1, contourIndex2 ) {
        var ax = geometry.vertices[ indexA ].x,
            ay = geometry.vertices[ indexA ].y,
            az = geometry.vertices[ indexA ].z,

            bx = geometry.vertices[ indexB ].x,
            by = geometry.vertices[ indexB ].y,
            bz = geometry.vertices[ indexB ].z,

            cx = geometry.vertices[ indexC ].x,
            cy = geometry.vertices[ indexC ].y,
            cz = geometry.vertices[ indexC ].z,

            dx = geometry.vertices[ indexD ].x,
            dy = geometry.vertices[ indexD ].y,
            dz = geometry.vertices[ indexD ].z;

        var amt = extrudeOptions.amount,
            bb = extrudedShape.getBoundingBox(),
            bbx = bb.maxX - bb.minX,
            bby = bb.maxY - bb.minY;

        if ( Math.abs( ay - by ) < 0.01 ) {
            return [
                new THREE.UV( ax / bbx, az / amt),
                new THREE.UV( bx / bbx, bz / amt),
                new THREE.UV( cx / bbx, cz / amt),
                new THREE.UV( dx / bbx, dz / amt)
            ];
        } else {
            return [
                new THREE.UV( ay / bby, az / amt ),
                new THREE.UV( by / bby, bz / amt ),
                new THREE.UV( cy / bby, cz / amt ),
                new THREE.UV( dy / bby, dz / amt )
            ];
        }
    }
};


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

  var roundedRectShape = new THREE.Shape();
  roundedRect(roundedRectShape, 0, 0, 2000, 2000, 100);

  var foo = roundedRectShape.createSpacedPointsGeometry(10);

  var m = new THREE.Matrix4();
  //console.log(m);
  var gamma = Math.PI/2;
  m.rotateX(gamma);
  foo.applyMatrix(m);

  var wang = new THREE.ClosedSplineCurve3(foo.vertices);
  //console.log(wang, extrudeBend);

  var extrudeSettings = { steps: 300 }
  extrudeSettings.extrudePath = wang; //roundedRectShape; //extrudeBend;
  extrudeSettings.UVGenerator = new THREE.UVsUtils.CylinderUVGenerator();
  //BoundingUVGenerator; //THREE.ExtrudeGeometry.WorldUVGenerator;
  //extrudeSettings.extrudeMaterial = 0;
  extrudeSettings.material = 1;





  var rectLength = 30.0;
  var rectWidth = 1.0;

  var rectShape = new THREE.Shape();

  /*
  rectShape.moveTo(0, -rectLength);
  rectShape.lineTo(0, rectLength);
  rectShape.lineTo(rectWidth, 0);
  rectShape.lineTo(0, -rectLength);
  */
  rectShape.moveTo(0, -rectLength);
  rectShape.lineTo(0, rectLength);
  rectShape.lineTo(rectWidth, 0);
  rectShape.lineTo(0, -rectLength);

  var circle3d = rectShape.extrude(extrudeSettings);

  addGeometry(st, parent, circle3d, 0x700000, 0, 0, 0, 0, 0, 0, 1 );
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

  //console.log(spline.getPoint(0.5));
  //console.log(spline.getTangent(0.5));
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

