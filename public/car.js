
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

  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  stats.domElement.style.zIndex = 100;

  container.appendChild(stats.domElement);

  //document.addEventListener('mousemove', onDocumentMouseMove, false);

  /*
  var r = "SwedishRoyalCastle/";
  var urls = [ r + "px.jpg", r + "nx.jpg",
         r + "py.jpg", r + "ny.jpg",
         r + "pz.jpg", r + "nz.jpg" ];

  var textureCube = THREE.ImageUtils.loadTextureCube(urls);

  var camaroMaterials = {

    body: [],
    chrome: new THREE.MeshLambertMaterial( { color: 0xffffff, envMap: textureCube } ),
    darkchrome: new THREE.MeshLambertMaterial( { color: 0x444444, envMap: textureCube } ),
    glass: new THREE.MeshBasicMaterial( { color: 0x223344, envMap: textureCube, opacity: 0.25, combine: THREE.MixOperation, reflectivity: 0.25, transparent: true } ),
    tire: new THREE.MeshLambertMaterial( { color: 0x050505 } ),
    interior: new THREE.MeshPhongMaterial( { color: 0x050505, shininess: 20 } ),
    black: new THREE.MeshLambertMaterial( { color: 0x000000 } )

  }

  camaroMaterials.body.push( [ "Orange", new THREE.MeshLambertMaterial( { color: 0xff6600, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.3 } ) ] );
  camaroMaterials.body.push( [ "Blue", new THREE.MeshLambertMaterial( { color: 0x226699, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.3 } ) ] );
  camaroMaterials.body.push( [ "Red", new THREE.MeshLambertMaterial( { color: 0x660000, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.5 } ) ] );
  camaroMaterials.body.push( [ "Black", new THREE.MeshLambertMaterial( { color: 0x000000, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.5 } ) ] );
  camaroMaterials.body.push( [ "White", new THREE.MeshLambertMaterial( { color: 0xffffff, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.5 } ) ] );

  camaroMaterials.body.push( [ "Carmine", new THREE.MeshPhongMaterial( { color: 0x770000, specular:0xffaaaa, envMap: textureCube, combine: THREE.MultiplyOperation } ) ] );
  camaroMaterials.body.push( [ "Gold", new THREE.MeshPhongMaterial( { color: 0xaa9944, specular:0xbbaa99, shininess:50, envMap: textureCube, combine: THREE.MultiplyOperation } ) ] );
  camaroMaterials.body.push( [ "Bronze", new THREE.MeshPhongMaterial( { color: 0x150505, specular:0xee6600, shininess:10, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.5 } ) ] );
  camaroMaterials.body.push( [ "Chrome", new THREE.MeshPhongMaterial( { color: 0xffffff, specular:0xffffff, envMap: textureCube, combine: THREE.MultiplyOperation } ) ] );
  */

  //var loader = new THREE.BinaryLoader();
  //loader.load("CamaroNoUv_bin.js", function( geometry ) { createScene( geometry, camaroMaterials ) } );
  //
  var loader = new THREE.ColladaLoader();
  loader.load("ferrari_f50.dae", function( geometry ) { createScene2( geometry, null ) } );

  //window.addEventListener('resize', onWindowResize, false );

}


function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth / 3, window.innerHeight / 3);

}

function $( id ) { return document.getElementById( id ) }

/*
function createButtons( materials, geometry ) {

  var i, src = "", parent = $( "buttons" );

  for( i = 0; i < materials.length; i ++ ) {

    src += '<button id="m' + i + '">' + materials[ i ][ 0 ] + '</button>';

  }

  parent.innerHTML = src;

  for( i = 0; i < materials.length; i ++ ) {

    $( "m" + i ).counter = i;
    $( "m" + i ).addEventListener( 'click', function() { geometry.materials[ 0 ] = materials[ this.counter ][ 1 ] }, false );

  }

}
*/

function createScene2( geometry, materials ) {

  var s = 75, m = new THREE.MeshFaceMaterial();

  //console.log(geometry);
  //console.log(materials);

  /*
  geometry.materials[ 0 ] = materials.body[ 0 ][ 1 ]; // car body
  geometry.materials[ 1 ] = materials.chrome; // wheels chrome
  geometry.materials[ 2 ] = materials.chrome; // grille chrome
  geometry.materials[ 3 ] = materials.darkchrome; // door lines
  geometry.materials[ 4 ] = materials.glass; // windshield
  geometry.materials[ 5 ] = materials.interior; // interior
  geometry.materials[ 6 ] = materials.tire; // tire
  geometry.materials[ 7 ] = materials.black; // tireling
  geometry.materials[ 8 ] = materials.black; // behind grille
  */

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

/*

            var hlMaterial = new THREE.MeshPhongMaterial( { color: 0x750004 } );

            function hl (o3d) {

                var children = o3d.children,
                    geometry = o3d.geometry;

                for ( var i = 0, il = children.length; i < il; i++ ) {
                    hl( children[ i ] );
                }

                if ( geometry ) o3d.material = hlMaterial;

            }
*/

            //hl(dae);


  //createButtons( materials.body, geometry );

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
