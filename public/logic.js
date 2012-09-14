// logic of racing game
// http://www.youtube.com/watch?v=NUU_F9TvXco

var moveObjectInDirectionAtSpeed = function(st, dt, obj, dir, spd) {

  // clean up the input
  dir.normalize();

  // calculate the distance traveled over time in that direction
  dir.multiplyScalar(spd * dt);

  // move object that much distance
  obj.position.addSelf(dir);

};

var followObjectWithObjectAtSpeed = function(st, dt, car, camera, speed) {
  // there is a distance between the two objects
  var distance = new THREE.Vector3(0, 0, 0);
  distance.sub(car.position, camera.position);

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

var createRaceTrack = function() {
  // there is a race track
  // that follows a spline curve of points
  // it has a road that is an object
  // that is extruded over the spline
  // this road as two edges
  // this road as lines painted on it
  // inside line is dashed white
  // inner ring is white/yellow 70%
  // outer ring is red white 50/50
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

