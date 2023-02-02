import * as THREE from "three";
import * as DATGUI from "datgui";
import * as CONTROLS from "controls";
import * as DRAGCONTROLS from "dragcontrols";
import * as TWEEN from "tween";
import Stats from "stats";

// lecture modules
import Physics from "./physics/Physics.js";

// Own modules
import TurbineFromFile from "./objects/TurbineFromFile.js";
import Floor from "./objects/Floor.js";
import Lamp from "./objects/Lamp.js";
import Tree from "./objects/Tree.js";

// Event functions
import { updateAspectRatio } from "./eventfunctions/updateAspectRatio.js";
import { executeRaycast } from "./eventfunctions/executeRaycast.js";
import {
  keyDownAction,
  keyUpAction,
} from "./eventfunctions/executeKeyAction.js";


const MAX_TREE_COUNT = 15;
const MAX_TURBINE_COUNT = 3;
const MIN_SPAWN_DIST = 20;

function main() {
  window.scene = new THREE.Scene();
  window.scene.add(new THREE.AxesHelper(50));

  window.camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  window.camera.position.set(-100, 300, 300);

  window.renderer = new THREE.WebGLRenderer({ antialias: true });
  window.renderer.setSize(window.innerWidth, window.innerHeight);
  window.renderer.setClearColor(0x71a3f5);
  window.renderer.shadowMap.enabled = true;

  window.physics = new Physics();
  window.physics.setup(0, -200, 0, 1 / 240, true);

  window.audioListener = new THREE.AudioListener();
  window.camera.add(window.audioListener);

  document.getElementById("3d_content").appendChild(window.renderer.domElement);

  window.turbines = [];
  window.lamps = [];
  window.treeSpawns = [];
  
  const windDirection = new THREE.Object3D();
  windDirection.position.set(0, 0, 1);
  windDirection.rotation.set(0, 0, 1);
  window.scene.add(windDirection);

  const turbineFromFile = new TurbineFromFile();
  turbineFromFile.position.set(0, 0, 0);
  turbineFromFile.scale.set(2, 2, 2);
  turbineFromFile.addPhysics();
  window.scene.add(turbineFromFile);
  window.turbines.push(turbineFromFile);


  const lamp = new Lamp();
  lamp.position.set(20, 0, 20);
  lamp.addPhysics();
  window.lamps.push(lamp);
  window.scene.add(lamp);
  
  spawnTrees();

  const floor = new Floor();
  floor.position.set(0, 0, 0);
  window.scene.add(floor);

  const ambientLight = new THREE.AmbientLight(0xffffff);
  ambientLight.intensity = 0.5;
  window.scene.add(ambientLight);

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(100, 100, 100);
  spotLight.intensity = 0.8;
  spotLight.target = floor;
  spotLight.angle = THREE.MathUtils.degToRad(30);
  spotLight.penumbra = 1.0;
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.set(2048, 2048);
  spotLight.shadow.camera.aspect = 1;
  spotLight.shadow.camera.near = 10;
  spotLight.shadow.camera.far = 500;
  //window.scene.add(new THREE.CameraHelper(spotLight.shadow.camera));
  window.scene.add(spotLight);

  const gui = new DATGUI.GUI();
  gui.add(spotLight.position, "x", 0, 200);
  gui.add(spotLight.position, "y", 0, 200);
  gui.add(spotLight.position, "z", 0, 200);
  gui.add(spotLight, "intensity", 0, 2);

  const turbineGui = gui.addFolder("Turbine");
  turbineGui.add(turbineFromFile, "localTimeScale", 0, 5);

  const windDirectionGUI = gui.addFolder("Wind direction");
  windDirectionGUI.add(
    windDirection.rotation,
    "z",
    0,
    THREE.MathUtils.degToRad(360)
  );


  const orbitControls = new CONTROLS.OrbitControls(
    window.camera,
    window.renderer.domElement
  );
  orbitControls.target = new THREE.Vector3(0, 0, 0);
  orbitControls.update();

  const stats = new Stats();
  document.body.appendChild(stats.dom);

  const clock = new THREE.Clock();

  function mainLoop() {
    
    stats.begin();

    const delta = clock.getDelta();

    TWEEN.update();

    window.turbines.forEach(function (turbine) {
      if (turbine.animationMixer !== null) {
        turbine.animationMixer.update(delta);
        turbine.efficacy = 1 - turbine.quaternion.dot(windDirection.quaternion);
        turbine.animationMixer.timeScale = turbine.localTimeScale * turbine.efficacy;
      }
    });

    window.physics.update(delta);
    window.renderer.render(window.scene, window.camera);
    stats.end();
    requestAnimationFrame(mainLoop);
  }

  mainLoop();
}

function spawnTrees() {
  for (let i = 0; i < MAX_TREE_COUNT; i++) {
    
    let spawnPosition = new THREE.Vector3(
      THREE.MathUtils.randFloatSpread(100),
      0,
      THREE.MathUtils.randFloatSpread(100)
    );
    
    if (window.treeSpawns.length > 0) {
      
      // check if there is at least 5 meters between the new tree and the others

      let tooClose = false;

      window.treeSpawns.forEach(function (spawn) {
        if (spawnPosition.distanceTo(spawn) < MIN_SPAWN_DIST) {
          tooClose = true;
        }
      });
      window.lamps.forEach(function (lamp) {
        if (spawnPosition.distanceTo(lamp.position) < MIN_SPAWN_DIST) {
          tooClose = true;
        }
      });

      if (tooClose) {
        i --;
        continue;
      } else {
        window.treeSpawns.push(spawnPosition);
      }

    } else {
      window.treeSpawns.push(spawnPosition);
    }
  }

  window.treeSpawns.forEach(function (spawn) {
    var tree = new Tree();
    tree.position.set(spawn.x, spawn.y, spawn.z);
    tree.addPhysics();
    window.scene.add(tree);
    console.log("Tree spawned at " + spawn.x + ", " + spawn.y + ", " + spawn.z);
  });
}

document.getElementById("startButton").addEventListener("click", function () {
  main();
  document.getElementById("overlay").remove();
  window.onresize = updateAspectRatio;
  window.onclick = executeRaycast;
  window.onkeydown = keyDownAction;
  window.onkeyup = keyUpAction;
});
