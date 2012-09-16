




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

var run = function() {

  var animate = function() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    stats.update();


    //c.clearRect(0,0,canvas.width, canvas.height); 

    //ship.targetVel.copyFrom(leftVector);
    //ship.targetVel.multiplyEq(0.15);
    //ship.update(); 

    /*
    with(ship.pos) {
      if(x<0) x = canvas.width; 
      else if(x>canvas.width) x = 0;
      if(y<0) y = canvas.height; 
      else if (y>canvas.height) y = 0; 
    }

    ship.draw(); 


    for (var i = 0; i < bullets.length; i++) {
      var bullet = bullets[i]; 
      if(!bullet.enabled) continue; 
      bullet.update(); 
      bullet.draw(c); 
      if(!bullet.enabled)
      {
        spareBullets.push(bullet); 

      }


    }
    */

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

  var container, stats;

  var camera, scene, renderer;

  //var directionalLight, pointLight;

  //var mouseX = 0, mouseY = 0;

  var car_one = null;
  var car_two = null;
  var forward_angle = 0;
  var forward_speed = 100;
  
  var foward = new THREE.Vector3(0, 0, 0);
  var turning_dir = 0;
  var accel_dir = 0;

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


function onPointerDown(e) {
  pointers = e.getPointerList();

  for(var i = 0; i<pointers.length; i++){
    var pointer =pointers[i]; 
    if((leftPointerID<0) && (pointer.x<halfWidth))
    {
      leftPointerID = pointer.identifier; 
      leftPointerStartPos.reset(pointer.x, pointer.y);  
      leftPointerPos.copyFrom(leftPointerStartPos); 
      leftVector.reset(0,0); 
      continue;     
      } else {

      //makeBullet(); 

    } 
  }
}

function onPointerMove(e) {
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

function onPointerUp(e) { 

  pointers = e.getPointerList(); 
  if (pointers.length == 0) {
    leftPointerID = -1; 
    if (e.pointerType == PointerTypes.pointer) {
      leftVector.reset(0,0); 
    }
  }
}



  var createStats = function() {
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100;

    container.appendChild(stats.domElement);
  };

  var createCamera = function(wsa) {
    camera = new THREE.PerspectiveCamera(45, wsa.x / wsa.y, 1, 1000);
  };

  var createScene = function() {
    scene = new THREE.Scene();
  };

  var createContainer = function() {
    container = document.createElement('div');
    container.id = "canvas-container";

    if (container.mozRequestFullScreen) {
      //container.mozRequestFullScreen();
    }

    document.body.appendChild(container);
  };

  init();
  animate();

  var st = 0;

  var center = new THREE.Vector3(0, 0, 0);
  var then = Date.now();

  (function foo() {

    directionRequiredToFollowSpine();

    var now = Date.now();
    var dt = (now - then) / 1000;
    st += dt;
    then = now;

    //var q = new THREE.Quaternion();
    //q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), forward_angle);
    //var m = new THREE.Matrix4();
    //m.setRotationFromQuaternion(q);
    //m.lookAt(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 1), new THREE.Vector3(0, 1, 0))
    //foward.setEulerFromRotationMatrix(m);

    forward_angle += ((turning_dir * 1) * dt);

    foward.x = Math.cos(forward_angle);
    foward.z = Math.sin(forward_angle);

    //foward.x = 
    if (car_one != null) {
      //camera.lookAt(car_one.position);
      moveObjectInDirectionAtSpeed(0, dt, car_one, foward, forward_speed);
      followObjectWithObjectAtSpeed(0, dt, car_one, camera, forward_speed * 0.999);


      //camera.position.x = 0; //car_one.position.x - 1;// + (b.x * 20.0);
      //camera.position.z = 0; //car_one.position.z - 1;// + (b.z * 20.0);
   
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

    } else { 
    }

    //camera.position.z = 0;

    camera.position.y = 10;
    
    setTimeout(foo, 67);
  })();


function init() {

  createContainer();
  
  var wsa = windowSizeAndAspect();
  createCamera(wsa);
  createScene();

  // LIGHTS
  //var ambient = new THREE.AmbientLight(0xffffff);
  //scene.add(ambient);

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



  var canvas,
  c, // c is the canvas' context 2D
  halfWidth, 
  halfHeight,
  leftPointerID = -1, 
  leftPointerPos = new THREE.Vector2(0,0),
  leftPointerStartPos = new THREE.Vector2(0,0),
  leftVector = new THREE.Vector2(0,0); 

  var pointers = []; // array of touch vectors

  /*
  c = renderer.domElement.getContext('2d');
  c.strokeStyle = "#ffffff";
  c.lineWidth =2; 
  */















  createStats();

  var loader = new THREE.ColladaLoader();

  loader.load("ferrari_f50.dae", function(geometry) {
    createScene2(geometry);
  });


  createRaceTrack(scene);
}



var createScene2 = function (geometry) {

  car_one = THREE.SceneUtils.cloneObject(geometry.scene);

  //dae.scale.x = dae.scale.y = dae.scale.z = 0.1;
  car_one.updateMatrix();

  car_one.children[0].children[0].material = new THREE.MeshLambertMaterial({color: 0xffaa00 }); // wheels chrome
  car_one.children[0].children[1].material = new THREE.MeshLambertMaterial({color: 0x0000ff }); // wheels chrome
  car_one.children[0].children[2].material = new THREE.MeshLambertMaterial({color: 0xe0e0e0 }); // wheels chrome



  car_one.position.set(0, 1.1, 0);
  scene.add(car_one);
}


  window.addEventListener('resize', onWindowResize.bind(this, camera, renderer), false);
}
