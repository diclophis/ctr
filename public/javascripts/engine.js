var onPointerDown = function(e) {
  this.speedUp = true;
  this.pointers = e.getPointerList();
  for(var i = 0; i<this.pointers.length; i++){
    var pointer = this.pointers[i]; 
    if((this.leftPointerID < 0)) // && (pointer.x<this.wsa.windowHalfX))
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

var onPointerMove = function(e) {
  this.pointers = e.getPointerList();
  for (var i = 0; i<this.pointers.length; i++){
    var pointer = this.pointers[i]; 
    if (this.leftPointerID == pointer.identifier) {
      this.leftPointerPos.set(pointer.x, pointer.y); 
      this.leftVector.copy(this.leftPointerPos); 
      this.leftVector.sub(this.leftPointerStartPos);  
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

var windowSizeAndAspect = function() {
  var subDivide = 1; //2.66;
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
  this.container.className = "hidden";
  setTimeout(function(game) {
    var wsa = windowSizeAndAspect();
    game.camera.aspect = wsa.aspect;
    game.camera.updateProjectionMatrix();
    game.skyBoxCamera.aspect = wsa.aspect;
    game.skyBoxCamera.updateProjectionMatrix();
    game.renderer.setSize(wsa.x, wsa.y);
    game.container.className = "";
  }, 1000, this);
};

var createCamera = function(wsa, lookFar) {
  var cmra = new THREE.PerspectiveCamera(25, wsa.x / wsa.y, 1, lookFar);
  return cmra;
};

var createScene = function() {
  scne = new THREE.Scene();
  return scne;
};

var createContainer = function() {
  var cntr = document.getElementById('canvas-container');
  return cntr;
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

var createDeltaTime = function() {
  var tm = (1000 / this.fps);
  var now = Date.now();
  var dt = (now - this.then) / 1000;
  this.then = now;
  var dt = tm * 0.001;
  //if (this.paused == false) {
  this.st += dt;
  //}
  return dt;
};

document.addEventListener("DOMContentLoaded", function () {
  try {
    main(document.body);
  } catch(e) {
    alert(e);
  }
});
