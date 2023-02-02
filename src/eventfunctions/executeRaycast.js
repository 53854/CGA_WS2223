import * as THREE from "three";
import Tree from "../objects/Tree.js";

window.raycaster = new THREE.Raycaster();

export function executeRaycast(event) {
  const mousePosition = new THREE.Vector2();
  mousePosition.x = 2 * (event.clientX / window.innerWidth) - 1;
  mousePosition.y = -2 * (event.clientY / window.innerHeight) + 1;

  window.raycaster.setFromCamera(mousePosition, window.camera);
  let intersects = window.raycaster.intersectObject(window.scene, true);

  if (intersects.length > 0) {
    let firstHit = intersects[0].object;
    let firstHitPosition = intersects[0].point;
    console.log(firstHit);
    if (firstHit.name === "floor") {
      var tree = new Tree();
      tree.position.set(firstHitPosition.x, 0, firstHitPosition.z);
      tree.addPhysics();
      window.scene.add(tree);
    } else if (firstHit.parent.name === "Lamp") {
      firstHit.parent.toggleLight();
    } else if (firstHit.name === "Rotor_base") {
      let p = firstHit.parent;

      while (p.hasOwnProperty("isInteractionGroup") === false) {
        p = p.parent;
      }

      p.toggleAnimation();
    }
  }
}
