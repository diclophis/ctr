
var windowSizeAndAspect = function() {
  var subDivide = 2.5;
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
  }

  var container, stats;

  var camera, scene, renderer;

  //var directionalLight, pointLight;

  //var mouseX = 0, mouseY = 0;

  var car_one = null;
  var car_two = null;

  var then = Date.now();

  var createStats = function() {
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100;

    container.appendChild(stats.domElement);
  };

  var createCamera = function(wsa) {
    camera = new THREE.PerspectiveCamera(70, wsa.x / wsa.y, 1, 10000);
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

  (function foo() {

    directionRequiredToFollowSpine();

    var now = Date.now();
    var dt = (now - then) / 1000;
    st += dt;
    then = now;

    var foward = new THREE.Vector3(Math.sin(st * 0.1) * 0.01, 0, -1);


    if (car_one != null) {
      if (st > 10) {
        //camera.lookAt(car_one.position);
        moveObjectInDirectionAtSpeed(0, dt, car_one, foward, 30.0);
        followObjectWithObjectAtSpeed(0, dt, car_one, camera, 31.0);
        camera.position.y = 20;
      } else {
        car_one.position.set(0, 0, 200);
      }
    
      camera.lookAt(car_one.position);
    } else { 
      camera.position.y = 10;
      camera.position.z = 210;
    }
    
    camera.position.x = 20;

    camera.up = new THREE.Vector3(0, 1, 0);

    setTimeout(foo, 1000 / 30);
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



  scene.add(car_one);
}


  window.addEventListener('resize', onWindowResize.bind(this, camera, renderer), false);
}
