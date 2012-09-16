
var tick = function(then, st, forward_angle, foward, car_one, turning_dir, forward_speed, camera) {

  var now = Date.now();
  var dt = (now - then) / 1000;
  st += dt;
  then = now;

  forward_angle += ((turning_dir * 1) * dt);

  foward.x = Math.cos(forward_angle);
  foward.z = Math.sin(forward_angle);

  //foward.x = 
  if (car_one != null) {
    //camera.lookAt(car_one.position);
    moveObjectInDirectionAtSpeed(0, dt, car_one, foward, forward_speed);
    followObjectWithObjectAtSpeed(0, dt, car_one, camera, forward_speed * 0.999);

    var b = foward.clone();
    var bb = foward.clone();
    //bb.negate();
    bb.multiplyScalar(20.0);
    
    b.negate();

    var a = car_one.position.clone();
    a.addSelf(bb);

    var c = car_one.position.clone();
    c.addSelf(b);

    car_one.lookAt(c);
    camera.lookAt(a);

  }

  camera.position.y = 10;
  
  setTimeout(tick, 67, then, st, forward_angle, foward, car_one, turning_dir, forward_speed, camera);
//})();
};

var createCarFromGeometry = function(geometry) {
  var car = THREE.SceneUtils.cloneObject(geometry.scene);

  //dae.scale.x = dae.scale.y = dae.scale.z = 0.1;
  car.updateMatrix();
  car.children[0].children[0].material = new THREE.MeshLambertMaterial({color: 0xffaa00 }); // wheels chrome
  car.children[0].children[1].material = new THREE.MeshLambertMaterial({color: 0x0000ff }); // wheels chrome
  car.children[0].children[2].material = new THREE.MeshLambertMaterial({color: 0xe0e0e0 }); // wheels chrome
  car.position.set(0, 1.1, 0);

  return car;
}

var windowSizeAndAspect = function() {
  var subDivide = 4;
  return {
    windowHalfX: window.innerWidth / subDivide,
    windowHalfY: window.innerHeight / subDivide,
    aspect: window.innerWidth / window.innerHeight,
    x: (window.innerWidth / subDivide),
    y: (window.innerHeight / subDivide)
  };
};

var onWindowResize = function(cmra, rndr) {
  var wsa = windowSizeAndAspect();
  cmra.aspect = wsa.aspect;
  cmra.updateProjectionMatrix();
  rndr.setSize(wsa.x, wsa.y);
}

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
  var cmra = new THREE.PerspectiveCamera(45, wsa.x / wsa.y, 1, 1000);
  return cmra;
};

var createScene = function() {
  scne = new THREE.Scene();
  return scne;
};

var createContainer = function() {
  var cntr = document.createElement('div');
  cntr.id = "canvas-container";

  if (cntr.mozRequestFullScreen) {
    //container.mozRequestFullScreen();
  }

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
  var forward_speed = 100;
  
  var foward = new THREE.Vector3(0, 0, 0);
  var turning_dir = 0;
  var accel_dir = 0;


// TODO ---
//
var onPointerDown = function(e) {
  pointers = e.getPointerList();

  for(var i = 0; i<pointers.length; i++){
    var pointer = pointers[i]; 
    if((leftPointerID<0) && (pointer.x<halfWidth))
    {
      leftPointerID = pointer.identifier; 
      leftPointerStartPos.reset(pointer.x, pointer.y);  
      leftPointerPos.copyFrom(leftPointerStartPos); 
      leftVector.reset(0,0); 
      continue;     
      } else {
    } 
  }
}

var onPointerMove = function(e) {
  // Prevent the browser from doing its default thing (scroll, zoom)
  pointers = e.getPointerList();

  for(var i = 0; i<pointers.length; i++){
    var pointer =pointers[i]; 
    if(leftPointerID == pointer.identifier)
    {
      leftPointerPos.reset(pointer.x, pointer.y); 
      leftVector.copyFrom(leftPointerPos); 
      leftVector.minusEq(leftPointerStartPos);  
      break;    
    }   
  }
} 

var onPointerUp = function(e) { 

  pointers = e.getPointerList(); 
  if (pointers.length == 0) {
    leftPointerID = -1; 
    if (e.pointerType == PointerTypes.pointer) {
      leftVector.reset(0,0); 
    }
  }
}

// TODO ---

  var canvas,
  c, // c is the canvas' context 2D
  halfWidth, 
  halfHeight,
  leftPointerID = -1, 
  leftPointerPos = new THREE.Vector2(0,0),
  leftPointerStartPos = new THREE.Vector2(0,0),
  leftVector = new THREE.Vector2(0,0); 

  var pointers = []; // array of touch vectors


  container = createContainer();
  document.body.appendChild(container);

  var wsa = windowSizeAndAspect();
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

  renderer.domElement.addEventListener( 'pointerdown', onPointerDown, false );
  renderer.domElement.addEventListener( 'pointermove', onPointerMove, false );
  renderer.domElement.addEventListener( 'pointerup', onPointerUp, false );

  stats = createStats();
  container.appendChild(stats.domElement);

  createRaceTrack(scene);

  var st = 0;
  var loader = new THREE.ColladaLoader();
  var then = Date.now();

  loader.load("ferrari_f50.dae", function(geometry) {
    car_one = createCarFromGeometry(geometry);
    scene.add(car_one);

    animate(renderer, scene, camera, stats);
    tick(then, st, forward_angle, foward, car_one, turning_dir, forward_speed, camera);
  });

  //var center = new THREE.Vector3(0, 0, 0);

  // event listeners
  window.addEventListener('resize', onWindowResize.bind(this, camera, renderer), false);

  document.onkeydown = function(e) {
    if (e.keyCode == 37) { 
      // l
      //foward.x = -0.001;
      //foward.y = -0.00;
      //foward.z = -0.00;
      //forward_angle -= 0.1;
      turning_dir = -1;
    } else if (e.keyCode == 39) { 
      // r
      //foward.x = 0.001;
      //foward.y = -0.00;
      //foward.z = -0.00;
      //forward_angle += 0.1;
      turning_dir = 1;
    } else if (e.keyCode == 38) { 
      // u
      //foward.x = -0.00;
      //foward.y = -0.00;
      //foward.z = -0.001;
      //forward_speed += 1;
      accel_dir = 1;
    } else if (e.keyCode == 40) { 
      // u
      //foward.x = -0.00;
      //foward.y = -0.00;
      //foward.z = 0.001;
      accel_dir = 0;
    }

    //console.log(foward.x, foward.y, e.keyCode);
    
    return true;
  };

}
