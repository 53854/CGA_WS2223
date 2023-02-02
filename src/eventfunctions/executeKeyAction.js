import * as THREE from "three";

window.spaceDown = false;

export function keyDownAction(event) {
  switch (event.keyCode) {
    case 32:
      if (!window.spaceDown) {
        window.spaceDown = true;
        shootBalls();
      }
      break;
    case 39:
      window.winddirection += 0.25;

      break;
    case 37:
      window.winddirection -= 0.25;

      break;
    case 38:
      window.turbines[0].toggleAnimation();

      break;
    case 40:
      console.log("down");

      window.turbines[0].toggleAnimation();
  }
}

export function keyUpAction(event) {
  switch (event.keyCode) {
    case 32:
      window.spaceDown = false;
      break;
  }
}

function shootBalls() {
  const ballRadius = 2;
  const ballGeometry = new THREE.SphereGeometry(ballRadius, 16, 16);
  const ball = new THREE.Mesh(
    ballGeometry,
    new THREE.MeshLambertMaterial({ color: 0xff0000 })
  );

  ball.position.set(
    window.camera.position.x,
    window.camera.position.y,
    window.camera.position.z
  );
  ball.castShadow = true;
  window.scene.add(ball);

  const directionalVectorDC = new THREE.Vector3(0, 0, 1);
  const velocityVectorWC = directionalVectorDC
    .unproject(window.camera)
    .sub(window.camera.position);
  velocityVectorWC.normalize();
  velocityVectorWC.multiplyScalar(800);
  window.physics.addSphereWithVelocity(ball, 1, ballRadius, velocityVectorWC);
}
