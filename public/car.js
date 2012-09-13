
var windowSizeAndAspect = function() {
  return {
    windowHalfX: window.innerWidth / 2,
    windowHalfY: window.innerHeight / 2,
    aspect: window.innerWidth / window.innerHeight,
    x: (window.innerWidth / 3),
    y: (window.innerHeight / 3)
  };
};

var run = function() {

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
    camera.position.x = 5;
    camera.position.y = 10;
    camera.position.z = 5;
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

  (function foo() {

    directionRequiredToFollowSpine();

    var now = Date.now();
    var dt = (now - then) * 0.0001;

    var foward = new THREE.Vector3(0, 0, -1);

    if (car_one != null) {
      camera.lookAt(car_one.position);
      //moveCar(dt, car_one, foward, 0.01);
      followObjectWithObjectAtSpeed(0, dt, car_one, camera, 0.01); 
    } else {
      camera.lookAt(scene.position);
    }

    camera.position.x = Math.cos(dt) * 10;
    camera.position.z = Math.sin(dt) * 10;

    setTimeout(foo, 17);
  })();


function init() {

  createContainer();
  
  var wsa = windowSizeAndAspect();
  createCamera(wsa);
  createScene();

  // LIGHTS
  var ambient = new THREE.AmbientLight( 0x020202 );
  scene.add(ambient);

  /*
  directionalLight = new THREE.DirectionalLight( 0xffffff );
  directionalLight.position.set(5.0, 5.0, 5.0).normalize();
  scene.add(directionalLight);
  pointLight = new THREE.PointLight( 0xffaa00 );
  pointLight.position.set(0, 0, 5);
  scene.add(pointLight);
  */

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(wsa.x, wsa.y);
  renderer.setFaceCulling(0);

  container.appendChild(renderer.domElement);

  createStats();

  var loader = new THREE.ColladaLoader();
  loader.load("ferrari_f50.dae", function( geometry ) { createScene2( geometry, null ) } );

  //window.addEventListener('resize', onWindowResize, false );

}


var onWindowResize = function() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth / 3, window.innerHeight / 3);

}

var createScene2 = function (geometry, materials) {

  var s = 75, m = new THREE.MeshFaceMaterial();

  //var mesh = new THREE.Mesh( geometry, m );
  //mesh.rotation.y = 1;
  //mesh.scale.set( s, s, s );
  //scene.add( mesh );

  car_one = THREE.SceneUtils.cloneObject(geometry.scene);
  car_two = THREE.SceneUtils.cloneObject(geometry.scene);

  //dae.scale.x = dae.scale.y = dae.scale.z = 0.1;
  car_one.updateMatrix();
  car_two.updateMatrix();

  //scene.add(dae);
  //car_one.children[0].children[0].material = materials.chrome; // wheels chrome


    //var mesh1 = new THREE.Mesh(geometry.scene.children[0].children[0].geometry[0], new THREE.MeshFaceMaterial() );
    //var mesh2 = new THREE.Mesh(geometry.scene.children[0].children[0].geometry[0], new THREE.MeshLambertMaterial( { color: 0xffaa00 } ) );

    // ...

    car_one.position.set(0, 0, 0);
    car_two.position.set(5, 0, 0);

    // ...

    scene.add(car_one);
    scene.add(car_two);
}

function onDocumentMouseMove(event) {

  mouseX = ( event.clientX - windowHalfX );
  mouseY = ( event.clientY - windowHalfY );

}

function animate() {

  requestAnimationFrame( animate );

  render();
  stats.update();

}

  function render() {

    if (true) {

      renderer.render(scene, camera);
    }
  }
}
