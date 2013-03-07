document.addEventListener("DOMContentLoaded", function () {
  //try {
    main(document.body);
  //} catch(e) {
  //  alert(e);
  //}
});

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
    y: Math.floor(window.innerHeight / subDivide),
    ax: Math.floor(window.innerWidth / subDivide) * window.devicePixelRatio,
    ay: Math.floor(window.innerHeight / subDivide) * window.devicePixelRatio
  };
  return r;
};

var onWindowResize = function() {
  clearTimeout(this.resizeTimeout);
  this.container.className = "hidden";
  this.paused = true;
  this.resizeTimeout = setTimeout(function(game) {
    var wsa = windowSizeAndAspect();
    game.wsa = wsa;
    game.camera.aspect = wsa.aspect;
    game.camera.updateProjectionMatrix();
    game.debugCamera.aspect = wsa.aspect;
    game.debugCamera.updateProjectionMatrix();
    game.skyBoxCamera.aspect = wsa.aspect;
    game.skyBoxCamera.updateProjectionMatrix();
    game.renderer.setSize(wsa.x, wsa.y);
    game.container.className = "";
    game.paused = false;
  }, 2000, this);
};

var createCamera = function(wsa, lookFar, fov) {
  if (typeof(fov) === "undefined") {
    fov = 25;
  }
  var cmra = new THREE.PerspectiveCamera(fov, wsa.x / wsa.y, 1, lookFar);
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
  /*
  var tm = (1000 / this.fps);
  var now = Date.now();
  var dt = (now - this.then) / 1000;
  this.then = now;
  var dt = tm * 0.001;
  //if (this.paused == false) {
  this.st += dt;
  //}
  */
  var now = new Date().getTime();
  var dt = (now - this.then);
  this.then = now;
  this.st += dt;
  //console.log(dt);
  return dt;
};

var createSkyBox = function(skyMaterial, subdivide) {
  if (typeof(subdivide) === "undefined") {
    subdivide = 2;
  }
  var M = 999 * 1;
  var skyGeometry = new THREE.CubeGeometry(M, M, M, subdivide, subdivide, subdivide, null, true);
  var skyboxMesh  = new THREE.Mesh(skyGeometry, skyMaterial);
  var skyboxObject = new THREE.Object3D();
  skyboxObject.add(skyboxMesh);
  return skyboxObject;
};

var createTextureCubeMaterial = function() {
  // there is a world with blue sky
  // http://learningthreejs.com/blog/2011/08/15/lets-do-a-sky/
  var urlPrefix = "SwedishRoyalCastle/";
  var urls = [ urlPrefix + "px.jpg", urlPrefix + "nx.jpg",
               urlPrefix + "py.jpg", urlPrefix + "ny.jpg",
               urlPrefix + "pz.jpg", urlPrefix + "nz.jpg" ];
  var textureCube = THREE.ImageUtils.loadTextureCube(urls);

  var shader  = THREE.ShaderLib["cube"];
  shader.uniforms["tCube"].value = textureCube;
  var skyMaterial = new THREE.ShaderMaterial({
    fragmentShader  : shader.fragmentShader,
    vertexShader  : shader.vertexShader,
    uniforms  : shader.uniforms,
    depthWrite: false,
    side: THREE.BackSide
  });

  return skyMaterial;
};

var createMeshBasicWireframeMaterial = function(wireframe) {
  //var mtl = new THREE.MeshBasicMaterial({color: 0x3030ff, side: THREE.BackSide, wireframe: true});
  var mtl = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, wireframe: wireframe});
  mtl.color.setHex( Math.random() * 0xffffff );
  return mtl;
};
