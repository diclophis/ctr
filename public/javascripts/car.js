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
